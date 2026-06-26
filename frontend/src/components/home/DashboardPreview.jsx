import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function DashboardPreview() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.95]);

  return (
    <section id="analytics" ref={containerRef} className="relative overflow-hidden py-32 px-5 sm:px-8" style={{ perspective: "1200px" }}>
      <div className="mx-auto max-w-4xl text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Live Preview</h2>
        <p className="mt-4 text-lg text-gray-500">Everything you need to monitor and manage your teams.</p>
      </div>

      <motion.div
        style={{ y, rotateX, scale }}
        className="mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        {/* Mockup Header */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-amber-400" />
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="text-sm font-medium text-gray-400">Workspace Dashboard</div>
          <div className="h-8 w-8 rounded-full bg-gray-100" />
        </div>

        {/* Mockup Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="text-sm text-gray-400">Total Members</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">124</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="text-sm text-gray-400">Teams Formed</div>
                <div className="mt-2 text-3xl font-bold text-[#E1251B]">28</div>
              </div>
            </div>
            <div className="h-48 rounded-xl bg-gray-50 border border-gray-100 p-4 flex items-end justify-between gap-2">
              {[40, 70, 45, 90, 65, 80, 50, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                  className="w-full rounded-t-md bg-gradient-to-t from-gray-200 to-gray-900"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 h-full">
              <div className="mb-4 text-sm font-semibold text-gray-900">Recent Teams</div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="mb-3 rounded-lg bg-white border border-gray-100 p-3 last:mb-0 flex items-center justify-between">
                  <div className="h-10 w-10 rounded bg-gray-100" />
                  <div className="h-2 w-24 rounded bg-gray-200" />
                  <div className="h-2 w-8 rounded bg-emerald-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default DashboardPreview;
