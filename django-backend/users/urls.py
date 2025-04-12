from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, UserProfileView, 
    MedicalProfileView, DiaryListView, GoalListView, 
    NotificationListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('medical-profile/', MedicalProfileView.as_view(), name='medical-profile'),
    path('diary/', DiaryListView.as_view(), name='diary-list'),
    path('goal/', GoalListView.as_view(), name='goal-list'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
]