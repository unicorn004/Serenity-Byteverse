from rest_framework import generics
from .models import Forum, ChatMessage, Post, Comment, Reply
from .serializers import ForumSerializer, ChatMessageSerializer, PostSerializer, CommentSerializer, ReplySerializer

class ForumListView(generics.ListCreateAPIView):
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer

class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentListView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class ReplyListView(generics.ListCreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer