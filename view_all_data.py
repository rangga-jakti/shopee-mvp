import sqlite3
from datetime import datetime

conn = sqlite3.connect('shopee_mvp.db')
cursor = conn.cursor()

print("=" * 80)
print("📊 DATABASE SHOPEE MVP - OVERVIEW")
print("=" * 80)

# 1. Users
print("\n👥 USERS:")
print("-" * 80)
cursor.execute("SELECT id, username, email, full_name, phone, is_seller, is_active, created_at FROM users")
users = cursor.fetchall()

for user in users:
    print(f"\nID: {user[0]}")
    print(f"  Username: {user[1]}")
    print(f"  Email: {user[2]}")
    print(f"  Full Name: {user[3]}")
    print(f"  Phone: {user[4]}")
    print(f"  Type: {'🏪 SELLER' if user[5] else '🛒 BUYER'}")
    print(f"  Status: {'✅ Active' if user[6] else '❌ Inactive'}")
    print(f"  Created: {user[7]}")

print(f"\n📊 Total Users: {len(users)}")

# 2. Products
print("\n\n🛍️ PRODUCTS:")
print("-" * 80)
cursor.execute("""
    SELECT p.id, p.name, p.price, p.stock, p.category, u.username as seller 
    FROM products p 
    LEFT JOIN users u ON p.seller_id = u.id
""")
products = cursor.fetchall()

for product in products:
    print(f"\nID: {product[0]}")
    print(f"  Name: {product[1]}")
    print(f"  Price: Rp {product[2]:,.0f}")
    print(f"  Stock: {product[3]}")
    print(f"  Category: {product[4]}")
    print(f"  Seller: {product[5]}")

print(f"\n📊 Total Products: {len(products)}")

# 3. Summary by Category
print("\n\n📈 PRODUCTS BY CATEGORY:")
print("-" * 80)
cursor.execute("""
    SELECT category, COUNT(*) as total, SUM(stock) as total_stock 
    FROM products 
    GROUP BY category
""")
categories = cursor.fetchall()

for cat in categories:
    print(f"  {cat[0]}: {cat[1]} products, Total Stock: {cat[2]}")

# 4. Sellers Summary
print("\n\n👨‍💼 SELLERS SUMMARY:")
print("-" * 80)
cursor.execute("""
    SELECT u.username, u.email, COUNT(p.id) as total_products 
    FROM users u 
    LEFT JOIN products p ON u.id = p.seller_id 
    WHERE u.is_seller = 1 
    GROUP BY u.id
""")
sellers = cursor.fetchall()

for seller in sellers:
    print(f"  {seller[0]} ({seller[1]}): {seller[2]} products")

conn.close()

print("\n" + "=" * 80)