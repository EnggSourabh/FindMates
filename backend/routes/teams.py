from fastapi import APIRouter

from services.team_service import generate_balanced_teams


router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("/generate")
def generate_teams(members: list[dict]):
    return generate_balanced_teams(members)
