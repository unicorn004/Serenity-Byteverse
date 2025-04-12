from django.urls import path
from .views import get_emotion

urlpatterns = [
    path('get_emotion/', get_emotion, name='get_emotion'),
]
