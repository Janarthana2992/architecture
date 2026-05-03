from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from app.api.deps import get_current_admin
from app.models.user import User
from app.services.image import validate_and_process_image

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("/image", status_code=status.HTTP_200_OK)
async def upload_image(
    file: UploadFile = File(...),
    image_type: str = Form(...),  # hero|project_cover|project_gallery|blog_cover|team|testimonial
    subdirectory: str = Form(...),  # projects|blogs|team|testimonials
    _: User = Depends(get_current_admin),
):
    """
    Upload and process an image. Returns the public URL path.
    Images are validated, resized to fixed dimensions, and converted to WebP.
    """
    url = await validate_and_process_image(file, image_type, subdirectory)
    return {"url": url, "message": "Image uploaded successfully"}
