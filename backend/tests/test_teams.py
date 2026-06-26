from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_generate_teams():
    members = [
        {"id": "1", "name": "Alice", "skills": ["React"], "role": "Frontend Developer", "availability": "Full-time"},
        {"id": "2", "name": "Bob", "skills": ["FastAPI"], "role": "Backend Developer", "availability": "Full-time"},
        {"id": "3", "name": "Charlie", "skills": ["Machine Learning"], "role": "ML Engineer", "availability": "Full-time"},
        {"id": "4", "name": "Diana", "skills": ["Pitching"], "role": "Project Lead", "availability": "Full-time"},
    ]
    
    response = client.post("/teams/generate", json=members)
    assert response.status_code == 200
    teams = response.json()
    assert len(teams) == 1
    assert len(teams[0]["members"]) == 4
    assert teams[0]["chemistry"] > 0
    assert "balance_score" in teams[0]
