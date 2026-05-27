import { useMemo, useState } from "react";
import { profiles } from "../data/teamData";
import { profileApi, resumeApi } from "../services/api";
import { generateSmartTeams, getAnalytics, normalizeMember } from "../utils/teamEngine";
import { TeamContext } from "./teamContextObject";

const initialMembers = profiles.map(normalizeMember);

export function TeamProvider({ children }) {
  const [members, setMembers] = useState(initialMembers);
  const [teams, setTeams] = useState(() => generateSmartTeams(initialMembers));
  const [resumeAnalyses, setResumeAnalyses] = useState([]);
  const [activity, setActivity] = useState([
    "Seed team workspace created",
    "Initial smart teams generated",
  ]);
  const [status, setStatus] = useState("");

  const addActivity = (message) => {
    setActivity((current) => [message, ...current].slice(0, 8));
  };

  const addMember = async (member) => {
    const normalized = normalizeMember(member);
    setMembers((current) => [...current, normalized]);
    addActivity(`${normalized.name} added as ${normalized.role}`);

    try {
      await profileApi.create(normalized);
    } catch {
      addActivity("Backend unavailable, member stored in current session");
    }

    return normalized;
  };

  const analyzeResume = async (file) => {
    setStatus("Analyzing resume");

    try {
      const result = await resumeApi.analyze(file);
      setResumeAnalyses((current) => [result, ...current]);
      addActivity(`Resume analyzed: ${result.recommended_role || "role recommended"}`);
      return result;
    } catch {
      const fallback = {
        detected_skills: ["React", "Python", "FastAPI"],
        recommended_role: "Full Stack Developer",
        confidence: 0.72,
        note: "Local fallback used because the backend is not reachable.",
      };

      setResumeAnalyses((current) => [fallback, ...current]);
      addActivity("Resume analysis used local fallback");
      return fallback;
    } finally {
      setStatus("");
    }
  };

  const generateTeams = () => {
    const nextTeams = generateSmartTeams(members);
    setTeams(nextTeams);
    addActivity(`${nextTeams.length} balanced teams generated`);
    return nextTeams;
  };

  const analytics = useMemo(() => getAnalytics(members, teams), [members, teams]);

  const value = {
    members,
    teams,
    analytics,
    resumeAnalyses,
    activity,
    status,
    addMember,
    analyzeResume,
    generateTeams,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
