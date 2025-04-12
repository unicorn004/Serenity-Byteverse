from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv
import os
from .models import Conversation, ChatMessage
from django.utils import timezone
from assessment.llm_tools import get_user_context

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


# Initialize Groq LLM
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama3-70b-8192")

# Mental health prompt template


def update_conversation_summary(conversation):
    """
    Updates the summary of a conversation based on recent messages.
    """
    print("Updating summary")
    # Fetch the last 10 messages for summarization
    recent_messages = conversation.messages.all().order_by("timestamp")[:10]
    message_texts = [msg.text for msg in recent_messages]
    
    # Generate a summary using an LLM
    # llm = ChatGroq(groq_api_key="YOUR_GROQ_API_KEY", model_name="llama3-70b-8192")
    summary_prompt = f"Summarize the following conversation:\n\n" + "\n".join(message_texts)
    summary = llm.invoke(summary_prompt).content
    
    # Update the conversation's summary field
    conversation.summary = summary
    conversation.last_updated = timezone.now()
    conversation.save()


# Mental health prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", """
        You are a compassionate mental health assistant.
        Respond with empathy, validate the user's feelings, and provide supportive advice.
        Avoid medical diagnoses or recommending medications.
        Keep responses concise and reassuring.

        Additional Context:
        - User Summary: {user_summary}
      
    """),
      # - Recent Conversation Summary: {conversation_summary} # Add this below user summary to explicityl mention conv_summary
    MessagesPlaceholder(variable_name="chat_history"),  # Placeholder for last 5 messages
    ("human", "{user_input}"),
])

# Create the chain
chain = prompt | llm

def chat(user_input, user_profile):
    """
    Handles the chat interaction by incorporating conversation history and user context.
    """
    # Fetch or create the latest conversation for the user
    conversation = Conversation.objects.filter(user=user_profile).order_by('-last_updated').first()
    if not conversation:
        conversation = Conversation.objects.create(user=user_profile)

    # Fetch the last 5 messages (user + assistant)
    recent_messages = conversation.messages.all().order_by('-timestamp')[:5]
    formatted_chat_history = [{"role": msg.role, "content": msg.text} for msg in reversed(recent_messages)]
    # Use the conversation summary
    # conversation_summary = conversation.summary or "No prior conversation summary available."
    # Generate a user-specific summary (e.g., based on their profile or past interactions)
    user_summary = get_user_context(user_profile.medical_profile)

    # Generate AI response
    response = chain.invoke({
        "user_summary": user_summary,
        # "conversation_summary": conversation_summary,
        "chat_history": formatted_chat_history,
        "user_input": user_input
    })

    # Save the new messages to Django models
    ChatMessage.objects.create(
        conversation=conversation,
        # user=user_profile,
        role="user",
        text=user_input
    )
    ChatMessage.objects.create(
        conversation=conversation,
        # user=user_profile,
        role="assistant",
        text=response.content
    )

    # Update the conversation summary after saving new messages
    update_conversation_summary(conversation)

    return response.content


