from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq LLM
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama3-70b-8192")

# Mental health prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", """
        You are a compassionate mental health assistant. 
        Respond with empathy, validate the user's feelings, and provide supportive advice.
        Avoid medical diagnoses or recommending medications.
        Keep responses concise and reassuring.
    """),
    ("human", "{user_input}"),
])

# Create the chain
chain = prompt | llm