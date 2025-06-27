from fastapi.testclient import TestClient
import pytest
from backend.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_memory():
    from backend.main import persons, groups
    persons.clear()
    groups.clear()

def create_group(name: str):
    return client.post("/groups/", 
        json={"name": name}
    )

def test_get_group():
    test_name = "test_group"
    response = create_group(test_name)
    assert response.status_code == 200
    assert any(test_name == group["name"] for group in response.json())
    response = client.get("/groups")
    assert response.status_code == 200
    assert any(test_name == group["name"] for group in response.json())

def test_create_group():
    test_name = "test_group"
    response = create_group(test_name)
    assert response.status_code == 200
    assert any(test_name == group["name"] for group in response.json())

def test_create_duplicate_group():
    test_name = "test_group"
    response = create_group(test_name)
    assert response.status_code == 200
    assert any(test_name == group["name"] for group in response.json())
    response = create_group(test_name)
    assert response.status_code == 400

def test_change_group():
    test_name = "test_group"
    new_name = "changed_group_name"
    test_obj = { 
        "group": {"name": new_name},
        "person_groups": [
            {
                "person_name": "a",
                "group_name": new_name,
                "share": 3
            }
        ]
    }
    response = client.post("/groups/", 
        json={"name": test_name})
    assert response.status_code == 200
    assert any(test_name == group["name"] for group in response.json())
    response = client.put(
        f"/groups/{test_name}", 
        json=test_obj
    )
    assert response.status_code == 200
    changed_group = [group for group in response.json() if new_name == group["name"]][0]
    assert changed_group["members"][0]["person_name"] == "a"
    assert changed_group["members"][0]["share"] == 3

def test_change_group_keep_name():
    test_name = "test_group"
    new_name = "test_group"
    test_obj = { 
        "group": {"name": new_name},
        "person_groups": [
            {
                "person_name": "a",
                "group_name": new_name,
                "share": 3
            }
        ]
    }
    response = client.post("/groups/", 
        json={"name": test_name})
    assert response.status_code == 200
    assert any(test_name == group["name"] for group in response.json())
    response = client.put(
        f"/groups/{test_name}", 
        json=test_obj
    )
    assert response.status_code == 200

def test_change_group_duplicate():
    test_name = "test_group"
    new_name = "changed_group_name"
    response = create_group(test_name)
    assert response.status_code == 200
    response = create_group(new_name)
    assert response.status_code == 200
    response = client.put(
        f"/groups/{test_name}", 
        json={ "group": { "name": new_name }, "person_groups": [] },
    )
    assert response.status_code == 400

def test_remove_group():
    test_name = "test_group"
    test_create_group()
    response = client.delete(f"/groups/{test_name}")
    assert response.status_code == 200
    assert not any(test_name == group["name"] for group in response.json())