import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import { FileText, Lightbulb, Plus, Sparkles, Users } from "lucide-react";
import PageTransition from "../components/animations/PageTransition";
import PrimaryButton from "../components/buttons/PrimaryButton";
import GlassCard from "../components/cards/GlassCard";
import FormField, { inputClass } from "../components/inputs/FormField";
import SkillBadge from "../components/SkillBadge";
import StatCard from "../components/StatCard";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";
import { formatList } from "../utils/teamEngine";

const emptyForm = {
  name: "",
  skills: "",
  interests: "",
  role: "",
  availability: "",
};

const roleOptions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "ML Engineer",
  "AI Engineer",
  "Data Analyst",
  "Product Designer",
  "DevOps Engineer",
  "Presenter",
  "Project Lead",
  "Generalist",
];

const availabilityOptions = [
  "Full-time",
  "Weekdays",
  "Weekends",
  "Evenings",
  "Afternoons",
  "Flexible",
  "Limited",
];

function TeamBuilder() {
  const {
    members,
    teams,
    analytics,
    status,
    addMember,
    analyzeResume,
    generateTeams,
  } = useTeamWorkspace();
  const [formData, setFormData] = useState(emptyForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeResult, setResumeResult] = useState(null);
  const [message, setMessage] = useState("");

  const canSubmit = formData.name && formData.skills && formData.role;

  const coverage = useMemo(() => {
    const total = analytics.missingSkills.length + analytics.topSkills.length;
    if (!total) return 0;
    return Math.round((analytics.topSkills.length / total) * 100);
  }, [analytics.missingSkills.length, analytics.topSkills.length]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setMessage("Add a name, skills, and role before saving the member.");
      return;
    }

    await addMember(formData);
    setFormData(emptyForm);
    setMessage("Member added. Generate teams again when the roster is ready.");
  };

  const handleResumeAnalysis = async () => {
    if (!resumeFile) {
      setMessage("Choose a PDF resume first.");
      return;
    }

    const result = await analyzeResume(resumeFile);
    setResumeResult(result);
    setFormData((current) => ({
      ...current,
      skills: formatList(result.detected_skills),
      role: result.recommended_role || current.role,
    }));
    setMessage("Resume insights are ready and copied into the member form.");
  };

  const downloadTeamReport = (team) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`${team.name} Report`, 20, 20);
    doc.setFontSize(12);
    doc.text(`Leader: ${team.leader?.name || "Not assigned"}`, 20, 34);
    doc.text(`Chemistry: ${team.chemistry}%`, 20, 44);
    doc.text(`Balance score: ${team.balanceScore}%`, 20, 54);
    doc.text(`Availability match: ${team.availabilityMatch}/10`, 20, 64);
    doc.text(`Strengths: ${team.strengths.join(", ") || "None"}`, 20, 74);
    doc.text(`Skill gaps: ${team.skillGaps.join(", ") || "None"}`, 20, 84);

    let y = 102;
    team.members.forEach((member) => {
      doc.text(`${member.name} - ${member.role}`, 20, y);
      y += 10;
    });

    doc.save(`${team.name.replace(" ", "_")}_Report.pdf`);
  };

  return (
    <PageTransition className="px-5 pb-12 pt-32 sm:px-8 lg:px-10">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-300">Core workflow</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white md:text-5xl">Team Builder</h1>
          <p className="mt-4 max-w-3xl text-slate-400">
            Add members manually or analyze resumes, then generate balanced teams with leader
            recommendations, chemistry scoring, and skill gap detection.
          </p>
        </div>
        <PrimaryButton
          onClick={generateTeams}
        >
          <Sparkles size={18} />
          Generate Smart Teams
        </PrimaryButton>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Roster" value={members.length} detail="Members captured" />
        <StatCard label="Generated Teams" value={teams.length} detail="Live workspace output" accent="text-violet-300" />
        <StatCard label="Average Chemistry" value={`${analytics.averageChemistry || 0}%`} detail="Across generated teams" accent="text-emerald-300" />
        <StatCard label="Skill Coverage" value={`${coverage}%`} detail="Against target capabilities" accent="text-amber-300" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Add Member</h2>
              <p className="text-sm text-slate-500">Manual entry or resume-assisted profile creation</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <FormField label="Student name">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Member name" className={inputClass} />
            </FormField>
            <FormField label="Skills">
              <input name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Python, Figma" className={inputClass} />
            </FormField>
            <FormField label="Interests">
              <input name="interests" value={formData.interests} onChange={handleChange} placeholder="AI, product, pitching" className={inputClass} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Recommended role">
                <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
                  <option value="">Select role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Availability">
                <select name="availability" value={formData.availability} onChange={handleChange} className={inputClass}>
                  <option value="">Select availability</option>
                  {availabilityOptions.map((availability) => (
                    <option key={availability} value={availability}>
                      {availability}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <PrimaryButton className="w-full">
              Save Member
            </PrimaryButton>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-white/5">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-violet-300" />
              <div>
                <h3 className="font-semibold">Resume Analysis</h3>
                <p className="text-sm text-slate-500">Upload a PDF to extract skills and autofill the role.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="file"
                accept=".pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-300 file:px-3 file:py-2 file:font-semibold file:text-slate-950"
              />
              <PrimaryButton
                type="button"
                onClick={handleResumeAnalysis}
                variant="secondary"
              >
                {status || "Analyze"}
              </PrimaryButton>
            </div>

            {resumeResult && (
              <div className="mt-4 flex flex-wrap gap-2">
                {resumeResult.detected_skills?.map((skill) => (
                  <SkillBadge key={skill} tone="purple">{skill}</SkillBadge>
                ))}
                <SkillBadge tone="green">{resumeResult.recommended_role}</SkillBadge>
              </div>
            )}
          </div>

          {message && <p className="mt-4 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">{message}</p>}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/10">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Member Roster</h2>
              <p className="text-sm text-slate-500">Profiles shared across analytics and admin monitoring</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {members.map((member) => (
              <GlassCard key={member.id} interactive className="bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-slate-500">{member.role}</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                    {member.compatibility}%
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <SkillBadge key={skill}>{skill}</SkillBadge>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-500">Availability: {member.availability}</p>
              </GlassCard>
            ))}
          </div>
        </GlassCard>
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-3">
          <Lightbulb className="text-amber-300" size={22} />
          <h2 className="text-2xl font-semibold">Generated Teams</h2>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {teams.map((team) => (
            <GlassCard key={team.id} interactive className="p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">Leader: {team.leader?.name || "Not assigned"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-semibold text-emerald-300">{team.chemistry}%</p>
                  <p className="text-xs text-slate-500">Chemistry score</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950/70 px-4 py-3">
                  <p className="text-xs text-slate-500">Balance score</p>
                  <p className="mt-1 font-semibold text-cyan-300">{team.balanceScore}%</p>
                </div>
                <div className="rounded-2xl bg-slate-950/70 px-4 py-3">
                  <p className="text-xs text-slate-500">Availability match</p>
                  <p className="mt-1 font-semibold text-violet-300">{team.availabilityMatch}/10</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-2xl bg-slate-950/70 px-4 py-3">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-sm text-slate-500">{member.role}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {team.strengths.map((skill) => (
                  <SkillBadge key={skill} tone="green">{skill}</SkillBadge>
                ))}
                {team.skillGaps.slice(0, 3).map((gap) => (
                  <SkillBadge key={gap} tone="amber">Lacks {gap}</SkillBadge>
                ))}
              </div>

              <button
                onClick={() => downloadTeamReport(team)}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
              >
                Download Report
              </button>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

export default TeamBuilder;
