# from django.shortcuts import render
# from django.http import JsonResponse
# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.parsers import MultiPartParser, FormParser
# from .emotion_utils import get_emotion_probabilities
# from users.models import UserProfile

# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser])
# def get_emotion(request):
#     """
#     API endpoint to process an uploaded image and return emotion probabilities.
#     """
#     if 'image' not in request.FILES:
#         return JsonResponse({'error': 'No image provided'}, status=400)

#     user = UserProfile.objects.get(user=request.user)
    
#     image_file = request.FILES['image']
#     try:
#         probabilities = get_emotion_probabilities(image_file)
#         return JsonResponse({'emotions': probabilities}, status=200)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)


from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .emotion_utils import get_emotion_probabilities
from users.models import UserProfile
import json

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def get_emotion(request):
    """
    API endpoint to process an uploaded image and return emotion probabilities.
    Saves the detected emotions in the `emotion` field of the user's profile.
    """
    if 'image' not in request.FILES:
        return JsonResponse({'error': 'No image provided'}, status=400)

    # try:
    #     user_profile = UserProfile.objects.get(user=request.user)
    # except UserProfile.DoesNotExist:
    #     return JsonResponse({'error': 'User profile not found'}, status=404)

    image_file = request.FILES['image']
    
    try:
        probabilities = get_emotion_probabilities(image_file)
        #print(probabilities)
        
        # Store the emotion probabilities as a JSON object
        # user_profile.emotion = json.dumps(probabilities)
        # user_profile.save()

        return JsonResponse({'emotions': probabilities}, status=200)
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
