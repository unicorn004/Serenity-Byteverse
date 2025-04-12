from django.contrib import admin
from .models import *

admin.site.register(UserProfile)
admin.site.register(Diary)
admin.site.register(Goal)
admin.site.register(MedicalProfile)
admin.site.register(Notification)


# Register your models here.
