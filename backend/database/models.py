from typing import Optional
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Time


class Record(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    domain: str = Field(index=True)
    text: str
    response: str
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
    )
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
