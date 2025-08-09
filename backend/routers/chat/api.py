from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.agents.agent import process_message
from backend.utils.logger_config import get_logger
router = APIRouter()

SESSION_STORE = {}
logger = get_logger(__name__)
class ChatRequest(BaseModel):
    session_id: str
    message: str

@router.post("/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        history = SESSION_STORE.get(req.session_id, [])

        response, updated_history = process_message(req.message, history, limit_message=10)
        SESSION_STORE[req.session_id] = updated_history
        return {'response' : response}
    except ValueError as e:
        return {'Error': str(e)}
    except Exception as e:
        logger.exception(f"Error in /chat {e}")
        return {"Error": "Internal server error"}