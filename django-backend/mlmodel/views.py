from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from mlmodel.ml_inference import predict
from .serializers import TestInputSerializer
from serenity.mongo_client import db  # Import MongoDB connection
from .serializers import ChatInputSerializer, ChatOutputSerializer
from .chain import chain

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




class MentalHealthChatbotView(APIView):
    def post(self, request, *args, **kwargs):
        # Validate input
        input_serializer = ChatInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Generate response using LangChain
        user_input = input_serializer.validated_data["user_input"]
        try:
            response = chain.invoke({"user_input": user_input})
            output_data = {"response": response.content}
            return Response(output_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

