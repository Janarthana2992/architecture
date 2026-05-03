from sqlalchemy import Column, String, Text, Boolean, Integer
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Testimonial(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "testimonials"

    client_name = Column(String(255), nullable=False)
    client_title = Column(String(255))               # e.g. "CEO, TechCorp"
    client_photo = Column(String(500))
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)              # 1-5 stars
    project_name = Column(String(255))               # Optional: linked project name
    is_active = Column(Boolean, default=True, nullable=False)
    sort_order = Column(Integer, default=0)
