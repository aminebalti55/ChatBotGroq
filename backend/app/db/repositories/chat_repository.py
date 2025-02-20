from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.exc import SQLAlchemyError
from app.models.chat import ChatMessage, ChatSession, DBChatSession, DBChatMessage
from datetime import datetime
from uuid import uuid4
import logging

logger = logging.getLogger(__name__)

class ChatRepository:
    def __init__(self, db: AsyncSession):
       
        self.db = db
        logger.info("ChatRepository initialized with database session")

    async def add_message(self, message: ChatMessage) -> ChatMessage:
        
        try:
            message_id = message.id or str(uuid4())
            session_id = message.session_id or str(uuid4())
            
            db_message = DBChatMessage(
                id=message_id,
                session_id=session_id,
                user_id=message.user_id,
                is_user=message.is_user,
                content=message.content,
                created_at=message.created_at or datetime.utcnow()
            )
            
            self.db.add(db_message)
            await self.db.commit()
            
            return message
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error adding message: {str(e)}")
            raise

    async def get_messages_by_session(self, session_id: str):
       
        try:
            result = await self.db.execute(
                select(DBChatMessage)
                .filter(DBChatMessage.session_id == session_id)
                .order_by(DBChatMessage.created_at)
            )
            
            db_messages = result.scalars().all()
            
            return [
                ChatMessage(
                    id=msg.id,
                    session_id=msg.session_id,
                    user_id=msg.user_id,
                    is_user=msg.is_user,
                    content=msg.content,
                    created_at=msg.created_at
                ) for msg in db_messages
            ]
        except Exception as e:
            logger.error(f"Error getting messages: {str(e)}")
            raise

    async def get_all_sessions(self):
       
        try:
            result = await self.db.execute(
                select(DBChatSession).order_by(DBChatSession.created_at.desc())
            )
            
            db_sessions = result.scalars().all()
            
            return [
                ChatSession(
                    id=session.id,
                    user_id=session.user_id,
                    created_at=session.created_at,
                    updated_at=session.updated_at
                ) for session in db_sessions
            ]
        except Exception as e:
            logger.error(f"Error getting sessions: {str(e)}")
            raise

    async def delete_session(self, session_id: str):
    
        try:
            await self.db.execute(
                delete(DBChatMessage).where(DBChatMessage.session_id == session_id)
            )
            
            await self.db.execute(
                delete(DBChatSession).where(DBChatSession.id == session_id)
            )
            
            await self.db.commit()
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting session: {str(e)}")
            raise