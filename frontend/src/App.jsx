import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Suspense, lazy } from "react";

import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import TeamBuilder from "./pages/TeamBuilder";
import Admin from "./pages/Admin";

const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/analytics" element={
            <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading Analytics...</div>}>
              <Dashboard />
            </Suspense>
          } />
          <Route path="/admin" element={<Admin />} />
          <Route path="/teams" element={<Navigate to="/team-builder" replace />} />
          <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
