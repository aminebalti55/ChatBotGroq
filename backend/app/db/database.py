from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, AsyncEngine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./chatbot.db")

# Create async SQLAlchemy engine
engine = create_async_engine(
    DATABASE_URL, 
    echo=True,  
    future=True  
)

# Create session factory
AsyncSessionLocal = sessionmaker(
    engine, 
    autocommit=False,
    autoflush=False,
    class_=AsyncSession  
)

Base = declarative_base()

async def init_db():
   
    from app.models.user import DBUser
    from app.models.chat import DBChatSession, DBChatMessage
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_db():

    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()