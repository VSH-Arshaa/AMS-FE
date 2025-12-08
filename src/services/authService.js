import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});
export { api };

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const requestPasswordReset = (data) => {
  return axios.post("http://localhost:7001/api/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return axios.post("http://localhost:7001/api/auth/reset-password", data);
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;