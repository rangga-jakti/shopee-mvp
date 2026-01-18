# Shopee MVP – Simple Marketplace Application

Shopee MVP is a simple marketplace application built **end-to-end** using **FastAPI (Python backend)** and **Vanilla JavaScript (frontend)**.

This project is designed as a **learning and portfolio project**, focusing on building a real, functional MVP rather than a feature-complete e-commerce platform.

---

## Scope & Goals

The scope of this project is intentionally limited to a **Minimum Viable Product (MVP)** with a focus on:

- Clean backend architecture
- RESTful API design
- Authentication & authorization
- Frontend–backend integration without heavy frontend frameworks

Advanced features such as cart, checkout, and payment processing are intentionally left for future development phases.

---

## Features

- Authentication & Authorization (JWT)
- Role-based Users (Buyer & Seller)
- Product Listing with Category Filter
- Product Detail Page
- Seller Dashboard (CRUD Products)
- Seller Statistics & Analytics
- SQLite Database (Persistent Storage)
- Responsive UI (Vanilla JavaScript)

---

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Argon2 (Password Hashing)
- Python-JOSE (JWT Authentication)

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shopee-mvp

### 2. Create a Virtual Environment
python -m venv venv

venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS / Linux

### 3. Install Dependencies
pip install fastapi uvicorn sqlalchemy pydantic passlib \
python-jose[cryptography] python-multipart email-validator argon2-cffi

### 4. Initialize the Database
python -m backend.init_db

### 5. Run the Server
uvicorn backend.main:app --reload

### 6. Access the Application
Homepage: http://127.0.0.1:8000
API Documentation (Swagger): http://127.0.0.1:8000/docs

## Test Accounts

Buyer
Username: buyerbaru1
Password: buyerbaru123

Seller
Username: testseller
Password: test123

## Future Improvements

1. Shopping Cart & Checkout System

Add to cart
Cart page
Quantity adjustment
Checkout form

2. Order Management

Order history for buyer
Order management for seller
Order status tracking
Invoice generation

3. Payment Integration

Midtrans / Xendit integration
Payment confirmation
Payment proof upload

4. Advanced Features

Product search
Product reviews & ratings
User profile page
Upload product images
Wishlist
Notifications

5. Deployment

Deploy ke Railway / Render / Heroku
Change SQLite to PostgreSQL
Add domain custom
SSL certificate
```

## LICENSE

MIT License
