import { motion } from "framer-motion";
import { heroAnimations } from "./heroAnimations.config";

function HeroBackground() {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: heroAnimations.sequence.bgFadeInDuration }}
      className="absolute inset-0 z-0 overflow-hidden bg-[#F9FAFB] pointer-events-none"
    >
      {/* Base White overlay (optional, since bg is F9FAFB) */}
      <div className="absolute inset-0 bg-[#FFFFFF] opacity-50" />

      {/* Main Red Radial */}
      <motion.div
        animate={
          isReducedMotion
            ? { x: "-50%", y: "-50%" }
            : {
                x: ["-50%", "calc(-50% - 20px)", "calc(-50% + 20px)", "-50%"],
                y: ["-50%", "calc(-50% + 10px)", "calc(-50% - 10px)", "-50%"],
              }
        }
        transition={
          isReducedMotion
            ? {}
            : { duration: 10, repeat: Infinity, ease: "linear" }
        }
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] rounded-full bg-[rgba(225,37,27,0.04)] blur-[120px]"
      />

      {/* Secondary Violet Radial */}
      <motion.div
        animate={
          isReducedMotion
            ? {}
            : {
                x: [0, 15, -15, 0],
                y: [0, -15, 15, 0],
              }
        }
        transition={
          isReducedMotion
            ? {}
            : { duration: 12, repeat: Infinity, ease: "linear" }
        }
        className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[rgba(124,58,237,0.03)] blur-[100px]"
      />
    </motion.div>
  );
}

export default HeroBackground;
