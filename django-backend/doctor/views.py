from rest_framework import generics
from .models import TherapySession
from .serializers import TherapySessionSerializer

class TherapySessionListView(generics.ListCreateAPIView):
    queryset = TherapySession.objects.all()
    serializer_class = TherapySessionSerializer