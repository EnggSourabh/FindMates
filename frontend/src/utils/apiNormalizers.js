import {
  generateSmartTeams,
  getSkillGapRecommendations,
  getTeamCompatibilitySignals,
  normalizeMember,
} from "./teamEngine";

export const normalizeTeam = (team, index = 0) => {
  const members = (team.members || []).map(normalizeMember);
  const leader = team.leader ? normalizeMember(team.leader) : null;
  const fallbackTeam = generateSmartTeams(members, members.length || 4)[0];

  return {
    id: team.id || `team-${index + 1}`,
    name: team.name || `Team ${index + 1}`,
    members,
    leader,
    chemistry: Number(team.chemistry || fallbackTeam?.chemistry || 0),
    balanceScore: Number(
      team.balanceScore || team.balance_score || fallbackTeam?.balanceScore || 0,
    ),
    skillGaps: team.skillGaps || team.skill_gaps || fallbackTeam?.skillGaps || [],
    recommendations:
      team.recommendations?.map((recommendation) => ({
        key: recommendation.key,
        capability: recommendation.capability,
        targetRole: recommendation.targetRole || recommendation.target_role,
        exampleSkills: recommendation.exampleSkills || recommendation.example_skills || [],
        action: recommendation.action,
        priority: recommendation.priority,
      })) ||
      fallbackTeam?.recommendations ||
      getSkillGapRecommendations(members),
    compatibilitySignals:
      team.compatibilitySignals ||
      team.compatibility_signals ||
      fallbackTeam?.compatibilitySignals ||
      getTeamCompatibilitySignals(members),
    strengths:
      team.strengths ||
      fallbackTeam?.strengths ||
      [...new Set(members.flatMap((member) => member.skills))].slice(0, 5),
    availabilityMatch: Number(
      team.availabilityMatch || team.availability_match || fallbackTeam?.availabilityMatch || 0,
    ),
  };
};

export const normalizeTeamRun = (run) => {
  return {
    ...run,
    teams: (run.teams || []).map((team, index) => normalizeTeam(team, index)),
    average_chemistry: run.average_chemistry || run.averageChemistry || 0,
    average_balance: run.average_balance || run.averageBalance || 0,
    member_count: run.member_count || run.memberCount || 0,
    team_count: run.team_count || run.teamCount || 0,
  };
};

export const memberFingerprint = (member) =>
  [
    member.name,
    member.role,
    member.availability,
    [...member.skills].sort().join("|"),
    [...member.interests].sort().join("|"),
  ]
    .join("::")
    .toLowerCase();

export const mergeMembers = (currentMembers, incomingMembers) => {
  const merged = new Map();

  [...currentMembers, ...incomingMembers].map(normalizeMember).forEach((member) => {
    const key = memberFingerprint(member);
    const existing = merged.get(key);
    merged.set(key, existing ? { ...member, id: existing.id || member.id } : member);
  });

  return [...merged.values()];
};
