from rest_framework import status, generics, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, MedicalProfile, Diary, Goal, Notification
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer, 
    UserProfileSerializer, MedicalProfileSerializer, 
    DiarySerializer, GoalSerializer, NotificationSerializer
)
User = get_user_model()

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

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            # Fetch the UserProfile for the authenticated user
            profile = UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            # If UserProfile doesn't exist, you can create it (or return an error response)
            profile = UserProfile.objects.create(user=self.request.user)
        
        # Check if a MedicalProfile already exists for the user
        if not MedicalProfile.objects.filter(user=profile).exists():
            # If no MedicalProfile exists, create one
            MedicalProfile.objects.create(user=profile)
        
        return profile

class MedicalProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        
        user_profile = UserProfile.objects.get(user=self.request.user)
        # Return an error or create a profile if necessary
        medical_profile = MedicalProfile.objects.get(user=user_profile)
        return medical_profile


class CreateMedicalProfileView(generics.CreateAPIView):
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user_profile = UserProfile.objects.get(user=self.request.user)
        # Check if a MedicalProfile exists, and create it if not
        medical_profile, created = MedicalProfile.objects.get_or_create(user=user_profile)
        if created:
            # If the profile was created, save it with the provided data
            serializer.save(user=user_profile)
        else:
            return Response({"detail": "Medical Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class UpdateMedicalProfileView(generics.UpdateAPIView):
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        return user_profile.medical_profile

class MedicalInfoView(generics.RetrieveUpdateAPIView):
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user_profile = UserProfile.objects.get(user=self.request.user)
        medical_profile, created = MedicalProfile.objects.get_or_create(user=user_profile)
        return medical_profile

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
        # Save the diary entry with the user and the provided entry_text
        serializer.save(user=profile)

class CreateGoalView(generics.CreateAPIView):
    serializer_class = GoalSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        # Save the goal with the user and the provided goal_text
        profile = UserProfile.objects.get(user=self.request.user)
        serializer.save(user=profile)