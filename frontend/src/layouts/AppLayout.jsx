import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomeNavbar from "../components/home/HomeNavbar";
import AmbientBackground from "../components/backgrounds/AmbientBackground";

function AppLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-gray-900">
      {!isHome && <AmbientBackground />}
      {isHome ? <HomeNavbar /> : <Navbar />}
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
