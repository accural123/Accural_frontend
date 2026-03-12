import apiClient from './apiClient';


export const createVoucherService = (endpoint) => ({
  getAll: async (params = {}) => {
    return apiClient.get(endpoint, params);
  },

  create: async (data) => {
    return apiClient.post(endpoint, data);
  },

  update: async (id, data) => {
    return apiClient.put(`${endpoint}/${id}`, data);
  },

  delete: async (id) => {
    return apiClient.delete(`${endpoint}/${id}`);
  },
});
