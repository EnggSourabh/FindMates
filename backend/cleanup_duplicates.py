from database.connection import get_profiles_collection

def remove_duplicate_profiles():
    """
    One-off script to clean up duplicate profiles in MongoDB.
    Deduplicates based on the 'name' and 'role' fields to ensure 
    only unique roster members are persisted.
    """
    col = get_profiles_collection()
    docs = list(col.find())
    
    seen_fingerprints = set()
    duplicates_removed = 0
    
    # We iterate over documents. 
    # The first time we see a specific (name, role), we keep it.
    # Subsequent matches are deleted.
    for doc in docs:
        name = str(doc.get("name", "")).strip().lower()
        role = str(doc.get("role", "")).strip().lower()
        
        fingerprint = f"{name}::{role}"
        
        if fingerprint in seen_fingerprints:
            col.delete_one({"_id": doc["_id"]})
            duplicates_removed += 1
            print(f"Removed duplicate: {doc.get('name')} ({doc.get('role')})")
        else:
            seen_fingerprints.add(fingerprint)
            
    print(f"Cleanup complete. Total duplicate profiles removed: {duplicates_removed}")

if __name__ == "__main__":
    remove_duplicate_profiles()
