from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
import os
from logging import getLogger
from uuid import uuid4

from app.models.user import UserCreate, DBUser
from app.db.repositories.user_repository import UserRepository

logger = getLogger(__name__)

class AuthService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        self.SECRET_KEY = os.getenv("SECRET_KEY")
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY must be set in environment variables")
            
        self.ALGORITHM = os.getenv("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        try:
            return self.pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification error: {str(e)}")
            return False

    def get_password_hash(self, password: str) -> str:
        return self.pwd_context.hash(password)

    async def authenticate_user(self, email: str, password: str) -> Optional[DBUser]:
        try:
            user = await self.user_repository.get_user_by_email(email)
            if not user:
                return None
                
            if not self.verify_password(password, user.hashed_password):
                return None
                
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User account is disabled"
                )
                
            return user
            
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed"
            )

    def create_access_token(self, data: Dict[str, Any]) -> str:
        try:
            to_encode = data.copy()
            
            expire = datetime.utcnow() + timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)
            to_encode.update({
                "exp": expire,
                "iat": datetime.utcnow(),
                "jti": str(uuid4())  
            })
            
            encoded_jwt = jwt.encode(
                to_encode, 
                self.SECRET_KEY, 
                algorithm=self.ALGORITHM
            )
            
            return encoded_jwt
            
        except Exception as e:
            logger.error(f"Token creation error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not create access token"
            )

    async def register_user(self, user_data: UserCreate, user_id: str = None) -> DBUser:
       
        try:
            existing_user = await self.user_repository.get_user_by_email(user_data.email)
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

            if len(user_data.password) < 8:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must be at least 8 characters long"
                )

            if not user_id:
                user_id = str(uuid4())
                
            user = await self.user_repository.create_user(user_data, user_id)
            
            return user
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"User registration error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register user"
            )

    async def verify_token(self, token: str) -> Optional[DBUser]:
        try:
            payload = jwt.decode(
                token, 
                self.SECRET_KEY, 
                algorithms=[self.ALGORITHM]
            )
            
            email: str = payload.get("sub")
            if not email:
                return None
                
            user = await self.user_repository.get_user_by_email(email)
            if not user or not user.is_active:
                return None
                
            return user
            
        except JWTError:
            return None
        except Exception as e:
            logger.error(f"Token verification error: {str(e)}")
            return None