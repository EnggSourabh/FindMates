import { motion } from "framer-motion";

function PrimaryButton({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-gray-900 text-white shadow-sm hover:bg-gray-800",
    secondary:
      "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
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
