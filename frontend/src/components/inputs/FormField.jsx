function FormField({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-slate-300">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-12 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70 focus:bg-slate-950";

export default FormField;
