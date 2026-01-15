import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGate from "./components/RoleGate";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import RoleSelect from "./pages/RoleSelect";
import Dashboard from "./pages/Dashboard";
// import other pages...

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* everything below requires login */}
      <Route element={<ProtectedRoute />}>
        <Route path="/role-selection" element={<RoleSelect />} />

        {/* everything below also requires role */}
        <Route element={<RoleGate />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<div>Library Page</div>} />
          <Route path="/labs" element={<div>Labs Page</div>} />
          {/* add more pages here */}
        </Route>
      </Route>

      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
