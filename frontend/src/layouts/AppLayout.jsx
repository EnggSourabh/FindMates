import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AmbientBackground from "../components/backgrounds/AmbientBackground";

function AppLayout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-100">
      <AmbientBackground />
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
