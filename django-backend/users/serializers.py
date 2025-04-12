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
        fields = ['id', 'username', 'email', 'streak', 'role']

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
        email = data.get('email', None)
        password = data.get('password', None)
        user = User.objects.filter(email=email).first()

        if user and user.check_password(password):
            tokens = RefreshToken.for_user(user)
            return {
                'refresh': str(tokens),
                'access': str(tokens.access_token),
                'user': UserSerializer(user).data
            }
        raise serializers.ValidationError("Invalid credentials")

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class MedicalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalProfile
        exclude = ['user']

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
        fields = '__all__'