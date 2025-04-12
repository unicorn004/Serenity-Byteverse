from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.user_views import (
    DiaryListView, GoalListView, NotificationListView,
    CreateDiaryView, CreateGoalView, LoginView, RegisterView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import medical_profile_views, user_views


# Create router for ViewSets
router = DefaultRouter()
router.register(r'medical-profile', medical_profile_views.MedicalProfileViewSet, basename='medical-profile')
router.register(r'user-profile', user_views.UserProfileViewSet, basename='user-profile')

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