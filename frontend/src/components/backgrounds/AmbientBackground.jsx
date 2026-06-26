function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gray-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(225,37,27,0.04),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(100,100,100,0.03),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f9fafb_48%,#f3f4f6_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:96px_96px] opacity-30" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute left-1/2 top-24 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[#E1251B]/[0.02] blur-3xl" />
    </div>
  );
}

export default AmbientBackground;
