#!/usr/bin/env python3
"""
Test authentication flow
"""
import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

# Test 1: Register a new user
print("=" * 70)
print("TEST 1: Register new user")
print("=" * 70)

register_data = {
    "email": "testauth@test.com",
    "username": "testauth123",
    "password": "testpass123",
    "full_name": "Test Auth",
    "phone": "08123456789",
    "is_seller": False
}

print(f"\nRegistering with:")
print(json.dumps(register_data, indent=2))

try:
    reg_response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
    print(f"\nResponse Status: {reg_response.status_code}")
    print(f"Response: {json.dumps(reg_response.json(), indent=2)}")
    
    if reg_response.status_code != 201:
        print("❌ Registration failed!")
        exit(1)
    else:
        print("✅ Registration successful!")
        
except Exception as e:
    print(f"❌ Error during registration: {e}")
    exit(1)

# Give DB a moment to settle
time.sleep(1)

# Test 2: Login with same credentials
print("\n" + "=" * 70)
print("TEST 2: Login with registered credentials")
print("=" * 70)

login_data = {
    "username": "testauth123",
    "password": "testpass123"
}

print(f"\nLogging in with:")
print(json.dumps(login_data, indent=2))

try:
    login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"\nResponse Status: {login_response.status_code}")
    print(f"Response: {json.dumps(login_response.json(), indent=2)}")
    
    if login_response.status_code == 200:
        print("✅ Login successful!")
        token = login_response.json()["access_token"]
        print(f"\nToken: {token[:50]}...")
    else:
        print(f"❌ Login failed with status {login_response.status_code}")
        print(f"Error: {login_response.json()}")
        
except Exception as e:
    print(f"❌ Error during login: {e}")
    exit(1)

# Test 3: Try login with wrong password
print("\n" + "=" * 70)
print("TEST 3: Login with wrong password (should fail)")
print("=" * 70)

wrong_login = {
    "username": "testauth123",
    "password": "wrongpassword"
}

try:
    wrong_response = requests.post(f"{BASE_URL}/auth/login", json=wrong_login)
    print(f"\nResponse Status: {wrong_response.status_code}")
    
    if wrong_response.status_code == 401:
        print("✅ Correctly rejected wrong password")
    else:
        print("❌ Should have rejected wrong password with 401")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 70)
print("All tests completed!")
print("=" * 70)
