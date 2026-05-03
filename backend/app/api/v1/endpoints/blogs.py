import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from slugify import slugify
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.blog import Blog
from app.models.user import User
from app.schemas.blog import BlogCreate, BlogUpdate, BlogResponse, BlogListResponse

router = APIRouter(prefix="/blogs", tags=["blogs"])


@router.get("", response_model=BlogListResponse)
async def list_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Blog).where(Blog.is_published == True)
    if category:
        query = query.where(Blog.category == category)

    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar()

    query = query.order_by(Blog.sort_order.desc(), Blog.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)

    return BlogListResponse(
        items=result.scalars().all(),
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 1,
    )


@router.get("/{slug}", response_model=BlogResponse)
async def get_blog(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Blog).where(Blog.slug == slug, Blog.is_published == True)
    )
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return blog


@router.get("/admin/all", response_model=BlogListResponse)
async def admin_list_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    total = (await db.execute(select(func.count(Blog.id)))).scalar()
    result = await db.execute(
        select(Blog).order_by(Blog.created_at.desc())
        .offset((page - 1) * page_size).limit(page_size)
    )
    return BlogListResponse(
        items=result.scalars().all(),
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 1,
    )


@router.post("", response_model=BlogResponse, status_code=201)
async def create_blog(
    data: BlogCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    slug = data.slug or slugify(data.title)
    existing = await db.execute(select(Blog).where(Blog.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{str(__import__('uuid').uuid4())[:8]}"

    blog = Blog(**data.model_dump(exclude={"slug"}), slug=slug)
    db.add(blog)
    await db.flush()
    await db.refresh(blog)
    return blog


@router.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: str,
    data: BlogUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Blog).where(Blog.id == blog_id))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(blog, field, value)

    await db.flush()
    await db.refresh(blog)
    return blog


@router.delete("/{blog_id}", status_code=204)
async def delete_blog(
    blog_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Blog).where(Blog.id == blog_id))
    blog = result.scalar_one_or_none()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    await db.delete(blog)
