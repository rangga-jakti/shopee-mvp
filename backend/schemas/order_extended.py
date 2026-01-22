from pydantic import BaseModel
from typing import List
from datetime import datetime

class ProductInOrder(BaseModel):
    id: int
    name: str
    price: float
    image_url: str | None
    
    class Config:
        from_attributes = True

class OrderItemExtended(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: ProductInOrder
    
    class Config:
        from_attributes = True

class OrderExtended(BaseModel):
    id: int
    buyer_id: int
    total_amount: float
    status: str
    shipping_address: str
    created_at: datetime
    items: List[OrderItemExtended]
    
    class Config:
        from_attributes = True