# app/models/chat.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.db.database import Base
from uuid import uuid4

class DBChatSession(Base):
    __tablename__ = "chat_sessions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    
    messages = relationship("DBChatMessage", back_populates="session", cascade="all, delete-orphan")

class DBChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("chat_sessions.id"))
    user_id = Column(String, index=True, nullable=True)
    is_user = Column(Boolean, default=True)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.now)
    
    session = relationship("DBChatSession", back_populates="messages")

class ChatMessage(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid4()))
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    is_user: bool = True
    content: str = ''
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ChatSession(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class ChatHistoryResponse(BaseModel):
    session_id: str
    messages: List[ChatMessage] = []