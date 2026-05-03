from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
import uuid


class TestimonialBase(BaseModel):
    client_name: str
    client_title: Optional[str] = None
    client_photo: Optional[str] = None
    content: str
    rating: int = 5
    project_name: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0

    @field_validator("rating")
    @classmethod
    def rating_must_be_valid(cls, v: int) -> int:
        if not 1 <= v <= 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_title: Optional[str] = None
    client_photo: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    project_name: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class TestimonialResponse(TestimonialBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
