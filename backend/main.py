from typing import Optional
from fastapi import FastAPI, HTTPException
from database import RecordForm, Record, create_db_and_tables, SessionDep
from sqlmodel import select
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

    return {"message": "success"}


@app.get("/generation")
def generation_get(domain: str, session: SessionDep) -> Optional[Record]:
    query = select(Record).where(Record.domain == domain)
    results = session.exec(query)
    record = results.first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    return record
