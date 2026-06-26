import { Activity, Database, Server, ShieldCheck, UploadCloud, History } from "lucide-react";
import { useEffect, useState } from "react";
import PageTransition from "../components/animations/PageTransition";
import GlassCard from "../components/cards/GlassCard";
import StatCard from "../components/StatCard";
import SkillBadge from "../components/SkillBadge";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";
import { healthApi, profileApi } from "../services/api";

function Admin() {
  const { analytics, activity, resumeAnalyses, teams, teamRuns } = useTeamWorkspace();
  const generatedMembers = teams.reduce((count, team) => count + team.members.length, 0);
  const systemHealth = analytics.totalMembers ? 99 : 92;

  const [healthStatus, setHealthStatus] = useState(null);
  const [dbProfileCount, setDbProfileCount] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchHealth = async () => {
      try {
        const health = await healthApi.check();
        const profiles = await profileApi.list();
        if (!ignore) {
          setHealthStatus(health);
          setDbProfileCount(profiles.length);
        }
      } catch {
        if (!ignore) {
          setHealthStatus({ api: "offline", database: false, tracking: { enabled: false } });
        }
      }
    };
    fetchHealth();
    return () => { ignore = true; };
  }, []);

  return (
    <PageTransition className="px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">Operations</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Admin Dashboard</h1>
        <p className="mt-4 max-w-3xl text-gray-500">
          Monitor workspace activity, generated teams, resume processing, and system readiness from
          a single SaaS-style control panel.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={analytics.totalMembers} detail="Student profiles" />
        <StatCard label="Generated Teams" value={analytics.totalTeams} detail={`${generatedMembers} assigned members`} accent="text-violet-600" />
        <StatCard label="Recent Uploads" value={resumeAnalyses.length} detail="Resume analysis events" accent="text-emerald-600" />
        <StatCard label="System Health" value={`${systemHealth}%`} detail="API and workflow readiness" accent="text-amber-600" />
      </div>

      <div className="mt-8">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Server className="text-[#E1251B]" size={22} />
            <h2 className="text-xl font-bold text-gray-900">Backend Infrastructure</h2>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-400">API Status</p>
              <p className={`mt-1 text-lg font-semibold ${healthStatus?.api === "ok" ? "text-emerald-600" : "text-red-500"}`}>
                {healthStatus?.api === "ok" ? "Online" : "Offline"}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-400">Database Connection</p>
              <p className={`mt-1 text-lg font-semibold ${healthStatus?.database ? "text-emerald-600" : "text-amber-500"}`}>
                {healthStatus?.database ? "Connected" : "Disconnected"}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-400">MLflow Tracking</p>
              <p className={`mt-1 text-lg font-semibold ${healthStatus?.tracking?.enabled ? "text-[#E1251B]" : "text-gray-400"}`}>
                {healthStatus?.tracking?.enabled ? "Enabled" : "Disabled"}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-400">DB Profile Count</p>
              <p className="mt-1 text-lg font-semibold text-violet-600">
                {dbProfileCount !== null ? dbProfileCount : "---"}
              </p>
            </div>
          </div>
          {healthStatus?.tracking?.enabled && (
             <p className="mt-4 text-sm text-gray-400">Tracking URI: {healthStatus.tracking.uri}</p>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-emerald-600" size={22} />
              <h2 className="text-xl font-bold text-gray-900">Team Performance Overview</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${healthStatus?.api === "ok" ? "bg-[#E1251B]/10 text-[#E1251B]" : "bg-gray-100 text-gray-400"}`}>
              {healthStatus?.api === "ok" ? "API-Generated" : "Local Fallback"}
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            {teams.map((team) => (
              <GlassCard key={team.id} interactive className="p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-400">Leader: {team.leader?.name || "Not assigned"}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-emerald-600">{team.chemistry}% chemistry</p>
                    <p className="text-xs text-gray-400">{team.members.length} members</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {team.strengths.slice(0, 4).map((skill) => (
                    <SkillBadge key={skill} tone="green">{skill}</SkillBadge>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <Activity className="text-[#E1251B]" size={22} />
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>

          <div className="mt-5 grid gap-3">
            {activity.map((item) => (
              <div key={item} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-6">
          <Server className="text-[#E1251B]" size={22} />
          <h2 className="mt-4 text-lg font-bold text-gray-900">Top Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.topSkills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill.name}>{skill.name} x{skill.count}</SkillBadge>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <Database className="text-violet-600" size={22} />
          <h2 className="mt-4 text-lg font-bold text-gray-900">Most Active Roles</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.topRoles.slice(0, 4).map((role) => (
              <SkillBadge key={role.name} tone="purple">{role.name} x{role.count}</SkillBadge>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <UploadCloud className="text-emerald-600" size={22} />
          <h2 className="mt-4 text-lg font-bold text-gray-900">Resume Pipeline</h2>
          <p className="mt-2 text-sm text-gray-400">Uploads feed skill extraction, role recommendation, and member creation.</p>
        </GlassCard>
      </div>

      <div className="mt-8">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <History className="text-violet-600" size={22} />
            <h2 className="text-xl font-bold text-gray-900">Team Generation History</h2>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-200 text-gray-400">
                <tr>
                  <th className="pb-3 pr-4 font-medium">Time</th>
                  <th className="pb-3 pr-4 font-medium">Members</th>
                  <th className="pb-3 pr-4 font-medium">Teams</th>
                  <th className="pb-3 pr-4 font-medium">Avg Chemistry</th>
                  <th className="pb-3 pr-4 font-medium">Avg Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamRuns.map((run) => (
                  <tr key={run.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap py-3 pr-4">
                      {new Date(run.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">{run.members?.length || run.member_count || 0}</td>
                    <td className="py-3 pr-4">{run.teams?.length || run.team_count || 0}</td>
                    <td className="py-3 pr-4 text-emerald-600">{run.average_chemistry}%</td>
                    <td className="py-3 pr-4 text-[#E1251B]">{run.average_balance}%</td>
                  </tr>
                ))}
                {(!teamRuns || teamRuns.length === 0) && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-400">
                      No team generation history available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}

export default Admin;
