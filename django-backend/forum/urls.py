from django.urls import path
from .views import ForumListView, PostListView, CommentListView, ReplyListView

urlpatterns = [
    path('forums/', ForumListView.as_view(), name='forum-list'),
    path('posts/', PostListView.as_view(), name='post-list'),
    path('comments/', CommentListView.as_view(), name='comment-list'),
    path('replies/', ReplyListView.as_view(), name='reply-list'),
]