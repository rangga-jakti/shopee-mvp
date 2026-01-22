from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from backend.schemas.product import ProductResponse

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    
    @validator('quantity')
    def quantity_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity harus lebih dari 0')
        return v

class CartItemUpdate(BaseModel):
    quantity: int
    
    @validator('quantity')
    def quantity_positive(cls, v):
        if v <= 0:
            raise ValueError('Quantity harus lebih dari 0')
        return v

class CartItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    created_at: datetime
    product: ProductResponse
    
    class Config:
        from_attributes = True

class CartSummary(BaseModel):
    total_items: int
    total_quantity: int
    total_price: float
    items: list[CartItemResponse]