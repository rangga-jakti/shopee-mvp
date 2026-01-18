import requests
import json

BASE_URL = "http://127.0.0.1:8000"

# Login sebagai seller
print("🔑 Login sebagai seller1...")
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "username": "seller1",
    "password": "seller123"
})
token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

print("\n" + "="*60)
print("TEST 1: CREATE MULTIPLE PRODUCTS")
print("="*60)

products_data = [
    {
        "name": "Samsung Galaxy S24 Ultra",
        "description": "Flagship Samsung dengan S Pen, kamera 200MP",
        "price": 16999000,
        "stock": 15,
        "category": "Elektronik"
    },
    {
        "name": "MacBook Air M3",
        "description": "Laptop tipis dengan chip M3",
        "price": 17999000,
        "stock": 8,
        "category": "Laptop"
    },
    {
        "name": "Sony WH-1000XM5",
        "description": "Headphone wireless premium",
        "price": 5499000,
        "stock": 20,
        "category": "Audio"
    }
]

for product in products_data:
    response = requests.post(f"{BASE_URL}/products/", headers=headers, json=product)
    if response.status_code == 201:
        p = response.json()
        print(f"✅ Created: {p['name']} - Rp {p['price']:,}")
    else:
        print(f"❌ Failed: {product['name']}")

print("\n" + "="*60)
print("TEST 2: GET ALL PRODUCTS (PUBLIC)")
print("="*60)

response = requests.get(f"{BASE_URL}/products/")
products = response.json()
print(f"Total products: {len(products)}")
for p in products:
    print(f"  {p['id']}. {p['name']} - Rp {p['price']:,} (Stock: {p['stock']})")

print("\n" + "="*60)
print("TEST 3: GET PRODUCT DETAIL")
print("="*60)

response = requests.get(f"{BASE_URL}/products/1")
if response.status_code == 200:
    product = response.json()
    print(f"✅ Product Detail:")
    print(f"   Name: {product['name']}")
    print(f"   Price: Rp {product['price']:,}")
    print(f"   Description: {product['description']}")
    print(f"   Stock: {product['stock']}")

print("\n" + "="*60)
print("TEST 4: UPDATE PRODUCT")
print("="*60)

update_data = {
    "price": 17999000,  # Turunkan harga
    "stock": 5  # Kurangi stock
}

response = requests.put(f"{BASE_URL}/products/1", headers=headers, json=update_data)
if response.status_code == 200:
    product = response.json()
    print(f"✅ Product Updated!")
    print(f"   New Price: Rp {product['price']:,}")
    print(f"   New Stock: {product['stock']}")

print("\n" + "="*60)
print("TEST 5: GET MY PRODUCTS (SELLER)")
print("="*60)

response = requests.get(f"{BASE_URL}/products/my/products", headers=headers)
if response.status_code == 200:
    my_products = response.json()
    print(f"Total my products: {len(my_products)}")
    for p in my_products:
        print(f"  {p['id']}. {p['name']} - Rp {p['price']:,}")

print("\n" + "="*60)
print("TEST 6: FILTER BY CATEGORY")
print("="*60)

response = requests.get(f"{BASE_URL}/products/?category=Elektronik")
elektronik_products = response.json()
print(f"Products in Elektronik: {len(elektronik_products)}")
for p in elektronik_products:
    print(f"  - {p['name']}")

print("\n" + "="*60)
print("TEST 7: DELETE PRODUCT")
print("="*60)

# Delete product terakhir
last_product_id = products[-1]['id']
response = requests.delete(f"{BASE_URL}/products/{last_product_id}", headers=headers)
if response.status_code == 200:
    print(f"✅ Product ID {last_product_id} berhasil dihapus!")
    print(response.json())

# Check products after delete
response = requests.get(f"{BASE_URL}/products/")
print(f"\nTotal products after delete: {len(response.json())}")

print("\n" + "="*60)
print("✅ ALL TESTS COMPLETED!")
print("="*60)