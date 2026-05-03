from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from slugify import slugify
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from typing import List, Optional

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[CategoryResponse])
async def list_categories(
    type: Optional[str] = None,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db),
):
    """Public: list all categories (optionally filtered by type)."""
    q = select(Category)
    if type:
        q = q.where(Category.type == type)
    if active_only:
        q = q.where(Category.is_active == True)
    q = q.order_by(Category.sort_order, Category.name)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/admin/all", response_model=List[CategoryResponse])
async def admin_list_categories(
    type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    """Admin: list all categories including inactive."""
    q = select(Category)
    if type:
        q = q.where(Category.type == type)
    q = q.order_by(Category.sort_order, Category.name)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    base_slug = slugify(data.name)
    slug = base_slug
    # ensure slug uniqueness
    counter = 1
    while True:
        existing = await db.execute(select(Category).where(Category.slug == slug))
        if not existing.scalar_one_or_none():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1

    category = Category(slug=slug, **data.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(category, key, value)

    # Re-slug if name changed
    if data.name:
        base_slug = slugify(data.name)
        slug = base_slug
        counter = 1
        while True:
            existing = await db.execute(
                select(Category).where(Category.slug == slug, Category.id != category_id)
            )
            if not existing.scalar_one_or_none():
                break
            slug = f"{base_slug}-{counter}"
            counter += 1
        category.slug = slug

    await db.commit()
    await db.refresh(category)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    await db.delete(category)
    await db.commit()
