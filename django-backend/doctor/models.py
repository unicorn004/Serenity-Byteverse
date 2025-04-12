from django.db import models
from users.models import User

class TherapySession(models.Model):  
    """Therapy sessions with doctors"""  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_sessions', null=True, blank=True)
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_sessions', limit_choices_to={'role': 'therapist'})
    date = models.DateTimeField()
    status = models.CharField(max_length=255, default='Scheduled')  # status can be 'Scheduled', 'Joined', 'Completed', etc.
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Session with {self.doctor.username} on {self.date}"