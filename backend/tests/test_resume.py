from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_empty_resume():
    response = client.post("/upload-resume", files={"file": ("empty.pdf", b"")})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"]

def test_analyze_invalid_pdf():
    response = client.post("/upload-resume", files={"file": ("invalid.pdf", b"Not a pdf content")})
    assert response.status_code == 400
    assert "corrupt" in response.json()["detail"]
