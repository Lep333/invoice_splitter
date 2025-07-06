from fastapi.testclient import TestClient
import pytest
from backend.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_memory():
    from backend.main import persons, groups, expenses
    persons.clear()
    groups.clear()
    expenses.clear()

def test_create_expense():
    req = {
        "person_name": "a",
        "group_name": "g",
        "description": "test",
        "amount": 12.55,
    }
    response = client.post(
        "/expenses/",
        json=req
    )
    assert response.status_code == 200

def test_change_expense():
    req = {
        "person_name": "a",
        "group_name": "g",
        "description": "test",
        "amount": 12.55,
    }
    response = client.post(
        "/expenses/",
        json=req
    )
    assert response.status_code == 200
    response = client.get("/expenses")
    og_expense = response.json()[0]
    req = {
        "person_name": "hallo",
        "group_name": "g2",
        "description": "post",
        "amount": 100.00,
        "id": og_expense["id"],
        "compensation_payment": og_expense["compensation_payment"]
    }
    response = client.put(f"/expenses/{og_expense["id"]}", json=req)
    assert response.status_code == 200
    response = client.get("/expenses")
    assert response.status_code == 200
    expense = response.json()[0]
    assert expense["person_name"] == "hallo"
    assert expense["group_name"] == "g2"
    assert expense["description"] == "post"
    assert expense["amount"] == 100.00

def test_remove_expense():
    test_create_expense()
    response = client.get("/expenses/")
    expense = response.json()[0]
    assert expense["description"] == "test"
    response = client.delete(f"/expenses/{expense["id"]}")
    assert response.status_code == 200