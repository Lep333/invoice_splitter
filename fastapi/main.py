
import uuid
from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class Person(BaseModel):
    id: str | None = None
    name: str

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

@app.get("/")
def read_root():
    return ["a", "b"]

@app.post("/person/")
def create_person(person: Person):
    if not person.id:
        person.id = uuid.uuid4()
    persons.append(person)
    return persons