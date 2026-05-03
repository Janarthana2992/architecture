from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime, date
import uuid


class ProjectBase(BaseModel):
    title: str
    description: str
    short_description: str
    category: str
    location: str
    year: int
    project_date: Optional[str] = None   # ISO date string "YYYY-MM-DD"
    area: Optional[str] = None
    materials: Optional[str] = None
    client: Optional[str] = None
    status: str = "completed"
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True
    sort_order: int = 0


class ProjectCreate(ProjectBase):
    slug: Optional[str] = None  # auto-generated if not provided
    cover_image: str
    gallery_images: List[str] = []


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    year: Optional[int] = None
    project_date: Optional[str] = None
    area: Optional[str] = None
    materials: Optional[str] = None
    client: Optional[str] = None
    status: Optional[str] = None
    cover_image: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    sort_order: Optional[int] = None


class ProjectResponse(ProjectBase):
    id: uuid.UUID
    slug: str
    cover_image: str
    gallery_images: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    page_size: int
    pages: int
