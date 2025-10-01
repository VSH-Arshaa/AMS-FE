import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const role = localStorage.getItem("role") || "EMPLOYEE";

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome! Your role: <strong>{role}</strong></p>

        <div style={{ marginTop: 12 }}>
          {/* Quick links to role panels */}
          <Link to="/admin">Admin Panel</Link> |{" "}
          <Link to="/hr">HR Panel</Link> |{" "}
          <Link to="/manager">Manager Panel</Link> |{" "}
          <Link to="/employee">Employee Panel</Link>
        </div>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("role"); window.location.href = "/login"; }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
