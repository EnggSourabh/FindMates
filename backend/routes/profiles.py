from fastapi import APIRouter, HTTPException

from models.profile import Profile
from services.profile_service import create_profile, list_profiles, delete_profile


router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post("")
def add_profile(profile: Profile):
    return create_profile(profile)


@router.get("")
def get_profiles():
    return list_profiles()


@router.delete("/{profile_id}")
def remove_profile(profile_id: str):
    success = delete_profile(profile_id)
    if not success:
        raise HTTPException(status_code=404, detail="Profile not found or could not be deleted")
    return {"message": "Profile deleted successfully"}
