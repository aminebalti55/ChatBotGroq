from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from jose import JWTError, jwt
import logging
import os
import uuid
from sqlalchemy import select
from app.utils.security import get_password_hash, create_access_token

from app.db.database import get_db
from app.models.user import UserCreate, User, Token, TokenData, DBUser
from app.services.auth_service import AuthService
from app.db.repositories.user_repository import UserRepository

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


@router.post("/signup", response_model=Dict[str, Any])
async def signup(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        user_repository = UserRepository(db)
        auth_service = AuthService(user_repository)

        query = select(DBUser).where(DBUser.email == user_data.email)
        result = await db.execute(query)
        existing_user = result.scalars().first()  # ✅ Correct async execution

        if existing_user:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"detail": "Email already registered"}
            )

        user_id = str(uuid.uuid4())
        hashed_password = get_password_hash(user_data.password)

        new_user = DBUser(
            id=user_id,
            email=user_data.email,
            hashed_password=hashed_password,
            is_active=True
        )

        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        access_token = create_access_token(data={"sub": new_user.email})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "is_active": new_user.is_active,
                "created_at": new_user.created_at.isoformat()
            }
        }

    except Exception as e:
        logger.error(f"Signup error: {str(e)}")
        await db.rollback()  # ✅ Now db is an AsyncSession
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": str(e)}
        )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
   
    try:
        user_repository = UserRepository(db)
        auth_service = AuthService(user_repository)
        
        user = await auth_service.authenticate_user(form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = auth_service.create_access_token(data={"sub": user.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "is_active": user.is_active
            }
        }
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)  
) -> DBUser:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub") 
        if email is None:
            raise credentials_exception
            
        token_data = TokenData(email=email)
        
    except JWTError:
        raise credentials_exception
        
    try:
        user_repository = UserRepository(db)
        user = await user_repository.get_user_by_email(token_data.email)
        if user is None:
            raise credentials_exception
        return user
        
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        raise credentials_exception

@router.get("/me", response_model=Dict[str, Any]) 
async def get_current_user_info(current_user: DBUser = Depends(get_current_user)):
   
    return {
        "user": {
            "id": current_user.id,
            "email": current_user.email,
            "is_active": current_user.is_active,
            "created_at": current_user.created_at.isoformat()
        }
    }
        
@router.get("/verify-token")
async def verify_token(current_user: DBUser = Depends(get_current_user)):
   
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid token"
        )
    return {
        "id": current_user.id,
        "email": current_user.email, 
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat()
    }
       