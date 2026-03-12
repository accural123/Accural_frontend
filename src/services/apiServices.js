import apiClient from './apiClient';

// ============================================================================
// INSTITUTION SERVICE
// ============================================================================
export const institutionService = {
  getAll: async (params = {}) => {
    return apiClient.get('/institutions', params);
  },

  getById: async (id) => {
    return apiClient.get(`/institutions/${id}`);
  },

  create: async (institutionData) => {
    return apiClient.post('/institutions', institutionData);
  },

  update: async (id, institutionData) => {
    return apiClient.put(`/institutions/${id}`, institutionData);
  },

  delete: async (id) => {
    return apiClient.delete(`/institutions/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/institutions/search', { q: searchTerm, ...filters });
  }
};

// ============================================================================
// LEDGER SERVICE
// ============================================================================
export const ledgerService = {
  getAll: async (params = {}) => {
    return apiClient.get('/ledgers', params);
  },

  getById: async (id) => {
    return apiClient.get(`/ledgers/${id}`);
  },

  create: async (ledgerData) => {
    return apiClient.post('/ledgers', ledgerData);
  },

  update: async (id, ledgerData) => {
    return apiClient.put(`/ledgers/${id}`, ledgerData);
  },

  delete: async (id) => {
    return apiClient.delete(`/ledgers/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/ledgers/search', { q: searchTerm, ...filters });
  }
};

// ============================================================================
// GROUP SERVICE
// ============================================================================
export const groupService = {
  getAll: async (params = {}) => {
    return apiClient.get('/groups', params);
  },

  getById: async (id) => {
    return apiClient.get(`/groups/${id}`);
  },

  create: async (groupData) => {
    return apiClient.post('/groups', groupData);
  },

  update: async (id, groupData) => {
    return apiClient.put(`/groups/${id}`, groupData);
  },

  delete: async (id) => {
    return apiClient.delete(`/groups/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/groups/search', { q: searchTerm, ...filters });
  },

  getByMainGroup: async (mainGroup) => {
    return apiClient.get('/groups/by-main-group', { mainGroup });
  },

  getMainGroupsSummary: async () => {
    return apiClient.get('/groups/main-groups-summary');
  },

  bulkDelete: async (ids) => {
    return apiClient.post('/groups/bulk-delete', { ids });
  },

  validateGroupName: async (groupName, underMainGroup, excludeId = null) => {
    return apiClient.get('/groups/validate-name', { groupName, underMainGroup, excludeId });
  }
};

// ============================================================================
// FUND SERVICE
// ============================================================================
export const fundService = {
  getAll: async (params = {}) => {
    return apiClient.get('/funds', params);
  },

  getById: async (id) => {
    return apiClient.get(`/funds/${id}`);
  },

  create: async (fundData) => {
    return apiClient.post('/funds', fundData);
  },

  update: async (id, fundData) => {
    return apiClient.put(`/funds/${id}`, fundData);
  },

  delete: async (id) => {
    return apiClient.delete(`/funds/${id}`);
  }
};

// ============================================================================
// VOUCHER TYPE SERVICE
// ============================================================================
export const voucherTypeService = {
  getAll: async (params = {}) => {
    return apiClient.get('/voucher-types', params);
  },

  getById: async (id) => {
    return apiClient.get(`/voucher-types/${id}`);
  },

  create: async (voucherData) => {
    return apiClient.post('/voucher-types', voucherData);
  },

  update: async (id, voucherData) => {
    return apiClient.put(`/voucher-types/${id}`, voucherData);
  },

  delete: async (id) => {
    return apiClient.delete(`/voucher-types/${id}`);
  },

  search: async (searchTerm) => {
    return apiClient.get('/voucher-types/search', { q: searchTerm });
  }
};

// ============================================================================
// OPENING BALANCE SERVICE
// ============================================================================
export const openingBalanceService = {
  getAll: async (params = {}) => {
    return apiClient.get('/opening-balances', params);
  },

  getById: async (id) => {
    return apiClient.get(`/opening-balances/${id}`);
  },

  create: async (openingBalanceData) => {
    return apiClient.post('/opening-balances', openingBalanceData);
  },

  update: async (id, openingBalanceData) => {
    return apiClient.put(`/opening-balances/${id}`, openingBalanceData);
  },

  delete: async (id) => {
    return apiClient.delete(`/opening-balances/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/opening-balances/search', { q: searchTerm, ...filters });
  },

  getSummary: async () => {
    return apiClient.get('/opening-balances/summary');
  }
};

// ============================================================================
// ACCOUNT SERVICE
// ============================================================================
export const accountService = {
  getAll: async (params = {}) => {
    return apiClient.get('/accounts', params);
  },

  getById: async (id) => {
    return apiClient.get(`/accounts/${id}`);
  },

  getByCode: async (code) => {
    return apiClient.get(`/accounts/by-code/${code}`);
  },

  create: async (accountData) => {
    return apiClient.post('/accounts', accountData);
  },

  update: async (id, accountData) => {
    return apiClient.put(`/accounts/${id}`, accountData);
  },

  delete: async (id) => {
    return apiClient.delete(`/accounts/${id}`);
  },

  search: async (searchTerm) => {
    return apiClient.get('/accounts/search', { q: searchTerm });
  },

  getByGroup: async (groupName) => {
    return apiClient.get('/accounts/by-group', { groupName });
  },

  getByType: async (accountType) => {
    return apiClient.get('/accounts/by-type', { accountType });
  },

  validateCode: async (code, excludeId = null) => {
    return apiClient.get('/accounts/validate-code', { code, excludeId });
  }
};

// ============================================================================
// TRANSACTION SERVICE
// ============================================================================
export const transactionService = {
  getAll: async (params = {}) => {
    return apiClient.get('/transactions', params);
  },

  getById: async (id) => {
    return apiClient.get(`/transactions/${id}`);
  },

  create: async (transactionData) => {
    return apiClient.post('/transactions', transactionData);
  },

  update: async (id, transactionData) => {
    return apiClient.put(`/transactions/${id}`, transactionData);
  },

  delete: async (id) => {
    return apiClient.delete(`/transactions/${id}`);
  },

  getByAccountCode: async (accountCode) => {
    return apiClient.get('/transactions/by-account', { accountCode });
  },

  search: async (searchTerm) => {
    return apiClient.get('/transactions/search', { q: searchTerm });
  }
};

// ============================================================================
// REPORT SERVICE
// ============================================================================
export const reportService = {
  getTrialBalance: async (params = {}) => {
    return apiClient.get('/reports/trial-balance', params);
  },

  getBalanceSheet: async (params = {}) => {
    return apiClient.get('/reports/balance-sheet', params);
  },

  getIncomeStatement: async (params = {}) => {
    return apiClient.get('/reports/income-statement', params);
  },

  getCashFlow: async (params = {}) => {
    return apiClient.get('/reports/cash-flow', params);
  },

  getAccountLedger: async (accountCode, params = {}) => {
    return apiClient.get(`/reports/account-ledger/${accountCode}`, params);
  }
};

// ============================================================================
// AUDIT TRAIL SERVICE
// ============================================================================
export const auditTrailService = {
  getAll: async (params = {}) => {
    return apiClient.get('/audit-trail', params);
  },

  log: async (auditData) => {
    return apiClient.post('/audit-trail', auditData);
  },

  search: async (searchTerm) => {
    return apiClient.get('/audit-trail/search', { q: searchTerm });
  },

  getStats: async () => {
    return apiClient.get('/audit-trail/stats');
  }
};

// ============================================================================
// AUTO GJV SERVICE
// ============================================================================
export const autoGjvService = {
  getAll: async (params = {}) => {
    return apiClient.get('/auto-gjv', params);
  },

  getById: async (id) => {
    return apiClient.get(`/auto-gjv/${id}`);
  },

  create: async (configData) => {
    return apiClient.post('/auto-gjv', configData);
  },

  update: async (id, configData) => {
    return apiClient.put(`/auto-gjv/${id}`, configData);
  },

  delete: async (id) => {
    return apiClient.delete(`/auto-gjv/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/auto-gjv/search', { q: searchTerm, ...filters });
  },

  executeAutoGJV: async (configId) => {
    return apiClient.post(`/auto-gjv/${configId}/execute`);
  },

  toggleStatus: async (id) => {
    return apiClient.post(`/auto-gjv/${id}/toggle-status`);
  },

  getExecutionHistory: async (configId) => {
    return apiClient.get(`/auto-gjv/${configId}/execution-history`);
  },

  getDashboardStats: async () => {
    return apiClient.get('/auto-gjv/dashboard-stats');
  }
};

// ============================================================================
// ADVANCE & DEPOSIT SERVICE
// ============================================================================
export const advanceDepositService = {
  getAll: async (params = {}) => {
    return apiClient.get('/advance-deposits', params);
  },

  getById: async (id) => {
    return apiClient.get(`/advance-deposits/${id}`);
  },

  create: async (recordData) => {
    return apiClient.post('/advance-deposits', recordData);
  },

  update: async (id, recordData) => {
    return apiClient.put(`/advance-deposits/${id}`, recordData);
  },

  delete: async (id) => {
    return apiClient.delete(`/advance-deposits/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/advance-deposits/search', { q: searchTerm, ...filters });
  },

  getSummary: async (params = {}) => {
    return apiClient.get('/advance-deposits/summary', params);
  },

  getByFinancialYear: async (financialYear) => {
    return apiClient.get('/advance-deposits/by-financial-year', { financialYear });
  },

  toggleStatus: async (id) => {
    return apiClient.post(`/advance-deposits/${id}/toggle-status`);
  },

  bulkDelete: async (ids) => {
    return apiClient.post('/advance-deposits/bulk-delete', { ids });
  },

  exportData: async (params = {}) => {
    return apiClient.get('/advance-deposits/export', params);
  }
};

// ============================================================================
// MDR SERVICE
// ============================================================================
export const mdrService = {
  getAll: async (params = {}) => {
    return apiClient.get('/mdr', params);
  },

  getById: async (id) => {
    return apiClient.get(`/mdr/${id}`);
  },

  create: async (recordData) => {
    return apiClient.post('/mdr', recordData);
  },

  update: async (id, recordData) => {
    return apiClient.put(`/mdr/${id}`, recordData);
  },

  delete: async (id) => {
    return apiClient.delete(`/mdr/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/mdr/search', { q: searchTerm, ...filters });
  },

  getSummary: async (params = {}) => {
    return apiClient.get('/mdr/summary', params);
  },

  getByFinancialYear: async (financialYear) => {
    return apiClient.get('/mdr/by-financial-year', { financialYear });
  },

  getUpcomingRenewals: async (days = 90) => {
    return apiClient.get('/mdr/upcoming-renewals', { days });
  },

  toggleStatus: async (id) => {
    return apiClient.post(`/mdr/${id}/toggle-status`);
  },

  getRevenueProjections: async (params = {}) => {
    return apiClient.get('/mdr/revenue-projections', params);
  },

  exportData: async (params = {}) => {
    return apiClient.get('/mdr/export', params);
  }
};

// ============================================================================
// PAYABLE SERVICE
// ============================================================================
export const payableService = {
  getAll: async (params = {}) => {
    return apiClient.get('/payables', params);
  },

  getById: async (id) => {
    return apiClient.get(`/payables/${id}`);
  },

  create: async (recordData) => {
    return apiClient.post('/payables', recordData);
  },

  update: async (id, recordData) => {
    return apiClient.put(`/payables/${id}`, recordData);
  },

  delete: async (id) => {
    return apiClient.delete(`/payables/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/payables/search', { q: searchTerm, ...filters });
  },

  updateStatus: async (id, newStatus) => {
    return apiClient.post(`/payables/${id}/update-status`, { status: newStatus });
  },

  getSummary: async (params = {}) => {
    return apiClient.get('/payables/summary', params);
  },

  getOverduePayables: async () => {
    return apiClient.get('/payables/overdue');
  },

  bulkUpdateStatus: async (ids, newStatus) => {
    return apiClient.post('/payables/bulk-update-status', { ids, status: newStatus });
  },

  exportData: async (params = {}) => {
    return apiClient.get('/payables/export', params);
  }
};

// ============================================================================
// PAYABLE ANALYTICS SERVICE
// ============================================================================
export const payableAnalyticsService = {
  getDashboardMetrics: async () => {
    return apiClient.get('/payables/analytics/dashboard');
  },

  getComplianceReport: async (params = {}) => {
    return apiClient.get('/payables/analytics/compliance', params);
  }
};

// ============================================================================
// YEARWISE BALANCE SERVICE
// ============================================================================
export const yearwiseBalanceService = {
  getAll: async (params = {}) => {
    return apiClient.get('/yearwise-balance', params);
  },

  getById: async (id) => {
    return apiClient.get(`/yearwise-balance/${id}`);
  },

  create: async (recordData) => {
    return apiClient.post('/yearwise-balance', recordData);
  },

  update: async (id, recordData) => {
    return apiClient.put(`/yearwise-balance/${id}`, recordData);
  },

  delete: async (id) => {
    return apiClient.delete(`/yearwise-balance/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/yearwise-balance/search', { q: searchTerm, ...filters });
  },

  getAnalytics: async (params = {}) => {
    return apiClient.get('/yearwise-balance/analytics', params);
  },

  getCollectionTrends: async (params = {}) => {
    return apiClient.get('/yearwise-balance/collection-trends', params);
  },

  getOutstandingBalances: async (params = {}) => {
    return apiClient.get('/yearwise-balance/outstanding-balances', params);
  },

  exportData: async (params = {}) => {
    return apiClient.get('/yearwise-balance/export', params);
  }
};

// ============================================================================
// DAILY COLLECTION SERVICE
// ============================================================================
export const dailyCollectionService = {
  getAll: async (params = {}) => {
    return apiClient.get('/daily-collections', params);
  },

  getById: async (id) => {
    return apiClient.get(`/daily-collections/${id}`);
  },

  create: async (collectionData) => {
    return apiClient.post('/daily-collections', collectionData);
  },

  update: async (id, collectionData) => {
    return apiClient.put(`/daily-collections/${id}`, collectionData);
  },

  delete: async (id) => {
    return apiClient.delete(`/daily-collections/${id}`);
  },

  search: async (searchTerm, filters = {}) => {
    return apiClient.get('/daily-collections/search', { q: searchTerm, ...filters });
  },

  getStats: async () => {
    return apiClient.get('/daily-collections/stats');
  },

  getByDateRange: async (startDate, endDate) => {
    return apiClient.get('/daily-collections/by-date-range', { startDate, endDate });
  },

  getByMonth: async (month, year) => {
    return apiClient.get('/daily-collections/by-month', { month, year });
  },

  getSummary: async (date) => {
    return apiClient.get('/daily-collections/summary', { date });
  },

  validateEntries: async (entries) => {
    return apiClient.post('/daily-collections/validate-entries', { entries });
  },

  getLedgerCodes: async () => {
    return apiClient.get('/daily-collections/ledger-codes');
  },

  getReport: async (reportType, params = {}) => {
    return apiClient.get('/daily-collections/report', { reportType, ...params });
  }
};

// ============================================================================
// INVESTMENT SERVICE
// ============================================================================
export const investmentService = {
  getAll: async (params = {}) => {
    return apiClient.get('/investments', params);
  },

  getById: async (id) => {
    return apiClient.get(`/investments/${id}`);
  },

  create: async (investmentData) => {
    return apiClient.post('/investments', investmentData);
  },

  update: async (id, investmentData) => {
    return apiClient.put(`/investments/${id}`, investmentData);
  },

  delete: async (id) => {
    return apiClient.delete(`/investments/${id}`);
  },

  search: async (searchTerm) => {
    return apiClient.get('/investments/search', { q: searchTerm });
  },

  getByStatus: async (status) => {
    return apiClient.get('/investments/by-status', { status });
  },

  getByFinancialYear: async (year) => {
    return apiClient.get('/investments/by-financial-year', { year });
  },

  getStatistics: async () => {
    return apiClient.get('/investments/statistics');
  }
};

// ============================================================================
// LOAN SERVICE
// ============================================================================
export const loanService = {
  getAll: async (params = {}) => {
    return apiClient.get('/loans', params);
  },

  getById: async (id) => {
    return apiClient.get(`/loans/${id}`);
  },

  create: async (loanData) => {
    return apiClient.post('/loans', loanData);
  },

  update: async (id, loanData) => {
    return apiClient.put(`/loans/${id}`, loanData);
  },

  delete: async (id) => {
    return apiClient.delete(`/loans/${id}`);
  },

  search: async (searchTerm) => {
    return apiClient.get('/loans/search', { q: searchTerm });
  },

  getByStatus: async (status) => {
    return apiClient.get('/loans/by-status', { status });
  },

  getByType: async (type) => {
    return apiClient.get('/loans/by-type', { type });
  },

  getStatistics: async () => {
    return apiClient.get('/loans/statistics');
  }
};

// ============================================================================
// SFC GRANT SERVICE
// ============================================================================
export const sfcGrantService = {
  getAll: async (params = {}) => {
    return apiClient.get('/sfc-grants', params);
  },

  getById: async (id) => {
    return apiClient.get(`/sfc-grants/${id}`);
  },

  create: async (grantData) => {
    return apiClient.post('/sfc-grants', grantData);
  },

  update: async (id, grantData) => {
    return apiClient.put(`/sfc-grants/${id}`, grantData);
  },

  delete: async (id) => {
    return apiClient.delete(`/sfc-grants/${id}`);
  },

  search: async (searchTerm) => {
    return apiClient.get('/sfc-grants/search', { q: searchTerm });
  },

  getByFinancialYear: async (year) => {
    return apiClient.get('/sfc-grants/by-financial-year', { year });
  },

  getByFundType: async (fundType) => {
    return apiClient.get('/sfc-grants/by-fund-type', { fundType });
  },

  getByVoucherType: async (voucherType) => {
    return apiClient.get('/sfc-grants/by-voucher-type', { voucherType });
  },

  getStatistics: async () => {
    return apiClient.get('/sfc-grants/statistics');
  },

  getByDateRange: async (startDate, endDate) => {
    return apiClient.get('/sfc-grants/by-date-range', { startDate, endDate });
  },

  getMonthlySummary: async (year) => {
    return apiClient.get('/sfc-grants/monthly-summary', { year });
  },

  bulkUpdate: async (ids, updateData) => {
    return apiClient.post('/sfc-grants/bulk-update', { ids, updateData });
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Function to handle file uploads
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  const response = await fetch(`${apiClient.baseURL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    },
    body: formData
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Upload failed');
  }
  
  return {
    success: true,
    data: data.data || data,
    message: data.message || 'Upload successful'
  };
};

// Function to download files
export const downloadFile = async (endpoint, filename) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${apiClient.baseURL}${endpoint}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Export all services
export default {
  institutionService,
  ledgerService,
  groupService,
  fundService,
  voucherTypeService,
  openingBalanceService,
  accountService,
  transactionService,
  reportService,
  auditTrailService,
  autoGjvService,
  advanceDepositService,
  mdrService,
  payableService,
  payableAnalyticsService,
  yearwiseBalanceService,
  dailyCollectionService,
  investmentService,
  loanService,
  sfcGrantService,
  uploadFile,
  downloadFile
};