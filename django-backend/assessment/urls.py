from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    AssessmentViewSet,
    QuestionViewSet,
    AnswerViewSet,
    UserAssessmentViewSet,
)
from . import views

router = DefaultRouter()
router.register(r"profiles", UserProfileViewSet)
router.register(r"assessments", AssessmentViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"responses", AnswerViewSet)
router.register(r"user_assessments", UserAssessmentViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("grade/", views.GradeAssessmentView.as_view()),
    path("assess_medical/", views.AssessMedicalProfileView.as_view()),
    path("generate_questions/", views.GenerateQuestionsView.as_view()),

]