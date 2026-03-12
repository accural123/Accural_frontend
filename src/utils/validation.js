export const validateVoucherForm = (formData, debitEntries, creditEntries, requiredFields = []) => {
  const errors = [];

  // Check required form fields
  requiredFields.forEach(field => {
    if (!formData[field] || !formData[field].toString().trim()) {
      errors.push(`${field} is required`);
    }
  });

  // Validate entries
  if (debitEntries.some(entry => !entry.ledgerCode || !entry.amount)) {
    errors.push('Please fill all debit entries');
  }

  if (creditEntries.some(entry => !entry.ledgerCode || !entry.amount)) {
    errors.push('Please fill all credit entries');
  }

  return errors;
};