from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, UserProfileView, 
    MedicalProfileView, CreateMedicalProfileView, 
    UpdateMedicalProfileView, MedicalInfoView,
    DiaryListView, GoalListView, NotificationListView, 
    CreateDiaryView, CreateGoalView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('medical-profile/', MedicalProfileView.as_view(), name='medical-profile'),
    
    path('medical-profile/create/', CreateMedicalProfileView.as_view(), name='create-medical-profile'),
    path('medical-profile/update/', UpdateMedicalProfileView.as_view(), name='update-medical-profile'),
    path('medical-info/', MedicalInfoView.as_view(), name='medical-info'),
    
    path('diary/', DiaryListView.as_view(), name='diary-list'),
    path('goal/', GoalListView.as_view(), name='goal-list'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('diary/create', CreateDiaryView.as_view(), name='create-diary'),
    path('add-goal', CreateGoalView.as_view(), name='goal-add'),
]