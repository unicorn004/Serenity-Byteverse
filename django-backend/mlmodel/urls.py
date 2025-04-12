from django.urls import path
from .views import ChatAPIView

urlpatterns = [
        # path('submit/', submit_ml_test, name='submit_ml_test'),
    path('chat/',ChatAPIView().as_view(), name='chatbot'),

]



