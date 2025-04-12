from rest_framework import serializers
from .models import Forum, ChatMessage, Post, Comment, Reply
from users.serializers import UserProfileSerializer  # Use your existing serializer

class ForumSerializer(serializers.ModelSerializer):
    admin = UserProfileSerializer(read_only=True,allow_null=True)
    users = UserProfileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Forum
        fields = ['id', 'title', 'description', 'admin', 'users', 'created_at']

class ChatMessageSerializer(serializers.ModelSerializer):
    sender = UserProfileSerializer(read_only=True,allow_null=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'forum', 'sender', 'message', 'sent_at']
        read_only_fields = ['forum', 'sender', 'sent_at']

class PostSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True,allow_null=True)
    
    class Meta:
        model = Post
        fields = ['id', 'forum', 'user', 'title', 'content', 'created_at']
        read_only_fields = ['forum', 'user']

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True,allow_null=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'text', 'created_at']
        read_only_fields = ['post', 'user']

class ReplySerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True,allow_null=True)
    
    class Meta:
        model = Reply
        fields = ['id', 'comment', 'user', 'text', 'created_at']
        read_only_fields = ['comment', 'user']