from pymongo.errors import PyMongoError

from database.connection import get_profiles_collection
from ml.experiment_tracking import log_profile_count
from models.profile import Profile


def _profile_fingerprint(profile: dict) -> str:
    return "::".join(
        [
            str(profile.get("name") or "").strip().lower(),
            str(profile.get("role") or "").strip().lower(),
            str(profile.get("availability") or "").strip().lower(),
            "|".join(sorted(str(skill).strip().lower() for skill in profile.get("skills") or [])),
            "|".join(sorted(str(interest).strip().lower() for interest in profile.get("interests") or [])),
        ]
    )


def create_profile(profile: Profile) -> dict:
    collection = get_profiles_collection()
    payload = profile.model_dump()

    if collection is None:
        return {
            "message": "Profile processed successfully",
            "persisted": False,
            "data": payload,
        }

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


def delete_profile(profile_id: str) -> bool:
    collection = get_profiles_collection()
    if collection is None:
        return False

    try:
        result = collection.delete_one({"id": profile_id})
        return result.deleted_count > 0
    except PyMongoError:
        return False



def list_profiles() -> list[dict]:
    collection = get_profiles_collection()

    if collection is None:
        return []

    try:
        profiles = list(collection.find({}, {"_id": 0}))
    except PyMongoError:
        return []

    deduped = {}
    for profile in profiles:
        deduped.setdefault(_profile_fingerprint(profile), profile)

    return list(deduped.values())
