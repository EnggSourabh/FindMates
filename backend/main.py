import os
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.profiles import router as profiles_router
from routes.resumes import router as resumes_router
from routes.teams import router as teams_router


app = FastAPI(
    title="AI Team Formation API",
    description="Backend services for resume analysis, profile persistence, and team intelligence.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(profiles_router)
app.include_router(resumes_router)
app.include_router(teams_router)
