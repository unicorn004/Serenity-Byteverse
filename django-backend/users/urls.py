from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
# from .views import (
#     DiaryListView, GoalListView, NotificationListView,
#     CreateDiaryView, CreateGoalView
# )
from .views import medical_profile_views, user_views

router = DefaultRouter()

router.register(r'medical-profile', medical_profile_views.MedicalProfileViewSet, basename='medical-profile')
router.register(r'user-profile', user_views.UserProfileViewSet, basename='user-profile')  # Register UserProfileViewSet

urlpatterns = [

    path('register/', user_views.RegisterView.as_view(), name='register'),
    path('login/', user_views.LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', user_views.UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', user_views.UpdateUserProfileView.as_view(), name='update-user-profile'),

    path('api/', include(router.urls)),  # This will route both UserProfileViewSet and MedicalProfileViewSet

    # path('diary/', DiaryListView.as_view(), name='diary-list'),
    # path('goal/', GoalListView.as_view(), name='goal-list'),
    # path('notifications/', NotificationListView.as_view(), name='notification-list'),
    # path('diary/create', CreateDiaryView.as_view(), name='create-diary'),
    # path('add-goal', CreateGoalView.as_view(), name='goal-add'),
]