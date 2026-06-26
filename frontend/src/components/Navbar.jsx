import {
  LayoutDashboard,
  Users,
  Shield,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useTeamWorkspace } from "../hooks/useTeamWorkspace";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/team-builder", label: "Team Builder", icon: Users },
  { to: "/analytics", label: "Analytics", icon: LayoutDashboard },
  { to: "/admin", label: "Admin", icon: Shield },
];

function Navbar() {
  const { analytics } = useTeamWorkspace();

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-lg">
        <NavLink to="/" className="flex min-w-fit items-center gap-3">
          <span>
            <span className="block text-lg font-bold tracking-tight text-gray-900">
              find<span className="text-[#E1251B]">mates</span>
            </span>
            <span className="hidden text-xs text-gray-400 md:block">AI student team formation</span>
          </span>
        </NavLink>

        <nav className="flex flex-1 justify-start gap-2 overflow-x-auto md:justify-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `group relative flex min-w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition sm:px-4 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-xl bg-gray-900"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={17} />
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden min-w-fit rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 lg:block">
          <span className="text-[#E1251B] font-semibold">{analytics.averageChemistry || 0}%</span> chemistry
        </div>
      </div>
    </header>
  );
}

export default Navbar;
