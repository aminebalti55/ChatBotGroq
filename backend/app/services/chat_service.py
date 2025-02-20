from app.db.repositories.chat_repository import ChatRepository
from app.models.chat import ChatMessage, ChatSession
from typing import List, Optional
from uuid import uuid4
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class ChatService:
    def __init__(self, chat_repository: ChatRepository):
       
        self.chat_repository = chat_repository
        logger.info("ChatService initialized")

    async def create_session(self) -> str:
      
        session_id = str(uuid4())
        session = ChatSession(
            id=session_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        await self.chat_repository.add_session(session)
        return session_id

    async def save_message(self, message: ChatMessage) -> ChatMessage:
      
        try:
            if not message.id:
                message.id = str(uuid4())

            if not message.created_at:
                message.created_at = datetime.utcnow()

            saved_message = await self.chat_repository.add_message(message)

            return saved_message

        except Exception as e:
            logger.error(f"Error saving message: {str(e)}")
            raise

    async def get_chat_history(self, session_id: str) -> List[ChatMessage]:
      
        try:
            return await self.chat_repository.get_messages_by_session(session_id)
        except Exception as e:
            logger.error(f"Error getting chat history: {str(e)}")
            raise

    async def get_all_sessions(self, user_id: Optional[str] = None) -> List[ChatSession]:
       
        try:
            sessions = await self.chat_repository.get_all_sessions()
            
            if user_id:
                sessions = [session for session in sessions if session.user_id == user_id]
            
            return sessions
        except Exception as e:
            logger.error(f"Error getting sessions: {str(e)}")
            raise

    async def delete_session(self, session_id: str) -> bool:
     
        try:
            return await self.chat_repository.delete_session(session_id)
        except Exception as e:
            logger.error(f"Error deleting session: {str(e)}")
            raise