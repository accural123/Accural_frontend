import apiClient from './apiClient';

export const reportService = {
  // Trial Balance - GET /reports/trial-balance
  trialBalance: async (params = {}) => {
    return await apiClient.get('/reports/trial-balance', params);
  },

  // Alias kept for backward compat with existing pages
  detailedTrialBalance: async (params = {}) => {
    return await apiClient.get('/reports/trial-balance', params);
  },

  // Balance Sheet - GET /reports/balance-sheet
  balanceSheet: async (params = {}) => {
    return await apiClient.get('/reports/balance-sheet', params);
  },

  // Income & Expenditure Statement - GET /reports/income-statement
  incomeStatement: async (params = {}) => {
    return await apiClient.get('/reports/income-statement', params);
  },

  // Alias for existing pages
  receiptAndExpenditure: async (startDate, endDate) => {
    return await apiClient.get('/reports/income-statement', {
      start_date: startDate,
      end_date: endDate
    });
  },

  // Ledger Statement - GET /reports/ledger-statement
  ledgerStatement: async (params = {}) => {
    return await apiClient.get('/reports/ledger-statement', params);
  },

  // Cash Book - GET /reports/cash-book
  cashBook: async (params = {}) => {
    return await apiClient.get('/reports/cash-book', params);
  },

  // Bank Book - GET /reports/bank-book
  bankBook: async (params = {}) => {
    return await apiClient.get('/reports/bank-book', params);
  },

  // Monthly Summary - GET /reports/monthly-summary
  monthlyAbstract: async (month, year) => {
    return await apiClient.get('/reports/monthly-summary', { month, year });
  },

  // Yearwise Reports - GET /reports/yearwise-summary
  yearwiseSummary: async (params = {}) => {
    return await apiClient.get('/reports/yearwise-summary', params);
  }
};