export const formatAmount = (value) => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^\d.]/g, '');
  if (numericValue === '' || isNaN(numericValue)) return '';
  return parseFloat(numericValue).toString();
};

export const formatCurrency = (amount) => {
  return amount?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// constants/ledgers.js
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

export const SAMPLE_LEDGERS = [
  // Assets
  { code: '3059', name: 'Cash' },
  ...BANK_LEDGERS,
  { code: '1501', name: 'Land' },
  { code: '1502', name: 'Buildings' },
  { code: '1503', name: 'Plant & Machinery' },
  { code: '1504', name: 'Furniture & Fixtures' },
  // Income
  { code: '1001', name: 'Property Tax' },
  { code: '1002', name: 'Water Charges' },
  { code: '1003', name: 'Profession Tax' },
  { code: '1004', name: 'Market Development Revenue' },
  { code: '1005', name: 'SWM User Charges' },
  { code: '1006', name: 'UGD User Charges' },
  { code: '1051', name: 'Government Grants' },
  { code: '1052', name: 'Central Grants' },
  { code: '1053', name: 'State Grants' },
  // Expenses
  { code: '2001', name: 'Salary' },
  { code: '2002', name: 'Office Expenses' },
  { code: '2003', name: 'Maintenance Expenses' },
  { code: '2004', name: 'Electricity Charges' },
  { code: '2005', name: 'Telephone Charges' },
  { code: '2006', name: 'Water Charges' },
  { code: '2051', name: 'Depreciation' },
  { code: '2052', name: 'Bad Debts' },
  // Advances & Deposits
  { code: '4001', name: 'Advance to Contractors' },
  { code: '4002', name: 'Advance to Suppliers' },
  { code: '5001', name: 'Security Deposits' },
  { code: '5002', name: 'Tender Deposits' }
];