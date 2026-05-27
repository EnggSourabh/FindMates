import { Activity, Database, Server, ShieldCheck, UploadCloud } from "lucide-react";
import PageTransition from "../components/animations/PageTransition";
import GlassCard from "../components/cards/GlassCard";
import StatCard from "../components/StatCard";
import SkillBadge from "../components/SkillBadge";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";

function Admin() {
  const { analytics, activity, resumeAnalyses, teams } = useTeamWorkspace();
  const generatedMembers = teams.reduce((count, team) => count + team.members.length, 0);
  const systemHealth = analytics.totalMembers ? 99 : 92;

  return (
    <PageTransition className="px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">Operations</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">Admin Dashboard</h1>
        <p className="mt-4 max-w-3xl text-slate-400">
          Monitor workspace activity, generated teams, resume processing, and system readiness from
          a single SaaS-style control panel.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Users" value={analytics.totalMembers} detail="Student profiles" />
        <StatCard label="Generated Teams" value={analytics.totalTeams} detail={`${generatedMembers} assigned members`} accent="text-violet-300" />
        <StatCard label="Recent Uploads" value={resumeAnalyses.length} detail="Resume analysis events" accent="text-emerald-300" />
        <StatCard label="System Health" value={`${systemHealth}%`} detail="API and workflow readiness" accent="text-amber-300" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-300" size={22} />
            <h2 className="text-xl font-semibold">Team Performance Overview</h2>
          </div>

          <div className="mt-5 grid gap-4">
            {teams.map((team) => (
              <GlassCard key={team.id} interactive className="bg-slate-950/70 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <p className="text-sm text-slate-500">Leader: {team.leader?.name || "Not assigned"}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-semibold text-emerald-300">{team.chemistry}% chemistry</p>
                    <p className="text-xs text-slate-500">{team.members.length} members</p>
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
            <Activity className="text-cyan-300" size={22} />
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>

          <div className="mt-5 grid gap-3">
            {activity.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <GlassCard className="p-6">
          <Server className="text-cyan-300" size={22} />
          <h2 className="mt-4 text-lg font-semibold">Top Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.topSkills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill.name}>{skill.name} x{skill.count}</SkillBadge>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <Database className="text-violet-300" size={22} />
          <h2 className="mt-4 text-lg font-semibold">Most Active Roles</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.topRoles.slice(0, 4).map((role) => (
              <SkillBadge key={role.name} tone="purple">{role.name} x{role.count}</SkillBadge>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <UploadCloud className="text-emerald-300" size={22} />
          <h2 className="mt-4 text-lg font-semibold">Resume Pipeline</h2>
          <p className="mt-2 text-sm text-slate-400">Uploads feed skill extraction, role recommendation, and member creation.</p>
        </GlassCard>
      </div>
    </PageTransition>
  );
}

export default Admin;
