import sqlite3

# Connect ke database
conn = sqlite3.connect('shopee_mvp.db')
cursor = conn.cursor()

# Lihat semua tabel
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print("📊 Tables in database:")
for table in tables:
    print(f"  ✅ {table[0]}")

conn.close()
print("\n🎉 Database berhasil dibuat dengan semua tabel!")