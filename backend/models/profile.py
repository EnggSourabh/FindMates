from typing import List, Optional

from pydantic import BaseModel, Field


class Profile(BaseModel):
    id: Optional[str] = None
    name: str
    skills: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    role: str = "Generalist"
    availability: str = "Not specified"
    compatibility: int = 75
    source: str = "manual"


class ResumeAnalysis(BaseModel):
    detected_skills: List[str]
    recommended_role: str
    confidence: float = 0.8
