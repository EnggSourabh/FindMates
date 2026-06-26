from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_add_and_list_profiles(monkeypatch):
    mock_db = {}
    
    class MockCollection:
        def update_one(self, query, update, upsert=False):
            mock_db[query["id"]] = update["$set"]
            
        def count_documents(self, query):
            return len(mock_db)
            
        def find(self, query, projection=None):
            return list(mock_db.values())
            
        def delete_one(self, query):
            if query["id"] in mock_db:
                del mock_db[query["id"]]
                class Result: deleted_count = 1
                return Result()
            class Result: deleted_count = 0
            return Result()
            
    def mock_get_profiles_collection():
        return MockCollection()
        
    monkeypatch.setattr("services.profile_service.get_profiles_collection", mock_get_profiles_collection)
    
    profile_data = {
        "id": "123",
        "name": "Alice",
        "role": "Frontend",
        "availability": "Full-time",
        "skills": ["React"],
        "interests": [],
        "compatibility": 80,
        "source": "manual"
    }
    
    resp1 = client.post("/profiles", json=profile_data)
    assert resp1.status_code == 200
    
    profile_data_2 = {
        "id": "124",
        "name": "Alice",
        "role": "Frontend",
        "availability": "Full-time",
        "skills": ["React"],
        "interests": [],
        "compatibility": 80,
        "source": "manual"
    }
    resp2 = client.post("/profiles", json=profile_data_2)
    assert resp2.status_code == 200
    
    resp3 = client.get("/profiles")
    assert resp3.status_code == 200
    assert len(resp3.json()) == 1
    
    resp4 = client.delete("/profiles/123")
    assert resp4.status_code == 200
