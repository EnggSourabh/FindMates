import io

import PyPDF2
from fastapi import UploadFile, HTTPException


SKILL_KEYWORDS = [
    "React", "Node.js", "MongoDB", "Python", "FastAPI", "UI/UX",
    "JavaScript", "Machine Learning", "Docker", "SQL", "Figma",
    "Analytics", "Presentation", "Leadership",
    "Java", "C++", "TypeScript", "Next.js", "Flask", "Django",
    "AWS", "Azure", "Git", "Kubernetes"
]

ROLE_RULES = [
    ("Machine Learning", "ML Engineer"),
    ("AWS", "DevOps Engineer"),
    ("Azure", "DevOps Engineer"),
    ("Kubernetes", "DevOps Engineer"),
    ("Docker", "DevOps Engineer"),
    ("Next.js", "Full Stack Developer"),
    ("React", "Frontend Developer"),
    ("UI/UX", "Product Designer"),
    ("Figma", "Product Designer"),
    ("FastAPI", "Backend Developer"),
    ("Django", "Backend Developer"),
    ("Flask", "Backend Developer"),
    ("Node.js", "Backend Developer"),
    ("Java", "Backend Developer"),
    ("C++", "Backend Developer"),
    ("SQL", "Data Analyst"),
    ("Analytics", "Data Analyst"),
    ("Presentation", "Presenter"),
    ("Leadership", "Project Lead"),
]


def extract_pdf_text(content: bytes) -> str:
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages)
    except Exception:
        raise ValueError("Invalid PDF format")


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
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        extracted_text = extract_pdf_text(content)
    except ValueError:
        raise HTTPException(status_code=400, detail="Could not read PDF. It may be corrupt or encrypted.")

    text_length = len(extracted_text.strip())

    if text_length < 50:
        return {
            "detected_skills": [],
            "recommended_role": "Generalist",
            "confidence": 0.1,
            "note": "Extracted text is very short or empty. This might be a scanned image PDF.",
            "text_length": text_length
        }

    detected_skills = detect_skills(extracted_text)
    recommended_role = recommend_role(detected_skills)

    if len(detected_skills) >= 4:
        confidence = min(0.95, 0.55 + len(detected_skills) * 0.07)
        note = f"High confidence based on {len(detected_skills)} strong keyword matches."
    elif len(detected_skills) > 0:
        confidence = min(0.70, 0.40 + len(detected_skills) * 0.07)
        note = "Moderate confidence. Few keywords found."
    else:
        confidence = 0.3
        note = "Low confidence. No known skills found."

    return {
        "detected_skills": detected_skills,
        "recommended_role": recommended_role,
        "confidence": round(confidence, 2),
        "note": note,
        "text_length": text_length
    }
