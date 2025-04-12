from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator

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
    last_login = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    daily_mood = models.JSONField(default=list)  # Stores last 7 days of mood (0-10)
    emotion = models.JSONField(null=True, blank=True)
    wellness_score = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    CURRENT_LEVEL_CHOICES = [
        ('seed', 'Seed'),  # Just starting out
        ('sprout', 'Sprout'),  # Making progress
        ('sapling', 'Sapling'),  # Growing stronger
        ('tree', 'Tree'),  # Steady and resilient
        ('oak', 'Oak'),  # Strong and grounded
        ('redwood', 'Redwood'),  # Unshakable and wise
        ('forest', 'Forest'),  # A force of nature
    ]
    current_level = models.CharField(
        max_length=20,
        choices=CURRENT_LEVEL_CHOICES,
        default='seed'
    )
    RECENT_BADGE_CHOICES = [
        ('first_step', 'First Step'),  # First milestone
        ('consistency_champ', 'Consistency Champ'),  # Consistent effort
        ('mindful_master', 'Mindful Master'),  # Mastered mindfulness
        ('gratitude_guru', 'Gratitude Guru'),  # Practiced gratitude regularly
        ('streak_surfer', 'Streak Surfer'),  # Maintained a long streak
        ('zen_warrior', 'Zen Warrior'),  # Overcame challenges with calm
        ('wellness_whiz', 'Wellness Whiz'),  # Achieved high wellness score
        ('balance_builder', 'Balance Builder'),  # Balanced all aspects of wellness
        ('resilience_rockstar', 'Resilience Rockstar'),  # Demonstrated resilience
        ('joy_juggler', 'Joy Juggler'),  # Found joy in small things
    ]
    recent_badge = models.CharField(
        max_length=20,
        choices=RECENT_BADGE_CHOICES,
        default='first_step'
    )
    morning_meditation_last_performed = models.DateField(null=True, blank=True)
    morning_meditation_streak = models.PositiveIntegerField(default=0)
    gratitude_journal_last_performed = models.DateField(null=True, blank=True)
    gratitude_journal_streak = models.PositiveIntegerField(default=0)
    evening_reflection_last_performed = models.DateField(null=True, blank=True)
    evening_reflection_streak = models.PositiveIntegerField(default=0)

    # Wellness Metrics
    sleep_quality = models.IntegerField(
        default=5,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    activity_level = models.IntegerField(
        default=5,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    mindfulness_level = models.IntegerField(
        default=5,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    embedding = models.JSONField(null=True, blank=True)  # Vector for recommendations
    streak = models.PositiveIntegerField(default=0)
    role = models.CharField(max_length=20, choices=[('user', 'User'), ('therapist', 'Therapist'), ('admin', 'Admin')], default='user')
    llm_remark = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    def update_streak(self , new_streak):
        self.streak = new_streak
        self.save()
    def update_last_login( self , new_last_login):
        self.last_login = new_last_login
        self.save()
    
    # Methods to update fields
    def update_daily_mood(self, mood_score):
        """
        Append a new mood score and maintain only the last 7 days.
        """
        if not isinstance(mood_score, int) or mood_score < 0 or mood_score > 10:
            raise ValueError("Mood score must be an integer between 0 and 10.")
        
        self.daily_mood.append(mood_score)
        if len(self.daily_mood) > 7:
            self.daily_mood = self.daily_mood[-7:]  # Keep only the last 7 entries
        self.save()

    def update_wellness_score(self, change):
        """
        Update the wellness score within the valid range (0-100).
        """
        new_score = self.wellness_score + change
        self.wellness_score = max(0, min(100, new_score))  # Ensure score stays within 0-100
        self.save()

    def add_badge(self, badge):
        """
        Update the recent badge field.
        """
        if badge not in dict(self._meta.get_field('recent_badge').choices):
            raise ValueError(f"Invalid badge: {badge}")
        self.recent_badge = badge
        self.save()

    def update_habit_streak(self, habit, performed_date):
        """
        Update the streak and last performed date for a habit.
        """
        if habit not in ['morning_meditation', 'gratitude_journal', 'evening_reflection']:
            raise ValueError("Invalid habit.")
        
        last_performed_field = f"{habit}_last_performed"
        streak_field = f"{habit}_streak"
        
        # Check if the habit was performed yesterday to maintain the streak
        if getattr(self, last_performed_field) == performed_date - timedelta(days=1):
            setattr(self, streak_field, getattr(self, streak_field) + 1)
        else:
            setattr(self, streak_field, 1)  # Reset streak if not consecutive
        
        setattr(self, last_performed_field, performed_date)
        self.save()

    def update_sleep_quality(self, score):
        """
        Update sleep quality (0-10).
        """
        if not isinstance(score, int) or score < 0 or score > 10:
            raise ValueError("Sleep quality must be an integer between 0 and 10.")
        self.sleep_quality = score
        self.save()

    def update_activity_level(self, score):
        """
        Update activity level (0-10).
        """
        if not isinstance(score, int) or score < 0 or score > 10:
            raise ValueError("Activity level must be an integer between 0 and 10.")
        self.activity_level = score
        self.save()

    def update_mindfulness_level(self, score):
        """
        Update mindfulness level (0-10).
        """
        if not isinstance(score, int) or score < 0 or score > 10:
            raise ValueError("Mindfulness level must be an integer between 0 and 10.")
        self.mindfulness_level = score
        self.save()

    def update_current_level(self):
        """
        Update the current level based on predefined criteria.
        """
        if self.wellness_score >= 90:
            self.current_level = 'forest'
        elif self.wellness_score >= 75:
            self.current_level = 'redwood'
        elif self.wellness_score >= 60:
            self.current_level = 'oak'
        elif self.wellness_score >= 45:
            self.current_level = 'tree'
        elif self.wellness_score >= 30:
            self.current_level = 'sapling'
        elif self.wellness_score >= 15:
            self.current_level = 'sprout'
        else:
            self.current_level = 'seed'
        self.save()

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