from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .emotion_utils import get_emotion_probabilities

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def get_emotion(request):
    """
    API endpoint to process an uploaded image and return emotion probabilities.
    """
    if 'image' not in request.FILES:
        return JsonResponse({'error': 'No image provided'}, status=400)

    image_file = request.FILES['image']
    try:
        probabilities = get_emotion_probabilities(image_file)
        return JsonResponse({'emotions': probabilities}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
