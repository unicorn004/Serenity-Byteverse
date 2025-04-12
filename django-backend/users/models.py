from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model() 

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    is_admin = models.BooleanField(default=False)  # Can be used for managing group admins
    bio = models.TextField(blank=True, null=True)  # Optional user info
    created_at = models.DateTimeField(auto_now_add=True)  # Track profile creation

    def __str__(self):
        return self.user.username