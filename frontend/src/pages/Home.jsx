import { ArrowRight, Brain, ChartNoAxesCombined, FileText, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageTransition from "../components/animations/PageTransition";
import GlassCard from "../components/cards/GlassCard";
import StatCard from "../components/StatCard";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";

const features = [
  {
    icon: FileText,
    title: "Resume intelligence",
    text: "Upload PDFs, extract skills, and convert candidate data into structured team profiles.",
  },
  {
    icon: Users,
    title: "Balanced team formation",
    text: "Generate teams around roles, skills, availability, and chemistry instead of simple grouping.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Live analytics",
    text: "Every member and generated team updates insights across the workspace automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Admin monitoring",
    text: "Track uploads, generated teams, activity, and operational signals from one dashboard.",
  },
];

function Home() {
  const { analytics } = useTeamWorkspace();

  return (
    <PageTransition className="px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <section className="grid min-h-[calc(100vh-5rem)] content-center gap-10 xl:grid-cols-[1.06fr_0.94fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 shadow-lg shadow-cyan-500/10 backdrop-blur"
          >
            <Brain size={16} />
            AI-powered student team formation
          </motion.div>

          <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-7xl">
            Find the right teammates with{" "}
            <span className="bg-gradient-to-r from-cyan-200 via-violet-200 to-emerald-200 bg-clip-text text-transparent">
              AI clarity
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            FindMates helps students analyze skills, form balanced hackathon teams, identify missing
            roles, and understand team chemistry from one clean workflow.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/team-builder"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Build Teams
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/analytics"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/[0.08]"
            >
              View Analytics
            </Link>
          </div>

          <div className="mt-12 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Resume skill extraction", "Balanced teams", "Chemistry insights"].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-slate-300 backdrop-blur">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid content-center gap-4">
          <GlassCard className="relative overflow-hidden p-6">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-300/10 blur-2xl" />
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Workspace snapshot</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <StatCard label="Members" value={analytics.totalMembers} detail="Ready for matching" />
              <StatCard label="Teams" value={analytics.totalTeams} detail="Current generated groups" accent="text-violet-300" />
              <StatCard label="Chemistry" value={`${analytics.averageChemistry || 0}%`} detail="Average score" accent="text-emerald-300" />
              <StatCard label="Skill Gaps" value={analytics.missingSkills.length} detail="Coverage opportunities" accent="text-amber-300" />
            </div>
          </GlassCard>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <GlassCard key={feature.title} interactive className="p-5">
                  <Icon className="text-cyan-300" size={24} />
                  <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

export default Home;
