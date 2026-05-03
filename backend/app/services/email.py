import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


async def send_contact_email(
    name: str,
    email: str,
    subject: str,
    message: str,
    phone: str = "",
    service_interest: str = "",
) -> bool:
    """Send contact form email notification to admin."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning("Email not configured. Skipping send.")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"[Ethos Habitats] New Contact: {subject}"
        msg["From"] = settings.EMAIL_FROM
        msg["To"] = settings.EMAIL_TO

        html_body = f"""
        <html><body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #C9A96E;">New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">{name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">{email}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone:</td><td style="padding:8px;">{phone or 'N/A'}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Service Interest:</td><td style="padding:8px;">{service_interest or 'N/A'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Subject:</td><td style="padding:8px;">{subject}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;">Message:</td><td style="padding:8px;">{message}</td></tr>
        </table>
        <p style="margin-top:20px;color:#666;">Reply directly to: <a href="mailto:{email}">{email}</a></p>
        </body></html>
        """

        msg.attach(MIMEText(html_body, "html"))

        async with aiosmtplib.SMTP(
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=True,
        ) as smtp:
            await smtp.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            await smtp.send_message(msg)

        return True
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False
