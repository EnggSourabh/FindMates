from pymongo.errors import PyMongoError

from database.connection import get_profiles_collection
from ml.experiment_tracking import log_profile_count
from models.profile import Profile


def create_profile(profile: Profile) -> dict:
    collection = get_profiles_collection()
    payload = profile.model_dump()

    try:
        collection.update_one({"id": payload.get("id")}, {"$set": payload}, upsert=True)
        profile_count = collection.count_documents({})
        log_profile_count(profile_count)
        persisted = True
    except PyMongoError:
        persisted = False

    return {
        "message": "Profile processed successfully",
        "persisted": persisted,
        "data": payload,
    }


def list_profiles() -> list[dict]:
    collection = get_profiles_collection()

    try:
        return list(collection.find({}, {"_id": 0}))
    except PyMongoError:
        return []
