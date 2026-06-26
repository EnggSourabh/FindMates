import os

from pymongo import MongoClient
from pymongo.errors import ConfigurationError, PyMongoError, ServerSelectionTimeoutError


MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "hackathon_matcher")

_client = None


def _get_client():
    global _client

    if _client is None:
        try:
            _client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=1200)
        except (ConfigurationError, PyMongoError):
            _client = None

    return _client


def get_profiles_collection():
    client = _get_client()
    if client is None:
        return None

    return client[DATABASE_NAME]["profiles"]


def get_team_runs_collection():
    client = _get_client()
    if client is None:
        return None

    return client[DATABASE_NAME]["team_runs"]


def mongo_is_available() -> bool:
    client = _get_client()
    if client is None:
        return False

    try:
        client.admin.command("ping")
        return True
    except (ConfigurationError, PyMongoError, ServerSelectionTimeoutError):
        return False
