# Shopee MVP – Simple Marketplace Application

Shopee MVP is a **full-stack marketplace MVP** built end-to-end using  
**FastAPI (Python backend)** and **Vanilla JavaScript (frontend)**.

This project focuses on **clean backend architecture, authentication, and real API–frontend integration**, rather than UI-heavy frameworks.

---

## Project Goals

- Build a real, working marketplace MVP
- Practice backend system design with FastAPI
- Implement JWT-based authentication & authorization
- Separate concerns (models, routes, schemas, services)
- Prepare a **portfolio-grade project** for backend roles

---

## Features

### Authentication & Users

- JWT Authentication
- Role-based access (Buyer & Seller)
- Secure password hashing (Argon2)

### Marketplace

- Product listing & filtering
- Product detail page
- Seller dashboard (CRUD products)
- Seller statistics & analytics

### Technical

- RESTful API
- SQLite database
- Clean project structure
- Automated tests
- Vanilla JS frontend (Fetch API)

---

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Argon2
- Python-JOSE (JWT)

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript

---

## Project Structure

```text
shopee-mvp/
│
├── backend/        # FastAPI backend
├── frontend/       # HTML, CSS, JS frontend
├── tests/          # Automated tests
├── scripts/        # Helper & debug scripts
├── README.md
├── LICENSE
└── requirements.txt


---

## Installation & Setup

### 1. Clone the Repository

git clone https://github.com/rangga-jakti/shopee-mvp.git
cd shopee-mvp

### 2. Create a Virtual Environment

python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS / Linux

### 3. Install Dependencies
pip install -r requirements.txt

### 4. Initialize Database
python backend/init_db.py

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

## Testing
pytest

## Notes

This project was created as a personal learning and portfolio project to practice building a full-stack marketplace application from scratch.

It focuses on core marketplace concepts such as authentication, product management, and seller dashboards.
Advanced features like checkout and payment processing are intentionally left for future iterations.

## LICENSE

MIT License
```
