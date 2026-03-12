import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Calendar, FileText, DollarSign, Banknote, User, Wallet, Building, Plus, Trash2, Check, Edit3, CheckCircle, AlertCircle, Filter, X, ChevronDown, ChevronUp, Search, TrendingUp } from 'lucide-react';

// Import hooks
import { useToast } from '../../hooks/useToast';
import { useApiService } from '../../hooks/useApiService';
import { useVoucherForm } from '../../hooks/useVoucherForm';
import { fundService, accountService } from '../../services/apiServices';
import { useAuth } from '../../context/AuthContext';

// Import components
import { ToastContainer } from '../../components/common/ToastContainer';
import { FormField } from '../../components/common/FormField';
import { BalanceStatus } from '../../components/common/BalanceStatus';
import { Header } from '../../components/common/Header';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { SubmitButton } from '../../components/common/SubmitButton';
import { EmptyState } from '../../components/common/EmptyState';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import SearchableRecords from '../../components/common/SearchableRecords';
import WorkDetails from '../../components/common/WorkDetails';
import EmployeeDetails from '../../components/common/EmployeeDetails';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
// Import special form components
import DoubtfulCollectionForm from './DoubtfulCollectionForm';
import PriorYearIncomeForm from './PriorYearIncomeForm';

// Import utilities
import { validateVoucherForm } from '../../utils/validation';
import { showConfirmDialog } from '../../utils/confirmDialog';
import { createVoucherService } from '../../services/createVoucherService';
import { ResetButton } from '../../components/common/ResetButton';
import MultipleEmployeeEntry from './employee/MultipleEmployeeEntry';
import EmployeeSelector from './employee/EmployeeSelector';
import { VoiceInputField } from '../../components/common/VoiceInputField';

const EMPLOYEE_LEDGERS = [
   { code: '1001', name: 'PF Ledger ' },
  { code: '1002', name: 'Info Ledger' },
];


const JournalVoucher = () => {
const getFilteredLedgerOptions = (entryType) => {
  return allLedgers.map(ledger => {
    const isUsedInSame = isLedgerAlreadyUsed(ledger.code, entryType);
    // Removed the opposite entry check to allow same ledger in debit and credit
    const isDisabled = isUsedInSame;
    
    return {
      value: ledger.code,
      label: `${ledger.code} - ${ledger.name}${isDisabled ? ' (Already Used)' : ''}`,
      description: `${ledger.category} | ${ledger.name}${isDisabled ? ' - Already selected in this entry type' : ''}`,
      disabled: isDisabled
    };
  });
}; 
//   const getFilteredLedgerOptions = (entryType) => {
//   return allLedgers.map(ledger => {
//     const isUsedInSame = isLedgerAlreadyUsed(ledger.code, entryType);
//     const isUsedInOpposite = isLedgerUsedInOppositeEntry(ledger.code, entryType);
//     const isDisabled = isUsedInSame || isUsedInOpposite;
    
//     return {
//       value: ledger.code,
//       label: `${ledger.code} - ${ledger.name}${isDisabled ? ' (Already Used)' : ''}`,
//       description: `${ledger.category} | ${ledger.name}${isDisabled ? ' - Already selected' : ''}`,
//       disabled: isDisabled
//     };
//   });
// };
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [currentDebitEntry, setCurrentDebitEntry] = useState({
    ledgerCode: '',
    ledgerName: '',
    amount: ''
  });
  const [currentCreditEntry, setCurrentCreditEntry] = useState({
    ledgerCode: '',
    ledgerName: '',
    amount: ''
  });
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [showSpecialForm, setShowSpecialForm] = useState(null);
  const [specialFormData, setSpecialFormData] = useState({});
  
  const initialFormData = {
    journalType: '',
    journalNo: '',
    journalDate: new Date().toISOString().split('T')[0],
    nameOfScheme: '',
    nameOfWork: '',
    estimateValue: '',
    description : '',
    fundType: '',
    nameOfContractor: '',
    nameOfSupplier: '',
    valueOfWorkDone: '',
    workAmount: '',
    nameOfEmployee: '',
    designation: '',
    section: '',
    monthYear: '',
    employeeAmount: ''
  };

  const initialDebitEntries = [];
  const initialCreditEntries = [];

  const {
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
  } = useVoucherForm(initialFormData, initialDebitEntries, initialCreditEntries);

  const [savedVouchers, setSavedVouchers] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableFunds, setAvailableFunds] = useState([]);
  const [allLedgers, setAllLedgers] = useState([]);
  const [showMultipleEmployees, setShowMultipleEmployees] = useState(false);
  const [employeeEntries, setEmployeeEntries] = useState([]);
  const [showWorkDetails, setShowWorkDetails] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [currentEmployeeEntry, setCurrentEmployeeEntry] = useState({
    nameOfEmployee: '',
    designation: '',
    section: '',
    monthYear: '',
    employeeAmount: ''
  });
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    status: '',
    nameOfScheme: '',
    nameOfWork: '',
    fundType: '',
    journalType: ''
  });

  const journalVoucherService = createVoucherService('/journal-vouchers');

  // Updated SPECIAL_LEDGER_CODES with entry type restrictions
  const SPECIAL_LEDGER_CODES = {
    '3061': { formType: 'doubtfulCollection', allowedEntryTypes: ['debit'] },
    '3059': { formType: 'doubtfulCollection', allowedEntryTypes: ['debit'] }, 
    '1088': { formType: 'priorYearIncome', allowedEntryTypes: ['credit'] },
    '1089': { formType: 'priorYearIncome', allowedEntryTypes: ['credit'] }
  };

  // Updated helper function to check if ledger requires special form for specific entry type
  const requiresSpecialForm = (ledgerCode, entryType) => {
    const specialLedger = SPECIAL_LEDGER_CODES[ledgerCode];
    return specialLedger && specialLedger.allowedEntryTypes.includes(entryType);
  };

  // Add these helper functions at the top of your component, after the state declarations

// const isLedgerAlreadyUsed = (ledgerCode, entryType) => {
//   if (entryType === 'debit') {
//     return debitEntries.some(entry => entry.ledgerCode === ledgerCode);
//   } else {
//     return creditEntries.some(entry => entry.ledgerCode === ledgerCode);
//   }
// };
const isLedgerAlreadyUsed = (ledgerCode, entryType) => {
  if (entryType === 'debit') {
    return debitEntries.some(entry => entry.ledgerCode === ledgerCode);
  } else {
    return creditEntries.some(entry => entry.ledgerCode === ledgerCode);
  }
};
const isLedgerUsedInOppositeEntry = (ledgerCode, entryType) => {
  if (entryType === 'debit') {
    return creditEntries.some(entry => entry.ledgerCode === ledgerCode);
  } else {
    return debitEntries.some(entry => entry.ledgerCode === ledgerCode);
  }
};

  // Updated handleSpecialFormOpen function
  const handleSpecialFormOpen = (ledgerCode, ledgerName, entryType) => {
    const specialLedger = SPECIAL_LEDGER_CODES[ledgerCode];
    if (specialLedger && specialLedger.allowedEntryTypes.includes(entryType)) {
      setShowSpecialForm({
        type: specialLedger.formType,
        ledgerCode,
        ledgerName,
        entryType,
        journalNo: formData.journalNo,
        journalDate: formData.journalDate
      });
    }
  };

  const handleSpecialFormSave = (data) => {
    const { type, total, ledgerCode, ledgerName } = data;
    
    setSpecialFormData(prev => ({
      ...prev,
      [ledgerCode]: data
    }));

    const entry = {
      id: Date.now(),
      ledgerCode,
      ledgerName,
      amount: total,
      hasDetailedForm: true,
      detailType: type
    };

    if (showSpecialForm.entryType === 'debit') {
      setCurrentDebitEntry(prev => ({
        ...prev,
        amount: total.toLocaleString('en-IN', { minimumFractionDigits: 2 })
      }));
      setDebitEntries(prev => [...prev, entry]);
    } else {
      setCurrentCreditEntry(prev => ({
        ...prev,
        amount: total.toLocaleString('en-IN', { minimumFractionDigits: 2 })
      }));
      setCreditEntries(prev => [...prev, entry]);
    }

    setShowSpecialForm(null);
    showToast('Detailed entry saved successfully', 'success');
  };

  const handleSpecialFormBack = () => {
    setShowSpecialForm(null);
    // Optionally reset the amount field if the user cancels the special form
    if (showSpecialForm.entryType === 'debit') {
      setCurrentDebitEntry(prev => ({ ...prev, amount: '' }));
    } else {
      setCurrentCreditEntry(prev => ({ ...prev, amount: '' }));
    }
  };

  // Updated handleViewSpecialForm function
  const handleViewSpecialForm = (entry, entryType) => {
    const specialLedger = SPECIAL_LEDGER_CODES[entry.ledgerCode];
    if (specialLedger && specialLedger.allowedEntryTypes.includes(entryType)) {
      setShowSpecialForm({
        type: specialLedger.formType,
        ledgerCode: entry.ledgerCode,
        ledgerName: entry.ledgerName,
        entryType,
        journalNo: formData.journalNo,
        journalDate: formData.journalDate,
        existingData: specialFormData[entry.ledgerCode] || {}
      });
    }
  };

  const journalTypes = [
    { value: 'EJV', label: 'EJV', description: 'Entry Journal Voucher (Employee)' },
    { value: 'PJV', label: 'PJV', description: 'Purchase Journal Voucher (Supplier)' },
    { value: 'CJV', label: 'CJV', description: 'Cash Journal Voucher (Contractor)' },
    { value: 'FAJV', label: 'FAJV', description: 'Fixed Asset Journal Voucher' },
    { value: 'GJV', label: 'GJV', description: 'General Journal Voucher' },
    { value: 'BRV', label: 'BRV', description: 'Bank Receipt Voucher' },
    { value: 'ADBRV', label: 'ADBRV', description: 'Advance Bank Receipt Voucher' },
    { value: 'BPV', label: 'BPV', description: 'Bank Payment Voucher' },
    { value: 'OB', label: 'OB', description: 'Opening Balance' },
    { value: 'RC', label: 'RC', description: 'Receipt' }
  ];

  useEffect(() => {
    loadSavedVouchers();
    loadAvailableFunds();
    loadLedgers();
    
    const editingVoucherData = localStorage.getItem('editingVoucher');
    const correctionMode = localStorage.getItem('correctionMode');
    
    if (editingVoucherData && correctionMode === 'true') {
      const voucher = JSON.parse(editingVoucherData);
      handleEditVoucher(voucher);
      localStorage.removeItem('editingVoucher');
      localStorage.removeItem('correctionMode');
      showToast('Voucher loaded for correction', 'success');
    }
  }, []);

  const loadLedgers = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) {
      setAllLedgers((result.data || []).map(l => ({ code: l.ledgerCode, name: l.ledgerName, category: l.underGroup || '' })));
    }
  };

  const loadAvailableFunds = async () => {
    try {
      const result = await fundService.getAll();
      setAvailableFunds(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Error loading funds:', error);
      setAvailableFunds([]);
    }
  };

  const loadSavedVouchers = async () => {
    const result = await executeApi(journalVoucherService.getAll);
    if (result.success) {
      setSavedVouchers(result.data || []);
    }
  };

  const fundOptions = availableFunds.map(fund => ({
    value: fund.fundName,
    label: fund.fundName,
    description: `Created: ${fund.createdDate}`
  }));

  const handleEmployeeEntriesChange = (entries) => {
    setEmployeeEntries(entries);
  };

const mockShowConfirmDialog = async (title, message, confirmText, cancelText) => {
  return await showConfirmDialog({
    title,
    message,
    confirmText,
    cancelText,
    type: 'warning'
  });
};

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    if (['estimateValue', 'valueOfWorkDone', 'workAmount', 'employeeAmount'].includes(name)) {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        const formattedValue = parseFloat(numericValue).toLocaleString('en-IN');
        handleChange({ target: { name, value: formattedValue } });
      } else {
        handleChange({ target: { name, value } });
      }
    } else {
      handleChange(e);
    }
  };

  const handleJournalTypeChange = (e) => {
    const journalType = e.target.value;
    handleChange(e);
    
    setShowWorkDetails(false);
    setShowEmployeeDetails(false);
    setShowMultipleEmployees(false);
    setEmployeeEntries([]);
    
    if (journalType !== 'CJV' && journalType !== 'PJV') {
      setFormData(prev => ({
        ...prev,
        nameOfContractor: '',
        nameOfSupplier: '',
        valueOfWorkDone: '',
        workAmount: ''
      }));
    }
    
    if (journalType !== 'EJV') {
      setFormData(prev => ({
        ...prev,
        nameOfEmployee: '',
        designation: '',
        section: '',
        monthYear: '',
        employeeAmount: ''
      }));
    }
  };

  const handleDebitChange = handleEntryChange(debitEntries, setDebitEntries, allLedgers);
  const handleCreditChange = handleEntryChange(creditEntries, setCreditEntries, allLedgers);
// Update your addDebitEntry function

const addDebitEntry = () => {
  if (!currentDebitEntry?.ledgerCode?.trim()) {
    showToast('Ledger Code is required for debit entry', 'error');
    return;
  }

  // Only check for duplicate in same entry type
  if (isLedgerAlreadyUsed(currentDebitEntry.ledgerCode, 'debit')) {
    showToast('This ledger is already added in debit entries', 'error');
    return;
  }

  // Remove the opposite entry check
  
  const numericAmount = parseFloat((currentDebitEntry.amount || '').replace(/,/g, ''));
  if (!currentDebitEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
    showToast('Amount must be greater than 0', 'error');
    return;
  }

  const entryData = {
    id: Date.now(),
    ledgerCode: currentDebitEntry.ledgerCode,
    ledgerName: currentDebitEntry.ledgerName,
    amount: numericAmount,
    hasDetailedForm: requiresSpecialForm(currentDebitEntry.ledgerCode, 'debit'),
    detailType: SPECIAL_LEDGER_CODES[currentDebitEntry.ledgerCode]?.formType
  };

  setDebitEntries(prev => [...prev, entryData]);
  setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
  showToast('Debit entry added successfully', 'success');
};


// Update your addCreditEntry function
const addCreditEntry = () => {
  if (!currentCreditEntry?.ledgerCode?.trim()) {
    showToast('Ledger Code is required for credit entry', 'error');
    return;
  }

  // Only check for duplicate in same entry type
  if (isLedgerAlreadyUsed(currentCreditEntry.ledgerCode, 'credit')) {
    showToast('This ledger is already added in credit entries', 'error');
    return;
  }

  // Remove the opposite entry check - allowing same ledger in debit and credit
  
  const numericAmount = parseFloat((currentCreditEntry.amount || '').replace(/,/g, ''));
  if (!currentCreditEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
    showToast('Amount must be greater than 0', 'error');
    return;
  }

  const entryData = {
    id: Date.now(),
    ledgerCode: currentCreditEntry.ledgerCode,
    ledgerName: currentCreditEntry.ledgerName,
    amount: numericAmount,
    hasDetailedForm: requiresSpecialForm(currentCreditEntry.ledgerCode, 'credit'),
    detailType: SPECIAL_LEDGER_CODES[currentCreditEntry.ledgerCode]?.formType
  };

  setCreditEntries(prev => [...prev, entryData]);
  setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
  showToast('Credit entry added successfully', 'success');
};
  // const addDebitEntry = () => {
  //   if (!currentDebitEntry?.ledgerCode?.trim()) {
  //     showToast('Ledger Code is required for debit entry', 'error');
  //     return;
  //   }
    
  //   const numericAmount = parseFloat((currentDebitEntry.amount || '').replace(/,/g, ''));
  //   if (!currentDebitEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
  //     showToast('Amount must be greater than 0', 'error');
  //     return;
  //   }

  //   const entryData = {
  //     id: Date.now(),
  //     ledgerCode: currentDebitEntry.ledgerCode,
  //     ledgerName: currentDebitEntry.ledgerName,
  //     amount: numericAmount,
  //     hasDetailedForm: requiresSpecialForm(currentDebitEntry.ledgerCode, 'debit'),
  //     detailType: SPECIAL_LEDGER_CODES[currentDebitEntry.ledgerCode]?.formType
  //   };

  //   setDebitEntries(prev => [...prev, entryData]);
  //   setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
  //   showToast('Debit entry added successfully', 'success');
  // };

  // const addCreditEntry = () => {
  //   if (!currentCreditEntry?.ledgerCode?.trim()) {
  //     showToast('Ledger Code is required for credit entry', 'error');
  //     return;
  //   }
    
  //   const numericAmount = parseFloat((currentCreditEntry.amount || '').replace(/,/g, ''));
  //   if (!currentCreditEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
  //     showToast('Amount must be greater than 0', 'error');
  //     return;
  //   }

  //   const entryData = {
  //     id: Date.now(),
  //     ledgerCode: currentCreditEntry.ledgerCode,
  //     ledgerName: currentCreditEntry.ledgerName,
  //     amount: numericAmount,
  //     hasDetailedForm: requiresSpecialForm(currentCreditEntry.ledgerCode, 'credit'),
  //     detailType: SPECIAL_LEDGER_CODES[currentCreditEntry.ledgerCode]?.formType
  //   };

  //   setCreditEntries(prev => [...prev, entryData]);
  //   setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
  //   showToast('Credit entry added successfully', 'success');
  // };

  const removeDebitEntry = async (entryId) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Debit Entry',
      message: 'Are you sure you want to delete this debit entry?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });
    if (confirmed) {
      setDebitEntries(prev => prev.filter(item => item.id !== entryId));
      showToast('Debit entry deleted successfully', 'success');
    }
  };

  const removeCreditEntry = async (entryId) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Credit Entry',
    message: 'Are you sure you want to delete this credit entry?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });
  if (confirmed) {
    setCreditEntries(prev => prev.filter(item => item.id !== entryId));
    showToast('Credit entry deleted successfully', 'success');
  }
};

// const handleSubmit = async () => {
//   const errors = validateVoucherForm(formData, debitEntries, creditEntries, ['journalType', 'journalNo', 'journalDate', 'fundType']);

//   if (errors.length > 0) {
//     showToast(errors[0], 'error');
//     return;
//   }

//   const debitTotal = calculateTotal(debitEntries);
//   const creditTotal = calculateTotal(creditEntries);

//   if (Math.abs(debitTotal - creditTotal) > 0.01) {
//     await showConfirmDialog({
//       title: 'Unbalanced Entries - Cannot Save',
//       message: `Entries are unbalanced. Difference: ₹${Math.abs(debitTotal - creditTotal).toFixed(2)}. Please balance your debit and credit entries before saving.`,
//       type: 'error',
//       cancelText: 'OK',
//       hideConfirm: true
//     });
//     return;
//   }

//   const submitData = {
//     ...formData,
//     estimateValue: formData.estimateValue ? parseFloat(formData.estimateValue.replace(/,/g, '')) : 0,
//     valueOfWorkDone: formData.valueOfWorkDone ? parseFloat(formData.valueOfWorkDone.replace(/,/g, '')) : 0,
//     workAmount: formData.workAmount ? parseFloat(formData.workAmount.replace(/,/g, '')) : 0,
//     employeeAmount: formData.employeeAmount ? parseFloat(formData.employeeAmount.replace(/,/g, '')) : 0,
//     employeeEntries: showMultipleEmployees ? employeeEntries : [],
//     debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
//     creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
//     specialFormData,
//     debitTotal,
//     creditTotal,
//     entryCount: debitEntries.length + creditEntries.length,
//     balanced: true
//   };

//   let result;
//   if (editingId) {
//     result = await executeApi(journalVoucherService.update, editingId, submitData);
//   } else {
//     result = await executeApi(journalVoucherService.create, submitData);
//   }

//   if (result.success) {
//     showToast(editingId ? 'Journal Voucher updated successfully!' : 'Journal Voucher created successfully!', 'success');
//     resetFormHandler();
//     await loadSavedVouchers();
//   } else {
//     showToast(result.message || 'Operation failed!', 'error');
//   }
// };
const handleSubmit = async () => {
  const errors = validateVoucherForm(formData, debitEntries, creditEntries, ['journalType', 'journalNo', 'journalDate', 'fundType']);

  if (errors.length > 0) {
    showToast(errors[0], 'error');
    return;
  }

  const debitTotal = calculateTotal(debitEntries);
  const creditTotal = calculateTotal(creditEntries);

  if (Math.abs(debitTotal - creditTotal) > 0.01) {
    await showConfirmDialog({
      title: 'Unbalanced Entries - Cannot Save',
      message: `Entries are unbalanced. Difference: ₹${Math.abs(debitTotal - creditTotal).toFixed(2)}. Please balance your debit and credit entries before saving.`,
      type: 'error',
      cancelText: 'OK',
      hideConfirm: true
    });
    return;
  }

  // STRICT VALIDATION: Employee entries total MUST match debit or credit entries
  if (showMultipleEmployees && employeeEntries.length > 0) {
    const employeeTotal = employeeEntries.reduce((sum, entry) => sum + entry.employeeAmount, 0);
    
    // Check if employee total matches any debit or credit entry
    const hasMatchingDebitEntry = debitEntries.some(entry => Math.abs(entry.amount - employeeTotal) < 0.01);
    const hasMatchingCreditEntry = creditEntries.some(entry => Math.abs(entry.amount - employeeTotal) < 0.01);
    
    if (!hasMatchingDebitEntry && !hasMatchingCreditEntry) {
      await showConfirmDialog({
        title: 'Employee Total Mismatch - Cannot Save',
        message: `Employee entries total (₹${employeeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}) must match at least one debit or credit entry amount. Please add a corresponding entry or adjust the employee amounts.`,
        type: 'error',
        cancelText: 'OK',
        hideConfirm: true
      });
      return; // STOP - Don't allow saving
    }
  }

  const submitData = {
    ...formData,
    estimateValue: formData.estimateValue ? parseFloat(formData.estimateValue.replace(/,/g, '')) : 0,
    valueOfWorkDone: formData.valueOfWorkDone ? parseFloat(formData.valueOfWorkDone.replace(/,/g, '')) : 0,
    workAmount: formData.workAmount ? parseFloat(formData.workAmount.replace(/,/g, '')) : 0,
    employeeAmount: formData.employeeAmount ? parseFloat(formData.employeeAmount.replace(/,/g, '')) : 0,
    employeeEntries: showMultipleEmployees ? employeeEntries : [],
    debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
    creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
    specialFormData,
    debitTotal,
    creditTotal,
    entryCount: debitEntries.length + creditEntries.length,
    balanced: true
  };

  let result;
  if (editingId) {
    result = await executeApi(journalVoucherService.update, editingId, submitData);
  } else {
    result = await executeApi(journalVoucherService.create, submitData);
  }

  if (result.success) {
    showToast(editingId ? 'Journal Voucher updated successfully!' : 'Journal Voucher created successfully!', 'success');
    resetFormHandler();
    await loadSavedVouchers();
  } else {
    showToast(result.message || 'Operation failed!', 'error');
  }
};

  const handleEditVoucher = (voucher) => {
    console.log('=== EDIT DEBUG (Journal Voucher) ===');
    console.log('Editing voucher:', voucher);
    console.log('Voucher employee entries:', voucher.employeeEntries);
    console.log('Voucher special form data:', voucher.specialFormData);
    
    if (voucher.specialFormData) {
      setSpecialFormData(voucher.specialFormData);
    } else {
      setSpecialFormData({});
    }
    
    const hasWorkDetails = voucher.nameOfContractor || voucher.nameOfSupplier || voucher.valueOfWorkDone || voucher.workAmount;
    const hasMultipleEmployees = voucher.employeeEntries && Array.isArray(voucher.employeeEntries) && voucher.employeeEntries.length > 0;
    const hasSingleEmployee = voucher.nameOfEmployee && voucher.nameOfEmployee.trim() !== '';
    
    console.log('Has work details:', hasWorkDetails);
    console.log('Has multiple employees:', hasMultipleEmployees);
    console.log('Has single employee:', hasSingleEmployee);
    
    if (voucher.journalType === 'EJV') {
      setShowEmployeeDetails(hasSingleEmployee || hasMultipleEmployees);
      if (hasMultipleEmployees) {
        setEmployeeEntries(voucher.employeeEntries);
        setShowMultipleEmployees(true);
      } else {
        setEmployeeEntries([]);
        setShowMultipleEmployees(false);
      }
    } else {
      setShowEmployeeDetails(false);
      setEmployeeEntries([]);
      setShowMultipleEmployees(false);
    }
    
    if (voucher.journalType === 'CJV' || voucher.journalType === 'PJV') {
      setShowWorkDetails(hasWorkDetails);
    } else {
      setShowWorkDetails(false);
    }
    
    setFormData({
      journalType: voucher.journalType || '',
      journalNo: voucher.journalNo || '',
      journalDate: voucher.journalDate || '',
      nameOfScheme: voucher.nameOfScheme || '',
      nameOfWork: voucher.nameOfWork || '',
      estimateValue: voucher.estimateValue ? voucher.estimateValue.toLocaleString('en-IN') : '',
      description : voucher.description  || '',
      fundType: voucher.fundType || '',
      nameOfContractor: voucher.nameOfContractor || '',
      nameOfSupplier: voucher.nameOfSupplier || '',
      valueOfWorkDone: voucher.valueOfWorkDone ? voucher.valueOfWorkDone.toLocaleString('en-IN') : '',
      workAmount: voucher.workAmount ? voucher.workAmount.toLocaleString('en-IN') : '',
      nameOfEmployee: hasMultipleEmployees ? '' : (voucher.nameOfEmployee || ''),
      designation: hasMultipleEmployees ? '' : (voucher.designation || ''),
      section: hasMultipleEmployees ? '' : (voucher.section || ''),
      monthYear: hasMultipleEmployees ? '' : (voucher.monthYear || ''),
      employeeAmount: hasMultipleEmployees ? '' : (voucher.employeeAmount ? voucher.employeeAmount.toLocaleString('en-IN') : '')
    });
    
    setDebitEntries(voucher.debitEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialDebitEntries);
    setCreditEntries(voucher.creditEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialCreditEntries);
    
    setEditingId(voucher.id);
    setShowRecords(false);
    clearError();
    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    console.log('Edit setup complete. Employee entries state:', employeeEntries);
    console.log('Show multiple employees state:', showMultipleEmployees);
    console.log('Special form data loaded:', specialFormData);
  };

const handleDeleteVoucher = async (voucher) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Voucher',
    message: `Are you sure you want to delete voucher "${voucher.journalNo}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });
  
  if (confirmed) {
    const result = await executeApi(journalVoucherService.delete, voucher.id);
    if (result.success) {
      showToast('Voucher deleted successfully!', 'success');
      await loadSavedVouchers();
    } else {
      showToast('Failed to delete voucher!', 'error');
    }
  }
};

  const debitTotal = useMemo(() => calculateTotal(debitEntries), [debitEntries, calculateTotal]);
  const creditTotal = useMemo(() => calculateTotal(creditEntries), [creditEntries, calculateTotal]);

  const handleAdvancedFilters = useCallback((filters) => {
    setSearchFilters(filters);
  }, []);

  const filteredVouchers = useMemo(() => savedVouchers.filter(voucher => {
    const filters = searchFilters;
    
    const searchMatch = !filters.searchTerm || 
      voucher.journalNo?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.nameOfScheme?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.nameOfWork?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.fundType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.journalDate?.includes(filters.searchTerm);

    const dateFromMatch = !filters.dateFrom || voucher.journalDate >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || voucher.journalDate <= filters.dateTo;

    const amountMinMatch = !filters.amountMin || 
      (voucher.debitTotal >= parseFloat(filters.amountMin) || voucher.creditTotal >= parseFloat(filters.amountMin));
    const amountMaxMatch = !filters.amountMax || 
      (voucher.debitTotal <= parseFloat(filters.amountMax) && voucher.creditTotal <= parseFloat(filters.amountMax));

    const nameOfSchemeMatch = !filters.nameOfScheme || 
      voucher.nameOfScheme?.toLowerCase().includes(filters.nameOfScheme.toLowerCase());

    const nameOfWorkMatch = !filters.nameOfWork || 
      voucher.nameOfWork?.toLowerCase().includes(filters.nameOfWork.toLowerCase());

    const fundTypeMatch = !filters.fundType || 
      voucher.fundType?.toLowerCase().includes(filters.fundType.toLowerCase());

    const statusMatch = !filters.status || 
      (filters.status === 'balanced' && voucher.balanced) ||
      (filters.status === 'unbalanced' && !voucher.balanced);

    const journalTypeMatch = !filters.journalType || voucher.journalType === filters.journalType;

    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch && 
           amountMaxMatch && nameOfSchemeMatch && nameOfWorkMatch && fundTypeMatch && 
           statusMatch && journalTypeMatch;
  }), [savedVouchers, searchFilters]);

  const resetFormHandler = () => {
    resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
    setShowRecords(false);
    setShowMultipleEmployees(false);
    setShowWorkDetails(false);
    setShowEmployeeDetails(false);
    setEmployeeEntries([]);
    setSpecialFormData({});
    setShowSpecialForm(null);
    setCurrentEmployeeEntry({
      nameOfEmployee: '',
      designation: '',
      section: '',
      monthYear: '',
      employeeAmount: ''
    });
    setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
    setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Journal Voucher"
        subtitle="Manage journal vouchers for adjustments and transfers"
        icon={BookOpen}
        totalRecords={savedVouchers.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-purple-500"
        gradientTo="to-indigo-500"
        countBg="from-purple-100"
        countTo="to-indigo-100"
        countBorder="border-purple-200"
        countText="text-purple-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Journal Vouchers"
          totalRecords={filteredVouchers.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-purple-500"
          gradientTo="to-indigo-500"
          customFilters={[
            {
              key: 'journalType',
              label: 'Journal Type',
              type: 'select',
              icon: FileText,
              options: [
                { value: '', label: 'All Types' },
                { value: 'EJV', label: 'EJV' },
                { value: 'PJV', label: 'PJV' },
                { value: 'CJV', label: 'CJV' },
                { value: 'FAJV', label: 'FAJV' },
                { value: 'GJV', label: 'GJV' },
                { value: 'BRV', label: 'BRV' },
                { value: 'ADBRV', label: 'ADBRV' },
                { value: 'BPV', label: 'BPV' },
                { value: 'OB', label: 'OB' },
                { value: 'RC', label: 'RC' }
              ]
            },
            {
              key: 'nameOfScheme',
              label: 'Scheme Name',
              type: 'text',
              icon: Building,
              placeholder: 'Search by scheme name'
            },
            {
              key: 'nameOfWork',
              label: 'Work Name',
              type: 'text',
              icon: FileText,
              placeholder: 'Search by work name'
            }
          ]}
        >
          {filteredVouchers.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No journal vouchers found."
              actionText="Create your first voucher"
              onAction={() => setShowRecords(false)}
              searchTerm={searchFilters.searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {/* {filteredVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {voucher.journalType} - {voucher.journalNo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {voucher.journalDate} | Fund: {voucher.fundType}
                        </p>
                        {voucher.nameOfScheme && (
                          <p className="text-sm text-gray-600">Scheme: {voucher.nameOfScheme}</p>
                        )}
                        {voucher.nameOfWork && (
                          <p className="text-sm text-gray-600">Work: {voucher.nameOfWork}</p>
                        )}
                        {voucher.journalType === 'CJV' && voucher.nameOfContractor && (
                          <p className="text-sm text-blue-600">Contractor: {voucher.nameOfContractor}</p>
                        )}
                        {voucher.journalType === 'PJV' && voucher.nameOfSupplier && (
                          <p className="text-sm text-blue-600">Supplier: {voucher.nameOfSupplier}</p>
                        )}
                        {voucher.journalType === 'EJV' && voucher.nameOfEmployee && (
                          <p className="text-sm text-blue-600">Employee: {voucher.nameOfEmployee}</p>
                        )}
                        {voucher.journalType === 'EJV' && voucher.employeeEntries && voucher.employeeEntries.length > 0 && (
                          <p className="text-sm text-blue-600">Multiple Employees: {voucher.employeeEntries.length} entries</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-red-600">Dr: ₹{voucher.debitTotal?.toLocaleString('en-IN')}</span>
                          <span className="text-green-600">Cr: ₹{voucher.creditTotal?.toLocaleString('en-IN')}</span>
                          {voucher.balanced ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {voucher.entryCount} entries
                          {voucher.estimateValue && ` | Est: ₹${parseFloat(voucher.estimateValue).toLocaleString('en-IN')}`}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditVoucher(voucher)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Voucher"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVoucher(voucher)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Voucher"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                    {voucher.debitEntries && voucher.debitEntries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Debit Entries ({voucher.debitEntries.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {voucher.debitEntries.map((entry, index) => (
                            <div key={index} className="bg-red-50 p-3 rounded border border-red-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {entry.ledgerCode} - {entry.ledgerName}
                                    {entry.hasDetailedForm && (
                                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Detailed
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-red-600">₹{entry.amount?.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 p-2 bg-red-100 rounded text-right">
                          <span className="text-sm font-bold text-red-700">
                            Total: ₹{voucher.debitTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}

                    {voucher.creditEntries && voucher.creditEntries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center space-x-1">
                          <Banknote className="h-4 w-4" />
                          <span>Credit Entries ({voucher.creditEntries.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {voucher.creditEntries.map((entry, index) => (
                            <div key={index} className="bg-green-50 p-3 rounded border border-green-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {entry.ledgerCode} - {entry.ledgerName}
                                    {entry.hasDetailedForm && (
                                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Detailed
                                      </span>
                                    )}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold text-green-600">₹{entry.amount?.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 p-2 bg-green-100 rounded text-right">
                          <span className="text-sm font-bold text-green-700">
                            Total: ₹{voucher.creditTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {voucher.description  && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">description : </span>
                        {voucher.description }
                      </p>
                    </div>
                  )}
                </div>
              ))} */}
              {filteredVouchers.map((voucher) => (
  <div
    key={voucher.id}
    className="bg-gradient-to-r from-white to-gray-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {voucher.journalType} - {voucher.journalNo}
          </h3>
          <p className="text-sm text-gray-600">
            Date: {voucher.journalDate} | Fund: {voucher.fundType}
          </p>
          {voucher.nameOfScheme && (
            <p className="text-sm text-gray-600">Scheme: {voucher.nameOfScheme}</p>
          )}
          {voucher.nameOfWork && (
            <p className="text-sm text-gray-600">Work: {voucher.nameOfWork}</p>
          )}
          {voucher.journalType === 'CJV' && voucher.nameOfContractor && (
            <p className="text-sm text-blue-600">Contractor: {voucher.nameOfContractor}</p>
          )}
          {voucher.journalType === 'PJV' && voucher.nameOfSupplier && (
            <p className="text-sm text-blue-600">Supplier: {voucher.nameOfSupplier}</p>
          )}
          {voucher.journalType === 'EJV' && voucher.nameOfEmployee && (
            <p className="text-sm text-blue-600">Employee: {voucher.nameOfEmployee}</p>
          )}
          {voucher.journalType === 'EJV' && voucher.employeeEntries && voucher.employeeEntries.length > 0 && (
            <p className="text-sm text-blue-600">Multiple Employees: {voucher.employeeEntries.length} entries</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-red-600">Dr: ₹{voucher.debitTotal?.toLocaleString('en-IN')}</span>
            <span className="text-green-600">Cr: ₹{voucher.creditTotal?.toLocaleString('en-IN')}</span>
            {voucher.balanced ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {voucher.entryCount} entries
            {voucher.estimateValue && ` | Est: ₹${parseFloat(voucher.estimateValue).toLocaleString('en-IN')}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditVoucher(voucher)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Edit Voucher"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteVoucher(voucher)}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Delete Voucher"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Employee Entries Details - NEW SECTION */}
    {voucher.employeeEntries && voucher.employeeEntries.length > 0 && (
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
          <User className="h-4 w-4 mr-2" />
          Employee Details ({voucher.employeeEntries.length} employees)
        </h4>
        <div className="space-y-3">
          {voucher.employeeEntries.map((emp, idx) => (
            <div key={idx} className="bg-white p-3 rounded border border-blue-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{emp.nameOfEmployee}</p>
                </div>
                {emp.designation && (
                  <div>
                    <span className="font-medium text-gray-700">Designation:</span>
                    <p className="text-gray-900">{emp.designation}</p>
                  </div>
                )}
                {emp.section && (
                  <div>
                    <span className="font-medium text-gray-700">Section:</span>
                    <p className="text-gray-900">{emp.section}</p>
                  </div>
                )}
                {emp.monthYear && (
                  <div>
                    <span className="font-medium text-gray-700">Period:</span>
                    <p className="text-gray-900">{emp.monthYear}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <p className="text-green-600 font-semibold">
                    ₹{emp.employeeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              {/* Ledger Entries for this employee */}
              {emp.ledgerEntries && emp.ledgerEntries.length > 0 && (
                <div className="mt-3 pt-3 border-t border-blue-100">
                  <p className="text-xs font-medium text-indigo-700 mb-2">
                    Ledger Breakdown ({emp.ledgerEntries.length} entries):
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {emp.ledgerEntries.map((ledger, ledgerIdx) => (
                      <div key={ledgerIdx} className="bg-indigo-50 p-2 rounded text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {ledger.ledgerCode} - {ledger.ledgerName}
                          </span>
                          <span className="font-semibold text-indigo-700">
                            ₹{ledger.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 p-2 bg-green-100 rounded text-right">
          <span className="text-sm font-bold text-green-700">
            Total Employee Amount: ₹{voucher.employeeEntries.reduce((sum, emp) => sum + emp.employeeAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
      {/* Existing debit entries display */}
      {voucher.debitEntries && voucher.debitEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center space-x-1">
            <DollarSign className="h-4 w-4" />
            <span>Debit Entries ({voucher.debitEntries.length})</span>
          </h4>
          <div className="space-y-2">
            {voucher.debitEntries.map((entry, index) => (
              <div key={index} className="bg-red-50 p-3 rounded border border-red-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.ledgerCode} - {entry.ledgerName}
                      {entry.hasDetailedForm && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Detailed
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-red-600">₹{entry.amount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-red-100 rounded text-right">
            <span className="text-sm font-bold text-red-700">
              Total: ₹{voucher.debitTotal?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* Existing credit entries display */}
      {voucher.creditEntries && voucher.creditEntries.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center space-x-1">
            <Banknote className="h-4 w-4" />
            <span>Credit Entries ({voucher.creditEntries.length})</span>
          </h4>
          <div className="space-y-2">
            {voucher.creditEntries.map((entry, index) => (
              <div key={index} className="bg-green-50 p-3 rounded border border-green-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {entry.ledgerCode} - {entry.ledgerName}
                      {entry.hasDetailedForm && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Detailed
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">₹{entry.amount?.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 p-2 bg-green-100 rounded text-right">
            <span className="text-sm font-bold text-green-700">
              Total: ₹{voucher.creditTotal?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
    </div>
    
    {voucher.description  && (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-medium text-gray-900">description : </span>
          {voucher.description }
        </p>
      </div>
    )}
  </div>
))}
            </div>
          )}
        </SearchableRecords>
      )}

      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          {showSpecialForm ? (
            <div className="p-6">
              {showSpecialForm.type === 'doubtfulCollection' && (
                <DoubtfulCollectionForm
                  ledgerCode={showSpecialForm.ledgerCode}
                  ledgerName={showSpecialForm.ledgerName}
                  journalNo={showSpecialForm.journalNo}
                  journalDate={showSpecialForm.journalDate}
                  onSave={handleSpecialFormSave}
                  onBack={handleSpecialFormBack}
                  initialData={showSpecialForm.existingData}
                />
              )}
              {showSpecialForm.type === 'priorYearIncome' && (
                <PriorYearIncomeForm
                  ledgerCode={showSpecialForm.ledgerCode}
                  ledgerName={showSpecialForm.ledgerName}
                  journalNo={showSpecialForm.journalNo}
                  journalDate={showSpecialForm.journalDate}
                  onSave={handleSpecialFormSave}
                  onBack={handleSpecialFormBack}
                  initialData={showSpecialForm.existingData}
                />
              )}
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  {editingId ? 'Edit Journal Voucher' : 'Create New Journal Voucher'}
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <SearchableDropdown
                  options={fundOptions}
                  value={formData.fundType}
                  onChange={(e) => handleChange({ target: { name: 'fundType', value: e.target.value } })}
                  label="Fund Type"
                  placeholder="Select a fund type"
                  searchPlaceholder="Search funds..."
                  required
                  icon={Wallet}
                  emptyMessage="No funds available. Create funds first."
                />
                  <SearchableDropdown
                    options={journalTypes.map(type => ({
                      value: type.value,
                      label: type.label,
                      description: type.description
                    }))}
                    value={formData.journalType}
                    onChange={(e) => handleJournalTypeChange({ target: { name: 'journalType', value: e.target.value } })}
                    label="Journal Type"
                    placeholder="Select Journal Type"
                    searchPlaceholder="Search journal types..."
                    required
                    icon={BookOpen}
                    emptyMessage="No journal types available"
                  />
                  
                  <FormField
                    label="Journal No"
                    name="journalNo"
                    value={formData.journalNo}
                    onChange={handleChange}
                    required
                    placeholder="Enter journal number"
                    icon={FileText}
                  />
                  
                  <FormField
                    label="Journal Date"
                    name="journalDate"
                    type="date"
                    value={formData.journalDate}
                    onChange={handleChange}
                    required
                    icon={Calendar}
                  />
                 
                </div>

                

            

               

                {/* {!['CJV', 'PJV', 'EJV'].includes(formData.journalType) && formData.journalType && (
                  <div className="space-y-6">
                    <WorkDetails
                      formData={formData}
                      onChange={handleFormChange}
                      errors={{}}
                      title="Work Details (Optional)"
                      contractorLabel="Name of the Contractor"
                      contractorFieldName="nameOfContractor"
                      showScheme={true}
                    />

                    <EmployeeDetails
                      formData={formData}
                      onChange={handleFormChange}
                      errors={{}}
                      title="Employee Details (Optional)"
                    />
                  </div>
                )} */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-700 flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Add Debit Entry</span>
                    </h3>
                    
                    <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                      {/* <SearchableDropdown
                        options={allLedgers.map(ledger => ({
                          value: ledger.code,
                          label: `${ledger.code} - ${ledger.name}`,
                          description: `${ledger.category} | ${ledger.name}`
                        }))}
                        value={currentDebitEntry?.ledgerCode || ''}
                        onChange={(e) => {
                          const selectedLedger = allLedgers.find(ledger => ledger.code === e.target.value);
                          const ledgerCode = e.target.value;
                          setCurrentDebitEntry(prev => ({
                            ...prev,
                            ledgerCode,
                            ledgerName: selectedLedger ? selectedLedger.name : '',
                            amount: ''
                          }));
                          if (requiresSpecialForm(ledgerCode, 'debit')) {
                            handleSpecialFormOpen(ledgerCode, selectedLedger?.name || '', 'debit');
                          }
                        }}
                        label="Ledger Code"
                        placeholder="Select ledger code"
                        searchPlaceholder="Search ledgers..."
                        required
                      /> */}
         <SearchableDropdown
  options={getFilteredLedgerOptions('debit')}
  value={currentDebitEntry?.ledgerCode || ''}
  onChange={(e) => {
    const selectedLedger = allLedgers.find(ledger => ledger.code === e.target.value);
    const ledgerCode = e.target.value;
    
    // Only check for duplicate in same entry type during selection
    if (isLedgerAlreadyUsed(ledgerCode, 'debit')) {
      showToast('This ledger is already added in debit entries', 'error');
      return;
    }
    
    // Remove the opposite entry check from here
    
    setCurrentDebitEntry(prev => ({
      ...prev,
      ledgerCode,
      ledgerName: selectedLedger ? selectedLedger.name : '',
      amount: ''
    }));
    
    if (requiresSpecialForm(ledgerCode, 'debit')) {
      handleSpecialFormOpen(ledgerCode, selectedLedger?.name || '', 'debit');
    }
  }}
  label="Ledger Code"
  placeholder="Select ledger code"
  searchPlaceholder="Search ledgers..."
  required
/>
                      <FormField
                        label="Ledger Head"
                        value={currentDebitEntry?.ledgerName || ''}
                        disabled
                        placeholder="Auto-filled"
                        className="bg-gray-100"
                      />
                      
                      <FormField
                        label="Amount (₹)"
                        name="amount"
                        value={currentDebitEntry?.amount || ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          let processedValue = value;
                          
                          if (value) {
                            const numericValue = value.replace(/,/g, '');
                            if (/^\d*\.?\d*$/.test(numericValue)) {
                              if (numericValue !== '' && !isNaN(numericValue)) {
                                const parts = numericValue.split('.');
                                parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
                                processedValue = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
                              }
                            } else {
                              return;
                            }
                          }
                          
                          setCurrentDebitEntry(prev => ({ ...prev, amount: processedValue }));
                        }}
                        placeholder="0.00"
                        required
                        disabled={requiresSpecialForm(currentDebitEntry.ledgerCode, 'debit')}
                      />
                      
                      <button
                        type="button"
                        onClick={addDebitEntry}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                        disabled={requiresSpecialForm(currentDebitEntry.ledgerCode, 'debit')}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Debit Entry</span>
                      </button>
                    </div>

                    {debitEntries.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold mb-3 text-red-700 flex items-center space-x-2">
                          <Check className="h-4 w-4" />
                          <span>Debit Entries ({debitEntries.length}) - Total: ₹{debitTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </h4>
                        
                        <div className="overflow-x-auto rounded-lg border border-red-200">
                          <table className="w-full">
                            <thead className="bg-red-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Ledger Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Ledger Head</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Amount (₹)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-red-200">
                              {debitEntries.map((entry, index) => (
                                <tr key={entry.id} className="hover:bg-red-50 transition-colors">
                                  <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerCode}</td>
                                  <td className="px-4 py-4 text-sm text-slate-900">
                                    {entry.ledgerName}
                                    {entry.hasDetailedForm && (
                                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Detailed
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                    ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="px-4 py-4 text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                      {entry.hasDetailedForm ? (
                                        <button
                                          onClick={() => handleViewSpecialForm(entry, 'debit')}
                                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                          title="View/Edit Detailed Form"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setCurrentDebitEntry({
                                              ledgerCode: entry.ledgerCode,
                                              ledgerName: entry.ledgerName,
                                              amount: entry.amount?.toLocaleString('en-IN')
                                            });
                                            setDebitEntries(prev => prev.filter(item => item.id !== entry.id));
                                            showToast('Debit entry loaded for editing', 'info');
                                          }}
                                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                          title="Edit Entry"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => removeDebitEntry(entry.id)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                        title="Delete Entry"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center space-x-2">
                      <Banknote className="h-5 w-5" />
                      <span>Add Credit Entry</span>
                    </h3>
                    
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      {/* <SearchableDropdown
                        options={allLedgers.map(ledger => ({
                          value: ledger.code,
                          label: `${ledger.code} - ${ledger.name}`,
                          description: `${ledger.category} | ${ledger.name}`
                        }))}
                        value={currentCreditEntry?.ledgerCode || ''}
                        onChange={(e) => {
                          const selectedLedger = allLedgers.find(ledger => ledger.code === e.target.value);
                          const ledgerCode = e.target.value;
                          setCurrentCreditEntry(prev => ({
                            ...prev,
                            ledgerCode,
                            ledgerName: selectedLedger ? selectedLedger.name : '',
                            amount: ''
                          }));
                          if (requiresSpecialForm(ledgerCode, 'credit')) {
                            handleSpecialFormOpen(ledgerCode, selectedLedger?.name || '', 'credit');
                          }
                        }}
                        label="Ledger Code"
                        placeholder="Select ledger code"
                        searchPlaceholder="Search ledgers..."
                        required
                      /> */}
         <SearchableDropdown
  options={getFilteredLedgerOptions('credit')}
  value={currentCreditEntry?.ledgerCode || ''}
  onChange={(e) => {
    const selectedLedger = allLedgers.find(ledger => ledger.code === e.target.value);
    const ledgerCode = e.target.value;
    
    // Only check for duplicate in same entry type during selection
    if (isLedgerAlreadyUsed(ledgerCode, 'credit')) {
      showToast('This ledger is already added in credit entries', 'error');
      return;
    }
    
    // Remove the opposite entry check from here
    
    setCurrentCreditEntry(prev => ({
      ...prev,
      ledgerCode,
      ledgerName: selectedLedger ? selectedLedger.name : '',
      amount: ''
    }));
    
    if (requiresSpecialForm(ledgerCode, 'credit')) {
      handleSpecialFormOpen(ledgerCode, selectedLedger?.name || '', 'credit');
    }
  }}
  label="Ledger Code"
  placeholder="Select ledger code"
  searchPlaceholder="Search ledgers..."
  required
/>
                      <FormField
                        label="Ledger Head"
                        value={currentCreditEntry?.ledgerName || ''}
                        disabled
                        placeholder="Auto-filled"
                        className="bg-gray-100"
                      />
                      
                      <FormField
                        label="Amount (₹)"
                        name="amount"
                        value={currentCreditEntry?.amount || ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          let processedValue = value;
                          
                          if (value) {
                            const numericValue = value.replace(/,/g, '');
                            if (/^\d*\.?\d*$/.test(numericValue)) {
                              if (numericValue !== '' && !isNaN(numericValue)) {
                                const parts = numericValue.split('.');
                                parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
                                processedValue = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
                              }
                            } else {
                              return;
                            }
                          }
                          
                          setCurrentCreditEntry(prev => ({ ...prev, amount: processedValue }));
                        }}
                        placeholder="0.00"
                        required
                        disabled={requiresSpecialForm(currentCreditEntry.ledgerCode, 'credit')}
                      />
                      
                      <button
                        type="button"
                        onClick={addCreditEntry}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                        disabled={requiresSpecialForm(currentCreditEntry.ledgerCode, 'credit')}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Credit Entry</span>
                      </button>
                    </div>

                    {creditEntries.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-md font-semibold mb-3 text-green-700 flex items-center space-x-2">
                          <Check className="h-4 w-4" />
                          <span>Credit Entries ({creditEntries.length}) - Total: ₹{creditTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                        </h4>
                        
                        <div className="overflow-x-auto rounded-lg border border-green-200">
                          <table className="w-full">
                            <thead className="bg-green-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Ledger Code</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Ledger Head</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Amount (₹)</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-green-200">
                              {creditEntries.map((entry, index) => (
                                <tr key={entry.id} className="hover:bg-green-50 transition-colors">
                                  <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerCode}</td>
                                  <td className="px-4 py-4 text-sm text-slate-900">
                                    {entry.ledgerName}
                                    {entry.hasDetailedForm && (
                                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Detailed
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                    ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </td>
                                  <td className="px-4 py-4 text-sm font-medium">
                                    <div className="flex items-center space-x-2">
                                      {entry.hasDetailedForm ? (
                                        <button
                                          onClick={() => handleViewSpecialForm(entry, 'credit')}
                                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                          title="View/Edit Detailed Form"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setCurrentCreditEntry({
                                              ledgerCode: entry.ledgerCode,
                                              ledgerName: entry.ledgerName,
                                              amount: entry.amount?.toLocaleString('en-IN')
                                            });
                                            setCreditEntries(prev => prev.filter(item => item.id !== entry.id));
                                            showToast('Credit entry loaded for editing', 'info');
                                          }}
                                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                          title="Edit Entry"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </button>
                                      )}
                                      <button
                                        onClick={() => removeCreditEntry(entry.id)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                                        title="Delete Entry"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <BalanceStatus debitTotal={debitTotal} creditTotal={creditTotal} />
 {formData.journalType === 'EJV' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <User className="h-5 w-5 mr-2 text-orange-500" />
                        Employee Details - Entry Journal Voucher (EJV)
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600">Add Employee Details?</span>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name="showEmployeeDetails"
                              value="no"
                              checked={!showEmployeeDetails}
                              onChange={() => {
                                setShowEmployeeDetails(false);
                                setShowMultipleEmployees(false);
                                setEmployeeEntries([]);
                              }}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name="showEmployeeDetails"
                              value="yes"
                              checked={showEmployeeDetails}
                               onChange={() => {setShowEmployeeDetails(true)
                               setShowMultipleEmployees(true); }
                            }
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {showEmployeeDetails && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <span className="text-sm font-medium text-slate-600">Multiple Employees?</span>
                          <div className="flex items-center space-x-2">
                            {/* <label className="flex items-center space-x-1">
                              <input
                                type="radio"
                                name="multipleEmployees"
                                value="no"
                                checked={!showMultipleEmployees}
                                onChange={() => {
                                  setShowMultipleEmployees(false);
                                  setEmployeeEntries([]);
                                }}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm">Single Employee</span>
                            </label> */}
                            {/* <label className="flex items-center space-x-1">
                              <input
                                type="radio"
                                name="multipleEmployees"
                                value="yes"
                                checked={showMultipleEmployees}
                                onChange={() => setShowMultipleEmployees(true)}
                                className="text-green-600 focus:ring-green-500"
                              />
                              <span className="text-sm">Multiple Employees</span>
                            </label> */}
                            <label className="flex items-center space-x-1">
  <input
    type="radio"
    name="showEmployeeDetails"
    value="yes"
    checked={showEmployeeDetails}
    onChange={() => {
      setShowEmployeeDetails(true);
      setShowMultipleEmployees(true);
    }}
    className="text-green-600 focus:ring-green-500"
  />
  <span className="text-sm">Yes</span>
</label>
                          </div>
                        </div>

                        {!showMultipleEmployees && (
                          <EmployeeDetails
                            formData={formData}
                            onChange={handleFormChange}
                            errors={{}}
                            title=""
                          />
                        )}

                        {/* {showMultipleEmployees && (
                          <MultipleEmployeeEntry
                            formData={formData}
                            onChange={handleFormChange}
                            showToast={showToast}
                            showConfirmDialog={mockShowConfirmDialog}
                            onEmployeeEntriesChange={handleEmployeeEntriesChange}
                            initialEmployeeEntries={employeeEntries}
                            ledgers={allLedgers}
                          />
                        )} */}
                        {showMultipleEmployees && (
  <EmployeeSelector
    onEmployeeEntriesChange={handleEmployeeEntriesChange}
    initialEmployeeEntries={employeeEntries}
    showToast={showToast}
    showConfirmDialog={mockShowConfirmDialog}
    ledgers={EMPLOYEE_LEDGERS} 
  />
)}
                      </div>
                    )}
                  </div>
                )}
                    {formData.journalType === 'CJV' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-blue-500" />
                        Work Details - Cash Journal Voucher (CJV)
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600">Add Work Details?</span>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name="showWorkDetails"
                              value="no"
                              checked={!showWorkDetails}
                              onChange={() => setShowWorkDetails(false)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name="showWorkDetails"
                              value="yes"
                              checked={showWorkDetails}
                              onChange={() => setShowWorkDetails(true)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {showWorkDetails && (
                      <WorkDetails
                        formData={formData}
                        onChange={handleFormChange}
                        errors={{}}
                        title=""
                        contractorLabel="Name of the Contractor"
                        contractorFieldName="nameOfContractor"
                        showScheme={true}
                      />
                    )}
                  </div>
                )}

                {formData.journalType === 'PJV' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-green-500" />
                        Work Details - Purchase Journal Voucher (PJV)
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-slate-600">Add Work Details?</span>
                        <div className="flex items-center space-x-2">
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name="showWorkDetailsPJV"
                              value="no"
                              checked={!showWorkDetails}
                              onChange={() => setShowWorkDetails(false)}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              name="showWorkDetailsPJV"
                              value="yes"
                              checked={showWorkDetails}
                              onChange={() => setShowWorkDetails(true)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm">Yes</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {showWorkDetails && (
                      <WorkDetails
                        formData={formData}
                        onChange={handleFormChange}
                        errors={{}}
                        title=""
                        contractorLabel="Name of the Supplier"
                        contractorFieldName="nameOfSupplier"
                        showScheme={true}
                      />
                    )}
                  </div>
                )}
                    <VoiceInputField
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description or use voice input (தமிழ்/EN)"
                rows={3}
             
                showToast={showToast}
                showLangToggle={true}
              />


                
                <div className="flex justify-center space-x-4 mt-8">
                  <ResetButton 
                    onClick={resetFormHandler}
                    loading={loading}
                  />
                  <SubmitButton
                    loading={loading}
                    onClick={handleSubmit}
                    editingId={editingId}
                    text="Voucher"
                    gradientFrom="from-purple-500"
                    gradientTo="to-indigo-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={dialogState.onConfirm}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        type={dialogState.type}
        loading={dialogState.loading}
        hideConfirm={dialogState.hideConfirm}
      />
    </div>
  );
};

export default JournalVoucher;