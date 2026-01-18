import sqlite3

conn = sqlite3.connect('shopee_mvp.db')
cursor = conn.cursor()

# Query semua users
cursor.execute("SELECT id, username, email, full_name, is_seller FROM users")
users = cursor.fetchall()

print("👥 USERS IN DATABASE:")
print("-" * 70)
for user in users:
    print(f"ID: {user[0]} | Username: {user[1]} | Email: {user[2]}")
    print(f"  Name: {user[3]} | Seller: {'Yes' if user[4] else 'No'}")
    print("-" * 70)

print(f"\n📊 Total users: {len(users)}")

conn.close()