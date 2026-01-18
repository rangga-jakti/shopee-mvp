from backend.database import engine, Base

# Import SEMUA models di sini (penting untuk SQLAlchemy relationships)
from backend.models.user import User
from backend.models.product import Product
from backend.models.order import Order, OrderItem

def init_database():
    """Create all tables in database"""
    print("🔨 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print("📁 Database file: shopee_mvp.db")

if __name__ == "__main__":
    init_database()