from sqlalchemy import Column, String, Text, Boolean, Integer, JSON
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Project(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "projects"

    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=False)
    category = Column(String(100), nullable=False, default="residential")
    location = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False)
    project_date = Column(String(50), nullable=True)     # "YYYY-MM-DD"
    area = Column(String(100))           # e.g. "2,500 m²"
    materials = Column(Text)             # comma-separated or JSON text
    client = Column(String(255))
    status = Column(String(50), default="completed")  # completed | ongoing | concept

    # Images
    cover_image = Column(String(500), nullable=False)   # main cover
    gallery_images = Column(JSON, default=list)          # list of image paths

    # SEO
    meta_title = Column(String(255))
    meta_description = Column(String(500))

    # Flags
    is_featured = Column(Boolean, default=False, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0)
