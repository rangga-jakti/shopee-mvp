import fastapi
import uvicorn
import sqlalchemy
import bcrypt
from jose import jwt  # ← INI YANG BENAR, bukan "import jose"

print("✅ FastAPI version:", fastapi.__version__)
print("✅ SQLAlchemy version:", sqlalchemy.__version__)
print("✅ Uvicorn version:", uvicorn.__version__)
print("✅ Bcrypt tersedia!")
print("✅ Python-JOSE tersedia!")
print("\n🎉 Semua library terinstall dengan benar!")