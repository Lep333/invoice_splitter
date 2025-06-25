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

def test_remove_expense():
    test_create_expense()
    response = client.get("/expenses/")
    expense = response.json()[0]
    assert expense["description"] == "test"
    response = client.delete(f"/expenses/{expense["id"]}")
    assert response.status_code == 200