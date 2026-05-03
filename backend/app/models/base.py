import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Uuid
from app.core.database import Base


class TimestampMixin:
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )


class UUIDMixin:
    id = Column(Uuid(as_uuid=True, native_uuid=False), primary_key=True, default=uuid.uuid4, index=True)
