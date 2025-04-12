from django.db import models
from users.models import UserProfile

class Forum(models.Model):  
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)  # Add description
    users = models.ManyToManyField(UserProfile, related_name='forums')  
    admin = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='admin_forums')
    created_at = models.DateTimeField(auto_now_add=True)

    def add_user(self, user_profile):
        if user_profile:
            self.users.add(user_profile)
            self.save()

class ChatMessage(models.Model):  
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE,null=True, blank=True)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):  
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE, related_name='posts')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):  
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Reply(models.Model):  
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)