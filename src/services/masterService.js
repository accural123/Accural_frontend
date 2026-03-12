import apiClient from './apiClient';

export const masterService = {
  // Opening Balance - /opening-balances
  getOpeningBalance: async (params = {}) => {
    return await apiClient.get('/opening-balances', params);
  },
  getOpeningBalanceSummary: async (financial_year) => {
    return await apiClient.get('/opening-balances/summary', { financial_year });
  },
  setOpeningBalance: async (balanceData) => {
    return await apiClient.post('/opening-balances', balanceData);
  },
  updateOpeningBalance: async (id, balanceData) => {
    return await apiClient.put(`/opening-balances/${id}`, balanceData);
  },
  deleteOpeningBalance: async (id) => {
    return await apiClient.delete(`/opening-balances/${id}`);
  },

  // Auto GJV - /auto-gjv
  getAutoGJV: async (params = {}) => {
    return await apiClient.get('/auto-gjv', params);
  },
  createAutoGJV: async (gjvData) => {
    return await apiClient.post('/auto-gjv', gjvData);
  },

  // Advance Deposits - /advance-deposits
  getAdvanceDeposits: async (params = {}) => {
    return await apiClient.get('/advance-deposits', params);
  },
  addAdvanceDeposit: async (data) => {
    return await apiClient.post('/advance-deposits', data);
  },
  updateAdvanceDeposit: async (id, data) => {
    return await apiClient.put(`/advance-deposits/${id}`, data);
  },
  deleteAdvanceDeposit: async (id) => {
    return await apiClient.delete(`/advance-deposits/${id}`);
  },

  // MDR Details - /mdr
  getMDRDetails: async (params = {}) => {
    return await apiClient.get('/mdr', params);
  },
  addMDRDetails: async (mdrData) => {
    return await apiClient.post('/mdr', mdrData);
  },
  updateMDRDetails: async (id, mdrData) => {
    return await apiClient.put(`/mdr/${id}`, mdrData);
  },
  deleteMDRDetails: async (id) => {
    return await apiClient.delete(`/mdr/${id}`);
  },

  // Payable Details - /payables
  getPayableDetails: async (params = {}) => {
    return await apiClient.get('/payables', params);
  },
  addPayableDetails: async (payableData) => {
    return await apiClient.post('/payables', payableData);
  },
  updatePayableDetails: async (id, payableData) => {
    return await apiClient.put(`/payables/${id}`, payableData);
  },
  deletePayableDetails: async (id) => {
    return await apiClient.delete(`/payables/${id}`);
  },

  // Yearwise Balance - /yearwise-balance
  getYearwiseBalance: async (params = {}) => {
    return await apiClient.get('/yearwise-balance', params);
  },
  setYearwiseBalance: async (balanceData) => {
    return await apiClient.post('/yearwise-balance', balanceData);
  },
  updateYearwiseBalance: async (id, balanceData) => {
    return await apiClient.put(`/yearwise-balance/${id}`, balanceData);
  },
  deleteYearwiseBalance: async (id) => {
    return await apiClient.delete(`/yearwise-balance/${id}`);
  }
};
