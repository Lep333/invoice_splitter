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
    balance: float | None = 0

class PersonGroup(BaseModel):
    person_name: str
    group_name: str
    share: int | None = 1

class GroupOut(Group):
    members: list[PersonGroup]
    expenses: float | None = 0

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

persons: list[PersonOut] = []
groups: list[Group] = []
persons_groups: list[PersonGroup] = []
expenses: list[ExpenseOut] = []

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

def create_groups_out() -> list[GroupOut]:
    groups_out = []
    for group in groups:
        members = []
        expense_sum = 0
        for expense in expenses:
            if expense.group_name == group.name:
                expense_sum += expense.amount
        for pg in persons_groups:
            if pg.group_name == group.name:
                members.append(pg)
        groups_out.append(GroupOut(**group.model_dump(), expenses=expense_sum, members=members))
    return groups_out

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

@app.put("/persons/{person_name}")
def change_person(person_name: str, person: Person, person_groups: list[PersonGroup] = None) -> list[PersonOut]:
    global persons, persons_groups
    print(person_name, person, person_groups)
    persons = [person for person in persons if person.name != person_name]
    persons_groups = [pg for pg in persons_groups if pg.person_name != person_name]
    # TODO: change name in expenses
    persons.append(person)
    persons_groups.extend(person_groups)
    return create_person_out()

@app.delete("/persons/{person_name}")
def delete_person(person_name: str) -> list[PersonOut]:
    global persons
    persons = [person for person in persons if person.name != person_name]
    return create_person_out()

@app.get("/groups/")
def get_groups() -> list[GroupOut]:
    return create_groups_out()

@app.post("/groups/")
def create_group(group: Group) -> list[GroupOut]:
    groups.append(group)
    return create_groups_out()

@app.put("/groups/{group_name}")
def change_group(group_name: str, group: Group, person_groups: list[PersonGroup] = None) -> list[GroupOut]:
    global groups, persons_groups
    groups = [group for group in groups if group.name != group_name]
    persons_groups = [pg for pg in persons_groups if pg.group_name != group_name]
    # TODO: change name in expenses
    groups.append(group)
    persons_groups.extend(person_groups)
    return create_groups_out()

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

@app.post("/final_billing")
def final_billing() -> list[PersonOut]:
    expenses_of_groups = dict()
    expenses_of_persons = dict()
    persons_with_memberships = create_person_out()
    groups_total_shares = dict()
    for expense in expenses:
        if not expenses_of_groups.get(expense.group_name):
            expenses_of_groups[expense.group_name] = expense.amount
        else:
            expenses_of_groups[expense.group_name] += expense.amount
        if not expenses_of_persons.get(expense.person_name):
            expenses_of_persons[expense.person_name] = dict()
        if not expenses_of_persons[expense.person_name].get(expense.group_name):
            expenses_of_persons[expense.person_name][expense.group_name] = expense.amount
        else:
            expenses_of_persons[expense.person_name][expense.group_name] += expense.amount

    for group in groups:
        for pg in persons_groups:
            if group.name == pg.group_name:
                if not groups_total_shares.get(group.name):
                    groups_total_shares[group.name] = pg.share
                else:
                    groups_total_shares[group.name] += pg.share
    for person in persons_with_memberships:
        balance = 0
        persons_memberships = dict()
        for pg in persons_groups:
            if pg.person_name == person.name:
                persons_memberships[pg.group_name] = pg.share
            personal_obligation = expenses_of_groups[pg.group_name] * pg.share / groups_total_shares[pg.group_name]
            balance += expenses_of_persons[person.name][pg.group_name] - personal_obligation
        person.balance = balance
    return persons_with_memberships