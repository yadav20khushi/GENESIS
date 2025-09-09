from fastapi import APIRouter, HTTPException
from backend.schemas.chat import ChatRequest, ChatResponse
from backend.agent import send_message_to_letta

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Sends a message from React to the Letta agent and returns structured response.
    """
    try:
        response = send_message_to_letta(request.message)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
