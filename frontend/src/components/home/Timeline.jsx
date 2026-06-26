import { motion } from "framer-motion";

const steps = [
  { step: "01", title: "Create Profile", desc: "Sign up and set your hackathon goals." },
  { step: "02", title: "Upload Resume", desc: "Drop your PDF resume into the parser." },
  { step: "03", title: "AI Extraction", desc: "Our engine detects your tech stack and skills." },
  { step: "04", title: "Generate Teams", desc: "Match based on skill gaps, roles, and chemistry." },
  { step: "05", title: "Collaborate", desc: "Download your team report and start building." },
];

function Timeline() {
  return (
    <section id="timeline" className="relative py-32 px-5 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">How It Works</h2>
        <p className="mt-4 text-lg text-gray-500">From solo developer to a balanced team in minutes.</p>
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        {steps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="relative flex items-center gap-8 pb-12 last:pb-0"
          >
            {idx !== steps.length - 1 && (
              <div className="absolute left-[39px] top-[80px] h-[calc(100%-80px)] w-px bg-gradient-to-b from-gray-200 to-transparent" />
            )}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
              <span className="text-xl font-bold text-[#E1251B]">{item.step}</span>
            </div>

            <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-500">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Timeline;
