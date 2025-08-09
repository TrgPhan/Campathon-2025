from fastapi import FastAPI
from .api.chat import router as chat_router
from .utils.logger_config import get_logger

app = FastAPI(
    title="FoodXPro",
    description="API",
    version="1.0.0"
)
logger = get_logger("recipe-assistant")
app.include_router(chat_router,prefix="/api", tags=["Chat"])

@app.get("/")
def root():
    logger.info("Root endpoint called")
    return {"message": "Recipe Assistant API is running!"}