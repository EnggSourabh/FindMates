function SkillBadge({ children, tone = "cyan" }) {
  const tones = {
    cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    purple: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default SkillBadge;
