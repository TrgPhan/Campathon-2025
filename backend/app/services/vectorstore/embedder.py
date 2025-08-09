import os
import json
from dotenv import load_dotenv

from backend.config import RECIPES_FOR_CHROMA_DIR, CHROMA_DB_DIR

from langchain.schema import Document
from langchain_chroma import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_google_genai import GoogleGenerativeAIEmbeddings


load_dotenv()

def load_recipes(json_list):
    docs = []
    for item in json_list:
        content = item["content"]
        docs.append(Document(page_content=content, metadata=item["metadata"]))
    return docs

RECIPES_FOR_CHROMA_FILE = os.path.join(RECIPES_FOR_CHROMA_DIR, 'recipes_for_Chroma.json')

with open(RECIPES_FOR_CHROMA_FILE, "r", encoding='utf-8') as f:
    docs = json.load(f)

splitter = RecursiveCharacterTextSplitter(chunk_size=750, chunk_overlap=100)
embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

rec_docs = load_recipes(docs)
texts = splitter.split_documents(rec_docs)

for doc in texts:
    doc.page_content = f"{doc.metadata['id']}\n\n{doc.metadata['title']}\n\n{doc.page_content}"

vectordb = Chroma.from_documents(texts, embedding_model, persist_directory=CHROMA_DB_DIR)