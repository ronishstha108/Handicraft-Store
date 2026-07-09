import apiClient from '../api/client';

export const userService = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUser: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
