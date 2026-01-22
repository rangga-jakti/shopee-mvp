# Shopee MVP – Simple Marketplace Application

Shopee MVP is a **full-stack marketplace MVP** built end-to-end using  
**FastAPI (Python backend)** and **Vanilla JavaScript (frontend)**.

This project focuses on **clean backend architecture, authentication, and real API–frontend integration**, rather than UI-heavy frameworks.

---

## Project Goals

- Build a real, working marketplace MVP
- Practice backend system design with FastAPI
- Implement JWT-based authentication & authorization
- Apply clean separation of concerns (models, routes, schemas)
- Deliver a **portfolio-grade backend-focused project**

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
- Shopping cart system
- Order creation & order history
- Payment simulation flow

---

### Technical Highlights

- RESTful API design
- SQLite database with relationships
- Clean project structure
- Automated tests
- Vanilla JavaScript frontend (Fetch API)

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

text
shopee-mvp/
├── backend/        # FastAPI backend
│   ├── models/     # Database models
│   ├── routes/     # API endpoints
│   ├── schemas/    # Pydantic schemas
│   ├── utils/      # Auth & dependencies
│   └── main.py
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

## Testing
pytest

## Future Improvements

- Real payment gateway integration (Midtrans / Xendit)
- PostgreSQL migration
- Product image uploads
- Product search & reviews
- Deployment (Railway / Render / Docker)

## Notes    

This project was created as a personal learning and portfolio project to practice building a full-stack marketplace application from scratch.

Advanced production features such as real payment gateways, file uploads, and cloud deployment are intentionally left for future iterations.

## LICENSE

MIT License

## Author

Mirangga Jakti
GitHub: https://github.com/rangga-jakti

LinkedIn: https://www.linkedin.com/in/mirangga-jakti-8b0a69334/