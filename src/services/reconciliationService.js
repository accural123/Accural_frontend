import apiClient from './apiClient';

export const reconciliationService = {
  // Get reconciliation data
  getAll: async (params = {}) => {
    return await apiClient.get('/bank-reconciliation', params);
  },

  // Add reconciliation
  add: async (reconciliationData) => {
    return await apiClient.post('/bank-reconciliation', reconciliationData);
  },

  // Add previous reconciliation
  addPrevious: async (reconciliationData) => {
    return await apiClient.post('/bank-reconciliation/previous', reconciliationData);
  },

  // Update reconciliation
  update: async (id, reconciliationData) => {
    return await apiClient.put(`/bank-reconciliation/${id}`, reconciliationData);
  },

  // Delete reconciliation
  delete: async (id) => {
    return await apiClient.delete(`/bank-reconciliation/${id}`);
  },

  // Get reconciliation by bank
  getByBank: async (bankCode, month) => {
    return await apiClient.get(`/bank-reconciliation/bank/${bankCode}`, { month });
  }
};