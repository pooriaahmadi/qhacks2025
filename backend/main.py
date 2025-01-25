from typing import Union
from fastapi import FastAPI
from database import RecordForm, Record, create_db_and_tables, SessionDep
from dotenv import load_dotenv
import os

load_dotenv()

COHERE_KEY = os.environ["COHERE_KEY"]


def lifespan(app: FastAPI):
    # BEGIN: Stuff to run before app starts up
    create_db_and_tables()
    # END

    yield  # Do not touch ;p

    # BEGIN: Stuff to run after app starts up

    # END


app = FastAPI(lifespan=lifespan)


@app.get("/")
def root():
    return {"hello": "world"}


@app.post("/generation")
def generation_post(record: RecordForm, session: SessionDep) -> Record:
    response = "LLM response"
    record = Record(domain=record.domain, response=response, text=record.text)

    # Save in the database
    session.add(record)
    session.commit()
    session.refresh(record)

    return record
