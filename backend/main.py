from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# IMPORT SEMUA MODELS (penting untuk relationships)
from backend.models.user import User
from backend.models.product import Product
from backend.models.order import Order, OrderItem
from backend.models.cart import CartItem
from backend.routes import auth, products, cart, orders

# Import routes
from backend.routes import auth, cart, products

app = FastAPI(
    title="Shopee MVP API",
    description="Simple Marketplace API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)

@app.get("/")
def root():
    """Serve homepage"""
    return FileResponse("frontend/index.html")

@app.get("/index.html")
def index_page():
    """Serve index page"""
    return FileResponse("frontend/index.html")

@app.get("/login.html")
def login_page():
    """Serve login page"""
    return FileResponse("frontend/login.html")

@app.get("/register.html")
def register_page():
    """Serve register page"""
    return FileResponse("frontend/register.html")

@app.get("/seller.html")
def seller_page():
    """Serve seller dashboard page"""
    return FileResponse("frontend/seller.html")

@app.get("/product-detail.html")
def product_detail_page():
    """Serve product detail page"""
    return FileResponse("frontend/product-detail.html")

@app.get("/cart.html")
def cart_page():
    """Serve cart page"""
    return FileResponse("frontend/cart.html")

@app.get("/orders.html")
def orders_page():
    """Serve orders page"""
    return FileResponse("frontend/orders.html")

@app.get("/payment.html")
def payment_page():
    """Serve payment page"""
    return FileResponse("frontend/payment.html")

@app.get("/health")
def health_check():
    return {"status": "healthy"}