from django.db import models
from django.utils import timezone
from .pinecone import upsert_to_pinecone
from users.models import UserProfile
import os

# models.py





class Conversation(models.Model):
    user = models.ForeignKey(
        UserProfile, 
        on_delete=models.CASCADE, 
        related_name="conversations"
    )
    summary = models.TextField(blank=True)  # Summary of the conversation
    last_updated = models.DateTimeField(auto_now=True)
 #   session_id = models.CharField(max_length=255, unique=True)  # Unique ID for the session

    def __str__(self):
        return f"Conversation {self.id} for {self.user.user.username}"


class ChatMessage(models.Model):
    conversation = models.ForeignKey(
        Conversation, 
        on_delete=models.CASCADE, 
        related_name="messages"
    )
    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant"),
        ("summary", "Summary")  # Optional: For summarized chunks
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    text = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update conversation summary after saving a message (optional)
        # update_conversation_summary(self.conversation)
