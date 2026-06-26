import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#timeline" },
  { label: "Analytics", href: "#analytics" },
  { label: "Contact", href: "#contact" },
];

function RollingNavItem({ text }) {
  return (
    <span className="rolling-nav-item h-5">
      <span className="rolling-text-original">{text}</span>
      <span className="rolling-text-duplicate" aria-hidden="true">{text}</span>
    </span>
  );
}

function HomeNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white/80 py-3 shadow-sm backdrop-blur-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B] focus-visible:ring-offset-2 rounded-sm">
          <span className="text-xl font-extrabold tracking-tight text-[#111827]">
            find<span className="text-[#E1251B]">mates</span>
          </span>
        </Link>

        {/* Center: Rolling Nav Capsule */}
        <nav 
          className="hidden items-center md:flex" 
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            border: "1px solid #E5E7EB",
            borderRadius: "30px",
            backdropFilter: "blur(10px)",
            padding: "4px"
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rolling-nav-link flex items-center justify-center px-5 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B] focus-visible:ring-inset rounded-full"
            >
              <RollingNavItem text={link.label} />
            </a>
          ))}
        </nav>

        {/* Right: Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/analytics"
            className="flex h-[40px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-5 text-sm font-medium text-[#111827] transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B] focus-visible:ring-offset-2"
          >
            Log In
          </Link>
          <Link
            to="/team-builder"
            className="flex h-[40px] items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-medium text-white transition-all duration-300 hover:bg-[#1f2937] hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B] focus-visible:ring-offset-2"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden p-2 outline-none focus-visible:ring-2 focus-visible:ring-[#E1251B]"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-[#111827] transition-transform duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#111827] transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-[#111827] transition-transform duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-gray-100 bg-white px-6 py-4 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm font-medium text-[#111827] hover:text-[#E1251B] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/team-builder"
            className="mt-3 block w-full rounded-full bg-[#111827] py-3 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-[#1f2937]"
          >
            Sign Up
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}

export default HomeNavbar;
