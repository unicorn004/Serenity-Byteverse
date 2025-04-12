from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .ml_inference import predict
from .serializers import TestInputSerializer

@api_view(['POST'])
def submit_ml_test(request):
    serializer = TestInputSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data['data']
        prediction = predict(data)  # Your ML model prediction function
        return Response({'prediction': prediction.tolist()}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)