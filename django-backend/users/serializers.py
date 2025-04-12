from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, MedicalProfile, Diary, Goal, Notification
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    streak = serializers.IntegerField(source='profile.streak', read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)
    
    class Meta:
        model = User
        exclude = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email', '').lower()  # Normalize email to lowercase
        password = data.get('password')

        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            # Add the user to the validated data
            data['user'] = user
            return data  # Return the original data + user

        raise serializers.ValidationError("Invalid credentials")

class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    class Meta:
        model = UserProfile
        fields = '__all__'

        # exclude = ['user']

class MedicalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalProfile
        # exclude = ['user']
        fields = '__all__'

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        exclude = ['user']

class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        exclude = ['user']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        exclude = ['user']