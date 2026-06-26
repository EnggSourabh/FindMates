import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { heroAnimations } from "./heroAnimations.config";

function HeroContent() {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="relative z-30 flex flex-col items-center text-center px-5 sm:px-8 pointer-events-none mt-20 md:mt-0">
      
      {/* Animated Heading (Spring) */}
      <motion.h1
        initial={isReducedMotion ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : heroAnimations.headingSpring.initial}
        animate={heroAnimations.headingSpring.animate}
        transition={isReducedMotion ? { duration: 0 } : heroAnimations.headingSpring.transition}
        className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[#111827] md:text-6xl lg:text-7xl"
        style={{ transformPerspective: 1000 }}
      >
        Find Your Perfect Team with <span className="text-[#E1251B]">AI</span>
      </motion.h1>

      {/* Animated Subtitle (Fade Up) */}
      <motion.p
        initial={isReducedMotion ? { opacity: 1, y: 0 } : heroAnimations.subtitle.initial}
        animate={heroAnimations.subtitle.animate}
        transition={isReducedMotion ? { duration: 0 } : heroAnimations.subtitle.transition}
        className="mt-6 max-w-2xl text-base leading-relaxed text-[#6B7280] sm:text-lg"
      >
        Upload resumes, extract skills automatically, and let our intelligence engine form
        perfectly balanced hackathon teams based on capabilities and chemistry.
      </motion.p>

      {/* Animated CTA Buttons */}
      <motion.div
        initial={isReducedMotion ? { opacity: 1, y: 0, scale: 1 } : heroAnimations.cta.initial}
        animate={heroAnimations.cta.animate}
        transition={isReducedMotion ? { duration: 0 } : heroAnimations.cta.transition}
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center pointer-events-auto"
      >
        {/* Primary CTA */}
        <Link
          to="/team-builder"
          className="group relative flex items-center justify-center rounded-full bg-[#111827] px-8 py-3 text-base font-bold text-white transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#E1251B] hover:shadow-[0_0_20px_rgba(225,37,27,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B] focus-visible:ring-offset-2"
        >
          Start Building Teams
        </Link>

        {/* Secondary CTA */}
        <a
          href="#features"
          className="flex items-center justify-center rounded-full border border-[#E5E7EB] bg-[#FFFFFF] px-8 py-3 text-base font-bold text-[#111827] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B] focus-visible:ring-offset-2"
        >
          Learn More
        </a>
      </motion.div>
    </div>
  );
}

export default HeroContent;
