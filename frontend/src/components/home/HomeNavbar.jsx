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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            find<span className="text-[#E1251B]">mates</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/analytics"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:shadow-sm"
          >
            Log In
          </Link>
          <Link
            to="/team-builder"
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-md"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-gray-900 transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-gray-900 transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-gray-900 transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
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
              className="block py-3 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/team-builder"
            className="mt-3 block w-full rounded-lg bg-gray-900 py-3 text-center text-sm font-medium text-white"
          >
            Sign Up
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}

export default HomeNavbar;
