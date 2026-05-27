from fastapi import APIRouter, File, UploadFile

from services.resume_service import analyze_resume


router = APIRouter(tags=["resumes"])


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    return await analyze_resume(file)
