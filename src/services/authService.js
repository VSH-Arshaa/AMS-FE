import axios from "axios";

export const login = (data) => {
  return axios.post("/api/auth/login", data);
};

export const requestPasswordReset = (data) => {
  return axios.post("/api/auth/forgot-password", data);
};

export const resetPassword = (data) => {
  return axios.post("/api/auth/reset-password", data);
};
