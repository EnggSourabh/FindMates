import { motion } from "framer-motion";

function GlassCard({ children, className = "", interactive = false }) {
  const Component = interactive ? motion.div : "div";
  const motionProps = interactive
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { duration: 0.2, ease: "easeOut" },
      }
    : {};

  return (
    <Component
      {...motionProps}
      className={`rounded-2xl border border-white/10 bg-white/[0.055] shadow-2xl shadow-black/20 backdrop-blur-2xl ${className}`}
    >
      {children}
    </Component>
  );
}

export default GlassCard;
