from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Forum, ChatMessage, Post, Comment, Reply
from .serializers import ForumSerializer, ChatMessageSerializer, PostSerializer, CommentSerializer, ReplySerializer
from users.models import UserProfile

# Custom Permissions
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.admin == request.user.profile

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user.profile

# Forum Views
class ForumListView(generics.ListCreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = []

    def perform_create(self, serializer):
        admin = self.request.user.profile if self.request.user.is_authenticated else None
        serializer.save(admin=admin)

class ForumDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
    permission_classes = [IsAdminOrReadOnly]

class JoinForumView(APIView):
    permission_classes = []

    def post(self, request, forum_id):
        forum = generics.get_object_or_404(Forum, id=forum_id)
        if request.user.is_authenticated:
            user_profile = request.user.profile
            forum.add_user(user_profile)
            return Response({"message": "Joined forum successfully"}, status=status.HTTP_200_OK)
        
        # If the user is not authenticated, return a success message (or handle as needed)
        return Response({"message": "Anonymous users cannot join forums"}, status=status.HTTP_200_OK)

# Chat Messages
class ChatMessageListView(generics.ListCreateAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = []

    def get_queryset(self):
        forum_id = self.kwargs['forum_id']
        return ChatMessage.objects.filter(forum_id=forum_id)

    def perform_create(self, serializer):
        forum = generics.get_object_or_404(Forum, id=self.kwargs['forum_id'])
        serializer.save(forum=forum, sender=None)

# Post, Comment, Reply Views (similar structure)
class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = []

    def get_queryset(self):
        forum_id = self.kwargs['forum_id']
        return Post.objects.filter(forum_id=forum_id)

    def perform_create(self, serializer):
        forum = generics.get_object_or_404(Forum, id=self.kwargs['forum_id'])
        user = self.request.user.profile if self.request.user.is_authenticated else None
        serializer.save(forum=forum, user=user)

class CommentListView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = []

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post = generics.get_object_or_404(Post, id=self.kwargs['post_id'])
        user = self.request.user.profile if self.request.user.is_authenticated else None
        serializer.save(post=post, user=user)

class ReplyListView(generics.ListCreateAPIView):
    serializer_class = ReplySerializer
    permission_classes = []

    def get_queryset(self):
        comment_id = self.kwargs['comment_id']
        return Reply.objects.filter(comment_id=comment_id)

    def perform_create(self, serializer):
        comment = generics.get_object_or_404(Comment, id=self.kwargs['comment_id'])
        user = self.request.user.profile if self.request.user.is_authenticated else None
        serializer.save(comment=comment, user=user)