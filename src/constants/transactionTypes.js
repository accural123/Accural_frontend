// Bank ledgers for inter-bank transfers
export const BANK_LEDGERS = [
  { code: '3060', name: 'State Bank of India - Current A/c' },
  { code: '3061', name: 'Canara Bank - Savings A/c' },
  { code: '3062', name: 'Union Bank of India - Current A/c' },
  { code: '3063', name: 'HDFC Bank - Current A/c' },
  { code: '3064', name: 'ICICI Bank - Savings A/c' },
  { code: '3065', name: 'Axis Bank - Current A/c' },
  { code: '3066', name: 'Punjab National Bank - Savings A/c' },
  { code: '3067', name: 'Bank of Baroda - Current A/c' },
  { code: '3068', name: 'Indian Bank - Savings A/c' },
  { code: '3069', name: 'Central Bank of India - Current A/c' }
];

// Complete ledger list for all voucher types
export const SAMPLE_LEDGERS = [
  // Cash and Bank Accounts
  { code: '3059', name: 'Cash' },
  ...BANK_LEDGERS,

  // Fixed Assets
  { code: '1501', name: 'Land' },
  { code: '1502', name: 'Buildings' },
  { code: '1503', name: 'Plant & Machinery' },
  { code: '1504', name: 'Furniture & Fixtures' },
  { code: '1505', name: 'Vehicles' },
  { code: '1506', name: 'Computer & Equipment' },
  { code: '1507', name: 'Office Equipment' },

  // Income/Revenue Accounts
  { code: '1001', name: 'Property Tax' },
  { code: '1002', name: 'Water Charges' },
  { code: '1003', name: 'Profession Tax' },
  { code: '1004', name: 'Market Development Revenue' },
  { code: '1005', name: 'SWM User Charges' },
  { code: '1006', name: 'UGD User Charges' },
  { code: '1007', name: 'Trade License Fee' },
  { code: '1008', name: 'Building Plan Approval Fee' },
  { code: '1009', name: 'Birth & Death Certificate Fee' },
  { code: '1010', name: 'Marriage Certificate Fee' },

  // Government Grants
  { code: '1051', name: 'Government Grants' },
  { code: '1052', name: 'Central Grants' },
  { code: '1053', name: 'State Grants' },
  { code: '1054', name: 'Finance Commission Grants' },
  { code: '1055', name: 'Assigned Revenue' },

  // Expense Accounts
  { code: '2001', name: 'Salary' },
  { code: '2002', name: 'Office Expenses' },
  { code: '2003', name: 'Maintenance Expenses' },
  { code: '2004', name: 'Electricity Charges' },
  { code: '2005', name: 'Telephone Charges' },
  { code: '2006', name: 'Water Charges' },
  { code: '2007', name: 'Fuel Expenses' },
  { code: '2008', name: 'Stationery' },
  { code: '2009', name: 'Printing & Publication' },
  { code: '2010', name: 'Legal Expenses' },
  { code: '2011', name: 'Audit Fees' },
  { code: '2012', name: 'Insurance' },
  { code: '2013', name: 'Repair & Maintenance' },
  { code: '2014', name: 'Transportation' },
  { code: '2015', name: 'Training & Development' },

  // Administrative Expenses
  { code: '2051', name: 'Depreciation' },
  { code: '2052', name: 'Bad Debts' },
  { code: '2053', name: 'Bank Charges' },
  { code: '2054', name: 'Interest on Loans' },
  { code: '2055', name: 'Professional Charges' },

  // Advances & Deposits
  { code: '4001', name: 'Advance to Contractors' },
  { code: '4002', name: 'Advance to Suppliers' },
  { code: '4003', name: 'Advance to Employees' },
  { code: '4004', name: 'Festival Advance' },

  // Security Deposits
  { code: '5001', name: 'Security Deposits' },
  { code: '5002', name: 'Tender Deposits' },
  { code: '5003', name: 'Performance Guarantee' },
  { code: '5004', name: 'EMD Deposits' },

  // Loans & Borrowings
  { code: '6001', name: 'Term Loans' },
  { code: '6002', name: 'Working Capital Loans' },
  { code: '6003', name: 'Government Loans' },

  // Creditors & Payables
  { code: '7001', name: 'Sundry Creditors' },
  { code: '7002', name: 'Salary Payable' },
  { code: '7003', name: 'Statutory Dues Payable' },
  { code: '7004', name: 'Contractor Payable' },

  // Debtors & Receivables
  { code: '8001', name: 'Sundry Debtors' },
  { code: '8002', name: 'Property Tax Receivable' },
  { code: '8003', name: 'Water Charges Receivable' },
  { code: '8004', name: 'Other Receivables' }
];

// ===== src/constants/transactionTypes.js =====
/**
 * Transaction types and modes for different voucher forms
 */

// Transaction modes for Inter Bank Transfer
export const INTER_BANK_MODES = [
  { 
    value: 'NEFT', 
    label: 'NEFT', 
    description: 'National Electronic Funds Transfer'
  },
  { 
    value: 'RTGS', 
    label: 'RTGS', 
    description: 'Real Time Gross Settlement'
  },
  { 
    value: 'IMPS', 
    label: 'IMPS', 
    description: 'Immediate Payment Service'
  },
  { 
    value: 'UPI', 
    label: 'UPI', 
    description: 'Unified Payments Interface'
  },
  { 
    value: 'Cheque / DD', 
    label: 'Cheque / DD', 
    description: 'Cheque or Demand Draft'
  }
];

// Transaction modes for Bank Receipt
export const BANK_RECEIPT_MODES = [
  { value: 'Cash', label: 'Cash', description: 'Cash Receipt' },
  { value: 'Cheque / DD', label: 'Cheque / DD', description: 'Cheque or Demand Draft' },
  { value: 'Online', label: 'Online', description: 'Online Transfer' },
  { value: 'ECS', label: 'ECS', description: 'Electronic Clearing Service' }
];

// Transaction modes for Bank Payment
export const BANK_PAYMENT_MODES = [
  { value: 'Cash', label: 'Cash', description: 'Cash Payment' },
  { value: 'Cheque / DD', label: 'Cheque / DD', description: 'Cheque or Demand Draft' },
  { value: 'NEFT', label: 'NEFT', description: 'National Electronic Funds Transfer' },
  { value: 'RTGS', label: 'RTGS', description: 'Real Time Gross Settlement' },
  { value: 'IMPS', label: 'IMPS', description: 'Immediate Payment Service' },
  { value: 'UPI', label: 'UPI', description: 'Unified Payments Interface' }
];

// Journal voucher types with styling
export const JOURNAL_TYPES = [
  { 
    value: 'EJV', 
    label: 'EJV', 
    description: 'Expense Journal Voucher',
    icon: 'DollarSign',
    color: 'from-red-500 to-rose-500',
    bgColor: 'from-red-50 to-rose-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-700'
  },
  { 
    value: 'PJV', 
    label: 'PJV', 
    description: 'Purchase Journal Voucher',
    icon: 'Receipt',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-700'
  },
  { 
    value: 'CJV', 
    label: 'CJV', 
    description: 'Contra Journal Voucher',
    icon: 'ArrowUpDown',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-700'
  },
  { 
    value: 'FAJV', 
    label: 'FAJV', 
    description: 'Fixed Asset Journal Voucher',
    icon: 'Building',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-700'
  },
  { 
    value: 'GJV', 
    label: 'GJV', 
    description: 'General Journal Voucher',
    icon: 'Clipboard',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-700'
  }
];

// BRV Types
export const BRV_TYPES = [
  { value: 'BRV', label: 'BRV', description: 'Bank Receipt Voucher' },
  { value: 'ADBRV', label: 'ADBRV', description: 'Advance Bank Receipt Voucher' }
];
