from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

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
    bio = models.TextField(blank=True)  
    preferences = models.JSONField(default=dict, null=True, blank=True)  
    embedding = models.JSONField(null=True, blank=True)  # Vector for recommendations
    streak = models.PositiveIntegerField(default=0)
    role = models.CharField(max_length=20, choices=[('user', 'User'), ('therapist', 'Therapist'), ('admin', 'Admin')], default='user')
    llm_remark = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class MedicalProfile(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE, related_name='medical_profile')
    conditions = models.TextField(blank=True, null=True)
    medications = models.TextField(blank=True, null=True)
    personality_score = models.FloatField(null=True, blank=True)  # 0-100 grayscale
    llm_remark = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.user.username}'s Medical Profile"

# Signal to automatically create a MedicalProfile when a UserProfile is created
@receiver(post_save, sender=UserProfile)
def create_medical_profile(sender, instance, created, **kwargs):
    if created:
        medical_profile = MedicalProfile.objects.create(user=instance)
        print(f'MedicalProfile created: {medical_profile}')

class Diary(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='diary_entries')
    entry_text = models.TextField(null=True, blank=True)
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