from sqlalchemy import Column, String, Text, Boolean, Integer
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Blog(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "blogs"

    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    excerpt = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)          # Rich HTML/Markdown content
    cover_image = Column(String(500), nullable=False)
    author = Column(String(255), nullable=False, default="Ethos Habitats Team")
    category = Column(String(100), nullable=False, default="Architecture")
    read_time = Column(Integer, default=5)           # minutes

    # SEO
    meta_title = Column(String(255))
    meta_description = Column(String(500))
    tags = Column(String(500))                       # comma-separated tags

    is_published = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    sort_order = Column(Integer, default=0)
