import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./data/app.db")


RAW_DIR = os.path.join(BASE_DIR, 'data', 'raw')
RECIPES_FOR_CHROMA_DIR = os.path.join(BASE_DIR, 'data', 'processed')
CHROMA_DB_DIR = os.path.join(BASE_DIR, 'data', 'chroma_db')