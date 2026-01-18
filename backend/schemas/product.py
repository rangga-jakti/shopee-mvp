from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int = 0
    image_url: Optional[str] = None
    category: Optional[str] = None
    
    @validator('price')
    def price_positive(cls, v):
        if v <= 0:
            raise ValueError('Harga harus lebih dari 0')
        return v
    
    @validator('stock')
    def stock_positive(cls, v):
        if v < 0:
            raise ValueError('Stock tidak boleh negatif')
        return v

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None
    category: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    image_url: Optional[str]
    category: Optional[str]
    seller_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True