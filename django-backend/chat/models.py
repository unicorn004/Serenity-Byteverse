from django.db import models
from users.models import UserProfile
from django.contrib.auth import get_user_model
User = get_user_model() 

class Room(models.Model):
    name = models.CharField(max_length=255, unique=True, null=True,blank=True)  
    members = models.ManyToManyField(UserProfile, related_name="rooms")  
    admin = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin_rooms")  
    created_at = models.DateTimeField(auto_now_add=True)  
    is_dm = models.BooleanField(default=False)  # True if it is a DM room.

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")  
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE)  
    content = models.TextField()  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.sender.username}: {self.content[:30]}"
