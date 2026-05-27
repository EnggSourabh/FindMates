export const REQUIRED_SKILLS = [
  "React",
  "FastAPI",
  "MongoDB",
  "Machine Learning",
  "UI/UX",
  "Pitching",
];

const TEAM_CAPABILITIES = [
  {
    key: "frontend",
    label: "frontend expertise",
    skills: ["react", "javascript", "frontend", "ui"],
    roles: ["frontend", "full stack"],
  },
  {
    key: "backend",
    label: "backend expertise",
    skills: ["fastapi", "node.js", "mongodb", "backend", "api", "sql"],
    roles: ["backend", "full stack"],
  },
  {
    key: "ai",
    label: "AI/ML expertise",
    skills: ["machine learning", "ml", "ai", "python", "analytics"],
    roles: ["ml engineer", "ai engineer", "data analyst"],
  },
  {
    key: "design",
    label: "UI/UX design",
    skills: ["ui/ux", "figma", "design", "ux", "product"],
    roles: ["designer", "product designer"],
  },
  {
    key: "presentation",
    label: "presentation or project leadership",
    skills: ["pitching", "presentation", "leadership", "communication"],
    roles: ["project lead", "presenter", "generalist"],
  },
];

export const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const formatList = (value) => parseList(value).join(", ");

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `member-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const normalizeMember = (member) => {
  const skills = parseList(member.skills);
  const interests = parseList(member.interests);
  const role = String(member.role || recommendRoleFromProfile({ skills, interests })).trim();
  const compatibility =
    Number(member.compatibility || member.score) ||
    Math.min(96, 68 + skills.length * 4 + interests.length * 2 + getMemberCapabilities({ skills, role }).length * 2);

  return {
    id: member.id || createId(),
    name: String(member.name || "").trim(),
    skills,
    interests,
    role,
    availability: String(member.availability || "Not specified").trim(),
    compatibility,
    source: member.source || "manual",
  };
};

export const scoreMemberForLeadership = (member) => {
  const skillWeight = parseList(member.skills).length * 4;
  const interestWeight = parseList(member.interests).some((interest) =>
    /pitch|lead|product|presentation|mentor/i.test(interest),
  )
    ? 7
    : 0;
  const roleWeight = /lead|manager|architect|full.?stack|presenter/i.test(member.role)
    ? 8
    : 0;

  return Math.round((member.compatibility || 75) + skillWeight + roleWeight + interestWeight);
};

export const getTeamLeader = (members) => {
  if (!members.length) return null;

  return [...members].sort(
    (a, b) => scoreMemberForLeadership(b) - scoreMemberForLeadership(a),
  )[0];
};

export const getSkillGaps = (members) => {
  const coveredCapabilities = new Set(members.flatMap(getMemberCapabilities));

  return TEAM_CAPABILITIES.filter((capability) => !coveredCapabilities.has(capability.key)).map(
    (capability) => capability.label,
  );
};

export const getMemberCapabilities = (member) => {
  const searchable = [...parseList(member.skills), member.role || "", ...parseList(member.interests)]
    .join(" ")
    .toLowerCase();

  return TEAM_CAPABILITIES.filter(
    (capability) =>
      capability.skills.some((skill) => searchable.includes(skill)) ||
      capability.roles.some((role) => searchable.includes(role)),
  ).map((capability) => capability.key);
};

export const recommendRoleFromProfile = ({ skills = [], interests = [] }) => {
  const searchable = [...parseList(skills), ...parseList(interests)].join(" ").toLowerCase();

  if (/machine learning|ml|ai|python/.test(searchable)) return "ML Engineer";
  if (/react|frontend|javascript/.test(searchable)) return "Frontend Developer";
  if (/fastapi|node|mongodb|api|backend|sql/.test(searchable)) return "Backend Developer";
  if (/figma|ui\/ux|design|ux/.test(searchable)) return "Product Designer";
  if (/pitch|presentation|leadership|communication/.test(searchable)) return "Presenter";
  if (/docker|devops|cloud/.test(searchable)) return "DevOps Engineer";

  return "Generalist";
};

const getAvailabilityScore = (members) => {
  if (members.length < 2) return 8;

  const availabilityCounts = members.reduce((acc, member) => {
    const value = String(member.availability || "Not specified").toLowerCase();
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
  const bestOverlap = Math.max(...Object.values(availabilityCounts));

  return Math.round((bestOverlap / members.length) * 10);
};

export const calculateBalanceScore = (members) => {
  if (!members.length) return 0;

  const capabilities = new Set(members.flatMap(getMemberCapabilities));
  const uniqueRoles = new Set(members.map((member) => member.role)).size;
  const roleDiversity = Math.min(20, uniqueRoles * 5);
  const capabilityCoverage = Math.round((capabilities.size / TEAM_CAPABILITIES.length) * 55);
  const availabilityScore = getAvailabilityScore(members);
  const duplicatePenalty = Math.max(0, members.length - uniqueRoles) * 4;

  return Math.max(40, Math.min(98, capabilityCoverage + roleDiversity + availabilityScore + 12 - duplicatePenalty));
};

export const calculateChemistry = (members) => {
  if (!members.length) return 0;

  const averageCompatibility =
    members.reduce((sum, member) => sum + (member.compatibility || 75), 0) /
    members.length;
  const uniqueRoles = new Set(members.map((member) => member.role)).size;
  const uniqueSkills = new Set(members.flatMap((member) => parseList(member.skills))).size;
  const balanceScore = calculateBalanceScore(members);
  const availabilityScore = getAvailabilityScore(members);
  const sharedInterestCount = members
    .flatMap((member) => parseList(member.interests).map((item) => item.toLowerCase()))
    .reduce((count, interest, _, all) => count + (all.indexOf(interest) !== all.lastIndexOf(interest) ? 1 : 0), 0);

  const score =
    averageCompatibility * 0.44 +
    balanceScore * 0.3 +
    availabilityScore * 1.1 +
    Math.min(uniqueRoles * 3, 12) +
    Math.min(uniqueSkills * 1.2, 10) +
    Math.min(sharedInterestCount, 5);

  return Math.max(50, Math.min(98, Math.round(score)));
};

const getTeamSkillCount = (team) => new Set(team.flatMap((member) => member.skills)).size;

const scoreFitForTeam = (member, team) => {
  const teamCapabilities = new Set(team.flatMap(getMemberCapabilities));
  const memberCapabilities = getMemberCapabilities(member);
  const newCapabilityScore = memberCapabilities.filter((capability) => !teamCapabilities.has(capability)).length * 18;
  const roleOverlapPenalty = team.some((teammate) => teammate.role === member.role) ? 12 : 0;
  const availabilityMatch = team.some((teammate) => teammate.availability === member.availability) ? 6 : 0;
  const interestMatch = team.some((teammate) =>
    teammate.interests.some((interest) =>
      member.interests.map((item) => item.toLowerCase()).includes(interest.toLowerCase()),
    ),
  )
    ? 4
    : 0;

  return newCapabilityScore + availabilityMatch + interestMatch - roleOverlapPenalty - team.length * 3;
};

export const generateSmartTeams = (members, teamSize = 4) => {
  const normalizedMembers = members.map(normalizeMember);
  const teamCount = Math.max(1, Math.ceil(normalizedMembers.length / teamSize));
  const teams = Array.from({ length: teamCount }, () => []);

  [...normalizedMembers]
    .sort((a, b) => {
      const capabilityCompare = getMemberCapabilities(b).length - getMemberCapabilities(a).length;
      if (capabilityCompare !== 0) return capabilityCompare;
      return scoreMemberForLeadership(b) - scoreMemberForLeadership(a);
    })
    .forEach((member) => {
      const targetTeam = teams
        .filter((team) => team.length < teamSize)
        .sort((a, b) => {
          const scoreCompare = scoreFitForTeam(member, b) - scoreFitForTeam(member, a);
          if (scoreCompare !== 0) return scoreCompare;
          if (a.length !== b.length) return a.length - b.length;
          return getTeamSkillCount(a) - getTeamSkillCount(b);
        })[0];

      targetTeam.push(member);
    });

  return teams
    .filter(Boolean)
    .map((team, index) => ({
      id: `team-${index + 1}`,
      name: `Team ${index + 1}`,
      members: team,
      leader: getTeamLeader(team),
      chemistry: calculateChemistry(team),
      balanceScore: calculateBalanceScore(team),
      skillGaps: getSkillGaps(team),
      strengths: [...new Set(team.flatMap((member) => member.skills))].slice(0, 5),
      availabilityMatch: getAvailabilityScore(team),
    }));
};

export const getAnalytics = (members, teams) => {
  const allSkills = members.flatMap((member) => parseList(member.skills));
  const allRoles = members.map((member) => member.role || "Generalist");
  const countByValue = (items) =>
    items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  const strongestTeam = [...teams].sort((a, b) => b.chemistry - a.chemistry)[0];
  const strongestMember = [...members].sort(
    (a, b) => scoreMemberForLeadership(b) - scoreMemberForLeadership(a),
  )[0];
  const averageChemistry = teams.length
    ? Math.round(teams.reduce((sum, team) => sum + team.chemistry, 0) / teams.length)
    : 0;
  const averageBalance = teams.length
    ? Math.round(teams.reduce((sum, team) => sum + team.balanceScore, 0) / teams.length)
    : 0;

  return {
    totalMembers: members.length,
    totalTeams: teams.length,
    averageChemistry,
    averageBalance,
    strongestTeam,
    strongestMember,
    skillDistribution: Object.entries(countByValue(allSkills)).map(([name, value]) => ({
      name,
      value,
    })),
    roleDistribution: Object.entries(countByValue(allRoles)).map(([name, value]) => ({
      name,
      value,
    })),
    topSkills: Object.entries(countByValue(allSkills))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count })),
    topRoles: Object.entries(countByValue(allRoles))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
    missingSkills: getSkillGaps(members),
  };
};
