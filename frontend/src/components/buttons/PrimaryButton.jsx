import { motion } from "framer-motion";

function PrimaryButton({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-200",
    secondary:
      "border border-white/10 bg-white/[0.04] text-white hover:border-cyan-300/40 hover:bg-white/[0.08]",
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default PrimaryButton;
