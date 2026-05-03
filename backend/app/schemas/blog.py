from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class BlogBase(BaseModel):
    title: str
    excerpt: str
    content: str
    author: str = "Ethos Habitats Team"
    category: str = "Architecture"
    read_time: int = 5
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    tags: Optional[str] = None
    is_published: bool = True
    is_featured: bool = False
    sort_order: int = 0


class BlogCreate(BlogBase):
    slug: Optional[str] = None
    cover_image: str


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    read_time: Optional[int] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    tags: Optional[str] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class BlogResponse(BlogBase):
    id: uuid.UUID
    slug: str
    cover_image: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BlogListResponse(BaseModel):
    items: List[BlogResponse]
    total: int
    page: int
    page_size: int
    pages: int
