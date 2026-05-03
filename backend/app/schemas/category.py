from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime
import re


class CategoryBase(BaseModel):
    name: str
    type: str = "project"
    color: Optional[str] = "#C9A96E"
    description: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("project", "blog"):
            raise ValueError("type must be 'project' or 'blog'")
        return v

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: Optional[str]) -> Optional[str]:
        if v and not re.match(r"^#[0-9a-fA-F]{3,6}$", v):
            raise ValueError("color must be a valid hex color")
        return v


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: str
    slug: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("id", mode="before")
    @classmethod
    def coerce_id(cls, v) -> str:
        return str(v)
