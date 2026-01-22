from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    shipping_address: str
    items: List[OrderItemCreate]
    
    @validator('shipping_address')
    def address_not_empty(cls, v):
        if not v or len(v.strip()) < 10:
            raise ValueError('Alamat pengiriman minimal 10 karakter')
        return v

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    buyer_id: int
    total_amount: float
    status: str
    shipping_address: str
    created_at: datetime
    items: List[OrderItemResponse]
    
    class Config:
        from_attributes = True