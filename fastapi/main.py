import uuid
from typing import Union
from uuid import UUID
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Person(BaseModel):
    name: str

class Group(BaseModel):
    name: str

class PersonOut(Person):
    groups: list[Group]
    expenses: float | None = 0

class PersonGroup(BaseModel):
    person_name: str
    group_name: str
    share: int | None = 0

class ExpenseBase(BaseModel):
    person_name: str
    group_name: str
    description: str
    amount: float

class ExpenseIn(ExpenseBase):
    pass

class ExpenseOut(ExpenseBase):
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

persons : list[Person] = []
groups = []
persons_groups = []
expenses = []

def create_person_out() -> list[PersonOut]:
    persons_out = []
    for person in persons:
        groups_of_person = []
        expense_sum = 0
        for pg in persons_groups:
            if pg.person_name == person.name:
                groups_of_person.append(Group(name=pg.group_name))
        for expense in expenses:
            if person.name == expense.person_name:
                expense_sum += expense.amount
        persons_out.append(PersonOut(**person.model_dump(), groups=groups_of_person, expenses=expense_sum))
    return persons_out

@app.get("/persons/")
def fetch_person() -> list[PersonOut]:
    return create_person_out()

@app.post("/persons/")
def create_person(person: Person, person_groups: list[PersonGroup] = None) -> list[PersonOut]:
    global persons, persons_groups
    persons.append(person)
    print(person_groups)
    persons_groups.extend(person_groups)
    return create_person_out()

@app.delete("/persons/{person_name}")
def delete_person(person_name: str) -> list[PersonOut]:
    global persons
    persons = [person for person in persons if person.name != person_name]
    return create_person_out()

@app.post("/groups/")
def create_group(group: Group) -> list[Group]:
    groups.append(group)
    return groups

@app.delete("/groups/{group_name}")
def delete_group(group_name: str) -> list[Group]:
    global groups
    groups = [group for group in groups if group.name != group_name]
    return groups

@app.post("/expenses/")
def create_expense(expense: ExpenseIn) -> list[ExpenseOut]:
    new_expense = ExpenseOut(**expense.model_dump(), id=uuid.uuid4())
    expenses.append(new_expense)
    return expenses

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: str) -> list[ExpenseOut]:
    global expenses
    expenses = [expense for expense in expenses if expense.id != expense_id]
    return expenses