from pinecone import Pinecone
import os

# Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

def upsert_to_pinecone(pinecone_id, text, user_id, role, timestamp):
    """
    Upserts a message to Pinecone with its embedding and metadata.
    
    Args:
        pinecone_id (str): Unique ID for the message in Pinecone.
        text (str): The raw text of the message.
        user_id (str): ID of the user.
        role (str): Role of the message ("user" or "assistant").
        timestamp (str): ISO-formatted timestamp of the message.
    """
    # Generate embedding using Pinecone Inference API
    embedding = pc.inference.embed(
        model="multilingual-e5-large",
        inputs=[text],
        parameters={"input_type": "passage"}
    )[0]  # Extract the first embedding
    
    # Upsert to Pinecone
    index = pc.Index("chat-history")
    index.upsert(
        vectors=[(
            pinecone_id,
            embedding,
            {
                "user_id": user_id,
                "role": role,
                "timestamp": timestamp
            }
        )],
        namespace="chat_history"
    )