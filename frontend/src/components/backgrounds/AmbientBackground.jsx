function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(56,189,248,0.12),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(139,92,246,0.08),transparent_28%),linear-gradient(180deg,#050816_0%,#07111f_48%,#030712_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.014)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.014)_1px,transparent_1px)] bg-[size:96px_96px] opacity-35" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/25 to-transparent" />
      <div className="absolute left-1/2 top-24 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-cyan-300/[0.055] blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950/80 to-transparent" />
    </div>
  );
}

export default AmbientBackground;
