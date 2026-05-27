from fastapi import APIRouter

from models.profile import Profile
from services.profile_service import create_profile, list_profiles


router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post("")
def add_profile(profile: Profile):
    return create_profile(profile)


@router.get("")
def get_profiles():
    return list_profiles()
