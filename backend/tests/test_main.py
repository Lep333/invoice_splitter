from fastapi.testclient import TestClient
import pytest
from backend.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def cleanup_memory():
    from backend.main import persons
    persons.clear()

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
    response = client.post("/persons/",
            json={"person": {"name": test_name},
                    "person_groups": []
            })
    assert response.status_code == 200
    response = client.get("/persons/")
    assert response.status_code == 200
    response = client.delete(f"/persons/{test_name}")
    assert response.status_code == 200
    assert not response.json()
    assert not any(test_name == person["name"] for person in response.json())