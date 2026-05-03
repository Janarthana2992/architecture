from fastapi import APIRouter, Depends, Request, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate
from app.services.email import send_contact_email
import html

router = APIRouter(prefix="/contact", tags=["contact"])
limiter = Limiter(key_func=get_remote_address)


@router.post("", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/hour")
async def submit_contact(
    request: Request,
    data: ContactCreate,
    db: AsyncSession = Depends(get_db),
):
    # Sanitize inputs to prevent XSS stored in DB
    safe_name = html.escape(data.name)
    safe_subject = html.escape(data.subject)
    safe_message = html.escape(data.message)
    safe_phone = html.escape(data.phone or "")
    safe_service = html.escape(data.service_interest or "")

    contact = Contact(
        name=safe_name,
        email=data.email,
        phone=safe_phone or None,
        subject=safe_subject,
        message=safe_message,
        service_interest=safe_service or None,
    )
    db.add(contact)
    await db.flush()

    # Send email notification (non-blocking failure)
    await send_contact_email(
        name=safe_name,
        email=data.email,
        subject=safe_subject,
        message=safe_message,
        phone=safe_phone,
        service_interest=safe_service,
    )

    return {"message": "Thank you for your message. We will get back to you shortly."}
