from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from datetime import datetime
from django.utils.dateparse import parse_datetime
from django.contrib.auth import get_user_model

from users.models import UserProfile, Diary, Goal, Notification
from users.serializers import (
    RegisterSerializer, LoginSerializer, UserProfileSerializer, 
    DiarySerializer, GoalSerializer, NotificationSerializer
)

User = get_user_model()

class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on the user profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This view returns the profile for the authenticated user.
        """
        return UserProfile.objects.filter(user=self.request.user)
    
    def update(self, request, *args, **kwargs):
        """
        Custom update logic for various user profile attributes.
        """
        user_profile = self.get_object()  # Get the authenticated user's profile
        data = request.data  

        try:
            if "daily_mood" in data:
                user_profile.update_daily_mood(data["daily_mood"])

            if "wellness_score" in data:
                user_profile.update_wellness_score(data["wellness_score"])

            if "badge" in data:
                user_profile.add_badge(data["badge"])

            if "habit" in data and "performed_date" in data:
                performed_date = datetime.strptime(data["performed_date"], "%Y-%m-%d").date()
                user_profile.update_habit_streak(data["habit"], performed_date)

            if "sleep_quality" in data:
                user_profile.update_sleep_quality(data["sleep_quality"])

            if "activity_level" in data:
                user_profile.update_activity_level(data["activity_level"])

            if "mindfulness_level" in data:
                user_profile.update_mindfulness_level(data["mindfulness_level"])

            if "streak" in data:
                user_profile.update_streak(data["streak"])

            if "last_login" in data:
                new_last_login = parse_datetime(data["last_login"])
                if new_last_login:
                    user_profile.update_last_login(new_last_login)

            user_profile.save()  # Save changes to the database
            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class DiaryListView(generics.ListCreateAPIView):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        profile = UserProfile.objects.get(user=self.request.user)
        return Diary.objects.filter(user=profile)

class GoalListView(generics.ListCreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile = UserProfile.objects.get(user=self.request.user)
        return Goal.objects.filter(user=profile)

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class CreateDiaryView(generics.CreateAPIView):
    serializer_class = DiarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        profile = UserProfile.objects.get(user=self.request.user)
        serializer.save(user=profile)

class CreateGoalView(generics.CreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        profile = UserProfile.objects.get(user=self.request.user)
        serializer.save(user=profile)