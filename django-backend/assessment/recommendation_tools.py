from mlmodel import pinecone
from users.models import UserProfile, MedicalProfile
from .llm_tools import generate_user_remark, generate_medical_profile

def upsert_user_embedding(user_id):
    userprofile = UserProfile.objects.get(id=user_id)
    medical = userprofile.medical_profile

    if not medical.llm_remark:
        pass