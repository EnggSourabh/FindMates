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
    <header className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-0 z-50 sm:z-40 px-3 pb-3 pt-0 sm:pb-0 sm:pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-4 rounded-2xl border border-gray-200 bg-white/90 sm:bg-white/80 px-2 sm:px-4 py-2 sm:py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] sm:shadow-sm backdrop-blur-lg">
        <NavLink to="/" className="hidden sm:flex min-w-fit items-center gap-3">
          <span>
            <span className="block text-lg font-bold tracking-tight text-gray-900">
              find<span className="text-[#E1251B]">mates</span>
            </span>
            <span className="hidden text-xs text-gray-400 md:block">AI student team formation</span>
          </span>
        </NavLink>

        <nav className="flex flex-1 justify-around sm:justify-start sm:gap-2 w-full sm:w-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `group relative flex flex-col sm:flex-row flex-1 sm:flex-none items-center justify-center gap-1 sm:gap-2 rounded-xl px-1 sm:px-4 py-2 text-[10px] sm:text-sm font-medium transition ${
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
                    <span className="relative flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                      <Icon className="w-[18px] h-[18px] sm:w-[17px] sm:h-[17px]" />
                      <span>{item.label}</span>
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
