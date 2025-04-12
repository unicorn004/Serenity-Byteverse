from rest_framework import generics, permissions
from .models import TherapySession
from .serializers import TherapySessionSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import BasePermission

class IsTherapist(BasePermission):
    def has_permission(self, request, view):
        if request.method in ['POST', 'PUT']: 
            return request.user.profile.role == 'therapist'
        return True  

class TherapySessionListView(generics.ListCreateAPIView):
    queryset = TherapySession.objects.all()
    serializer_class = TherapySessionSerializer
    permission_classes = [IsTherapist | permissions.IsAuthenticated]  

    def perform_create(self, serializer):
        if self.request.user.profile.role != 'therapist':
            raise PermissionDenied("Only therapists can create a session.")
        serializer.save()

class TherapySessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TherapySession.objects.all()
    serializer_class = TherapySessionSerializer
    permission_classes = [IsTherapist | permissions.IsAuthenticated]  

class TherapySessionJoinView(generics.UpdateAPIView):
    queryset = TherapySession.objects.all()
    serializer_class = TherapySessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        therapy_session = self.get_object()
        if request.user.profile.role == 'therapist':
            raise PermissionDenied("Therapists cannot join therapy sessions.")
        
        therapy_session.user = request.user 
        therapy_session.status = 'Joined'  
        therapy_session.save()

        return super().update(request, *args, **kwargs)