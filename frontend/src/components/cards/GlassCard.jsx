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
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </Component>
  );
}

export default GlassCard;
