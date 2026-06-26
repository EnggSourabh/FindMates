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
  Legend,
  Label,
} from "recharts";
import PageTransition from "../components/animations/PageTransition";
import GlassCard from "../components/cards/GlassCard";
import SkillBadge from "../components/SkillBadge";
import StatCard from "../components/StatCard";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";

const colors = ["#E1251B", "#7c3aed", "#059669", "#d97706", "#ec4899", "#2563eb"];

function Dashboard() {
  const { analytics, teams } = useTeamWorkspace();

  return (
    <PageTransition className="px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Intelligence layer</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Analytics Dashboard</h1>
        <p className="mt-4 max-w-3xl text-gray-500">
          Insights are calculated from the same member and team data used in Team Builder, so the
          dashboard updates as the workspace changes.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Total Members" value={analytics.totalMembers} detail="Available candidates" />
        <StatCard label="Total Teams" value={analytics.totalTeams} detail="Generated groups" accent="text-violet-600" />
        <StatCard label="Strongest Team" value={analytics.strongestTeam?.name || "None"} detail={`${analytics.strongestTeam?.chemistry || 0}% chemistry`} accent="text-emerald-600" />
        <StatCard label="Balance Score" value={`${analytics.averageBalance || 0}%`} detail="Average team balance" accent="text-amber-600" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StatCard label="Strongest Member" value={analytics.strongestMember?.name || "None"} detail={analytics.strongestMember?.role || "No roster yet"} accent="text-[#E1251B]" />
        <StatCard label="Open Recommendations" value={analytics.recommendations.length} detail={analytics.missingSkills.slice(0, 2).join(", ") || "No critical gaps"} accent="text-amber-600" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Skill Distribution</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.skillDistribution}>
                <CartesianGrid stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#E1251B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Role Distribution</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={analytics.roleDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={3}>
                  {analytics.roleDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                  <Label
                    value={analytics.totalMembers}
                    position="center"
                    fill="#111827"
                    style={{ fontSize: "36px", fontWeight: "bold" }}
                    dy={-10}
                  />
                  <Label
                    value="Members"
                    position="center"
                    fill="#6b7280"
                    style={{ fontSize: "14px", fontWeight: "500" }}
                    dy={20}
                  />
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
                  itemStyle={{ color: "#111827", fontWeight: "500" }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '13px', color: '#4b5563' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900">Top Skills</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {analytics.topSkills.map((skill) => (
              <SkillBadge key={skill.name}>{skill.name} x{skill.count}</SkillBadge>
            ))}
          </div>

          <h3 className="mt-8 text-lg font-bold text-amber-600">Skill Gaps</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analytics.missingSkills.length ? (
              analytics.missingSkills.map((skill) => <SkillBadge key={skill} tone="amber">{skill}</SkillBadge>)
            ) : (
              <p className="text-sm text-gray-400">The roster covers the target skill set.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
          <div className="mt-5 grid gap-3">
            {analytics.recommendations.length ? (
              analytics.recommendations.map((recommendation) => (
                <div key={recommendation.key} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-bold text-gray-900">{recommendation.targetRole}</p>
                      <p className="mt-1 text-sm text-gray-500">{recommendation.action}</p>
                    </div>
                    <span className="w-fit rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                      {recommendation.priority}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {recommendation.exampleSkills.map((skill) => (
                      <SkillBadge key={skill} tone="amber">{skill}</SkillBadge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                Current roster covers the core capability set. Keep balancing teams by availability and role diversity.
              </p>
            )}
            <p className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500">
              Strongest current group: {analytics.strongestTeam?.name || "Generate teams"} with {analytics.strongestTeam?.leader?.name || "no leader"} recommended as leader.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {teams.map((team) => (
              <div key={team.id} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{team.name}</span>
                  <span className="font-semibold text-emerald-600">{team.chemistry}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#E1251B] to-emerald-500" style={{ width: `${team.balanceScore}%` }} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {team.compatibilitySignals.slice(0, 3).map((signal) => (
                    <span key={`${team.id}-${signal.label}`} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                      {signal.label}: {signal.value}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-400">{team.balanceScore}% balance score</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  );
}

export default Dashboard;
