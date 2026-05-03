from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Ethos Habitats"
    APP_ENV: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "change-this-in-production-minimum-32-characters"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://archuser:archpass@localhost:5432/archdb"
    SYNC_DATABASE_URL: str = "postgresql://archuser:archpass@localhost:5432/archdb"

    # Admin
    ADMIN_EMAIL: str = "admin@archstudio.com"
    ADMIN_PASSWORD: str = "AdminPass123!"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    EMAIL_TO: str = ""

    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_IMAGE_SIZE_MB: int = 5
    ALLOWED_IMAGE_TYPES: str = "image/jpeg,image/png,image/webp"

    # Image Dimensions
    HERO_WIDTH: int = 1920
    HERO_HEIGHT: int = 1080
    PROJECT_COVER_WIDTH: int = 1200
    PROJECT_COVER_HEIGHT: int = 800
    PROJECT_GALLERY_WIDTH: int = 1200
    PROJECT_GALLERY_HEIGHT: int = 900
    BLOG_COVER_WIDTH: int = 1200
    BLOG_COVER_HEIGHT: int = 628
    TEAM_PHOTO_WIDTH: int = 400
    TEAM_PHOTO_HEIGHT: int = 400

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/projects", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/blogs", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/team", exist_ok=True)
os.makedirs(f"{settings.UPLOAD_DIR}/testimonials", exist_ok=True)
