from django.db import models
from users.models import UserProfile

class Forum(models.Model):  
    """Forum where users can discuss"""  
    title = models.CharField(max_length=255)
    users = models.ManyToManyField(UserProfile, related_name='forums')  
    admin = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='admin_forums')
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):  
    """Messages inside a forum chat"""  
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):  
    """Forum post"""  
    forum = models.ForeignKey(Forum, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):  
    """Comments on forum posts"""  
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Reply(models.Model):  
    """Replies to comments"""  
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)