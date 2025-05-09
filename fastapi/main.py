import uuid
from uuid import UUID
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class PersonBase(BaseModel):
    name: str

class PersonIn(PersonBase):
    pass

class PersonOut(PersonBase):
    id: UUID

class GroupBase(BaseModel):
    name: str

class GroupIn(GroupBase):
    pass

class GroupOut(GroupBase):
    id: UUID

class PersonGroup(BaseModel):
    person_id: UUID
    group_id: UUID
    share: int

class ExpensesBase(BaseModel):
    person_id: UUID
    group_id: UUID
    description: str

class ExpensesIn(ExpensesBase):
    pass

class ExpensesOut(ExpensesBase):
    id: UUID

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

persons = []
groups = []
persons_groups = []
expenses = []

@app.post("/persons/")
def create_person(person: PersonIn, person_groups: list[PersonGroup] = None) -> list[PersonOut]:
    global persons
    new_per = PersonOut(**person.model_dump(), id=uuid.uuid4())
    persons.append(new_per)
    return persons

@app.delete("/persons/{person_id}")
def delete_person(person_id: UUID) -> list[PersonOut]:
    global persons
    persons = [person for person in persons if person.id != person_id]
    return persons

@app.post("/groups/")
def create_group(group: GroupIn) -> list[GroupOut]:
    new_group = GroupOut(**group.model_dump(), id=uuid.uuid4())
    groups.append(new_group)
    return groups

@app.delete("/groups/{group_id}")
def delete_group(group_id: UUID) -> list[GroupOut]:
    global groups
    groups = [group for group in groups if group.id != group_id]
    return groups

@app.post("/expenses/")
def create_expense(expense: ExpensesIn) -> list[ExpensesOut]:
    new_expense = ExpensesOut(**expense.model_dump, id=uuid.uuid4())
    expenses.append(new_expense)
    return expenses

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: UUID) -> list[ExpensesOut]:
    global expenses
    expenses = [expense for expense in expenses if expense.id != expense_id]
    return expenses