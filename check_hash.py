import sqlite3

conn = sqlite3.connect('shopee_mvp.db')
cursor = conn.cursor()

# Get all users with their hashes
cursor.execute('SELECT id, username, hashed_password FROM users')
rows = cursor.fetchall()

print("All users and their password hashes:")
print("-" * 80)
for row in rows:
    print(f"ID: {row[0]}")
    print(f"Username: {row[1]}")
    print(f"Hash: {row[2]}")
    print(f"Hash length: {len(row[2])}")
    print()

conn.close()
