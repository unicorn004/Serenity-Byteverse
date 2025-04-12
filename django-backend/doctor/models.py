from django.db import models
from users.models import User

class TherapySession(models.Model):  
    """Therapy sessions with doctors"""  
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='therapy_sessions')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_sessions', limit_choices_to={'role': 'doctor'})
    date = models.DateTimeField()
    status = models.CharField(max_length=255)
    remarks = models.TextField(blank=True, null=True)