from fastapi import APIRouter

from database.connection import mongo_is_available
from ml.experiment_tracking import get_tracking_status


router = APIRouter(tags=["health"])


@router.get("/")
def home():
    return {
        "message": "AI Team Formation API is running",
        "database": "connected" if mongo_is_available() else "offline",
    }


@router.get("/health")
def health():
    return {
        "api": "ok",
        "database": mongo_is_available(),
        "tracking": get_tracking_status(),
    }
