function FormField({ label, children }) {
  return (
    <label className="grid gap-2 text-sm text-gray-600">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#E1251B]/50 focus:bg-white focus:ring-1 focus:ring-[#E1251B]/20";

export default FormField;
