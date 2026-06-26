function SkillBadge({ children, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default SkillBadge;
