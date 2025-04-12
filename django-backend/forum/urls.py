from django.urls import path
from .views import (
    ForumListView, ForumDetailView, JoinForumView,
    ChatMessageListView, PostListView, CommentListView, ReplyListView
)

urlpatterns = [

    path('forums/', ForumListView.as_view(), name='forum-list'),
    path('forums/<int:pk>/', ForumDetailView.as_view(), name='forum-detail'),
    path('forums/<int:forum_id>/join/', JoinForumView.as_view(), name='join-forum'),
    
    path('forums/<int:forum_id>/messages/', ChatMessageListView.as_view(), name='forum-messages'),
    
    path('forums/<int:forum_id>/posts/', PostListView.as_view(), name='forum-posts'),
    
    path('posts/<int:post_id>/comments/', CommentListView.as_view(), name='post-comments'),
    
    path('comments/<int:comment_id>/replies/', ReplyListView.as_view(), name='comment-replies'),
]