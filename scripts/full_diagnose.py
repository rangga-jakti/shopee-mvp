"""
Diagnose password hashing issue in Shopee MVP database
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./shopee_mvp.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

print("=== PASSWORD HASH DIAGNOSTIC ===\n")

# Get the raw data from database
conn = engine.raw_connection()
cursor = conn.cursor()

cursor.execute("SELECT id, username, email, hashed_password FROM users")
rows = cursor.fetchall()

print(f"Found {len(rows)} users\n")

for row in rows:
    user_id, username, email, hashed_password = row
    print(f"ID: {user_id}")
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Hash: {hashed_password}")
    print(f"Hash length: {len(hashed_password)}")
    
    # Check if it's a valid bcrypt hash
    if hashed_password.startswith('$2'):
        if len(hashed_password) == 60:
            print("Status: ✓ Valid bcrypt format")
        else:
            print(f"Status: ✗ Bcrypt format but wrong length (expected 60, got {len(hashed_password)})")
    else:
        print("Status: ✗ Not a valid bcrypt hash")
    
    print("-" * 60)

conn.close()

# Now test password verification
print("\n=== TESTING PASSWORD VERIFICATION ===\n")

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

# Get buyerbaru1
cursor = conn.cursor()
cursor.execute("SELECT hashed_password FROM users WHERE username = ?", ("buyerbaru1",))
result = cursor.fetchone()

if result:
    stored_hash = result[0]
    print(f"Testing with buyerbaru1's hash")
    print(f"Hash: {stored_hash}")
    print(f"Length: {len(stored_hash)}\n")
    
    test_passwords = ["buyerbaru", "password", "test", "123456"]
    
    for pwd in test_passwords:
        try:
            is_valid = pwd_context.verify(pwd, stored_hash)
            print(f"Password '{pwd}': {is_valid}")
        except Exception as e:
            print(f"Password '{pwd}': ERROR - {type(e).__name__}: {e}")
else:
    print("buyerbaru1 not found")

conn.close()
