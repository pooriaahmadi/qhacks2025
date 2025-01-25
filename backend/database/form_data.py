from typing import Annotated

from pydantic import BaseModel, Field


class RecordForm(BaseModel):
    domain: str = Field(
        description="The domain name of the website like spotify.com", max_length=200
    )
    text: str = Field(description="The TOS text")
