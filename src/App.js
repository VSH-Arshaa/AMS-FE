
import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";

import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import { ToastProvider } from "./components/ToastProvider";

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
function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbar = ["/login", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    try {
      if (window.api) delete window.api.defaults.headers.common["Authorization"];
    } catch (e) {}
    navigate("/login");
  };

  return (
    <>
      {!hideNavbar && (
        <nav
          style={{
            padding: 12,
            borderBottom: "1px solid #eee",
            marginBottom: 16,
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
          <div style={{ marginLeft: "auto" }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      )}
      <div style={{ padding: 12 }}>{children}</div>
    </>
  );
}

function UsersPage() {
  const [refresh, setRefresh] = useState(false);

  const handleUserAdded = () => setRefresh(!refresh);

  return (
    <div>
      <h2>Create User</h2>
      <UserForm onUserAdded={handleUserAdded} />
      <h2>All Users</h2>
      <UserList key={refresh} />
    </div>
  );
}
export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute allowedRoles={["ADMIN", "EMPLOYEE"]}>
                  <UsersPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/create"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <UserForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/:id/edit"
              element={
                <PrivateRoute allowedRoles={["ADMIN"]}>
                  <UserForm />
                </PrivateRoute>
              }
            />

            {/* Fallback 404 */}
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
    </ToastProvider>
  );
}
