import io
import os
from pathlib import Path
from typing import Tuple
from PIL import Image
from fastapi import HTTPException, UploadFile, status
from app.core.config import settings


# Allowed MIME types
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

# Image type configurations: (width, height)
IMAGE_CONFIGS = {
    "hero": (settings.HERO_WIDTH, settings.HERO_HEIGHT),
    "project_cover": (settings.PROJECT_COVER_WIDTH, settings.PROJECT_COVER_HEIGHT),
    "project_gallery": (settings.PROJECT_GALLERY_WIDTH, settings.PROJECT_GALLERY_HEIGHT),
    "blog_cover": (settings.BLOG_COVER_WIDTH, settings.BLOG_COVER_HEIGHT),
    "team": (settings.TEAM_PHOTO_WIDTH, settings.TEAM_PHOTO_HEIGHT),
    "testimonial": (400, 400),
}

MAX_SIZE_BYTES = settings.MAX_IMAGE_SIZE_MB * 1024 * 1024


async def validate_and_process_image(
    file: UploadFile,
    image_type: str,
    subdirectory: str,
) -> str:
    """
    Validate the uploaded image, resize to target dimensions, convert to WebP,
    and save to disk. Returns the public URL path.
    """
    # Check content type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image type. Allowed: {', '.join(ALLOWED_TYPES)}",
        )

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Maximum size: {settings.MAX_IMAGE_SIZE_MB}MB",
        )

    # Validate it's a real image (not a disguised file)
    try:
        img = Image.open(io.BytesIO(content))
        img.verify()
        img = Image.open(io.BytesIO(content))  # Re-open after verify
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image file",
        )

    # Get target dimensions
    if image_type not in IMAGE_CONFIGS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown image type: {image_type}",
        )
    target_w, target_h = IMAGE_CONFIGS[image_type]

    # Convert to RGB (handle RGBA, palette modes)
    if img.mode in ("RGBA", "LA", "P"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        background.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Smart resize: fill and center-crop
    img = _smart_resize(img, target_w, target_h)

    # Save as WebP
    import uuid
    filename = f"{uuid.uuid4().hex}.webp"
    save_dir = Path(settings.UPLOAD_DIR) / subdirectory
    save_dir.mkdir(parents=True, exist_ok=True)
    save_path = save_dir / filename

    # Save with two quality levels: full quality + thumbnail
    img.save(str(save_path), "WEBP", quality=85, method=6)

    # Also create a thumbnail for listing views (half dimensions, lower quality)
    thumb_dir = save_dir / "thumbs"
    thumb_dir.mkdir(parents=True, exist_ok=True)
    thumb = img.resize((target_w // 2, target_h // 2), Image.LANCZOS)
    thumb.save(str(thumb_dir / filename), "WEBP", quality=70, method=6)

    return f"/uploads/{subdirectory}/{filename}"


def _smart_resize(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Resize and center-crop to exact target dimensions."""
    src_w, src_h = img.size
    src_ratio = src_w / src_h
    tgt_ratio = target_w / target_h

    if src_ratio > tgt_ratio:
        # Image is wider — fit by height, crop width
        new_h = target_h
        new_w = int(src_w * target_h / src_h)
    else:
        # Image is taller — fit by width, crop height
        new_w = target_w
        new_h = int(src_h * target_w / src_w)

    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center crop
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    img = img.crop((left, top, left + target_w, top + target_h))
    return img
