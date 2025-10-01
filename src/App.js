import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";

/**
 * Simple route guard: checks if token exists in localStorage.
 * For production use verify token validity and expiration.
 */
function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && allowedRoles.length && !allowedRoles.includes(role)) {
    return (
      <div className="container">
        <h3>Access denied</h3>
        <p>Your role: {role}</p>
      </div>
    );
  }
  return children;
}

// Layout wrapper to conditionally render Navbar
function Layout({ children }) {
  const location = useLocation();

  // Hide navbar on login, forgot password, and reset password
  const hideNavbar = ["/login", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && (
        <nav>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      )}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard accessible to all authenticated users */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="container">
                <h3>404 - Not Found</h3>
              </div>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
