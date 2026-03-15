/**
 * realServices.js
 * Drop-in replacement for mockServices.js — exports the same service names
 * but calls the real backend instead of localStorage.
 *
 * Pages only need to change their import path:
 *   from "../../services/mockServices"  →  from "../../services/realServices"
 */

import apiClient from './apiClient';

// ─── Re-export everything from apiServices (richer implementations) ───────────
export {
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
  downloadFile,
} from './apiServices';

// ─── Aliases ──────────────────────────────────────────────────────────────────
// voucherService  →  voucherTypeService  (same thing, different name in pages)
export { voucherTypeService as voucherService } from './apiServices';

// ─── Services not in apiServices ─────────────────────────────────────────────
export { reconciliationService } from './reconciliationService';
export { employeeService }       from './employeeService';

// ─── Fund Allocation (separate resource) ─────────────────────────────────────
export const fundAllocationService = {
  getAll:  (params) => apiClient.get('/fund-allocations', params),
  create:  (data)   => apiClient.post('/fund-allocations', data),
  update:  (id, data) => apiClient.put(`/fund-allocations/${id}`, data),
  delete:  (id)     => apiClient.delete(`/fund-allocations/${id}`),
};
