import React from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Dashboard from "@/pages/Dashboard.jsx";
import RoleSelection from "@/pages/RoleSelect.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import ForgotPassword from "@/pages/ForgotPassword.jsx";

// your existing pages
import Layout from "@/pages/Layout.jsx";
import LibraryStatus from "@/pages/LibraryStatus.jsx";
import FindLabs from "@/pages/FindLabs.jsx";
import RoomRequests from "@/pages/RoomRequests.jsx";
import ReportFault from "@/pages/ReportFault.jsx";
import Reports from "@/pages/Reports.jsx";
import FaultManagement from "@/pages/FaultManagement.jsx";
import ManagerRequests from "@/pages/ManagerRequests.jsx";
import RequestApprovals from "@/pages/RequestApprovals.jsx";
import OccupancyOverview from "@/pages/OccupancyOverview.jsx";
import UserManagement from "@/pages/UserManagement.jsx";

import { useAuth } from "@/state/AuthContext.jsx";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireRole({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.role) return <Navigate to="/role-selection" replace />;
  return children;
}

function LayoutWrapper() {
  const location = useLocation();
  const getPageName = (pathname) => {
    const pageMap = {
      '/dashboard': 'Dashboard',
      '/library-status': 'LibraryStatus',
      '/find-labs': 'FindLabs',
      '/room-requests': 'RoomRequests',
      '/report-fault': 'ReportFault',
      '/reports': 'Reports',
      '/fault-management': 'FaultManagement',
      '/manager-requests': 'ManagerRequests',
      '/request-approvals': 'RequestApprovals',
      '/occupancy-overview': 'OccupancyOverview',
      '/user-management': 'UserManagement',
    };
    return pageMap[pathname] || 'Dashboard';
  };

  return <Layout currentPageName={getPageName(location.pathname)}><Outlet /></Layout>;
}

export default function Pages() {
  return (
    <Routes>
      {/* Default: go login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Needs login only */}
      <Route
        path="/role-selection"
        element={
          <RequireAuth>
            <RoleSelection />
          </RequireAuth>
        }
      />

      {/* Needs login + role */}
      <Route element={<RequireRole><LayoutWrapper /></RequireRole>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library-status" element={<LibraryStatus />} />
        <Route path="/find-labs" element={<FindLabs />} />
        <Route path="/room-requests" element={<RoomRequests />} />
        <Route path="/report-fault" element={<ReportFault />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/fault-management" element={<FaultManagement />} />
        <Route path="/manager-requests" element={<ManagerRequests />} />
        <Route path="/request-approvals" element={<RequestApprovals />} />
        <Route path="/occupancy-overview" element={<OccupancyOverview />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
