
import React, { useState, useEffect } from 'react';
import { CreditCard, Receipt, Calendar, AlertCircle, CheckCircle, Plus, Save, RefreshCw, Eye, FileText, Search, DollarSign, TrendingUp, Hash, Building, User, Trash2, Edit3, Wallet } from 'lucide-react';

// Import hooks
import { useToast } from '../../hooks/useToast';
import { useApiService } from '../../hooks/useApiService';

// Import components
import { ToastContainer } from '../../components/common/ToastContainer';
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { ResetButton } from '../../components/common/ResetButton';
import SearchableDropdown from "../../components/common/SearchableDropdown";
import WorkDetails from "../../components/common/WorkDetails";
import EmployeeDetails from "../../components/common/EmployeeDetails";
import { EmptyState } from '../../components/common/EmptyState';
import SearchableRecords from '../../components/common/SearchableRecords';
import { Header } from '../../components/common/Header';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import EmployeeSelector from '../transaction/employee/EmployeeSelector';

// Import services
import { payableService, accountService, fundService } from "../../services/realServices";
import { VoiceInputField } from '../../components/common/VoiceInputField';

const EMPLOYEE_LEDGERS = [
   { code: '1001', name: 'PF Ledger ' },
  { code: '1002', name: 'Info Ledger' },
];

const PayableDetails = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();

  const [formData, setFormData] = useState({
    financialYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
    fundType: '',
    ledgerCode: '',
    ledgerName: '',
    againstLedgerCode: '',
    againstLedgerName: '',
    transactionType: 'Debit',
    voucherNo: '',
    voucherDate: '',
    voucherType: '',
    amount: '',
    description: '',
    // Work Details
    nameOfScheme: '',
    nameOfWork: '',
    nameOfContractor: '',
    nameOfSupplier: '',
    estimateValue: '',
    valueOfWorkDone: '',
    workAmount: '',
    // Employee Details
    nameOfEmployee: '',
    designation: '',
    section: '',
    monthYear: '',
    employeeAmount: '',
    status: 'Pending'
  });

  const [accounts, setAccounts] = useState([]);
  const [savedRecords, setSavedRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState(null);
  const [showMultipleEmployees, setShowMultipleEmployees] = useState(false);
  const [employeeEntries, setEmployeeEntries] = useState([]);
  const [availableFunds, setAvailableFunds] = useState([]);
  
  // State variables for optional sections
  const [showWorkDetails, setShowWorkDetails] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    status: '',
    voucherType: '',
    financialYear: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadAccounts();
    loadSavedRecords();
    loadSummary();
    loadAvailableFunds();
    
    const editingPayableData = localStorage.getItem('editingPayable');
    const correctionMode = localStorage.getItem('correctionMode');
    
    if (editingPayableData && correctionMode === 'true') {
      const payable = JSON.parse(editingPayableData);
      handleEdit(payable);
      localStorage.removeItem('editingPayable');
      localStorage.removeItem('correctionMode');
      showToast('Payable record loaded for correction', 'success');
    }
  }, []);

  const loadAvailableFunds = async () => {
    try {
      const result = await fundService.getAll();
      setAvailableFunds(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Error loading funds:', error);
      setAvailableFunds([]);
    }
  };

  const loadAccounts = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) {
      setAccounts(result.data || []);
    }
  };

  const loadSavedRecords = async () => {
    const result = await executeApi(payableService.getAll);
    if (result.success) {
      setSavedRecords(result.data || []);
    }
  };

  const loadSummary = async () => {
    const result = await executeApi(payableService.getSummary);
    if (result.success) {
      setSummary(result.data);
    }
  };

  // Handle employee entries change from child component
  const handleEmployeeEntriesChange = (entries) => {
    setEmployeeEntries(entries);
  };

  // Convert options to SearchableDropdown format
  const transactionTypeOptions = [
    { value: 'Debit', label: 'Debit (Dr)', description: 'Debit transaction - money going out' },
    { value: 'Credit', label: 'Credit (Cr)', description: 'Credit transaction - money coming in' }
  ];

  const voucherTypeOptions = [
    { value: 'OB', label: 'OB - Opening Balance', description: 'Opening Balance voucher' },
    { value: 'RC', label: 'RC - Receipt', description: 'Receipt voucher' },
    { value: 'BRV', label: 'BRV - Bank Receipt Voucher', description: 'Bank Receipt Voucher' },
    { value: 'ADBRV', label: 'ADBRV - Advance Bank Receipt Voucher', description: 'Advance Bank Receipt Voucher' },
    { value: 'BPV', label: 'BPV - Bank Payment Voucher', description: 'Bank Payment Voucher' },
    { value: 'EJV', label: 'EJV - Entry Journal Voucher', description: 'Entry Journal Voucher' },
    { value: 'PJV', label: 'PJV - Purchase Journal Voucher', description: 'Purchase Journal Voucher' },
    { value: 'CJV', label: 'CJV - Contractor Journal Voucher', description: 'Contractor Journal Voucher' },
    { value: 'GJV', label: 'GJV - General Journal Voucher', description: 'General Journal Voucher' }
  ];

  const financialYearOptions = [
    { value: '2022-23', label: '2022-23', description: 'Financial Year 2022-23' },
    { value: '2023-24', label: '2023-24', description: 'Financial Year 2023-24' },
    { value: '2024-25', label: '2024-25', description: 'Financial Year 2024-25' },
    { value: '2025-26', label: '2025-26', description: 'Financial Year 2025-26' }
  ];

  const statusOptions = [
    { value: 'Pending', label: 'Pending', description: 'Payment pending' },
    { value: 'Paid', label: 'Paid', description: 'Payment completed' },
    { value: 'Overdue', label: 'Overdue', description: 'Payment overdue' },
    { value: 'Cancelled', label: 'Cancelled', description: 'Payment cancelled' }
  ];

  // Convert accounts to SearchableDropdown format
  const accountOptions = accounts.map(account => ({
    value: account.ledgerCode,
    label: `${account.ledgerCode} - ${account.ledgerName}`,
    description: account.description || `Account: ${account.ledgerName}`
  }));

  const fundOptions = availableFunds.map(fund => ({
    value: fund.fundName,
    label: fund.fundName,
    description: `Created: ${fund.createdDate}`
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ledgerCode') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setFormData(prev => ({
        ...prev,
        ledgerCode: value,
        ledgerName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else if (name === 'againstLedgerCode') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setFormData(prev => ({
        ...prev,
        againstLedgerCode: value,
        againstLedgerName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else if (['amount', 'estimateValue', 'valueOfWorkDone', 'workAmount', 'employeeAmount'].includes(name)) {
      // Format amount fields with commas
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        setFormData(prev => ({
          ...prev,
          [name]: parseFloat(numericValue).toLocaleString('en-IN')
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Handle voucher type changes and reset optional sections
  const handleVoucherTypeChange = (e) => {
    const voucherType = e.target.value;
    setFormData(prev => ({
      ...prev,
      voucherType: voucherType
    }));
    
    // Reset optional sections when voucher type changes
    setShowWorkDetails(false);
    setShowEmployeeDetails(false);
    setShowMultipleEmployees(false);
    setEmployeeEntries([]);
    
    // Clear related form fields
    if (voucherType !== 'CJV' && voucherType !== 'PJV') {
      setFormData(prev => ({
        ...prev,
        nameOfScheme: '',
        nameOfWork: '',
        nameOfContractor: '',
        nameOfSupplier: '',
        estimateValue: '',
        valueOfWorkDone: '',
        workAmount: ''
      }));
    }
    
    if (voucherType !== 'EJV') {
      setFormData(prev => ({
        ...prev,
        nameOfEmployee: '',
        designation: '',
        section: '',
        monthYear: '',
        employeeAmount: ''
      }));
    }
    
    // Clear error for this field
    if (errors.voucherType) {
      setErrors(prev => ({
        ...prev,
        voucherType: ''
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic required fields
    if (!formData.financialYear) {
      newErrors.financialYear = 'Financial year is required';
    }

    if (!formData.fundType.trim()) {
      newErrors.fundType = 'Fund type is required';
    }

    if (!formData.ledgerCode) {
      newErrors.ledgerCode = 'Ledger code is required';
    }

    if (!formData.transactionType) {
      newErrors.transactionType = 'Transaction type is required';
    }

    if (!formData.voucherType) {
      newErrors.voucherType = 'Voucher type is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const numericAmount = parseFloat(formData.amount.replace(/,/g, ''));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        newErrors.amount = 'Amount must be a valid positive number';
      }
    }

    // EJV specific validations - Only validate if employee details are enabled
    if (formData.voucherType === 'EJV' && showEmployeeDetails) {
      if (showMultipleEmployees) {
        if (employeeEntries.length === 0) {
          newErrors.employeeEntries = 'At least one employee entry is required for multiple employee mode';
        }
      } else {
        if (!formData.nameOfEmployee || !formData.nameOfEmployee.trim()) {
          newErrors.nameOfEmployee = 'Employee name is required for EJV vouchers';
        }
        if (!formData.employeeAmount || !formData.employeeAmount.trim()) {
          newErrors.employeeAmount = 'Employee amount is required for EJV vouchers';
        } else {
          const numericAmount = parseFloat(formData.employeeAmount.replace(/,/g, ''));
          if (isNaN(numericAmount) || numericAmount <= 0) {
            newErrors.employeeAmount = 'Employee amount must be a valid positive number';
          }
        }
      }
    }

    // Check for duplicate voucher number if provided
    if (formData.voucherNo) {
      const existingRecord = savedRecords.find(record => 
        (record.voucherNo === formData.voucherNo || record.challanNo === formData.voucherNo) && 
        (record.voucherType === formData.voucherType || record.challanType === formData.voucherType) &&
        record.id !== editingId
      );
      if (existingRecord) {
        newErrors.voucherNo = 'Voucher number already exists for this voucher type';
      }
    }

    // Validate amount fields only if work details are enabled
    if ((formData.voucherType === 'CJV' || formData.voucherType === 'PJV') && showWorkDetails) {
      ['estimateValue', 'valueOfWorkDone', 'workAmount'].forEach(field => {
        if (formData[field]) {
          const numericValue = parseFloat(formData[field].replace(/,/g, ''));
          if (isNaN(numericValue) || numericValue < 0) {
            newErrors[field] = 'Must be a valid positive number';
          }
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('Please fix the validation errors', 'error');
      return;
    }

    // STRICT VALIDATION: Employee entries total MUST match the main amount
    if (showMultipleEmployees && employeeEntries.length > 0) {
      const employeeTotal = employeeEntries.reduce((sum, entry) => sum + entry.employeeAmount, 0);
      const mainAmount = parseFloat(formData.amount.replace(/,/g, ''));
      
      if (Math.abs(employeeTotal - mainAmount) > 0.01) {
        await showConfirmDialog({
          title: 'Employee Total Mismatch - Cannot Save',
          message: `Employee entries total (₹${employeeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}) must match the main amount (₹${mainAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}). Please adjust the amounts.`,
          type: 'error',
          cancelText: 'OK',
          hideConfirm: true
        });
        return;
      }
    }

    // Convert amount fields back to numbers and map field names to match service expectations
    const submitData = {
      ...formData,
      // Map voucher fields to challan fields for service compatibility
      challanNo: formData.voucherNo,
      challanDate: formData.voucherDate,
      challanType: formData.voucherType,
      // Keep original voucher fields as well
      voucherNo: formData.voucherNo,
      voucherDate: formData.voucherDate,
      voucherType: formData.voucherType,
      // Add name field - use work name, employee name, or contractor name as fallback
      name: formData.nameOfWork || formData.nameOfEmployee || formData.nameOfContractor || formData.nameOfSupplier || 'Payable Record',
      // Convert amounts
      amount: parseFloat(formData.amount.replace(/,/g, '')),
      estimateValue: formData.estimateValue ? parseFloat(formData.estimateValue.replace(/,/g, '')) : 0,
      valueOfWorkDone: formData.valueOfWorkDone ? parseFloat(formData.valueOfWorkDone.replace(/,/g, '')) : 0,
      workAmount: formData.workAmount ? parseFloat(formData.workAmount.replace(/,/g, '')) : 0,
      employeeAmount: formData.employeeAmount ? parseFloat(formData.employeeAmount.replace(/,/g, '')) : 0,
      employeeEntries: showMultipleEmployees ? employeeEntries : []
    };

    let result;
    if (editingId) {
      result = await executeApi(payableService.update, editingId, submitData);
    } else {
      result = await executeApi(payableService.create, submitData);
    }

    if (result.success) {
      showToast(editingId ? 'Payable record updated successfully!' : 'Payable record created successfully!', 'success');
      resetForm();
      await loadSavedRecords();
      await loadSummary();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      financialYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
      fundType: '',
      ledgerCode: '',
      ledgerName: '',
      againstLedgerCode: '',
      againstLedgerName: '',
      transactionType: 'Debit',
      voucherNo: '',
      voucherDate: '',
      voucherType: '',
      amount: '',
      description: '',
      // Work Details
      nameOfScheme: '',
      nameOfWork: '',
      nameOfContractor: '',
      nameOfSupplier: '',
      estimateValue: '',
      valueOfWorkDone: '',
      workAmount: '',
      // Employee Details
      nameOfEmployee: '',
      designation: '',
      section: '',
      monthYear: '',
      employeeAmount: '',
      status: 'Pending'
    });
    setErrors({});
    setEditingId(null);
    setShowMultipleEmployees(false);
    setEmployeeEntries([]);
    setShowWorkDetails(false);
    setShowEmployeeDetails(false);
    setShowRecords(false);
    clearError();
  };

  const handleEdit = (record) => {
    console.log('=== EDIT DEBUG (Payable Details) ===');
    console.log('Editing record:', record);
    console.log('Record employee entries:', record.employeeEntries);
    
    // Determine if this record has multiple employees or single employee
    const hasMultipleEmployees = record.employeeEntries && Array.isArray(record.employeeEntries) && record.employeeEntries.length > 0;
    const hasSingleEmployee = record.nameOfEmployee && record.nameOfEmployee.trim() !== '';
    const hasWorkDetails = record.nameOfWork || record.nameOfContractor || record.nameOfSupplier || record.nameOfScheme;
    
    console.log('Has multiple employees:', hasMultipleEmployees);
    console.log('Has single employee:', hasSingleEmployee);
    console.log('Has work details:', hasWorkDetails);
    
    // Set the optional section states based on what the record contains
    if (record.voucherType === 'EJV') {
      setShowEmployeeDetails(hasSingleEmployee || hasMultipleEmployees);
      if (hasMultipleEmployees) {
        setEmployeeEntries(record.employeeEntries);
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
    
    if (record.voucherType === 'CJV' || record.voucherType === 'PJV') {
      setShowWorkDetails(hasWorkDetails);
    } else {
      setShowWorkDetails(false);
    }
    
    // Set form data
    setFormData({
      financialYear: record.financialYear || '',
      fundType: record.fundType || '',
      ledgerCode: record.ledgerCode || '',
      ledgerName: record.ledgerName || '',
      againstLedgerCode: record.againstLedgerCode || '',
      againstLedgerName: record.againstLedgerName || '',
      transactionType: record.transactionType || 'Debit',
      voucherNo: record.voucherNo || record.challanNo || '',
      voucherDate: record.voucherDate || record.challanDate || '',
      voucherType: record.voucherType || record.challanType || '',
      amount: record.amount ? record.amount.toLocaleString('en-IN') : '',
      description: record.description || '',
      // Work Details
      nameOfScheme: record.nameOfScheme || '',
      nameOfWork: record.nameOfWork || '',
      nameOfContractor: record.nameOfContractor || '',
      nameOfSupplier: record.nameOfSupplier || '',
      estimateValue: record.estimateValue ? record.estimateValue.toLocaleString('en-IN') : '',
      valueOfWorkDone: record.valueOfWorkDone ? record.valueOfWorkDone.toLocaleString('en-IN') : '',
      workAmount: record.workAmount ? record.workAmount.toLocaleString('en-IN') : '',
      // Employee Details - Only load if not in multiple employee mode
      nameOfEmployee: hasMultipleEmployees ? '' : (record.nameOfEmployee || ''),
      designation: hasMultipleEmployees ? '' : (record.designation || ''),
      section: hasMultipleEmployees ? '' : (record.section || ''),
      monthYear: hasMultipleEmployees ? '' : (record.monthYear || ''),
      employeeAmount: hasMultipleEmployees ? '' : (record.employeeAmount ? record.employeeAmount.toLocaleString('en-IN') : ''),
      status: record.status || 'Pending'
    });
    
    setEditingId(record.id);
    setShowRecords(false);
    clearError();
    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    console.log('Edit setup complete. Employee entries state:', employeeEntries);
    console.log('Show multiple employees state:', showMultipleEmployees);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Payable Record',
      message: `Are you sure you want to delete payable record "${record.voucherNo || record.challanNo}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });
    
    if (confirmed) {
      const result = await executeApi(payableService.delete, record.id);
      if (result.success) {
        showToast('Payable record deleted successfully!', 'success');
        await loadSavedRecords();
        await loadSummary();
      } else {
        showToast('Failed to delete payable record!', 'error');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await executeApi(payableService.updateStatus, id, newStatus);
    if (result.success) {
      showToast(`Status updated to ${newStatus}`, 'success');
      await loadSavedRecords();
      await loadSummary();
    } else {
      showToast('Failed to update status', 'error');
    }
  };

  const handleAdvancedFilters = (filters) => {
    setSearchFilters(filters);
  };

  const filteredRecords = savedRecords.filter(record => {
    const filters = searchFilters;
    
    const searchMatch = !filters.searchTerm || 
      record.voucherNo?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.transactionType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.ledgerName?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.description?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.nameOfWork?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.nameOfEmployee?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const dateFromMatch = !filters.dateFrom || record.voucherDate >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || record.voucherDate <= filters.dateTo;

    const amountMinMatch = !filters.amountMin || record.amount >= parseFloat(filters.amountMin);
    const amountMaxMatch = !filters.amountMax || record.amount <= parseFloat(filters.amountMax);

    const statusMatch = !filters.status || record.status === filters.status;
    const voucherTypeMatch = !filters.voucherType || record.voucherType === filters.voucherType;
    const financialYearMatch = !filters.financialYear || record.financialYear === filters.financialYear;

    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch && 
           amountMaxMatch && statusMatch && voucherTypeMatch && financialYearMatch;
  });

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Payable Details"
        subtitle="Manage payments, work orders, and employee transactions"
        icon={CreditCard}
        totalRecords={savedRecords.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetForm}
        loading={loading}
        gradientFrom="from-red-500"
        gradientTo="to-pink-500"
        countBg="from-red-100"
        countTo="to-pink-100"
        countBorder="border-red-200"
        countText="text-red-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Payable Records"
          totalRecords={filteredRecords.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-red-500"
          gradientTo="to-pink-500"
          customFilters={[
            {
              key: 'voucherType',
              label: 'Voucher Type',
              type: 'select',
              icon: Receipt,
              options: [
                { value: '', label: 'All Types' },
                ...voucherTypeOptions.map(opt => ({ value: opt.value, label: opt.label }))
              ]
            },
            {
              key: 'financialYear',
              label: 'Financial Year',
              type: 'select',
              icon: Calendar,
              options: [
                { value: '', label: 'All Years' },
                ...financialYearOptions.map(opt => ({ value: opt.value, label: opt.label }))
              ]
            }
          ]}
        >
          {filteredRecords.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payable records found."
              actionText="Create your first record"
              onAction={() => setShowRecords(false)}
              searchTerm={searchFilters.searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-red-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.voucherType} - {record.voucherNo || record.challanNo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {record.voucherDate || record.challanDate} | Fund: {record.fundType} | FY: {record.financialYear}
                        </p>
                        <p className="text-sm text-gray-600">
                          {record.transactionType}: {record.ledgerCode} - {record.ledgerName}
                        </p>
                        {record.nameOfWork && (
                          <p className="text-sm text-blue-600">Work: {record.nameOfWork}</p>
                        )}
                        {record.nameOfContractor && (
                          <p className="text-sm text-blue-600">Contractor: {record.nameOfContractor}</p>
                        )}
                        {record.nameOfSupplier && (
                          <p className="text-sm text-blue-600">Supplier: {record.nameOfSupplier}</p>
                        )}
                        {record.nameOfEmployee && (
                          <p className="text-sm text-blue-600">Employee: {record.nameOfEmployee}</p>
                        )}
                        {record.employeeEntries && record.employeeEntries.length > 0 && (
                          <p className="text-sm text-blue-600">Multiple Employees: {record.employeeEntries.length} entries</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">Amount: ₹{record.amount?.toLocaleString('en-IN')}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                            record.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            record.status === 'Cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Type: {record.transactionType}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(record)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Employee Entries Details */}
                  {record.employeeEntries && record.employeeEntries.length > 0 && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Employee Details ({record.employeeEntries.length} employees)
                      </h4>
                      <div className="space-y-3">
                        {record.employeeEntries.map((emp, idx) => (
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
                          Total Employee Amount: ₹{record.employeeEntries.reduce((sum, emp) => sum + emp.employeeAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {record.description && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">description: </span>
                        {record.description}
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
          <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Payable Record' : 'Create New Payable Record'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-red-500" />
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fund Type */}
                <SearchableDropdown
                  options={fundOptions}
                  value={formData.fundType}
                  onChange={(e) => handleChange({ target: { name: 'fundType', value: e.target.value } })}
                  label="Fund Type"
                  placeholder="Select a fund type"
                  searchPlaceholder="Search funds..."
                  required
                  error={errors.fundType}
                  icon={Wallet}
                  emptyMessage="No funds available. Create funds first."
                />

                {/* Financial Year */}
                <SearchableDropdown
                  label="Financial Year"
                  placeholder="Select Financial Year"
                  searchPlaceholder="Search financial year..."
                  options={financialYearOptions}
                  value={formData.financialYear}
                  onChange={(e) => handleChange({ target: { name: 'financialYear', value: e.target.value } })}
                  required
                  error={errors.financialYear}
                  icon={Calendar}
                  emptyMessage="No financial years available"
                />
                
                {/* Ledger Code */}
                <SearchableDropdown
                  label="Ledger Code"
                  placeholder="Select Ledger Account"
                  searchPlaceholder="Search by code or name..."
                  options={accountOptions}
                  value={formData.ledgerCode}
                  onChange={(e) => handleChange({ target: { name: 'ledgerCode', value: e.target.value } })}
                  required
                  error={errors.ledgerCode}
                  icon={Hash}
                  emptyMessage="No accounts available"
                  maxHeight="250px"
                />
                
                {/* Transaction Type */}
                <SearchableDropdown
                  label="Transaction Type"
                  placeholder="Select Transaction Type"
                  searchPlaceholder="Search transaction types..."
                  options={transactionTypeOptions}
                  value={formData.transactionType}
                  onChange={(e) => handleChange({ target: { name: 'transactionType', value: e.target.value } })}
                  required
                  error={errors.transactionType}
                  icon={DollarSign}
                  emptyMessage="No transaction types available"
                />
              </div>
            </div>

            {/* Voucher Details */}
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-blue-500" />
                Voucher Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  label="Voucher No"
                  name="voucherNo"
                  value={formData.voucherNo}
                  onChange={handleChange}
                  placeholder="Enter voucher number"
                  error={errors.voucherNo}
                />
                
                <FormField
                  label="Voucher Date"
                  name="voucherDate"
                  type="date"
                  value={formData.voucherDate}
                  onChange={handleChange}
                  error={errors.voucherDate}
                  icon={Calendar}
                />
                
                {/* Voucher Type */}
                <SearchableDropdown
                  label="Voucher Type"
                  placeholder="Select Voucher Type"
                  searchPlaceholder="Search voucher types..."
                  options={voucherTypeOptions}
                  value={formData.voucherType}
                  onChange={handleVoucherTypeChange}
                  required
                  error={errors.voucherType}
                  icon={Receipt}
                  emptyMessage="No voucher types available"
                  maxHeight="250px"
                />
                
                <FormField
                  label="Amount (₹)"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  error={errors.amount}
                  placeholder="0.00"
                  icon={DollarSign}
                />

                {/* Status */}
                <SearchableDropdown
                  label="Status"
                  placeholder="Select Status"
                  searchPlaceholder="Search status..."
                  options={statusOptions}
                  value={formData.status}
                  onChange={(e) => handleChange({ target: { name: 'status', value: e.target.value } })}
                  required
                  icon={CheckCircle}
                  emptyMessage="No status options available"
                />
              </div>
            </div>

            {/* CJV - Cash Journal Voucher (Contractor Work) */}
            {formData.voucherType === 'CJV' && (
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
                    onChange={handleChange}
                    errors={errors}
                    title=""
                    contractorLabel="Name of the Contractor"
                    contractorFieldName="nameOfContractor"
                    showScheme={true}
                  />
                )}
              </div>
            )}

            {/* PJV - Purchase Journal Voucher (Supplier) */}
            {formData.voucherType === 'PJV' && (
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
                    onChange={handleChange}
                    errors={errors}
                    title=""
                    contractorLabel="Name of the Supplier"
                    contractorFieldName="nameOfSupplier"
                    showScheme={true}
                  />
                )}
              </div>
            )}

            {/* EJV - Entry Journal Voucher (Employee Details) */}
            {formData.voucherType === 'EJV' && (
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
                </div>

                {showEmployeeDetails && (
                  <div className="space-y-4">
                    {!showMultipleEmployees && (
                      <EmployeeDetails
                        formData={formData}
                        onChange={handleChange}
                        errors={errors}
                        title=""
                      />
                    )}

                    {showMultipleEmployees && (
                      <EmployeeSelector
                        onEmployeeEntriesChange={handleEmployeeEntriesChange}
                        initialEmployeeEntries={employeeEntries}
                        showToast={showToast}
                        showConfirmDialog={showConfirmDialog}
                        ledgers={EMPLOYEE_LEDGERS} 
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Show validation errors if any */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {Object.entries(errors).map(([field, message]) => (
                        <li key={field}>{message}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* description */}
             <VoiceInputField
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter   description or use voice input (தமிழ்/EN)"
                rows={3}
                error={errors.description}
                showToast={showToast}
                showLangToggle={true}
              />

            <div className="flex justify-center space-x-4 mt-8">
              <ResetButton 
                onClick={resetForm}
                loading={loading}
              />
              <SubmitButton
                loading={loading}
                onClick={handleSubmit}
                editingId={editingId}
                text="Payable Record"
                gradientFrom="from-red-500"
                gradientTo="to-pink-500"
              />
            </div>
          </div>
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

export default PayableDetails;