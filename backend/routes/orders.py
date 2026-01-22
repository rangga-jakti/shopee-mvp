from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from backend.database import get_db
from backend.models.order import Order, OrderItem
from backend.models.product import Product
from backend.models.user import User
from backend.schemas.order import OrderCreate, OrderResponse
from backend.utils.dependencies import get_current_user
from backend.schemas.order_extended import OrderExtended
from pydantic import BaseModel

router = APIRouter(prefix="/orders", tags=["Orders"])

class PaymentRequest(BaseModel):
    payment_method: str

@router.post("/{order_id}/pay", status_code=status.HTTP_200_OK)
def pay_order(
    order_id: int,
    payment_data: PaymentRequest,  # ← GANTI DENGAN PaymentRequest
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark order as paid"""
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.buyer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order tidak ditemukan"
        )
    
    if order.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order tidak bisa dibayar. Status saat ini: {order.status}"
        )
    
    # Update order status
    order.status = "paid"
    db.commit()
    db.refresh(order)
    
    return {
        "message": "Pembayaran berhasil!",
        "order_id": order_id,
        "status": order.status,
        "payment_method": payment_data.payment_method
    }

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create order from cart items"""
    
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order harus memiliki minimal 1 item"
        )
    
    # Calculate total and validate stock
    total_amount = 0
    order_items = []
    
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Produk ID {item.product_id} tidak ditemukan"
            )
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Stok {product.name} tidak cukup. Tersedia: {product.stock}"
            )
        
        total_amount += item.price * item.quantity
        order_items.append({
            'product': product,
            'quantity': item.quantity,
            'price': item.price
        })
    
    # Create order
    new_order = Order(
        buyer_id=current_user.id,
        total_amount=total_amount,
        shipping_address=order_data.shipping_address,
        status="pending"
    )
    
    db.add(new_order)
    db.flush()
    
    # Create order items and update stock
    for item_data in order_items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item_data['product'].id,
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.add(order_item)
        
        # Update product stock
        item_data['product'].stock -= item_data['quantity']
    
    db.commit()
    db.refresh(new_order)
    
    return new_order

@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's orders"""
    
    # Use joinedload to include items in one query
    orders = db.query(Order).options(
        joinedload(Order.items)
    ).filter(
        Order.buyer_id == current_user.id
    ).order_by(
        Order.created_at.desc()
    ).all()
    
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get order detail"""
    
    order = db.query(Order).options(
        joinedload(Order.items)
    ).filter(
        Order.id == order_id,
        Order.buyer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order tidak ditemukan"
        )
    
    return order

@router.get("/extended/all", response_model=List[OrderExtended])
def get_orders_with_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get orders with full product information"""
    
    orders = db.query(Order).filter(
        Order.buyer_id == current_user.id
    ).order_by(
        Order.created_at.desc()
    ).all()
    
    return orders

@router.post("/{order_id}/pay", status_code=status.HTTP_200_OK)
def pay_order(
    order_id: int,
    payment_data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark order as paid"""
    
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.buyer_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order tidak ditemukan"
        )
    
    if order.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order sudah dibayar atau dibatalkan"
        )
    
    # Update order status
    order.status = "paid"
    db.commit()
    
    return {
        "message": "Pembayaran berhasil!",
        "order_id": order_id,
        "status": "paid"
    }