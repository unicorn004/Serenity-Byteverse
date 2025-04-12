from rest_framework import serializers
from .models import (
    UserProfile,
    Assessment,
    Question,
    Answer,
    UserAssessment,
)

# Serializer for UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            "id",
            "user",  # Include user ID for reference
            "age",
            "gender",
            "bio",
            "preferences",
            "mood_score",
            "embedding",  # Optional: If you want to expose embeddings
            "llm_remark",
        ]
        read_only_fields = ["id", "embedding"]  # Protect sensitive/computed fields

# Serializer for Assessment
class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = [
            "id",
            "name",
            "description",
            "severity_mapping",
        ]
        read_only_fields = ["id"]

# Serializer for Question
class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "id",
            "assessment",  # ForeignKey to Assessment
            "text",
            "order",
            "scoring_guidelines",
        ]
        read_only_fields = ["id"]

# Serializer for Response
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = [
            "id",
            "user",  # ForeignKey to User
            "question",  # ForeignKey to Question
            "response_text",
            "response_score",  # Objective score
            "llm_score",  # Subjective LLM score
            "date_taken",
        ]
        read_only_fields = ["id", "date_taken"]

# Serializer for UserAssessment
class UserAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAssessment
        fields = [
            "id",
            "user",  # ForeignKey to User
            "assessment",  # ForeignKey to Assessment
            "total_score",
            "severity",
            "date_taken",
            "llm_remark",
            "is_completed",
            "solutions",
        ]
        read_only_fields = ["id", "date_taken", "total_score", "severity"]