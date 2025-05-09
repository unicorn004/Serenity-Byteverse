from django.db import models
from forum.models import Forum
from users.models import UserProfile


class Room(models.Model):
    name = models.CharField(max_length=255, unique=True, null=True,blank=True)  
    members = models.ManyToManyField(UserProfile, related_name="rooms")  
    admin = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin_rooms")  
    created_at = models.DateTimeField(auto_now_add=True)  
    is_dm = models.BooleanField(default=False)  # True if it is a DM room.
    forum = models.ForeignKey(Forum, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")  
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE)  
    content = models.TextField()  
    timestamp = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return f"{self.sender.username}: {self.content[:30]}"
