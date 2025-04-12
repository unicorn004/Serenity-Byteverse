from django.urls import path
from .views import submit_ml_test

urlpatterns = [
    path('submit/', submit_ml_test, name='submit_ml_test'),
]