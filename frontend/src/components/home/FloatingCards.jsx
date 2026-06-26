import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const CARDS = [
  { label: "React", top: "12%", left: "8%", color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-200/60" },
  { label: "Python", top: "20%", right: "10%", color: "text-blue-600", bg: "bg-blue-50 border-blue-200/60" },
  { label: "Machine Learning", bottom: "32%", left: "6%", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200/60" },
  { label: "UI/UX", bottom: "18%", right: "12%", color: "text-purple-600", bg: "bg-purple-50 border-purple-200/60" },
  { label: "FastAPI", top: "48%", left: "4%", color: "text-green-600", bg: "bg-green-50 border-green-200/60" },
  { label: "Leadership", bottom: "42%", right: "4%", color: "text-amber-600", bg: "bg-amber-50 border-amber-200/60" },
  { label: "MongoDB", top: "8%", left: "42%", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200/60" },
  { label: "Docker", bottom: "10%", left: "38%", color: "text-blue-700", bg: "bg-blue-50 border-blue-200/60" },
  { label: "AI Engineer", top: "40%", right: "8%", color: "text-red-600", bg: "bg-red-50 border-red-200/60" },
  { label: "Communication", bottom: "48%", left: "12%", color: "text-rose-600", bg: "bg-rose-50 border-rose-200/60" },
];

function FloatingCard({ card, idx, smoothX, smoothY }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Remove delay after initial entrance animation completes
    const timer = setTimeout(() => setIsMounted(true), 1000 + idx * 80);
    return () => clearTimeout(timer);
  }, [idx]);

  const xTransform = useTransform(smoothX, (v) => v * (idx % 2 === 0 ? 1 : -1) * 0.4);
  const yTransform = useTransform(smoothY, (v) => v * (idx % 2 === 0 ? 1 : -1) * 0.4);

  return (
    <motion.div
      style={{
        top: card.top,
        left: card.left,
        right: card.right,
        bottom: card.bottom,
        x: xTransform,
        y: yTransform,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={
        isMounted
          ? { type: "spring", stiffness: 400, damping: 25 } // Fast revert on unhover
          : {
              opacity: { duration: 0.8, delay: idx * 0.08 },
              scale: { duration: 0.8, delay: idx * 0.08, type: "spring", bounce: 0.3 },
            }
      }
      whileHover={{
        scale: 1.2,
        zIndex: 20,
        transition: { type: "spring", stiffness: 400, damping: 15, duration: 0.15 },
      }}
      className="absolute pointer-events-auto cursor-pointer group"
    >
      {/* Continuous floating via CSS animation */}
      <div
        className="animate-float"
        style={{ animationDelay: `${idx * 0.5}s` }}
      >
        <div
          className={`rounded-2xl border px-5 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-150 ${card.bg} group-hover:shadow-lg group-hover:shadow-black/5 group-hover:border-gray-300`}
        >
          <span className={`text-sm font-semibold tracking-wide ${card.color}`}>
            {card.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingCards() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 40);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block overflow-hidden">
      {CARDS.map((card, idx) => (
        <FloatingCard
          key={card.label}
          card={card}
          idx={idx}
          smoothX={smoothX}
          smoothY={smoothY}
        />
      ))}
    </div>
  );
}

export default FloatingCards;
