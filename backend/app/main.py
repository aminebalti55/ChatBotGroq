# app/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.services.groq_service import GroqService
from app.services.chat_service import ChatService
from app.db.repositories.chat_repository import ChatRepository
from app.models.chat import ChatMessage, ChatSession
from app.db.database import init_db, get_db, engine
from app.api.routes.auth import router as auth_router
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import DBUser  
from app.models.chat import DBChatSession, DBChatMessage  

from typing import List
import logging
import uuid
import traceback
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Chat API",
    description="Backend for AI Chat application with Groq integration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)

groq_service = GroqService()

@app.on_event("startup")
async def startup_event():
   
    async with engine.begin() as conn:
        from app.models.user import DBUser
        from app.models.chat import DBChatSession, DBChatMessage
        
        await conn.run_sync(DBUser.metadata.create_all)
        await conn.run_sync(DBChatSession.metadata.create_all)
        await conn.run_sync(DBChatMessage.metadata.create_all)
    
    logger.info("Database tables created successfully")

@app.websocket("/ws/chat")
async def chat_websocket(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    chat_repository = ChatRepository(db)
    chat_service = ChatService(chat_repository)

    session_id = str(uuid.uuid4())
    
    try:
        await websocket.accept()
        
        await websocket.send_json({
            "type": "connection_established",
            "session_id": session_id
        })
        
        while True:
            try:
                data = await websocket.receive_json()
                
                if not isinstance(data, dict):
                    raise ValueError("Invalid message format")
                
                if 'message' not in data:
                    raise ValueError("No message content provided")
                
                current_session_id = data.get('session_id', session_id)
                
                user_message = ChatMessage(
                    session_id=current_session_id,
                    content=data['message'],
                    is_user=True,
                    created_at=datetime.utcnow()
                )
                await chat_service.save_message(user_message)
                
                await websocket.send_json({
                    "type": "message_received", 
                    "session_id": current_session_id
                })
                
                full_response = ""
                async for token in groq_service.stream_completion(data['message']):
                    await websocket.send_json({
                        "type": "token",
                        "content": token,
                        "session_id": current_session_id
                    })
                    full_response += token
                
                ai_message = ChatMessage(
                    session_id=current_session_id,
                    content=full_response,
                    is_user=False,
                    created_at=datetime.utcnow()
                )
                await chat_service.save_message(ai_message)
                
                await websocket.send_json({
                    "type": "completion", 
                    "session_id": current_session_id
                })
                
            except Exception as e:
                logger.error(f"Error processing message: {str(e)}")
                logger.error(traceback.format_exc())
                
                await websocket.send_json({
                    "type": "error",
                    "message": str(e),
                    "session_id": session_id
                })
                
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected: {session_id}")
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {str(e)}")
        logger.error(traceback.format_exc())
    finally:
        try:
            await websocket.close()
        except Exception:
            pass

@app.get("/api/chats", response_model=List[ChatSession])
async def get_chat_sessions(db: AsyncSession = Depends(get_db)):
    chat_repository = ChatRepository(db)
    chat_service = ChatService(chat_repository)
    return await chat_service.get_all_sessions()

@app.get("/api/chats/{session_id}/messages", response_model=List[ChatMessage])
async def get_chat_messages(session_id: str, db: AsyncSession = Depends(get_db)):
    chat_repository = ChatRepository(db)
    chat_service = ChatService(chat_repository)
    messages = await chat_service.get_chat_history(session_id)
    if not messages:
        raise HTTPException(status_code=404, detail="Chat session not found")
    return messages

@app.get("/health")
async def health_check():
    return {"status": "ok"}