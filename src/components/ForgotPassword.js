import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setStatus("Email is required");

    setLoading(true);
    try {
      await requestPasswordReset({ email }); // backend should send OTP to email
      setStatus("OTP sent to your email. Redirecting...");
      setTimeout(() => navigate("/reset-password"), 2000);
    } catch (err) {
      console.error(err);
      setStatus(err?.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email Address</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Reset Password"}
            </button>
          </div>
        </form>
        {status && <div style={{ marginTop: 10 }}>{status}</div>}
      </div>
    </div>
  );
}
