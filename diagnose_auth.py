import sqlite3
from passlib.context import CryptContext
import sys

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

conn = sqlite3.connect('shopee_mvp.db')
cursor = conn.cursor()

print("=== CHECKING USER PASSWORDS ===\n")

# Get buyerbaru1 user
cursor.execute('SELECT id, username, email, hashed_password FROM users WHERE username = "buyerbaru1"')
user = cursor.fetchone()

if user:
    print(f"User: {user[1]}")
    print(f"Email: {user[2]}")
    print(f"Hash in DB: {user[3]}")
    print(f"Hash length: {len(user[3])}")
    print()
    
    # Try to hash a password manually
    test_password = "test123"
    new_hash = pwd_context.hash(test_password)
    print(f"Manually hashed 'test123': {new_hash}")
    print(f"New hash length: {len(new_hash)}")
    print()
    
    # Try verification
    print("Testing password verification:")
    test_passwords = ["buyerbaru", "password123", "test123"]
    for pwd in test_passwords:
        try:
            result = pwd_context.verify(pwd, user[3])
            print(f"  '{pwd}': {result}")
        except Exception as e:
            print(f"  '{pwd}': ERROR - {e}")
    
    # Check if hash is valid bcrypt
    if user[3].startswith('$2'):
        print("\nHash starts with $2 - appears to be bcrypt format")
        if len(user[3]) == 60:
            print("Hash length is 60 - standard bcrypt length")
        else:
            print(f"Hash length is {len(user[3])} - NOT standard!")
    else:
        print(f"\nHash doesn't start with $2 - may be corrupted!")
else:
    print("User 'buyerbaru1' not found!")

conn.close()
