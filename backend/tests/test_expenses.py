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