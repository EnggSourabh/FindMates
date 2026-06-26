import { motion } from "framer-motion";

function StatCard({ label, value, detail, accent = "text-[#E1251B]" }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      {detail && <p className="mt-2 text-sm text-gray-400">{detail}</p>}
    </motion.div>
  );
}

export default StatCard;
