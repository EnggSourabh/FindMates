import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FloatingCards from "./FloatingCards";

function Hero() {
  const heading = "Find Your Perfect Team with AI";
  const words = heading.split(" ");

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center pt-20">
      <FloatingCards />

      <div className="relative z-10 flex flex-col items-center text-center px-5 sm:px-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm pointer-events-auto"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E1251B] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#E1251B]"></span>
          </span>
          AI-Powered Collaboration Platform
        </motion.div>

        <h1 className="max-w-5xl text-5xl font-extrabold leading-[1.1] tracking-tight text-gray-900 md:text-7xl lg:text-8xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.7, type: "spring", bounce: 0.2 }}
              className="inline-block mr-3 lg:mr-5 last:mr-0"
            >
              {word === "AI" ? (
                <span className="text-[#E1251B]">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl"
        >
          Upload resumes, extract skills automatically, and let our intelligence engine form
          perfectly balanced hackathon teams based on capabilities and chemistry.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center pointer-events-auto"
        >
          <Link
            to="/team-builder"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg"
          >
            Start Building Teams
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-8 py-4 font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
