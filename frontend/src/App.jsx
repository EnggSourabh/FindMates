import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import TeamBuilder from "./pages/TeamBuilder";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route path="/analytics" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/teams" element={<Navigate to="/team-builder" replace />} />
          <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
