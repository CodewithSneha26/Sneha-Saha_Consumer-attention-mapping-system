from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_register_user():
    response = client.post("/register", json={
        "name": "Test User",
        "email": "testuser_pytest@example.com",
        "password": "testpass123",
        "role": "Store Manager"
    })
    assert response.status_code in [200, 400]  # 400 if already registered from previous run

def test_login_wrong_password():
    response = client.post("/login", json={
        "email": "sneha@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_get_stores():
    response = client.get("/stores")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_shelves():
    response = client.get("/shelves")
    assert response.status_code == 200

def test_get_shelf_scores():
    response = client.get("/shelf-scores")
    assert response.status_code == 200

def test_get_recommendations():
    response = client.get("/recommendations")
    assert response.status_code == 200

def test_get_alerts():
    response = client.get("/alerts")
    assert response.status_code == 200

def test_unauthorized_access_protection():
    # Test that invalid data is rejected properly (basic security check)
    response = client.post("/register", json={
        "name": "",
        "email": "not-an-email",
        "password": "",
        "role": ""
    })
    assert response.status_code == 422  # Should reject invalid email format

def test_sql_injection_attempt():
    # Try a common SQL injection pattern in login - should safely fail, not crash
    response = client.post("/login", json={
        "email": "admin' OR '1'='1",
        "password": "anything"
    })
    assert response.status_code in [401, 422]  # Should reject, not succeed or crash

def test_password_not_exposed_in_response():
    response = client.post("/register", json={
        "name": "Security Test User",
        "email": "securitytest@example.com",
        "password": "supersecret123",
        "role": "Admin"
    })
    if response.status_code == 200:
        assert "password" not in response.json()  # Password should never be returned

def test_empty_credentials_rejected():
    response = client.post("/login", json={
        "email": "",
        "password": ""
    })
    assert response.status_code == 422