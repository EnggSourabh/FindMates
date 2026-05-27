from collections import Counter


CAPABILITIES = {
    "frontend expertise": ["react", "javascript", "frontend", "ui"],
    "backend expertise": ["fastapi", "node.js", "mongodb", "backend", "api", "sql"],
    "AI/ML expertise": ["machine learning", "ml", "ai", "python", "analytics"],
    "UI/UX design": ["ui/ux", "figma", "design", "ux"],
    "presentation or project leadership": ["pitch", "presentation", "leadership", "communication"],
}


def _searchable(member: dict) -> str:
    values = []
    values.extend(member.get("skills") or [])
    values.extend(member.get("interests") or [])
    values.append(member.get("role") or "")
    return " ".join(values).lower()


def _member_capabilities(member: dict) -> set[str]:
    text = _searchable(member)
    return {
        capability
        for capability, keywords in CAPABILITIES.items()
        if any(keyword in text for keyword in keywords)
    }


def _team_gaps(members: list[dict]) -> list[str]:
    covered = set()
    for member in members:
        covered.update(_member_capabilities(member))
    return [capability for capability in CAPABILITIES if capability not in covered]


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
    return min(98, round(len(covered) / len(CAPABILITIES) * 55 + unique_roles * 5 + _availability_score(members) + 12))


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
                "chemistry": min(98, round(balance * 0.75 + _availability_score(team_members) * 2.5)),
                "skill_gaps": _team_gaps(team_members),
                "availability_match": _availability_score(team_members),
            }
        )

    return output
