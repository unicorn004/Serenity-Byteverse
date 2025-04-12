# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from .models import UserProfile, Conversation, ChatMessage
from .chain  import chat  # Import the chat function

class ChatAPIView(APIView):
    """
    API endpoint to handle chat interactions.
    """
    #authentication_classes = [TokenAuthentication]  # Use token-based authentication
    #permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def post(self, request, *args, **kwargs):
        # Extract user input from the request
        user_input = request.data.get("message")
        if not user_input:
            return Response({"error": "Message is required."}, status=400)

        # Get the user profile
        user_profile = UserProfile.objects.get(user=request.user)

        # Call the chat function to process the message
        ai_response = chat(user_input=user_input, user_profile=user_profile)

        # Return the AI response
        return Response({"response": ai_response}, status=200)