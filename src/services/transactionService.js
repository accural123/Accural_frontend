import apiClient from './apiClient';

export const transactionService = {
  // Get all transactions
  getAll: async (params = {}) => {
    return await apiClient.get('/transactions', params);
  },

  // Get transaction by ID
  getById: async (id) => {
    return await apiClient.get(`/transactions/${id}`);
  },

  // --- Bank Receipts ---
  getBankReceipts: async (params = {}) => {
    return await apiClient.get('/bank-receipts', params);
  },
  getBankReceiptById: async (id) => {
    return await apiClient.get(`/bank-receipts/${id}`);
  },
  createBankReceipt: async (receiptData) => {
    return await apiClient.post('/bank-receipts', receiptData);
  },
  updateBankReceipt: async (id, receiptData) => {
    return await apiClient.put(`/bank-receipts/${id}`, receiptData);
  },
  deleteBankReceipt: async (id) => {
    return await apiClient.delete(`/bank-receipts/${id}`);
  },

  // --- Bank Payments ---
  getBankPayments: async (params = {}) => {
    return await apiClient.get('/bank-payments', params);
  },
  getBankPaymentById: async (id) => {
    return await apiClient.get(`/bank-payments/${id}`);
  },
  createBankPayment: async (paymentData) => {
    return await apiClient.post('/bank-payments', paymentData);
  },
  updateBankPayment: async (id, paymentData) => {
    return await apiClient.put(`/bank-payments/${id}`, paymentData);
  },
  deleteBankPayment: async (id) => {
    return await apiClient.delete(`/bank-payments/${id}`);
  },

  // --- Journal Vouchers ---
  getJournalVouchers: async (params = {}) => {
    return await apiClient.get('/journal-vouchers', params);
  },
  getJournalVoucherById: async (id) => {
    return await apiClient.get(`/journal-vouchers/${id}`);
  },
  createJournalVoucher: async (journalData) => {
    return await apiClient.post('/journal-vouchers', journalData);
  },
  updateJournalVoucher: async (id, journalData) => {
    return await apiClient.put(`/journal-vouchers/${id}`, journalData);
  },
  deleteJournalVoucher: async (id) => {
    return await apiClient.delete(`/journal-vouchers/${id}`);
  },

  // --- Inter-Bank Transfers ---
  getInterBankTransfers: async (params = {}) => {
    return await apiClient.get('/inter-bank-transfers', params);
  },
  getInterBankTransferById: async (id) => {
    return await apiClient.get(`/inter-bank-transfers/${id}`);
  },
  createInterBankTransfer: async (transferData) => {
    return await apiClient.post('/inter-bank-transfers', transferData);
  },
  updateInterBankTransfer: async (id, transferData) => {
    return await apiClient.put(`/inter-bank-transfers/${id}`, transferData);
  },
  deleteInterBankTransfer: async (id) => {
    return await apiClient.delete(`/inter-bank-transfers/${id}`);
  }
};
