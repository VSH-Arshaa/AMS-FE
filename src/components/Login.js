import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function validatePasswordRules(pw) {
  const minLen = pw.length >= 8;
  const special = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
  return { minLen, special };
}

export default function Login() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    const newErrors = {};
    if (!employeeId.trim()) newErrors.employeeId = "Employee ID is required";
    if (!password) newErrors.password = "Password is required";
    const rules = validatePasswordRules(password);
    if (!rules.minLen) newErrors.password = "Password must be at least 8 characters";
    if (!rules.special) newErrors.password = "Password must contain at least one special character";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    try {
      const res = await login({ employeeId, password });
      // expected response: { token: "...", role: "ADMIN" }
      localStorage.setItem("token", res.data.token || "");
      localStorage.setItem("role", res.data.role || "EMPLOYEE");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.response?.data || err.message || "Login failed";
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
            <label>Employee ID</label><br />
            <input value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="e.g. EMP1001" />
            {errors.employeeId && <small className="error">{errors.employeeId}</small>}
          </div>

          <div>
            <label>Password</label><br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>

          <div>
            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </div>

          {errors.submit && <div style={{ marginTop: 8 }}><small className="error">{errors.submit}</small></div>}
        </form>

        <div style={{ marginTop: 12 }}>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
