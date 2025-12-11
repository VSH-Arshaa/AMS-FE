import React, { useState } from "react";
import RoleLoginForm from "./RoleLoginForm";

export default function RoleLogin() {
  const [selectedRole, setSelectedRole] = useState("Employee");

  const roles = [
    { key: "Admin", label: "Admin Login" },
    { key: "HR", label: "HR Login" },
    { key: "Manager", label: "Manager Login" },
    { key: "Employee", label: "Employee Login" }
  ];

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h4 style={styles.sidebarTitle}>Sign in as</h4>
        {roles.map((r) => (
          <div
            key={r.key}
            onClick={() => setSelectedRole(r.key)}
            style={{
              ...styles.roleItem,
              ...(selectedRole === r.key ? styles.roleItemActive : {})
            }}
          >
            <div style={styles.iconBox}></div>
            <div>{r.label}</div>
          </div>
        ))}
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <h2 style={{ margin: 0 }}>WELCOME TO ARSHAA EMPLOYEE LEAVE MANAGEMENT SYSTEM</h2>
        </div>

        <div style={styles.formWrap}>
          <RoleLoginForm role={selectedRole} />
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f5f5f5"
  },
  sidebar: {
    width: 220,
    background: "#fff",
    borderRight: "1px solid #e6e6e6",
    padding: 20,
    boxSizing: "border-box"
  },
  sidebarTitle: {
    marginBottom: 12,
    fontSize: 14,
    color: "#666"
  },
  roleItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 8,
    color: "#333"
  },
  iconBox: {
    width: 28,
    height: 28,
    background: "#efefef",
    borderRadius: 6
  },
  roleItemActive: {
    background: "#00897b",
    color: "#fff",
    fontWeight: 600
  },
  main: {
    flex: 1,
    padding: 40,
    boxSizing: "border-box"
  },
  header: {
    marginBottom: 30
  },
  formWrap: {
    maxWidth: 620,
    marginTop: 10
  }
};
