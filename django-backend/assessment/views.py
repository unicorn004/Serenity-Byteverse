from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import UserProfile, Assessment, Question, Response, UserAssessment
from .serializers import (
    UserProfileSerializer,
    AssessmentSerializer,
    QuestionSerializer,
    ResponseSerializer,
    UserAssessmentSerializer,
)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer

class UserAssessmentViewSet(viewsets.ModelViewSet):
    queryset = UserAssessment.objects.all()
    serializer_class = UserAssessmentSerializer




from rest_framework.views import APIView
from rest_framework.response import Response
from .llm_tools import grade_assessment

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