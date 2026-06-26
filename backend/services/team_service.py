from collections import Counter
import uuid
from datetime import datetime, timezone

from database.connection import get_team_runs_collection
from ml.experiment_tracking import log_team_generation



CAPABILITIES = [
    {
        "key": "frontend",
        "label": "frontend expertise",
        "keywords": ["react", "javascript", "frontend", "ui"],
        "target_role": "Frontend Developer",
        "example_skills": ["React", "JavaScript", "UI integration"],
        "action": "Add a frontend-focused teammate or pair an existing React member with UI implementation tasks.",
    },
    {
        "key": "backend",
        "label": "backend expertise",
        "keywords": ["fastapi", "node.js", "mongodb", "backend", "api", "sql"],
        "target_role": "Backend Developer",
        "example_skills": ["FastAPI", "Node.js", "MongoDB"],
        "action": "Recruit backend ownership for APIs, database design, and integration reliability.",
    },
    {
        "key": "ai",
        "label": "AI/ML expertise",
        "keywords": ["machine learning", "ml", "ai", "python", "analytics"],
        "target_role": "ML Engineer",
        "example_skills": ["Python", "Machine Learning", "Analytics"],
        "action": "Add ML or analytics depth so the team can own model logic and data-driven scoring.",
    },
    {
        "key": "design",
        "label": "UI/UX design",
        "keywords": ["ui/ux", "figma", "design", "ux"],
        "target_role": "Product Designer",
        "example_skills": ["Figma", "UX research", "Product thinking"],
        "action": "Bring in product design coverage for user flows, visual polish, and presentation clarity.",
    },
    {
        "key": "presentation",
        "label": "presentation or project leadership",
        "keywords": ["pitch", "presentation", "leadership", "communication"],
        "target_role": "Presenter or Project Lead",
        "example_skills": ["Pitching", "Leadership", "Communication"],
        "action": "Assign a communication lead to own the pitch, demo story, and delivery rhythm.",
    },
]


def _searchable(member: dict) -> str:
    values = []
    values.extend(member.get("skills") or [])
    values.extend(member.get("interests") or [])
    values.append(member.get("role") or "")
    return " ".join(values).lower()


def _member_capabilities(member: dict) -> set[str]:
    text = _searchable(member)
    return {
        capability["key"]
        for capability in CAPABILITIES
        if any(keyword in text for keyword in capability["keywords"])
    }


def _team_gaps(members: list[dict]) -> list[str]:
    covered = set()
    for member in members:
        covered.update(_member_capabilities(member))
    return [
        capability["label"]
        for capability in CAPABILITIES
        if capability["key"] not in covered
    ]


def _team_recommendations(members: list[dict]) -> list[dict]:
    covered = set()
    for member in members:
        covered.update(_member_capabilities(member))

    recommendations = []
    for index, capability in enumerate(CAPABILITIES):
        if capability["key"] in covered:
            continue

        recommendations.append(
            {
                "key": capability["key"],
                "capability": capability["label"],
                "target_role": capability["target_role"],
                "example_skills": capability["example_skills"],
                "action": capability["action"],
                "priority": "High" if index == 0 else "Medium",
            }
        )

    return recommendations


def _shared_interests(members: list[dict]) -> list[str]:
    interests = [
        str(interest).strip().lower()
        for member in members
        for interest in (member.get("interests") or [])
        if str(interest).strip()
    ]
    counts = Counter(interests)
    return [interest for interest, count in counts.items() if count > 1]


def _compatibility_signals(members: list[dict]) -> list[dict]:
    if not members:
        return []

    capabilities = set()
    for member in members:
        capabilities.update(_member_capabilities(member))

    unique_roles = len({member.get("role") or "Generalist" for member in members})
    availability = _availability_score(members)
    shared_interests = _shared_interests(members)
    gaps = _team_gaps(members)
    signals = [
        {
            "label": "Capability coverage",
            "value": f"{len(capabilities)}/{len(CAPABILITIES)}",
            "tone": "green" if len(capabilities) >= 4 else "amber",
        },
        {
            "label": "Role diversity",
            "value": f"{unique_roles} roles",
            "tone": "green" if unique_roles >= min(len(members), 3) else "amber",
        },
        {
            "label": "Availability overlap",
            "value": f"{availability}/10",
            "tone": "green" if availability >= 6 else "amber",
        },
    ]

    if shared_interests:
        signals.append(
            {
                "label": "Shared interests",
                "value": ", ".join(shared_interests[:2]),
                "tone": "green",
            }
        )

    if gaps:
        signals.append({"label": "Coverage gap", "value": gaps[0], "tone": "amber"})

    return signals


def _leader(members: list[dict]) -> dict | None:
    if not members:
        return None

    return max(
        members,
        key=lambda member: len(member.get("skills") or []) * 4
        + int(member.get("compatibility") or 75)
        + (10 if "lead" in _searchable(member) or "presentation" in _searchable(member) else 0),
    )


def _availability_score(members: list[dict]) -> int:
    if not members:
        return 0
    counts = Counter(member.get("availability") or "Not specified" for member in members)
    return round(max(counts.values()) / len(members) * 10)


def _balance_score(members: list[dict]) -> int:
    if not members:
        return 0
    covered = set()
    for member in members:
        covered.update(_member_capabilities(member))
    unique_roles = len({member.get("role") for member in members})
    duplicate_penalty = max(0, len(members) - unique_roles) * 4
    score = len(covered) / len(CAPABILITIES) * 55 + unique_roles * 5 + _availability_score(members) + 12
    return max(40, min(98, round(score - duplicate_penalty)))


def _chemistry_score(members: list[dict]) -> int:
    if not members:
        return 0

    average_compatibility = sum(
        int(member.get("compatibility") or 75) for member in members
    ) / len(members)
    unique_roles = len({member.get("role") or "Generalist" for member in members})
    unique_skills = len(
        {
            str(skill).strip().lower()
            for member in members
            for skill in (member.get("skills") or [])
            if str(skill).strip()
        }
    )
    balance = _balance_score(members)
    availability = _availability_score(members)
    shared_interest_count = len(_shared_interests(members))
    score = (
        average_compatibility * 0.44
        + balance * 0.3
        + availability * 1.1
        + min(unique_roles * 3, 12)
        + min(unique_skills * 1.2, 10)
        + min(shared_interest_count, 5)
    )
    return max(50, min(98, round(score)))


def generate_balanced_teams(members: list[dict], team_size: int = 4) -> list[dict]:
    if not members:
        return []

    team_count = max(1, -(-len(members) // team_size))
    teams = [[] for _ in range(team_count)]

    ranked_members = sorted(members, key=lambda member: len(_member_capabilities(member)), reverse=True)
    for member in ranked_members:
        target_team = min(teams, key=lambda team: (len(team), _balance_score(team)))
        target_team.append(member)

    output = []
    for index, team_members in enumerate(teams, start=1):
        balance = _balance_score(team_members)
        output.append(
            {
                "id": f"team-{index}",
                "name": f"Team {index}",
                "members": team_members,
                "leader": _leader(team_members),
                "balance_score": balance,
                "chemistry": _chemistry_score(team_members),
                "skill_gaps": _team_gaps(team_members),
                "recommendations": _team_recommendations(team_members),
                "compatibility_signals": _compatibility_signals(team_members),
                "availability_match": _availability_score(team_members),
            }
        )

    average_chemistry = (
        round(sum(team["chemistry"] for team in output) / len(output)) if output else 0
    )
    average_balance = (
        round(sum(team["balance_score"] for team in output) / len(output)) if output else 0
    )

    run_doc = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "members": members,
        "teams": output,
        "average_chemistry": average_chemistry,
        "average_balance": average_balance,
    }

    collection = get_team_runs_collection()
    if collection is not None:
        try:
            collection.insert_one(run_doc)
        except Exception:
            pass

    log_team_generation(len(output), len(members), average_chemistry)

    return output

def list_team_runs() -> list[dict]:
    collection = get_team_runs_collection()
    if collection is None:
        return []

    try:
        runs = list(collection.find({}, {"_id": 0}).sort("timestamp", -1).limit(10))
        return runs
    except Exception:
        return []
