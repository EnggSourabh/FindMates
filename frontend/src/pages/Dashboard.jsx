import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageTransition from "../components/animations/PageTransition";
import GlassCard from "../components/cards/GlassCard";
import SkillBadge from "../components/SkillBadge";
import StatCard from "../components/StatCard";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";

const colors = ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b", "#f472b6", "#60a5fa"];

function Dashboard() {
  const { analytics, teams } = useTeamWorkspace();

  return (
    <PageTransition className="px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">Intelligence layer</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">Analytics Dashboard</h1>
        <p className="mt-4 max-w-3xl text-slate-400">
          Insights are calculated from the same member and team data used in Team Builder, so the
          dashboard updates as the workspace changes.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Members" value={analytics.totalMembers} detail="Available candidates" />
        <StatCard label="Total Teams" value={analytics.totalTeams} detail="Generated groups" accent="text-violet-300" />
        <StatCard label="Strongest Team" value={analytics.strongestTeam?.name || "None"} detail={`${analytics.strongestTeam?.chemistry || 0}% chemistry`} accent="text-emerald-300" />
        <StatCard label="Balance Score" value={`${analytics.averageBalance || 0}%`} detail="Average team balance" accent="text-amber-300" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StatCard label="Strongest Member" value={analytics.strongestMember?.name || "None"} detail={analytics.strongestMember?.role || "No roster yet"} accent="text-cyan-300" />
        <StatCard label="Missing Capabilities" value={analytics.missingSkills.length} detail={analytics.missingSkills.slice(0, 2).join(", ") || "No critical gaps"} accent="text-amber-300" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold">Skill Distribution</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.skillDistribution}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold">Role Distribution</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.roleDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={3}>
                  {analytics.roleDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold">Top Skills</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {analytics.topSkills.map((skill) => (
              <SkillBadge key={skill.name}>{skill.name} x{skill.count}</SkillBadge>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-semibold text-amber-200">Skill Gaps</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.missingSkills.length ? (
              analytics.missingSkills.map((skill) => <SkillBadge key={skill} tone="amber">{skill}</SkillBadge>)
            ) : (
              <p className="text-sm text-slate-400">The roster covers the target skill set.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold">AI Recommendations</h2>
          <div className="mt-5 grid gap-3">
            <p className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              Keep teams near three members until the roster grows so role coverage remains readable.
            </p>
            <p className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              Prioritize candidates with {analytics.missingSkills.slice(0, 3).join(", ") || "specialized depth"} to improve coverage.
            </p>
            <p className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              Strongest current group: {analytics.strongestTeam?.name || "Generate teams"} with {analytics.strongestTeam?.leader?.name || "no leader"} recommended as leader.
            </p>
            <p className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
              Team balance score is {analytics.averageBalance || 0}%, based on role diversity, complementary skills, and availability overlap.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {teams.map((team) => (
              <div key={team.id} className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span>{team.name}</span>
                  <span className="font-semibold text-emerald-300">{team.chemistry}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${team.balanceScore}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{team.balanceScore}% balance score</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}

export default Dashboard;
