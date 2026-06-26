import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ from = 0, to, duration = 2, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const update = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - percentage, 3);
      setCount(Math.floor(easeOut * (to - from) + from));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 500, suffix: "+", label: "Teams Generated" },
  { value: 95, suffix: "%", label: "Avg Compatibility" },
  { value: 1000, suffix: "+", label: "Students Matched" },
  { value: 40, suffix: "+", label: "Skills Supported" },
];

function Stats() {
  return (
    <section className="py-20 px-5 sm:px-8 border-y border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                <Counter to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-sm font-medium tracking-wide text-gray-400 uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
