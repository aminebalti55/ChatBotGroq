from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError  
import logging
from typing import Optional
import uuid

from app.models.user import DBUser, UserCreate
from app.utils.security import get_password_hash

logger = logging.getLogger(__name__)

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def get_user_by_email(self, email: str) -> Optional[DBUser]:
        """
        Retrieve a user by email
        """
        try:
            query = select(DBUser).where(DBUser.email == email)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_user_by_email: {str(e)}")
            raise
            
    async def get_user_by_id(self, user_id: str) -> Optional[DBUser]:
        """
        Retrieve a user by ID
        """ 
        try:
            query = select(DBUser).where(DBUser.id == user_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            logger.error(f"Database error in get_user_by_id: {str(e)}")
            raise
            
    async def create_user(self, user_data: UserCreate, user_id: Optional[str] = None) -> DBUser:
        """
        Create a new user
        """
        try:
            # Generate UUID if not provided
            if not user_id:
                user_id = str(uuid.uuid4())
                
            # Hash the password  
            hashed_password = get_password_hash(user_data.password)
            
            # Create new user
            db_user = DBUser(
                id=user_id,
                email=user_data.email,
                hashed_password=hashed_password,
                is_active=True
            )
            
            self.db.add(db_user)
            await self.db.commit() 
            await self.db.refresh(db_user)
            
            return db_user
            
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"Database error in create_user: {str(e)}")
            raise
    
    async def update_user(self, user_id: str, update_data: dict) -> Optional[DBUser]:
        """
        Update user information
        """
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                return None
                
            for key, value in update_data.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            
            await self.db.commit()
            await self.db.refresh(user)
            return user
        
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"Database error in update_user: {str(e)}")
            raise
            
    async def deactivate_user(self, user_id: str) -> Optional[DBUser]:
        """
        Deactivate a user (soft delete)  
        """
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                return None
            
            user.is_active = False
            await self.db.commit()
            await self.db.refresh(user)
            return user
        
        except SQLAlchemyError as e:
            await self.db.rollback() 
            logger.error(f"Database error in deactivate_user: {str(e)}")
            raise
            
    async def verify_user_exists(self, user_id: str) -> bool:
        """
        Check if a user exists by ID
        """
        try:
            user = await self.get_user_by_id(user_id)
            return user is not None
        except SQLAlchemyError as e:
            logger.error(f"Database error in verify_user_exists: {str(e)}")
            raise
            
    async def change_password(self, user_id: str, new_password: str) -> Optional[DBUser]:
        """  
        Change user's password
        """
        try:
            user = await self.get_user_by_id(user_id)
            if not user:
                return None
            
            hashed_password = get_password_hash(new_password)
            user.hashed_password = hashed_password
            await self.db.commit()
            await self.db.refresh(user)
            return user
        
        except SQLAlchemyError as e:
            await self.db.rollback()
            logger.error(f"Database error in change_password: {str(e)}")
            raise
            
