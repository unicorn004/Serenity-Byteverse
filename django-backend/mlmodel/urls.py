from django.urls import path
from .views import submit_ml_test, MentalHealthChatbotView

urlpatterns = [
    path('submit/', submit_ml_test, name='submit_ml_test'),
    path('chat/',MentalHealthChatbotView.as_view(), name='chatbot'),

    
]



