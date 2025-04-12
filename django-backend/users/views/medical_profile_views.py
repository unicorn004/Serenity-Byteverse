from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .models import UserProfile, MedicalProfile
from .serializers import MedicalProfileSerializer

class MedicalProfileViewSet(viewsets.ModelViewSet):
    """
    This ViewSet provides CRUD operations for the medical profile of the user.
    """
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override to ensure that we return the medical profile for the currently authenticated user.
        """
        user_profile = UserProfile.objects.get(user=self.request.user)
        return MedicalProfile.objects.filter(user=user_profile)

    def perform_create(self, serializer):
        """
        Override to ensure a user can only have one medical profile.
        """
        user_profile = UserProfile.objects.get(user=self.request.user)
        medical_profile, created = MedicalProfile.objects.get_or_create(user=user_profile)
        if created:
            serializer.save(user=user_profile)
        else:
            return Response({"detail": "Medical Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)