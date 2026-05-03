from sqlalchemy import Column, String, Boolean, Integer
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Category(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "categories"

    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    type = Column(String(20), nullable=False, default="project")  # "project" | "blog"
    color = Column(String(20), default="#C9A96E")   # hex color for UI badge
    description = Column(String(255))
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0)
