import cv2
import torch
import numpy as np
from transformers import AutoImageProcessor, AutoModelForImageClassification
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
import io

# Load the model and processor once at startup
processor = AutoImageProcessor.from_pretrained("dima806/facial_emotions_image_detection")
model = AutoModelForImageClassification.from_pretrained("dima806/facial_emotions_image_detection")

# Get label names
id2label = model.config.id2label
labels = list(id2label.values())

def get_emotion_probabilities(image_file: InMemoryUploadedFile):
    """
    Processes an uploaded image file and returns a dictionary of emotion probabilities.

    :param image_file: Uploaded image file (Django InMemoryUploadedFile)
    :return: Dictionary with emotion labels and their probabilities
    """

    # Convert the uploaded image to a format suitable for processing
    image = Image.open(image_file).convert("RGB")
    image_np = np.array(image)

    # Preprocess the image
    inputs = processor(images=image_np, return_tensors="pt")

    # Get model predictions
    with torch.no_grad():
        outputs = model(**inputs)

    # Compute softmax probabilities
    logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=1)[0].cpu().numpy()

    # Create a dictionary of label-probability pairs
    emotion_probs = {label: float(prob) for label, prob in zip(labels, probabilities)}

    return emotion_probs
