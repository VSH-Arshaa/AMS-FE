
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, api } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = "Employee ID / Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const res = await login({ email, password });
      const payload = (res && res.data && res.data.data) ? res.data.data : (res && res.data) ? res.data : {};
      const token = payload.token || payload.accessToken || null;
      const userId = payload.userId || payload.id || payload.user?.id || null;
      const roles = payload.roles || payload.role || null;

      const roleName = Array.isArray(roles) && roles.length > 0
        ? (roles[0].roleName || roles[0].name || "EMPLOYEE")
        : (roles && typeof roles === "string" ? roles : "EMPLOYEE");

      if (!token) {
        throw new Error("No token returned from server");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", roleName);
      if (userId) localStorage.setItem("userId", userId);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);


      let msg = "Login failed";
      if (err?.response) {
        msg = err.response.data?.message
            || err.response.data?.error
            || JSON.stringify(err.response.data)
            || `Server responded with status ${err.response.status}`;
      } else if (err?.request) {
        msg = "No response from server. Possible network/CORS issue.";
      } else if (err?.message) {
        msg = err.message;
      }

      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Employee Login</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label>Email</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. harshitha.v@gmail.com"
            />
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <div>
            <label>Password</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          {errors.submit && (
            <div style={{ marginTop: 8 }}>
              <small className="error">{errors.submit}</small>
            </div>
          )}
        </form>

        <div style={{ marginTop: 12 }}>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
