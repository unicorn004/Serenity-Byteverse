from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from mlmodel.ml_inference import predict
from .serializers import TestInputSerializer
from serenity.mongo_client import db  # Import MongoDB connection

@api_view(['POST'])
def submit_ml_test(request):
    serializer = TestInputSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data['data']
        prediction = predict(data)  # Your ML model prediction function

        # Save the test result to MongoDB
        test_results_collection = db["test_results"]
        test_results_collection.insert_one({
            "user": request.user.username if request.user.is_authenticated else "anonymous",
            "input_data": data,
            "prediction": prediction.tolist()
        })

        return Response({'prediction': prediction.tolist()}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)