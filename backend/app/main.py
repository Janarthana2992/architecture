import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings
from app.core.database import init_db
from app.core.security import get_password_hash
from app.api.v1.router import api_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database and seed admin user on startup."""
    await init_db()
    await seed_admin()
    await seed_categories()
    logger.info("✅ Ethos Habitats API started")
    yield
    logger.info("🛑 Ethos Habitats API shutting down")


async def seed_admin():
    """Create default admin user if none exists."""
    from app.core.database import AsyncSessionLocal
    from app.models.user import User
    from sqlalchemy import select

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.is_admin == True))
        if result.scalar_one_or_none():
            return  # Admin already exists

        admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            full_name="Admin",
            is_active=True,
            is_admin=True,
        )
        db.add(admin)
        await db.commit()
        logger.info(f"✅ Admin user created: {settings.ADMIN_EMAIL}")


async def seed_categories():
    """Seed default project and blog categories if none exist."""
    from app.core.database import AsyncSessionLocal
    from app.models.category import Category
    from sqlalchemy import select

    DEFAULT_PROJECT_CATEGORIES = [
        ("Residential", "residential", "#C9A96E"),
        ("Commercial", "commercial", "#7B9EA8"),
        ("Interior", "interior", "#A89B7B"),
        ("Landscape", "landscape", "#7BA87B"),
        ("Urban", "urban", "#8B7BA8"),
        ("Cultural", "cultural", "#A87B7B"),
    ]
    DEFAULT_BLOG_CATEGORIES = [
        ("Architecture", "architecture", "#C9A96E"),
        ("Design", "design", "#7B9EA8"),
        ("Sustainability", "sustainability", "#7BA87B"),
        ("Materials", "materials", "#A89B7B"),
        ("Technology", "technology", "#8B7BA8"),
    ]

    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Category))
        if result.scalars().first():
            return  # Already seeded

        for i, (name, slug, color) in enumerate(DEFAULT_PROJECT_CATEGORIES):
            db.add(Category(name=name, slug=slug, type="project", color=color, sort_order=i))
        for i, (name, slug, color) in enumerate(DEFAULT_BLOG_CATEGORIES):
            db.add(Category(name=name, slug=slug, type="blog", color=color, sort_order=i))
        await db.commit()
        logger.info("✅ Default categories seeded")


app = FastAPI(
    title="Ethos Habitats API",
    description="Backend API for Ethos Habitats architecture website",
    version="1.0.0",
    lifespan=lifespan,
    # Disable docs in production
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# ─── Rate Limiting ────────────────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── Security Middleware ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Total-Count"],
)

app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# ─── Static Files ─────────────────────────────────────────────────────────────
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# ─── Routes ───────────────────────────────────────────────────────────────────
app.include_router(api_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}
