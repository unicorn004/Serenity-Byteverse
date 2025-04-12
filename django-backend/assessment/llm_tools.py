from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from .models import Assessment, Question, Response, UserAssessment, UserProfile
import json

# Initialize Groq LLM
GROQ_API_KEY = "your_groq_api_key_here"
llm = ChatGroq(model_name="llama3-70b-8192", groq_api_key=GROQ_API_KEY)

# Define Prompt Templates
SCORING_PROMPT = PromptTemplate(
    input_variables=["question", "response", "guidelines"],
    template="""
    You are an expert mental health assistant. Score the user's response (0-3) based on the question and guidelines.
    
    Question: {question}
    User Response: {response}
    Scoring Guidelines: {guidelines}
    
    Output only the score as a number (0-3).
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
    """
)

DYNAMIC_QUESTION_PROMPT = PromptTemplate(
    input_variables=["context"],
    template="""
    Based on the context provided, suggest the next relevant question for the user.
    
    Context: {context}
    
    Output only the question as text.
    """
)

# Function to Assign LLM Scores
def assign_llm_scores(responses):
    """
    Assign subjective scores to user responses using the LLM.
    """
    for response in responses:
        question = response.question
        scoring_context = {
            "question": question.text,
            "response": response.response_text or str(response.response_score),
            "guidelines": question.scoring_guidelines or "Score based on severity (0-3).",
        }
        prompt = SCORING_PROMPT.format(**scoring_context)
        llm_response = llm.invoke(prompt)
        try:
            response.llm_score = float(llm_response.content.strip())
        except ValueError:
            response.llm_score = None  # Handle invalid outputs gracefully
        response.save()

# Function to Generate Subjective Remarks
def generate_llm_remark(user_assessment):
    """
    Generate a personalized remark for the user based on their assessment responses.
    """
    user_profile = user_assessment.user.profile
    responses = user_assessment.responses.all()
    context = {
        "user_profile": json.dumps({
            "age": user_profile.age,
            "gender": user_profile.gender,
            "bio": user_profile.bio,
            "mood_score": user_profile.mood_score,
        }),
        "responses": json.dumps({
            resp.question.text: resp.response_text or str(resp.response_score)
            for resp in responses
        }),
        "assessment": user_assessment.assessment.name,
    }
    prompt = REMARK_PROMPT.format(**context)
    llm_response = llm.invoke(prompt)
    user_assessment.llm_remark = llm_response.content.strip()
    user_assessment.save()

# Function to Dynamically Suggest Questions
def suggest_next_question(context):
    """
    Suggest the next relevant question based on the current context.
    """
    prompt = DYNAMIC_QUESTION_PROMPT.format(context=context)
    llm_response = llm.invoke(prompt)
    return llm_response.content.strip()

# Tool to Grade Assessments
def grade_assessment(assessment_id, user_id):
    """
    Grade a completed assessment and update the UserAssessment record.
    """
    user_assessment = UserAssessment.objects.get(assessment_id=assessment_id, user_id=user_id)
    responses = user_assessment.responses.all()
    
    # Step 1: Assign LLM Scores
    assign_llm_scores(responses)
    
    # Step 2: Calculate Total Score and Severity
    user_assessment.calculate_total_score()
    user_assessment.determine_severity()
    
    # Step 3: Generate Subjective Remark
    generate_llm_remark(user_assessment)
    
    # Save the updated UserAssessment
    user_assessment.save()

# Example Usage
