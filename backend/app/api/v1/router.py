from fastapi import APIRouter
from app.api.v1.endpoints import auth, projects, blogs, testimonials, contact, upload, categories

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(blogs.router)
api_router.include_router(testimonials.router)
api_router.include_router(contact.router)
api_router.include_router(upload.router)
api_router.include_router(categories.router)
