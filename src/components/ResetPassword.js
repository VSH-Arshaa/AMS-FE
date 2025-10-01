import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return setStatus("OTP is required");
    if (!password || password.length < 8)
      return setStatus("Password must be at least 8 characters");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return setStatus("Password must include a special character");
    if (password !== confirmPassword)
      return setStatus("Passwords do not match");

    setLoading(true);
    try {
      await resetPassword({ otp, newPassword: password });
      setStatus("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      setStatus(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>OTP</label><br />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>
          <div>
            <label>New Password</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label>Confirm Password</label><br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <div>
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
        {status && <div style={{ marginTop: 10 }}>{status}</div>}
      </div>
    </div>
  );
}
