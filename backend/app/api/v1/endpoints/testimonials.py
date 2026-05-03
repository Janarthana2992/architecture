from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.testimonial import Testimonial
from app.models.user import User
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse

router = APIRouter(prefix="/testimonials", tags=["testimonials"])

MAX_TESTIMONIALS = 10


@router.get("", response_model=list[TestimonialResponse])
async def list_testimonials(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Testimonial)
        .where(Testimonial.is_active == True)
        .order_by(Testimonial.sort_order.desc(), Testimonial.created_at.desc())
        .limit(MAX_TESTIMONIALS)
    )
    return result.scalars().all()


@router.get("/admin/all", response_model=list[TestimonialResponse])
async def admin_list_testimonials(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(
        select(Testimonial).order_by(Testimonial.sort_order.desc(), Testimonial.created_at.desc())
    )
    return result.scalars().all()


@router.post("", response_model=TestimonialResponse, status_code=201)
async def create_testimonial(
    data: TestimonialCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    count = (await db.execute(select(func.count(Testimonial.id)))).scalar()
    if count >= MAX_TESTIMONIALS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {MAX_TESTIMONIALS} testimonials allowed. Delete one first.",
        )

    testimonial = Testimonial(**data.model_dump())
    db.add(testimonial)
    await db.flush()
    await db.refresh(testimonial)
    return testimonial


@router.put("/{testimonial_id}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_id: str,
    data: TestimonialUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Testimonial).where(Testimonial.id == testimonial_id))
    t = result.scalar_one_or_none()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(t, field, value)

    await db.flush()
    await db.refresh(t)
    return t


@router.delete("/{testimonial_id}", status_code=204)
async def delete_testimonial(
    testimonial_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Testimonial).where(Testimonial.id == testimonial_id))
    t = result.scalar_one_or_none()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    await db.delete(t)
