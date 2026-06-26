import { useMemo, useState } from "react";
import { FileText, Lightbulb, Plus, Sparkles, Users, Trash2 } from "lucide-react";
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
    loading,
    addMember,
    removeMember,
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

  const downloadTeamReport = async (team) => {
    const { default: jsPDF } = await import("jspdf");
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
    doc.text(`Next hire: ${team.recommendations[0]?.targetRole || "No critical gap"}`, 20, 94);
    doc.text(
      `Compatibility signals: ${team.compatibilitySignals.map((signal) => `${signal.label} ${signal.value}`).join("; ")}`,
      20,
      104,
    );

    let y = 122;
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
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#E1251B]">Core workflow</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Team Builder</h1>
          <p className="mt-4 max-w-3xl text-gray-500">
            Add members manually or analyze resumes, then generate balanced teams with leader
            recommendations, chemistry scoring, and skill gap detection.
          </p>
        </div>
        <PrimaryButton
          onClick={generateTeams}
          disabled={loading.teams}
        >
          <Sparkles size={18} />
          {loading.teams ? "Generating Teams" : "Generate Smart Teams"}
        </PrimaryButton>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Roster" value={members.length} detail="Members captured" />
        <StatCard label="Generated Teams" value={teams.length} detail="Live workspace output" accent="text-violet-600" />
        <StatCard label="Average Chemistry" value={`${analytics.averageChemistry || 0}%`} detail="Across generated teams" accent="text-emerald-600" />
        <StatCard label="Skill Coverage" value={`${coverage}%`} detail="Against target capabilities" accent="text-amber-600" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-[#E1251B]/10 text-[#E1251B]">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Member</h2>
              <p className="text-sm text-gray-400">Manual entry or resume-assisted profile creation</p>
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

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-violet-600" />
              <div>
                <h3 className="font-bold text-gray-900">Resume Analysis</h3>
                <p className="text-sm text-gray-400">Upload a PDF to extract skills and autofill the role.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="file"
                accept=".pdf"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:font-semibold file:text-white"
              />
              <PrimaryButton
                type="button"
                onClick={handleResumeAnalysis}
                variant="secondary"
                disabled={loading.resume}
              >
                {loading.resume ? "Analyzing..." : "Analyze"}
              </PrimaryButton>
            </div>

            {resumeResult && (
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {resumeResult.detected_skills?.map((skill) => (
                    <SkillBadge key={skill} tone="purple">{skill}</SkillBadge>
                  ))}
                  <SkillBadge tone="green">{resumeResult.recommended_role}</SkillBadge>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-500">
                  <p className="font-medium text-gray-700">Confidence: {Math.round(resumeResult.confidence * 100)}%</p>
                  {resumeResult.note && <p className="mt-1">{resumeResult.note}</p>}
                </div>
              </div>
            )}
          </div>

          {message && <p className="mt-4 rounded-2xl border border-[#E1251B]/20 bg-[#E1251B]/5 px-4 py-3 text-sm text-[#E1251B]">{message}</p>}
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Member Roster</h2>
              <p className="text-sm text-gray-400">Profiles shared across analytics and admin monitoring</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {members.map((member) => (
              <GlassCard key={member.id} interactive className="group p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-sm font-semibold text-emerald-700">
                      {member.compatibility}%
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="p-1 text-gray-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                      title="Remove member"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <SkillBadge key={skill}>{skill}</SkillBadge>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-400">Availability: {member.availability}</p>
              </GlassCard>
            ))}
          </div>
        </GlassCard>
      </div>

      <section className="mt-8">
        <div className="flex items-center gap-3">
          <Lightbulb className="text-amber-500" size={22} />
          <h2 className="text-2xl font-bold text-gray-900">Generated Teams</h2>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          {teams.map((team) => (
            <GlassCard key={team.id} interactive className="p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">Leader: {team.leader?.name || "Not assigned"}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-emerald-600">{team.chemistry}%</p>
                  <p className="text-xs text-gray-400">Chemistry score</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <p className="text-xs text-gray-400">Balance score</p>
                  <p className="mt-1 font-semibold text-[#E1251B]">{team.balanceScore}%</p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <p className="text-xs text-gray-400">Availability match</p>
                  <p className="mt-1 font-semibold text-violet-600">{team.availabilityMatch}/10</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {team.compatibilitySignals.map((signal) => (
                  <div key={`${team.id}-${signal.label}`} className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-400">{signal.label}</p>
                    <p className={`mt-1 text-sm font-semibold ${signal.tone === "green" ? "text-emerald-600" : "text-amber-600"}`}>
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <span className="font-medium text-gray-900">{member.name}</span>
                    <span className="text-sm text-gray-400">{member.role}</span>
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

              {team.recommendations.length > 0 && (
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Recommended next add</p>
                  <p className="mt-2 font-bold text-gray-900">{team.recommendations[0].targetRole}</p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">{team.recommendations[0].action}</p>
                </div>
              )}

              <button
                onClick={() => downloadTeamReport(team)}
                className="mt-5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow-sm"
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
