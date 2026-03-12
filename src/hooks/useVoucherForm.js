import { useState } from 'react';

export const useVoucherForm = (initialFormData, initialDebitEntries, initialCreditEntries) => {
  const [formData, setFormData] = useState(initialFormData);
  const [debitEntries, setDebitEntries] = useState(initialDebitEntries);
  const [creditEntries, setCreditEntries] = useState(initialCreditEntries);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (entries, setEntries, sampleLedgers) => (id, field, value) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        
        // Auto-fill Ledger Head when code is selected
        if (field === 'ledgerCode') {
          const selectedLedger = sampleLedgers.find(ledger => ledger.code === value);
          updated.ledgerName = selectedLedger ? selectedLedger.name : '';
        }
        
        // Handle decimal amount input
        if (field === 'amount') {
          updated.amount = value;
        }
        
        return updated;
      }
      return entry;
    }));
  };

  const addEntry = (entries, setEntries, entryTemplate) => () => {
    setEntries(prev => [...prev, { 
      id: Date.now(), 
      ...entryTemplate
    }]);
  };

  const removeEntry = (entries, setEntries) => (id) => {
    if (entries.length > 1) {
      setEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const calculateTotal = (entries) => {
    return entries.reduce((sum, entry) => {
      const amount = parseFloat(entry.amount || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const resetForm = (initialForm, initialDebit, initialCredit) => {
    setFormData(initialForm);
    setDebitEntries(initialDebit);
    setCreditEntries(initialCredit);
    setEditingId(null);
  };

  return {
    formData,
    setFormData,
    debitEntries,
    setDebitEntries,
    creditEntries,
    setCreditEntries,
    editingId,
    setEditingId,
    handleChange,
    handleEntryChange,
    addEntry,
    removeEntry,
    calculateTotal,
    resetForm
  };
};