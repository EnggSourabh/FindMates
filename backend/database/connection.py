import os

from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError


MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "hackathon_matcher")

client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=1200)
db = client[DATABASE_NAME]


def get_profiles_collection():
    return db["profiles"]


def mongo_is_available() -> bool:
    try:
        client.admin.command("ping")
        return True
    except ServerSelectionTimeoutError:
        return False
