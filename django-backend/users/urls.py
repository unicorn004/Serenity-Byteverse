from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from users.views.medical_profile_views import MedicalProfileViewSet
from users.views.user_views import (
    RegisterView, LoginView, UserProfileViewSet, DiaryListView, 
    GoalListView, NotificationListView, CreateDiaryView, CreateGoalView
)

# Create router for ViewSets
router = DefaultRouter()
router.register(r'medical-profile', MedicalProfileViewSet, basename='medical-profile')
router.register(r'user-profile', UserProfileViewSet, basename='user-profile')

urlpatterns = [
    # Authentication Endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API Endpoints
    path('api/', include(router.urls)),  # ViewSet-based endpoints

    # Function-based views (non-ViewSet)
    path('diary/', DiaryListView.as_view(), name='diary-list'),
    path('goal/', GoalListView.as_view(), name='goal-list'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('diary/create/', CreateDiaryView.as_view(), name='create-diary'),
    path('goal/add/', CreateGoalView.as_view(), name='goal-add'),
]