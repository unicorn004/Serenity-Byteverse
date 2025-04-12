from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import time
import os

# Initialize Pinecone client
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))


# Creating New Pinecone Index
if not pc.has_index("serenity"):
    pc.create_index(
        name="serenity",
        dimension=1024,
        metric="cosine",
        spec=ServerlessSpec(
            cloud='aws', 
            region='us-east-1'
        ) 
    ) 

index = pc.Index("serenity")



def upsert_to_pinecone(id, text, namespace, timestamp, metadata=None):
    """
    Upserts a vector to Pinecone with its embedding and metadata.
    
    Args:
        index_name (str): Name of the Pinecone index.
        id (str): Unique ID for the vector in Pinecone.
        text (str): The raw text to generate an embedding.
        namespace (str): Namespace to store the vector in.
        timestamp (str): ISO-formatted timestamp (optional, stored in metadata).
        metadata (dict): Additional metadata to associate with the vector.
    """
    try:
        # Validate inputs
        if not id or not text:
            raise ValueError("ID and text must be non-empty.")
        if not namespace:
            raise ValueError("Namespace must be specified.")
        
        # Generate embedding
        embedding = pc.inference.embed(
            model="multilingual-e5-large",
            inputs=[text],
            parameters={"input_type": "passage"}
        )[0]  # Extract the first embedding
        
        # Add timestamp to metadata if provided
        if timestamp:
            if metadata is None:
                metadata = {}
            metadata["timestamp"] = timestamp
        
        
        # Upsert the vector
        index.upsert(
            vectors=[(id, embedding, metadata)],
            namespace=namespace
        )
        
        # Log success
        print(f"Successfully upserted ID {id} into namespace '{namespace}'.")
    
    except Exception as e:
        print(f"An error occurred: {e}")

        
def get_embedding_from_pinecone(id, namespace):
    """
    Fetches an embedding from Pinecone by ID and namespace.
    
    Args:
        index_name (str): Name of the Pinecone index.
        id (str): Unique ID of the vector.
        namespace (str): Namespace where the vector is stored.
    
    Returns:
        list: The embedding vector.
    """
    try:
        # Connect to Pinecone index
        
        # Fetch the vector
        result = index.fetch(ids=[id], namespace=namespace)
        
        # Extract and return the embedding
        if id in result["vectors"]:
            return result["vectors"][id]["values"]
        else:
            raise ValueError(f"No embedding found for ID: {id} in namespace: {namespace}")

    except Exception as e:
        print(f"An error occurred: {e}")

def query_pinecone(query,namespace, query_embedding = None):

    if not query and not query_embedding:
        raise ValueError("No Query or Query_Embedding provided")
    if not namespace:
        raise ValueError("No namespace provided")
            # Convert the query into a numerical vector that Pinecone can search with
    if not query_embedding:
        query_embedding = pc.inference.embed(
            model="multilingual-e5-large",
            inputs=[query],
            parameters={
                "input_type": "query"
            }
        )[0]['values']
    results = index.query(
        namespace=namespace,
        vector=query_embedding,
        top_k=3,
        include_values=False,
        include_metadata=True
    )

    return results


