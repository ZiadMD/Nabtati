from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
from pydantic import BaseModel, EmailStr, Field
import uuid

from ..database import get_db
from ..models import User
from ..services import auth_service

router = APIRouter()

# Pydantic models for request/response
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    full_name_ar: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    address_ar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    full_name_ar: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    address_ar: Optional[str] = None

class UserResponse(UserBase):
    id: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Routes
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user with email already exists
    db_user_email = db.query(User).filter(User.email == user.email).first()
    if db_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if user with username already exists
    db_user_username = db.query(User).filter(User.username == user.username).first()
    if db_user_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = auth_service.get_password_hash(user.password)
    db_user = User(
        id=str(uuid.uuid4()),
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.full_name,
        full_name_ar=user.full_name_ar,
        phone_number=user.phone_number,
        address=user.address,
        address_ar=user.address_ar
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Authenticate user
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = auth_service.create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(auth_service.get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user(user_update: UserUpdate, current_user: User = Depends(auth_service.get_current_user), db: Session = Depends(get_db)):
    # Update user fields if provided
    if user_update.email is not None:
        # Check if email is already taken by another user
        existing_user = db.query(User).filter(User.email == user_update.email).first()
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_update.email
    
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    if user_update.full_name_ar is not None:
        current_user.full_name_ar = user_update.full_name_ar
    
    if user_update.phone_number is not None:
        current_user.phone_number = user_update.phone_number
    
    if user_update.address is not None:
        current_user.address = user_update.address
    
    if user_update.address_ar is not None:
        current_user.address_ar = user_update.address_ar
    
    db.commit()
    db.refresh(current_user)
    
    return current_user