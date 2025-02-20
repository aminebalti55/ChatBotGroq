from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.chat import ChatSession, ChatMessage, ChatHistoryResponse
from app.db.repositories.chat_repository import ChatRepository
from app.services.chat_service import ChatService

router = APIRouter()

@router.get("/chats", response_model=List[ChatSession])
async def get_sessions(
    user_id: str = None,
    db: Session = Depends(get_db)
):
    chat_repository = ChatRepository(db)
    chat_service = ChatService(chat_repository)
    return await chat_service.get_all_sessions(user_id)

@router.get("/chats/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    chat_repository = ChatRepository(db)
    chat_service = ChatService(chat_service=chat_repository)
    messages = await chat_service.get_chat_history(session_id)
    
    if not messages:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    return ChatHistoryResponse(
        session_id=session_id,
        messages=messages
    )