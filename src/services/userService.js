import api from "./api";

export const getUsers = (params = {}, options = {}) => {
  return api.get("/api/users", { params, ...options });
};

export const getUserById = (id, options = {}) => api.get(`/api/users/${id}`, options);
export const createUser = (userData, options = {}) => api.post("/api/users", userData, options);
export const updateUser = (id, userData, options = {}) => api.put(`/api/users/${id}`, userData, options);
export const deleteUser = (id, options = {}) => api.delete(`/api/users/${id}`, options);

export default { getUsers, getUserById, createUser, updateUser, deleteUser };
