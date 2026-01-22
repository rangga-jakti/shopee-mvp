import requests

BASE_URL = "http://127.0.0.1:8000"

# Login sebagai seller
print("🔑 Login sebagai seller...")
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "seller",
    "password": "seller123"
})

if login_response.status_code != 200:
    print("❌ Login gagal! Pastikan user seller sudah dibuat.")
    print("Jalankan: python create_test_user.py")
    exit()

token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("✅ Login berhasil!")
print("\n📦 Creating test products...")

# Daftar produk untuk testing
products = [
    {
        "name": "iPhone 15 Pro Max",
        "description": "iPhone terbaru dengan chip A17 Pro, kamera 48MP, dan layar Super Retina XDR 6.7 inch",
        "price": 18999000,
        "stock": 10,
        "category": "Elektronik",
        "image_url": "https://via.placeholder.com/400x400?text=iPhone+15+Pro"
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "description": "Flagship Samsung dengan S Pen, kamera 200MP, dan layar AMOLED 6.8 inch",
        "price": 16999000,
        "stock": 15,
        "category": "Elektronik",
        "image_url": "https://via.placeholder.com/400x400?text=Galaxy+S24"
    },
    {
        "name": "MacBook Air M3",
        "description": "Laptop tipis dan ringan dengan chip M3, layar 13 inch, RAM 8GB, SSD 256GB",
        "price": 17999000,
        "stock": 8,
        "category": "Laptop",
        "image_url": "https://via.placeholder.com/400x400?text=MacBook+Air"
    },
    {
        "name": "Sony WH-1000XM5",
        "description": "Headphone wireless dengan Active Noise Cancelling terbaik di kelasnya",
        "price": 5499000,
        "stock": 20,
        "category": "Audio",
        "image_url": "https://via.placeholder.com/400x400?text=Sony+Headphone"
    },
    {
        "name": "iPad Pro 12.9 inch",
        "description": "Tablet profesional dengan chip M2, layar Liquid Retina XDR",
        "price": 14999000,
        "stock": 12,
        "category": "Elektronik",
        "image_url": "https://via.placeholder.com/400x400?text=iPad+Pro"
    },
    {
        "name": "AirPods Pro 2",
        "description": "Earbuds wireless dengan ANC adaptif dan audio spatial",
        "price": 3999000,
        "stock": 30,
        "category": "Audio",
        "image_url": "https://via.placeholder.com/400x400?text=AirPods+Pro"
    }
]

print("-" * 60)

for product in products:
    response = requests.post(f"{BASE_URL}/products/", headers=headers, json=product)
    if response.status_code == 201:
        p = response.json()
        print(f"✅ Created: {p['name']}")
        print(f"   Price: Rp {p['price']:,} | Stock: {p['stock']}")
    else:
        print(f"❌ Failed: {product['name']}")
        print(f"   Error: {response.json()}")

print("-" * 60)
print(f"\n✅ Test products created successfully!")
print(f"Total products: {len(products)}")