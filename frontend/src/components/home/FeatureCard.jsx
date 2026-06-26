import { motion } from "framer-motion";

function FeatureCard({ icon: Icon, title, text, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-700 transition-colors duration-300 group-hover:bg-[#E1251B]/10 group-hover:text-[#E1251B]">
        <Icon size={24} />
      </div>

      <h3 className="mt-6 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">{text}</p>
    </motion.div>
  );
}

export default FeatureCard;
