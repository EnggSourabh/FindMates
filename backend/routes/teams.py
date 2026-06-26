from fastapi import APIRouter

from services.team_service import generate_balanced_teams, list_team_runs


router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("/generate")
def generate_teams(members: list[dict]):
    return generate_balanced_teams(members)


@router.get("/runs")
def get_team_runs():
    return list_team_runs()
