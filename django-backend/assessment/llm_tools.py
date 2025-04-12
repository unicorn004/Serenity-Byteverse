from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from .models import Assessment, Question, Answer, UserAssessment, UserProfile
from users.models import UserProfile, MedicalProfile
from mlmodel.models import Conversation
from users.serializers import MedicalProfileSerializer
import json
from dotenv import load_dotenv
load_dotenv()
import os


# Initialize Groq LLM
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model_name="llama3-70b-8192", groq_api_key=GROQ_API_KEY)

# Define Prompt Templates
SCORING_PROMPT = PromptTemplate(
    input_variables=["question", "response", "guidelines"],
    template="""
    You are an expert mental health assistant. Score the user's response (0-3) based on the question and guidelines.
    
    Question: {question}
    User Response: {response}
    Scoring Guidelines: {guidelines}
    
    Output only the score as a number as mentioned in the guidelines.
    """
)

REMARK_PROMPT = PromptTemplate(
    input_variables=["user_profile", "responses", "assessment"],
    template="""
    You are an expert mental health assistant. Analyze the user's responses and generate a personalized remark.
    
    User Profile: {user_profile}
    Assessment Name: {assessment}
    Responses: {responses}
    
    Provide a concise summary of the user's mental state and any notable patterns. 
    Answer only in a couple of lines containing the summary, as one single paragraph, in a professional tone.
    """
)

DYNAMIC_QUESTION_PROMPT = PromptTemplate(
   input_variables=["user_context", "assessment_context"],
    template="""
    Based on the provided context, generate 5 relevant follow-up questions for the user. 

    User Context: {user_context}
    Assessment Context: {assessment_context}
    
    Output only the questions as a JSON list. Without any normal text as a precursor etc.. Pure parsable JSON Questions only.
    """
)

USER_REMARK_PROMPT = PromptTemplate(
    input_variables=["context"],
    template="""
    You are a mental health professional.
    Based on the context provided, which includes the user's profile, summaries of his last 5 assessments, and summary of the conversations he had with a chatbot, develop an overall view of the user's mental state, short term and long term, for further analysis and recommendations.
    
    Context: {context}
    
    Output only the summary as a professional remark text.
    """
)

USER_MEDICAL_PROMPT = PromptTemplate(
    input_variables=["context"],
    template="""
    You are a medical AI assistant. Analyze the given user data and generate structured medical insights.

    Context: {context}

    Provide the response as a JSON object with the following keys:
    - "conditions": A list of medical conditions the user might have.
    - "medications": List of medications the user might be taking or that you suggest if that's null previously.
    - "personality_score": A numerical score (0-100) representing personality stability.
    - "remark": A short, professional summary of the user's health.

    Respond with a valid JSON format only. Try not to leave any field null or empty, fill in valid format mentioned
    """
)
# Function to Assign LLM Scores
def assign_llm_scores(responses, user):
    """
    Assign subjective scores to user responses using the LLM.
    """
    for question in responses:
        response = question.responses.filter(user=user).first()
        scoring_context = {
            "question": question.text,
            "response": response.response_text or str(response.response_score),
            "guidelines": question.scoring_guidelines or "Score based on severity (0-10).",
        }
        prompt = SCORING_PROMPT.format(**scoring_context)
        llm_response = llm.invoke(prompt)
        try:
            response.llm_score = float(llm_response.content.strip())
        except ValueError:
            response.llm_score = None  # Handle invalid outputs gracefully
        response.save()
        print("assingned LLM score")

def get_assessment_context(user_assessment):
    user_profile = user_assessment.user
    questions = user_assessment.assessment.questions.all()
    context = {
        "user_profile": json.dumps({
            "age": user_profile.age,
            "gender": user_profile.gender,
            "bio": user_profile.bio,
            # "mood_score": user_profile.mood_score,
        }),
        "responses": json.dumps({
            resp.text: resp.responses.filter(user=user_profile).first().response_text or str(resp.response.filter(user=user_profile).first().response_score)
            for resp in questions
        }),
        "assessment": user_assessment.assessment.name,
        "previous_analysis": {
        "remark":user_assessment.llm_remark if user_assessment.llm_remark else "No Previous Remark",
        "total_score":user_assessment.total_score if user_assessment.total_score else "No previous score",
        "severity":user_assessment.severity if user_assessment.severity else "No severity"
        
        },
    }
    print("got assessment context")
    return context

# Function to Generate Subjective Remarks
def generate_llm_remark(user_assessment):
    """
    Generate a personalized remark for the user based on their assessment responses.
    """
    context = get_assessment_context(user_assessment)
    prompt = REMARK_PROMPT.format(**context)
    llm_response = llm.invoke(prompt)
    user_assessment.llm_remark = llm_response.content.strip()
    user_assessment.save()
    print("Generated_LLM_Remark")

def get_user_context_short(userprofile):
    converstaion = conversation = Conversation.objects.filter(user=userprofile.user).order_by('-last_updated').first()
    user_context = {
            "name":userprofile.user.user.username,
            "age":userprofile.user.age,
            "gender":userprofile.user.gender,
            "bio":userprofile.user.bio, 
            "preferences":userprofile.user.preferences,
            "medical_profile":{
                "personality_score":userprofile.personality_score,
                "conditions":userprofile.conditions,
                "medications":userprofile.medications,
                "llm_remark":userprofile.llm_remark
            }
          
        }
    return user_context

def get_user_context(userprofile):
    assessments = userprofile.user.assessments.all()
    assessment_context = {}
    for ass in assessments[:5]:
        if not ass.llm_remark:
            grade_assessment(ass)

        assessment_context[ass.assessment.name] =  {
            "assesssment_description":ass.assessment.description,
            "assessment_severity_mapping":ass.assessment.severity_mapping, 
            "remark":ass.llm_remark if ass.llm_remark else "No Previous Remark",
            "total_score":ass.total_score if ass.total_score else "No previous score",
            "severity":ass.severity if ass.severity else "No severity"         
        }
    conversation = Conversation.objects.filter(user=userprofile.user).order_by('-last_updated').first()
    conv_sum = conversation.summary
    # print("got assessments")
    context = {
        "user_context":{
            "name":userprofile.user.user.username,
            "age":userprofile.user.age,
            "gender":userprofile.user.gender,
            "bio":userprofile.user.bio, 
            "preferences":userprofile.user.preferences,
            "medical_profile":{
                "personality_score":userprofile.personality_score,
                "conditions":userprofile.conditions,
                "medications":userprofile.medications,
                "llm_remark":userprofile.llm_remark
            }
        },
        "assessments_context":assessment_context,
        "Chatbot conversation summary":conv_sum
    }
    
    print(f"Got User Context \n context")
    return context

def generate_user_remark(userprofile): # THis rather has to be a medicalProfile Object (in users.models), just mentioned userprofile in the flow.
    context = get_user_context(userprofile)
    prompt = USER_REMARK_PROMPT.format(context=context)
    llm_response = llm.invoke(prompt)
    userprofile.llm_remark = llm_response.content.strip()
    print("Generated User Remark")
    userprofile.save()

# Function to Dynamically Suggest Questions
def suggest_next_questions(user_assessment, medicalprofile):
    """
    Generate 5 relevant follow-up questions based on user and assessment context.
    """
    user_context = get_user_context(medicalprofile)["user_context"]
    ass_context = get_assessment_context(user_assessment)

    
    prompt = DYNAMIC_QUESTION_PROMPT.format(
        user_context=user_context,
        assessment_context=ass_context
    )

    llm_response = llm.invoke(prompt)
    print(f"got response")

    # Ensure response is properly formatted as a list
    try:
        questions = json.loads(llm_response.content.strip())  # Convert JSON string to Python list
        if not isinstance(questions, list):  # Ensure it's a list
            raise ValueError("Invalid LLM response format")
    except json.JSONDecodeError:
        questions = ["Generated invalid json."]  

    return questions
# Tool to Grade Assessments
def grade_assessment(assessment_id, user_id):
    """
    Grade a completed assessment and update the UserAssessment record.
    """
    print("Grading Assessment...")
    user_assessment = UserAssessment.objects.filter(assessment=assessment_id, user=user_id).order_by('-date_taken').first()
    print(user_assessment)
    questions = user_assessment.assessment.questions.all()
    user = user_assessment.user
    user_assessment.is_completed = True
    
    
    # Step 1: Assign LLM Scores
    assign_llm_scores(questions, user)
    
    # Step 2: Calculate Total Score and Severity
    # user_assessment.calculate_total_score() # ALready calculated within severity function
    user_assessment.severity = user_assessment.determine_severity()
    
    # Step 3: Generate Subjective Remark
    generate_llm_remark(user_assessment)
    
    # Save the updated UserAssessment
    user_assessment.save()
    print("Grading Complemte")
def assess_user(user_id):
    user_profile = UserProfile.objects.get(id = user_id)
    medical_profile = user_profile.medical_profile
    generate_user_remark(medical_profile)
    #medical_profile.llm_remark = remark
    #print(f"user = {medical_profile.user},id =  {medical_profile.id}, remark{medical_profile.llm_remark}")
   
    print(f"user = {medical_profile.user},id =  {medical_profile.id}, remark{medical_profile.llm_remark}")
    print("Users Medical Profile updated with LLM Remarks")

def generate_medical_profile(userprofile):
    context = get_user_context(userprofile)  # Assuming this retrieves user data correctly
    prompt = USER_MEDICAL_PROMPT.format(context=context)  # Define a structured prompt
    llm_response = llm.invoke(prompt)  

    print(f"LLM_response = {llm_response}")

    try:
        response_data = json.loads(llm_response.content.strip())  # Convert to dict
        
    except json.JSONDecodeError:
        print("Error: LLM response not in JSON format")
        return None  

    userprofile.conditions = response_data.get("conditions", "")
    userprofile.medications = response_data.get("medications", "")
    userprofile.personality_score = response_data.get("personality_score", None)
    userprofile.llm_remark = response_data.get("remark", "")

    userprofile.save()
    print("Medical profile updated successfully!")

    return response_data  # For debugging



