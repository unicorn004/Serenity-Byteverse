
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model() 

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(
        max_length=20,
        choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')],
        null=True,
        blank=True
    )
    bio = models.TextField(blank=True)  # User-provided description
    preferences = models.JSONField(default=dict, null=True, blank=True)  # e.g., {"preferred_language": "en"}
    embedding = models.JSONField(null=True, blank=True)  # Vector for recommendations

class MedicalProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='medical_profile')
    conditions = models.TextField(blank=True, null=True)
    medications = models.TextField(blank=True, null=True)
    mood_score = models.FloatField(null=True, blank=True)  # 0-100 grayscale
    llm_remark = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.user.user.username}'s Medical Profile"

class Diary(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='diary_entries')
    entry_text = models.TextField(null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diary Entry by {self.user.user.username}"

class Goal(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Goal: {self.title} - {self.user.user.username}"

class Notification(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.user.username}"