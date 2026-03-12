
export const DEFAULT_FORM_VALUES = {
  INTER_BANK_TRANSFER: {
    ibtNo: '',
    ibtDate: new Date().toISOString().split('T')[0],
    modeOfTransaction: 'NEFT',
    chequeNo: '',
    chequeDate: '',
    narration: ''
  },
  JOURNAL_VOUCHER: {
    natureOfTransaction: 'EJV',
    journalNo: '',
    journalDate: new Date().toISOString().split('T')[0],
    nameOfScheme: '',
    nameOfWork: '',
    estimateValue: '',
    narration: ''
  },
  BANK_RECEIPT: {
    brvType: '',
    brvNo: '',
    brvDate: new Date().toISOString().split('T')[0],
    fromWhom: '',
    narration: '',
    dateOfRealization: '',
    natureOfTransaction: 'Cash'
  },
  BANK_PAYMENT: {
    bpvNo: '',
    bpvDate: new Date().toISOString().split('T')[0],
    inFavourOf: '',
    narration: '',
    dateOfEncashment: '',
    modeOfTransaction: 'Cash',
    chequeNo: '',
    chequeDate: ''
  },
  DAILY_COLLECTION: {
    collectionDate: new Date().toISOString().split('T')[0],
    fromWhom: '',
    narration: ''
  }
};

export const DEFAULT_ENTRY = {
  ledgerCode: '',
  ledgerName: '',
  amount: ''
};

export const DEFAULT_CREDIT_ENTRY = {
  ...DEFAULT_ENTRY,
  challanNo: ''
};

// ===== src/constants/index.js =====
/**
 * Main barrel export for all constants
 */

// Ledger exports
export { BANK_LEDGERS, SAMPLE_LEDGERS } from './ledgers';

// Transaction type exports
export {
  INTER_BANK_MODES,
  BANK_RECEIPT_MODES,
  BANK_PAYMENT_MODES,
  JOURNAL_TYPES,
  BRV_TYPES
} from './transactionTypes';

// Theme exports
export { VOUCHER_THEMES } from './themes';

// Form defaults exports
export {
  DEFAULT_FORM_VALUES,
  DEFAULT_ENTRY,
  DEFAULT_CREDIT_ENTRY
} from './formDefaults';

// Combined transaction modes for easy access
export const TRANSACTION_MODES = {
  INTER_BANK: INTER_BANK_MODES,
  BANK_RECEIPT: BANK_RECEIPT_MODES,
  BANK_PAYMENT: BANK_PAYMENT_MODES
};

// Common validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_AMOUNT: 'Please enter a valid amount',
  INCOMPLETE_ENTRIES: 'Please fill all entries completely',
  UNBALANCED_ENTRIES: 'Debit and credit totals do not match'
};

// Storage keys for localStorage
export const STORAGE_KEYS = {
  INTER_BANK_TRANSFERS: 'interBankTransfers',
  JOURNAL_VOUCHERS: 'journalVouchers',
  BANK_RECEIPTS: 'bankReceiptVouchers',
  BANK_PAYMENTS: 'bankPaymentVouchers',
  DAILY_COLLECTIONS: 'dailyCollections'
};

// Voucher prefixes for auto-generated numbers
export const VOUCHER_PREFIXES = {
  INTER_BANK_TRANSFER: 'IBT',
  JOURNAL_VOUCHER: 'JV',
  BANK_RECEIPT: 'BRV',
  BANK_PAYMENT: 'BPV',
  DAILY_COLLECTION: 'MR'
};