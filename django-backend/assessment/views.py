from django.shortcuts import render
from users.serializers import MedicalProfileSerializer
# Create your views here.
from rest_framework import viewsets, status
from .models import UserProfile, Assessment, Question,Answer, UserAssessment
from .serializers import (
    UserProfileSerializer,
    AssessmentSerializer,
    QuestionSerializer,
    UserAssessmentSerializer,
    AnswerSerializer
)

from rest_framework.views import APIView
from rest_framework.response import Response
from .llm_tools import grade_assessment, assess_user, generate_medical_profile, suggest_next_questions

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

class UserAssessmentViewSet(viewsets.ModelViewSet):
    queryset = UserAssessment.objects.all()
    serializer_class = UserAssessmentSerializer


class GradeAssessmentView(APIView):
    def post(self, request, *args, **kwargs):

        assessment_id = request.data.get("assessment_id")
        user_id = request.data.get("user_id")
        
        if not assessment_id or not user_id:
            return Response({"error": "Missing assessment_id or user_id"}, status=400)
        
        try:
            grade_assessment(assessment_id, user_id)
            return Response({"message": "Assessment graded successfully."}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class AssessUserView(APIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "Missing user_id in request body"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            assess_user(user_id)
            return Response({"message": "User's medical profile updated with LLM remarks"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AssessMedicalProfileView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_profile = UserProfile.objects.get(id=user_id)
            medical_profile = user_profile.medical_profile  # Get associated MedicalProfile

            generate_medical_profile(medical_profile)  # Updates & saves profile inside function

            # Serialize and return updated profile
            serializer = MedicalProfileSerializer(medical_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class GenerateQuestionsView(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        assessment_id = request.data.get("assessment_id")

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_profile = UserProfile.objects.get(id=user_id)
            medical_profile = user_profile.medical_profile
            user_assessment = UserAssessment.objects.filter(user=user_profile, assessment=assessment_id).order_by('-date_taken').first()  # Get latest assessment
            
            if not user_assessment:
                return Response({"error": "No assessment found for the user"}, status=status.HTTP_404_NOT_FOUND)

            questions = suggest_next_questions(user_assessment, medical_profile)
            return Response({"questions": questions}, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)