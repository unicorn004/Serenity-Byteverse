from django.urls import path
from .views import TherapySessionListView

urlpatterns = [
    path('therapy-sessions/', TherapySessionListView.as_view(), name='therapy-session-list'),
]