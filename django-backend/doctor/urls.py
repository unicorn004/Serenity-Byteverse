from django.urls import path
from .views import TherapySessionListView, TherapySessionDetailView, TherapySessionJoinView

urlpatterns = [
    path('therapy-sessions/', TherapySessionListView.as_view(), name='therapy-session-list'),  # GET to list, POST to create (therapist only)
    path('therapy-sessions/<int:pk>/', TherapySessionDetailView.as_view(), name='therapy-session-detail'),  # GET to retrieve, PUT/PATCH to update (therapist only)
    path('therapy-sessions/join/<int:pk>/', TherapySessionJoinView.as_view(), name='therapy-session-join'),  # PATCH to join a session (users only)
]