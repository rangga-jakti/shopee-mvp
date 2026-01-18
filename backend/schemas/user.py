from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

# Schema untuk Register
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_seller: bool = False
    
    @validator('username')
    def username_alphanumeric(cls, v):
        if len(v) < 3:
            raise ValueError('Username minimal 3 karakter')
        if not v.replace('_', '').isalnum():
            raise ValueError('Username hanya boleh huruf, angka, dan underscore')
        return v
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 6:
            raise ValueError('Password minimal 6 karakter')
        return v

# Schema untuk Login
class UserLogin(BaseModel):
    username: str
    password: str

# Schema untuk Response User
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: Optional[str]
    phone: Optional[str]
    is_active: bool
    is_seller: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schema untuk Token Response
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse