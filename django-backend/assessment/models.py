from django.db import models

# Create your models here.
from users.models import UserProfile  # Default User model
from django.db import models
from django.db.models import JSONField
from django.utils import timezone


class Assessment(models.Model):
    name = models.CharField(max_length=50, unique=True)  # e.g., "PHQ-9", "GAD-7"
    description = models.TextField(null=True, blank=True)
    severity_mapping = JSONField(null=True, blank=True)  # e.g., {"0-4": "minimal", ...}

    def __str__(self):
        return self.name

class Question(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField(null=True,blank=True)
    order = models.PositiveIntegerField(null=True,blank=True)
    scoring_guidelines = JSONField(blank=True, null=True)  # For LLM context

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.assessment.name} - Q{self.order}: {self.text}"

class Answer(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="users")
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="responses")
    response_text = models.TextField(blank=True, null=True)
    response_score = models.IntegerField(blank=True, null=True)  # Objective score
    llm_score = models.FloatField(blank=True, null=True)  # Subjective LLM score
    date_taken = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.user.username} - {self.question.text}: {self.response_text or self.response_score}"

class UserAssessment(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="assessments")
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE)
    total_score = models.FloatField(blank=True, null=True)
    severity = models.CharField(max_length=50, blank=True, null=True)
    date_taken = models.DateTimeField(auto_now_add=True)
    llm_remark = models.TextField(blank=True, null=True)  # LLM-generated insight
    solutions = models.TextField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def calculate_total_score(self):
        try:
            print("Calculating Total score")
            total = sum(
                question.responses.filter(user=self.user).first().llm_score or question.responses.filter(user=self.user).first().response_score  if question.responses else 0
                for question in self.assessment.questions.all()
            )
            total_ques = len(self.assessment.questions.all())
            print(f"sum = {sum}, total = {total_ques}")
            return total // total_ques  
        
        except Exception as e:
            print(f"Error in total_score_calc {e}")
            return 0

    def determine_severity(self):
        score = self.calculate_total_score()
        self.total_score = score
        for range_str, label in self.assessment.severity_mapping.items():
            lower, upper = map(float, range_str.split("-"))
            if lower <= score <= upper:
                print("Calculated Severity")
                return label
        print("Calculated Severity")
        return "unknown"

    def save(self, *args, **kwargs):
        #  if not self.is_completed:
        #     self.total_score = self.calculate_total_score()
        #     self.severity = self.determine_severity()
        #     self.is_completed = True
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.user.username} - {self.assessment.name} ({self.date_taken})"

