from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
import re


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str
    service_interest: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_must_be_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 255:
            raise ValueError("Name must be between 2 and 255 characters")
        # Prevent script injection in name
        if re.search(r"[<>\"'%;()&+]", v):
            raise ValueError("Name contains invalid characters")
        return v

    @field_validator("message")
    @classmethod
    def message_must_be_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 10 or len(v) > 5000:
            raise ValueError("Message must be between 10 and 5000 characters")
        return v

    @field_validator("phone")
    @classmethod
    def phone_must_be_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if v and not re.match(r"^\+?[\d\s\-\(\)]{7,20}$", v):
            raise ValueError("Invalid phone number format")
        return v


class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    subject: str
    message: str
    status: str
    created_at: str

    class Config:
        from_attributes = True
