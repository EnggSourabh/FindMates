import io

import PyPDF2
from fastapi import UploadFile


SKILL_KEYWORDS = [
    "React",
    "Node.js",
    "MongoDB",
    "Python",
    "FastAPI",
    "UI/UX",
    "JavaScript",
    "Machine Learning",
    "Docker",
    "SQL",
    "Figma",
    "Analytics",
    "Presentation",
    "Leadership",
]


ROLE_RULES = [
    ("Machine Learning", "ML Engineer"),
    ("React", "Frontend Developer"),
    ("UI/UX", "Product Designer"),
    ("Figma", "Product Designer"),
    ("FastAPI", "Backend Developer"),
    ("Node.js", "Backend Developer"),
    ("Docker", "DevOps Engineer"),
    ("SQL", "Data Analyst"),
    ("Presentation", "Presenter"),
    ("Leadership", "Project Lead"),
]


def extract_pdf_text(content: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(content))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages)


def detect_skills(text: str) -> list[str]:
    lower_text = text.lower()
    return [skill for skill in SKILL_KEYWORDS if skill.lower() in lower_text]


def recommend_role(skills: list[str]) -> str:
    for skill, role in ROLE_RULES:
        if skill in skills:
            return role

    return "Generalist"


async def analyze_resume(file: UploadFile) -> dict:
    content = await file.read()
    extracted_text = extract_pdf_text(content)
    detected_skills = detect_skills(extracted_text)
    recommended_role = recommend_role(detected_skills)
    confidence = min(0.95, 0.55 + len(detected_skills) * 0.07)

    return {
        "detected_skills": detected_skills,
        "recommended_role": recommended_role,
        "confidence": round(confidence, 2),
    }
