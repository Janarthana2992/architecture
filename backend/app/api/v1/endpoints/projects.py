import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, delete
from slugify import slugify
from app.core.database import get_db
from app.api.deps import get_current_admin
from app.models.project import Project
from app.models.user import User
from app.schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectResponse, ProjectListResponse
)

router = APIRouter(prefix="/projects", tags=["projects"])

MAX_PROJECTS = 20
MAX_FEATURED = 5


# ─── Public Endpoints ────────────────────────────────────────────────────────

@router.get("", response_model=ProjectListResponse)
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(9, ge=1, le=50),
    category: Optional[str] = None,
    featured_only: bool = False,
    db: AsyncSession = Depends(get_db),
):
    query = select(Project).where(Project.is_published == True)
    if category:
        query = query.where(Project.category == category)
    if featured_only:
        query = query.where(Project.is_featured == True)

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    query = query.order_by(Project.sort_order.desc(), Project.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    projects = result.scalars().all()

    return ProjectListResponse(
        items=projects,
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 1,
    )


@router.get("/featured", response_model=list[ProjectResponse])
async def get_featured_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project)
        .where(Project.is_published == True, Project.is_featured == True)
        .order_by(Project.sort_order.desc())
        .limit(MAX_FEATURED)
    )
    return result.scalars().all()


@router.get("/{slug}", response_model=ProjectResponse)
async def get_project(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Project).where(Project.slug == slug, Project.is_published == True)
    )
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


# ─── Admin Endpoints ──────────────────────────────────────────────────────────

@router.get("/admin/all", response_model=ProjectListResponse)
async def admin_list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    count_result = await db.execute(select(func.count(Project.id)))
    total = count_result.scalar()

    result = await db.execute(
        select(Project)
        .order_by(Project.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    projects = result.scalars().all()

    return ProjectListResponse(
        items=projects,
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total > 0 else 1,
    )


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    # Enforce max project limit
    count_result = await db.execute(select(func.count(Project.id)))
    if count_result.scalar() >= MAX_PROJECTS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum {MAX_PROJECTS} projects allowed",
        )

    # Enforce featured limit
    if data.is_featured:
        feat_result = await db.execute(
            select(func.count(Project.id)).where(Project.is_featured == True)
        )
        if feat_result.scalar() >= MAX_FEATURED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {MAX_FEATURED} featured projects allowed",
            )

    # Generate slug
    slug = data.slug or slugify(data.title)
    existing = await db.execute(select(Project).where(Project.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{str(__import__('uuid').uuid4())[:8]}"

    project = Project(**data.model_dump(exclude={"slug"}), slug=slug)
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Enforce featured limit when enabling
    if data.is_featured is True and not project.is_featured:
        feat_result = await db.execute(
            select(func.count(Project.id)).where(Project.is_featured == True)
        )
        if feat_result.scalar() >= MAX_FEATURED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Maximum {MAX_FEATURED} featured projects allowed",
            )

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(project, field, value)

    await db.flush()
    await db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
