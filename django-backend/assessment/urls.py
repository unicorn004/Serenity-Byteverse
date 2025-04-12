from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet,
    AssessmentViewSet,
    QuestionViewSet,
    ResponseViewSet,
    UserAssessmentViewSet,
)

router = DefaultRouter()
router.register(r"profiles", UserProfileViewSet)
router.register(r"assessments", AssessmentViewSet)
router.register(r"questions", QuestionViewSet)
router.register(r"responses", ResponseViewSet)
router.register(r"user-assessments", UserAssessmentViewSet)

urlpatterns = [
    path("", include(router.urls)),
]