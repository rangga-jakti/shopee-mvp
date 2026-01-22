import requests

BASE_URL = "http://127.0.0.1:8000"

# Register user baru untuk testing
print("📝 Creating test users...")

test_users = [
    {
        "email": "buyer@test.com",
        "username": "buyer",
        "password": "buyer123",
        "full_name": "Test Buyer",
        "phone": "08123456789",
        "is_seller": False
    },
    {
        "email": "seller@test.com",
        "username": "seller",
        "password": "seller123",
        "full_name": "Test Seller",
        "phone": "08123456788",
        "is_seller": True
    }
]

for user in test_users:
    print(f"\n🔄 Creating {user['username']}...")
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user)
        if response.status_code == 201:
            print(f"✅ Success: {user['username']}")
            print(f"   Email: {user['email']}")
            print(f"   Password: {user['password']}")
        elif response.status_code == 400:
            print(f"⚠️ Already exists: {user['username']}")
        else:
            print(f"❌ Failed: {response.json()}")
    except Exception as e:
        print(f"❌ Error: {e}")

print("\n" + "="*60)
print("✅ TEST USERS READY!")
print("="*60)
print("\nLOGIN CREDENTIALS:")
print("-" * 60)
print("Buyer:")
print("  Username: buyer")
print("  Password: buyer123")
print("\nSeller:")
print("  Username: seller")
print("  Password: seller123")
print("-" * 60)
print("⚠️  Pastikan server FastAPI sudah running di http://127.0.0.1:8000")
