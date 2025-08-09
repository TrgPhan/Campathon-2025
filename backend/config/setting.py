import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW_DIR = os.path.join(BASE_DIR, 'data', 'raw')
RECIPES_FOR_CHROMA_DIR = os.path.join(BASE_DIR, 'data', 'processed')
CHROMA_DB_DIR = os.path.join(BASE_DIR, 'data', 'chroma_db')