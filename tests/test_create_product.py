import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# 1. Login sebagai seller
print("🔑 Login sebagai seller...")
login_data = {
    "username": "seller1",
    "password": "seller123"
}

login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Status: {login_response.status_code}")

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"✅ Token berhasil didapat!")
    print(f"Token: {token[:50]}...")
else:
    print("❌ Login gagal!")
    print(login_response.json())
    exit()

# 2. Create product
print("\n📦 Membuat product baru...")
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

product_data = {
    "name": "iPhone 15 Pro Max",
    "description": "iPhone terbaru dengan chip A17 Pro, kamera 48MP, dan layar Super Retina XDR 6.7 inch",
    "price": 18999000,
    "stock": 10,
    "image_url": "https://via.placeholder.com/300x300?text=iPhone+15+Pro",
    "category": "Elektronik"
}

create_response = requests.post(
    f"{BASE_URL}/products/",
    headers=headers,
    json=product_data
)

print(f"Status: {create_response.status_code}")

if create_response.status_code == 201:
    product = create_response.json()
    print("\n✅ PRODUCT BERHASIL DIBUAT!")
    print("-" * 50)
    print(f"ID: {product['id']}")
    print(f"Name: {product['name']}")
    print(f"Price: Rp {product['price']:,}")
    print(f"Stock: {product['stock']}")
    print(f"Category: {product['category']}")
    print(f"Seller ID: {product['seller_id']}")
    print("-" * 50)
else:
    print("❌ Gagal membuat product!")
    print(create_response.json())

# 3. Get all products
print("\n📋 Mengambil semua products...")
get_response = requests.get(f"{BASE_URL}/products/")
print(f"Status: {get_response.status_code}")

if get_response.status_code == 200:
    products = get_response.json()
    print(f"\n✅ Total products: {len(products)}")
    for p in products:
        print(f"  - {p['name']} (Rp {p['price']:,})")