from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from users.models import UserProfile, MedicalProfile
from users.serializers import MedicalProfileSerializer

class MedicalProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on the medical profile.
    """
    serializer_class = MedicalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Ensure that the queryset only returns the medical profile for the authenticated user.
        """
        user_profile = UserProfile.objects.get(user=self.request.user)
        return MedicalProfile.objects.filter(user=user_profile)

    def perform_create(self, serializer):
        """
        Prevent a user from creating multiple medical profiles.
        """
        user_profile = UserProfile.objects.get(user=self.request.user)
        if MedicalProfile.objects.filter(user=user_profile).exists():
            return Response({"detail": "Medical Profile already exists."}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(user=user_profile)