import { motion } from "framer-motion";

function StatCard({ label, value, detail, accent = "text-cyan-300" }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${accent}`}>{value}</p>
      {detail && <p className="mt-2 text-sm text-slate-500">{detail}</p>}
    </motion.div>
  );
}

export default StatCard;
