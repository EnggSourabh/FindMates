import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { heroAnimations } from "./heroAnimations.config";

const SKILL_CHIPS = [
  { text: "React", top: "15%", left: "10%", layer: "far", isAccent: false },
  { text: "AI", top: "25%", left: "80%", layer: "near", isAccent: true },
  { text: "Machine Learning", top: "60%", left: "12%", layer: "mid", isAccent: false },
  { text: "Frontend", top: "75%", left: "85%", layer: "far", isAccent: false },
  { text: "Backend", top: "10%", left: "60%", layer: "mid", isAccent: false },
  { text: "JavaScript", top: "45%", left: "5%", layer: "near", isAccent: false },
  { text: "Python", top: "85%", left: "20%", layer: "far", isAccent: false },
  { text: "Node.js", top: "35%", left: "90%", layer: "mid", isAccent: false },
  { text: "Figma", top: "50%", left: "75%", layer: "far", isAccent: false },
  { text: "UI/UX", top: "20%", left: "30%", layer: "near", isAccent: false },
  { text: "Cloud", top: "80%", left: "65%", layer: "mid", isAccent: false },
  { text: "System Design", top: "65%", left: "95%", layer: "far", isAccent: false },
  { text: "DSA", top: "5%", left: "85%", layer: "far", isAccent: false },
  { text: "Java", top: "90%", left: "45%", layer: "mid", isAccent: false },
  { text: "TypeScript", top: "40%", left: "20%", layer: "near", isAccent: true },
];

function FloatingChip({ chip, mouseX, mouseY, isReducedMotion }) {
  // Randomize float timing per chip
  const [floatConfig] = useState(() => ({
    delay: Math.random() * (0.12 - 0.05) + 0.05,
    duration: Math.random() * (8 - 4) + 4,
    rotation: Math.random() > 0.5 ? (Math.random() * 4 - 2) : 0, // -2 to +2 degrees
  }));

  // Parallax intensity based on layer
  const intensityMap = { near: 18, mid: 10, far: 4 };
  const intensity = intensityMap[chip.layer] || 10;

  // Spring physics for mouse follow
  const springX = useSpring(mouseX, heroAnimations.parallaxSpring);
  const springY = useSpring(mouseY, heroAnimations.parallaxSpring);

  const parallaxX = useTransform(springX, (v) => isReducedMotion ? 0 : v * intensity);
  const parallaxY = useTransform(springY, (v) => isReducedMotion ? 0 : v * intensity);

  return (
    <motion.div
      style={{
        position: "absolute",
        top: chip.top,
        left: chip.left,
        x: parallaxX,
        y: parallaxY,
      }}
      initial={heroAnimations.chipEntrance.initial}
      animate={heroAnimations.chipEntrance.animate}
      transition={{ delay: floatConfig.delay, duration: 0.6, ease: "easeOut" }}
      className="hidden md:block z-20"
    >
      <motion.div
        animate={
          isReducedMotion
            ? {}
            : {
                y: ["-12px", "12px", "-12px"],
                rotate: [0, floatConfig.rotation, 0],
              }
        }
        transition={
          isReducedMotion
            ? {}
            : {
                duration: floatConfig.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <div
          className={`
            group relative cursor-default whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
            hover:-translate-y-[10px] hover:scale-[1.05] hover:bg-[#F9FAFB] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)]
            ${
              chip.isAccent
                ? "border-[#E1251B]/30 bg-[#E1251B] text-white hover:border-[#E1251B]/50 hover:text-[#111827]"
                : "border-[#E5E7EB] bg-[#FFFFFF] text-[#111827] hover:border-[#E1251B]/30"
            }
          `}
        >
          {chip.isAccent && (
            <motion.div
              animate={isReducedMotion ? {} : { opacity: [0.6, 1, 0.6] }}
              transition={isReducedMotion ? {} : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(225,37,27,0.3)] pointer-events-none"
            />
          )}
          {chip.text}
        </div>
      </motion.div>
    </motion.div>
  );
}

function FloatingChips() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (isReducedMotion || window.innerWidth < 768) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize between -1 and 1
      const x = (clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isReducedMotion]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-auto overflow-hidden">
      {/* 
        Mobile View (4-5 static chips) 
      */}
      <div className="md:hidden flex flex-wrap justify-center gap-3 pt-32 px-5 opacity-60">
        {SKILL_CHIPS.slice(0, 5).map((chip, i) => (
          <span
            key={i}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              chip.isAccent
                ? "border-[#E1251B]/30 bg-[#E1251B] text-white"
                : "border-[#E5E7EB] bg-[#FFFFFF] text-[#111827]"
            }`}
          >
            {chip.text}
          </span>
        ))}
      </div>

      {/* Desktop Floating Parallax Chips */}
      {SKILL_CHIPS.map((chip, i) => (
        <FloatingChip
          key={i}
          chip={chip}
          mouseX={mousePos.x}
          mouseY={mousePos.y}
          isReducedMotion={isReducedMotion}
        />
      ))}
    </div>
  );
}

export default FloatingChips;
