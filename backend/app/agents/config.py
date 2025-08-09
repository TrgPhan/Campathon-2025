import os
from dotenv import load_dotenv
from ...config import CHROMA_DB_DIR

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

# Kiểm tra API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please set it in your .env file.")

retrieve_llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key=api_key
)
agent_llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash", 
    google_api_key=api_key
)

embed = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=api_key
)

vectordb = Chroma(embedding_function=embed, persist_directory=CHROMA_DB_DIR)
retriever = vectordb.as_retriever(search_kwargs={"k": 6})

def get_llm_for_retrieve_recipe():
    return retrieve_llm

def get_llm_for_agent():
    return agent_llm

def get_embed_for_retrieve_recipe():
    return embed

def get_vectordb_for_retrieve_recipe():
    return vectordb

def get_retriever_for_retrieve_recipe():
    return retriever