from sqlalchemy import Column, String, Text, Boolean, Enum
import enum
from app.core.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class ContactStatus(str, enum.Enum):
    new = "new"
    read = "read"
    replied = "replied"
    archived = "archived"


class Contact(UUIDMixin, TimestampMixin, Base):
    __tablename__ = "contacts"

    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50))
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    service_interest = Column(String(255))          # Which service they're interested in
    status = Column(Enum(ContactStatus), default=ContactStatus.new, nullable=False)
