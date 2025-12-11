import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function RoleLoginForm({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const redirectByRole = (roleName) => {
    const r = (roleName || "").toUpperCase();
    if (r.includes("ADMIN")) return "/admin";
    if (r.includes("HR")) return "/hr";
    if (r.includes("MANAGER")) return "/manager";
    return "/dashboard";
  };

  const normalize = (v) => (v || "").toString().trim().toUpperCase();

  const extractRoles = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((r) => {
          if (!r) return "";
          if (typeof r === "string") return r.toUpperCase();
          return (r.name || r.roleName || r.role || "").toString().toUpperCase();
        })
        .filter(Boolean);
    }
    if (typeof raw === "string") return [raw.toUpperCase()];
    return [(raw.name || raw.roleName || raw.role || "").toString().toUpperCase()].filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });

      const payload = (res && res.data && res.data.data) ? res.data.data : (res && res.data) ? res.data : {};

      const token = payload.token || payload.accessToken || null;
      const userId = payload.userId || payload.id || payload.user?.id || null;
      const serverRoles = extractRoles(payload.roles || payload.role || payload.user?.roles);

      const selectedRoleNormalized = normalize(role); 

      if (!serverRoles || serverRoles.length === 0) {
        setErrors({ submit: "Login succeeded but server did not return role information. Contact administrator." });
        setLoading(false);
        return;
      }

      const hasRole = selectedRoleNormalized ? serverRoles.includes(selectedRoleNormalized) : false;

      if (!hasRole) {
        setErrors({ submit: `Your account is not assigned the "${role}" role.` });
        setLoading(false);
        return;
      }

      if (!token) {
        setErrors({ submit: "No token returned from server." });
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", serverRoles[0] || selectedRoleNormalized);
      if (userId) localStorage.setItem("userId", userId);

      try {
        const api = require("../services/api").default;
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (ex) {
      }
      const roleName = serverRoles[0] || selectedRoleNormalized;
      navigate(redirectByRole(roleName));
    } catch (err) {
      let msg = "Login failed";
      if (err?.response) {
        msg =
          err.response.data?.message ||
          err.response.data?.error ||
          JSON.stringify(err.response.data) ||
          `Server responded with status ${err.response.status}`;
      } else if (err?.request) {
        msg = "No response from server";
      } else if (err?.message) {
        msg = err.message;
      }
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={{ marginBottom: 14 }}>{role} Login</h3>

      <form onSubmit={handleSubmit} noValidate>
        <div style={styles.field}>
          <label style={styles.label}>Email id</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email id"
          />
          {errors.email && <small style={styles.error}>{errors.email}</small>}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {errors.password && <small style={styles.error}>{errors.password}</small>}
        </div>

        <div style={styles.actions}>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </div>

        {errors.submit && <div style={{ marginTop: 8 }}><small style={styles.error}>{errors.submit}</small></div>}
      </form>
    </div>
  );
}

const styles = {
  card: {
    padding: 24,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    borderRadius: 4
  },
  field: { marginBottom: 14 },
  label: { display: "block", fontSize: 13, marginBottom: 6, color: "#666" },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 3,
    border: "1px solid #ddd",
    boxSizing: "border-box"
  },
  actions: { textAlign: "right" },
  button: {
    background: "#00897b",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer"
  },
  error: { color: "#b00020" }
};
