from fastapi.testclient import TestClient
import pytest
from backend.main import app
from backend.tests.test_groups import create_group

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_memory():
    from backend.main import persons, groups
    persons.clear()
    groups.clear()

def test_get_person():
    test_name = "alice"
    response = client.post("/persons/",
        json={"person": {"name": test_name},
            "person_groups": []
        })
    response = client.get("/persons/")
    assert response.json()

def test_create_person():
    global person
    test_name = "alice"
    response = client.post("/persons/",
        json={"person": {"name": test_name},
            "person_groups": []
        })
    assert response.status_code == 200
    assert any(test_name == person["name"] for person in response.json())

def test_create_person_duplicate_name():
    test_name = "alice"
    response = client.post("/persons/",
        json={"person": {"name": test_name},
            "person_groups": []
        })
    assert response.status_code == 200
    assert any(test_name == person["name"] for person in response.json())
    response = client.post("/persons/",
        json={"person": {"name": test_name},
            "person_groups": []
        })
    assert response.status_code == 400

def test_change_person():
    test_name = "alice"
    response = client.post("/persons/",
            json={"person": {"name": test_name},
                "person_groups": []
            })
    # change name
    new_name = "bob"
    response = client.put(f"/persons/{test_name}",
        json={"person": {"name": new_name},
            "person_groups": []
        })
    response = client.get("/persons/")
    assert response.status_code == 200
    assert any(new_name == person["name"] for person in response.json())

def test_change_person_keep_name():
    test_name = "alice"
    response = client.post("/persons/",
            json={"person": {"name": test_name},
                "person_groups": []
            })
    # change name
    new_name = "alice"
    response = client.put(f"/persons/{test_name}",
        json={"person": {"name": new_name},
            "person_groups": []
        })
    assert response.status_code == 200

def test_change_person_duplicate_name():
    test_name = "alice"
    new_name = "bob"
    response = client.post("/persons/",
        json={"person": {"name": test_name},
            "person_groups": []
        })
    assert response.status_code == 200
    response = client.post("/persons/",
        json={"person": {"name": new_name},
            "person_groups": []
        })
    assert response.status_code == 200
    # change name
    response = client.put(f"/persons/{test_name}",
        json={"person": {"name": new_name},
            "person_groups": []
        })
    assert response.status_code == 400

def test_remove_person():
    test_name = "alice"
    group_name = "test_group"
    create_group(group_name)
    response = client.post("/persons/",
        json={"person": {"name": test_name},
            "person_groups": [
                {
                    "person_name": test_name,
                    "group_name": group_name
                }
            ]
        })
    assert response.status_code == 200
    req = {
        "person_name": f"{test_name}",
        "group_name": f"{group_name}",
        "description": "test",
        "amount": 12.55,
    }
    response = client.post(
        "/expenses/",
        json=req
    )
    response = client.get("/persons/")
    assert response.status_code == 200
    response = client.delete(f"/persons/{test_name}")
    assert response.status_code == 200
    assert not response.json()
    assert not any(test_name == person["name"] for person in response.json())
    response = client.get("/groups")
    assert not any(test_name == member["person_name"] for group in response.json() for member in group["members"])
    response = client.get("/expenses")
    assert not any(test_name == expense["person_name"] for expense in response.json())