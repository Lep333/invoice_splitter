from fastapi.testclient import TestClient
import pytest
from backend.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_memory():
    from backend.main import persons, groups, persons_groups, expenses
    persons.clear()
    groups.clear()
    persons_groups.clear()
    expenses.clear()

def test_two_person_one_group():
    person_a = {
        "person": {"name": "a"},
        "person_groups": [
            {
                "person_name": "a",
                "group_name": "g",
            }
        ]
    }
    person_b = {
        "person": {"name": "b"},
        "person_groups": [
            {
                "person_name": "b",
                "group_name": "g",
            }
        ]
    }
    response = client.post("/groups/", json={"name": "g"})
    assert response.status_code == 200
    response = client.post("/persons/", json=person_a)
    assert response.status_code == 200
    response = client.post("/persons/", json=person_b)
    assert response.status_code == 200
    response = client.post(
        "/expenses/",
        json={
            "person_name": "a",
            "group_name": "g",
            "description": "test",
            "amount": 10,
        }
    )
    assert response.status_code == 200
    response = client.post("/final_billing/")
    assert response.status_code == 200
    response = client.get("/expenses/")
    assert response.status_code == 200
    assert len(response.json()) == 3

def test_three_persons_one_group():
    person_a = {
        "person": {"name": "a"},
        "person_groups": [
            {
                "person_name": "a",
                "group_name": "g1",
            },
            {
                "person_name": "a",
                "group_name": "g2",
            }
        ]
    }
    person_b = {
        "person": {"name": "b"},
        "person_groups": [
            {
                "person_name": "b",
                "group_name": "g1",
            },
            {
                "person_name": "b",
                "group_name": "g2",
            }
        ]
    }
    person_c = {
        "person": {"name": "c"},
        "person_groups": [
            {
                "person_name": "c",
                "group_name": "g1",
            },
            {
                "person_name": "c",
                "group_name": "g2",
            }
        ]
    }
    response = client.post("/groups/", json={"name": "g1"})
    assert response.status_code == 200
    response = client.post("/groups/", json={"name": "g2"})
    assert response.status_code == 200
    response = client.post("/persons/", json=person_a)
    assert response.status_code == 200
    response = client.post("/persons/", json=person_b)
    assert response.status_code == 200
    response = client.post("/persons/", json=person_c)
    assert response.status_code == 200
    response = client.post(
        "/expenses/",
        json={
            "person_name": "a",
            "group_name": "g1",
            "description": "test",
            "amount": 10,
        }
    )
    assert response.status_code == 200
    response = client.post(
        "/expenses/",
        json={
            "person_name": "b",
            "group_name": "g2",
            "description": "test",
            "amount": 50,
        }
    )
    assert response.status_code == 200
    response = client.post("/final_billing/")
    assert response.status_code == 200
    response = client.get("/expenses/")
    assert response.status_code == 200
    assert len(response.json()) == 6