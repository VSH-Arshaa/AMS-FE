
import React, { useState } from "react";
import { useToast } from "./ToastProvider";
import api from "../services/api"; 

export default function UserForm({ onUserAdded }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
    phone: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast(); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.show("Please upload a file", "error");

    setLoading(true);
    const formData = new FormData();
    formData.append("data", JSON.stringify(form));
    formData.append("file", file);

    try {
      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.show("User registered successfully!", "success");
      setForm({ name: "", email: "", employeeId: "", password: "", phone: "" });
      setFile(null);
      if (onUserAdded) onUserAdded();
    } catch (err) {
      console.error(err);
      toast.show("Failed to register user", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input type="text" name="employeeId" placeholder="Employee ID" value={form.employeeId} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
      <input type="file" onChange={handleFileChange} required />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register User"}
      </button>
    </form>
  );
}
