
import React, { useState, useEffect } from 'react';
import { FormField } from "../../components/common/FormField";
import { DataTable } from "../../components/common/DataTable";
import { ToastContainer } from "../../components/common/ToastContainer";
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import WorkDetails from "../../components/common/WorkDetails";
import { advanceDepositService, accountService } from "../../services/realServices";
import { showConfirmDialog as showUtilConfirmDialog } from "../../utils/confirmDialog";
import { useApiService } from "../../hooks/useApiService";
import { useToast } from "../../hooks/useToast";
import { CreditCard, Receipt, AlertCircle, Plus, Save, RefreshCw, Eye, FileText, X, Calendar, DollarSign, Users, Hash, Building, Trash2 } from 'lucide-react';
import ErrorDisplay from '../../components/common/ErrorDisplay';
import { VoiceInputField } from '../../components/common/VoiceInputField';
import SearchableRecords from '../../components/common/SearchableRecords';
import EmployeeSelector from '../transaction/employee/EmployeeSelector';


const ITEMS_PER_PAGE = 20;

// This is the base component that both AdvanceRegister and DepositRegister will extend
const AdvanceDeposits = ({
  registerType, 
  defaultRegisterType, 
  showLedgerField = true,
  title,
  description 
}) => {
  const [formData, setFormData] = useState({
    financialYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
    ledgerCode: '',
    ledgerName: '',
    transactionType: '',
    advDepNo: '',
    voucherNo: '',
    voucherDate: '',
    voucherType: '',
    amount: '',
    nameDesignation: '',
    description: '',
    status: 'Active',
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
    employeeAmount: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [savedRecords, setSavedRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', transactionType: '', voucherType: '' });
  const [errors, setErrors] = useState({});
  const [showMultipleEmployees, setShowMultipleEmployees] = useState(false);
  const [employeeEntries, setEmployeeEntries] = useState([]);
  const [showWorkDetails, setShowWorkDetails] = useState(false);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [viewingEmployeeRecord, setViewingEmployeeRecord] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { executeApi, loading, error, clearError } = useApiService();
  const { toasts, showToast, removeToast } = useToast();
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();

  // Load data on component mount
  useEffect(() => {
    loadAccounts();
    loadSavedRecords();
  }, []);

  const loadAccounts = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) {
      setAccounts(result.data || []);
    }
  };

  const loadSavedRecords = async () => {
    const result = await executeApi(advanceDepositService.getAll);
    if (result.success) {
      // Filter records by registerType
      const filteredRecords = result.data.filter(record => 
        record.registerType === defaultRegisterType
      );
      setSavedRecords(filteredRecords || []);
    }
  };

  const handleEmployeeEntriesChange = (entries) => {
    setEmployeeEntries(entries);
    // Auto-populate main amount from total of employee entries
    if (entries.length > 0) {
      const total = entries.reduce((sum, e) => sum + (e.employeeAmount || 0), 0);
      setFormData(prev => ({
        ...prev,
        amount: total.toLocaleString('en-IN')
      }));
    }
  };

  // Convert arrays to SearchableDropdown format
  const transactionTypeOptions = [
    { value: 'Debit', label: 'Debit', description: 'Debit transaction' },
    { value: 'Credit', label: 'Credit', description: 'Credit transaction' }
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

  const accountOptions = accounts.map(account => ({
    value: account.ledgerCode,
    label: `${account.ledgerCode} - ${account.ledgerName}`,
    description: account.description || `Account: ${account.ledgerName}`
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

  const handleVoucherTypeChange = (e) => {
    const voucherType = e.target.value;
    setFormData(prev => ({
      ...prev,
      voucherType: voucherType
    }));
    
    // Reset optional sections when voucher type changes
    setShowWorkDetails(false);
    setShowEmployeeDetails(voucherType === 'EJV');
    setShowMultipleEmployees(voucherType === 'EJV');
    if (voucherType !== 'EJV') setEmployeeEntries([]);
    setViewingEmployeeRecord(null);
    
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

  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    if (name === 'voucherType') {
      handleVoucherTypeChange(e);
      return;
    }
    
    if (name === 'ledgerCode') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setFormData(prev => ({
        ...prev,
        ledgerCode: value,
        ledgerName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.financialYear) {
      newErrors.financialYear = 'Financial year is required';
    }

    if (showLedgerField && !formData.ledgerCode) {
      newErrors.ledgerCode = 'Ledger code is required';
    }

    if (!formData.transactionType) {
      newErrors.transactionType = 'Transaction type is required';
    }

    if (!formData.voucherDate) {
      newErrors.voucherDate = 'Voucher date is required';
    }

    if (!formData.voucherType) {
      newErrors.voucherType = 'Voucher type is required';
    }

    const isMultipleEjv = formData.voucherType === 'EJV' && showMultipleEmployees && employeeEntries.length > 0;
    if (!isMultipleEjv) {
      if (!formData.amount) {
        newErrors.amount = 'Amount is required';
      } else {
        const numericAmount = parseFloat(formData.amount.replace(/,/g, ''));
        if (isNaN(numericAmount) || numericAmount <= 0) {
          newErrors.amount = 'Amount must be a valid positive number';
        }
      }
    }

    if (!formData.nameDesignation.trim()) {
      newErrors.nameDesignation = 'Name & Designation is required';
    }

    // EJV specific validations
    if (formData.voucherType === 'EJV' && showEmployeeDetails) {
      if (showMultipleEmployees) {
        if (employeeEntries.length === 0) {
          newErrors.employeeEntries = 'At least one employee entry is required for multiple employee mode';
        }
      } else {
        // Single employee validation
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
        record.voucherNo === formData.voucherNo && 
        record.registerType === defaultRegisterType &&
        record.id !== editingId
      );
      if (existingRecord) {
        newErrors.voucherNo = 'Voucher number already exists for this register type';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the validation errors', 'error');
      return;
    }

    const submitData = {
      registerType: defaultRegisterType,
      ...formData,
      challanDate: formData.voucherDate,
      amount: showMultipleEmployees && employeeEntries.length > 0
        ? employeeEntries.reduce((sum, e) => sum + (e.employeeAmount || 0), 0)
        : parseFloat((formData.amount || '0').replace(/,/g, '')),
      estimateValue: formData.estimateValue ? parseFloat(formData.estimateValue.replace(/,/g, '')) : 0,
      valueOfWorkDone: formData.valueOfWorkDone ? parseFloat(formData.valueOfWorkDone.replace(/,/g, '')) : 0,
      workAmount: formData.workAmount ? parseFloat(formData.workAmount.replace(/,/g, '')) : 0,
      employeeAmount: formData.employeeAmount ? parseFloat(formData.employeeAmount.replace(/,/g, '')) : 0,
      employeeEntries: showMultipleEmployees ? employeeEntries : []
    };
    
    let result;
    if (editingId) {
      result = await executeApi(advanceDepositService.update, editingId, submitData);
    } else {
      result = await executeApi(advanceDepositService.create, submitData);
    }

    if (result.success) {
      const message = editingId 
        ? `${defaultRegisterType} details updated successfully!`
        : `${defaultRegisterType} details saved successfully!`;
      
      showToast(message, 'success');
      resetForm();
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      financialYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
      ledgerCode: '',
      ledgerName: '',
      transactionType: '',
      advDepNo: '',
      voucherNo: '',
      voucherDate: '',
      voucherType: '',
      amount: '',
      nameDesignation: '',
      description: '',
      status: 'Active',
      nameOfScheme: '',
      nameOfWork: '',
      nameOfContractor: '',
      nameOfSupplier: '',
      estimateValue: '',
      valueOfWorkDone: '',
      workAmount: '',
      nameOfEmployee: '',
      designation: '',
      section: '',
      monthYear: '',
      employeeAmount: ''
    });
    setErrors({});
    setEditingId(null);
    setShowWorkDetails(false);
    setShowEmployeeDetails(false);
    setShowMultipleEmployees(false);
    setEmployeeEntries([]);
    setViewingEmployeeRecord(null);
    clearError();
  };

  const handleEdit = (record) => {
    const hasWorkDetails = record.nameOfWork || record.nameOfContractor || record.nameOfSupplier || record.nameOfScheme;
    const hasMultipleEmployees = record.employeeEntries && Array.isArray(record.employeeEntries) && record.employeeEntries.length > 0;
    
    if (record.voucherType === 'EJV') {
      setShowEmployeeDetails(true);
      setShowMultipleEmployees(true);
      setEmployeeEntries(hasMultipleEmployees ? record.employeeEntries : []);
    } else {
      setShowEmployeeDetails(false);
      setShowMultipleEmployees(false);
      setEmployeeEntries([]);
    }
    setViewingEmployeeRecord(null);
    
    if (record.voucherType === 'CJV' || record.voucherType === 'PJV') {
      setShowWorkDetails(hasWorkDetails);
    } else {
      setShowWorkDetails(false);
    }

    setFormData({
      financialYear: record.financialYear || '',
      ledgerCode: record.ledgerCode || '',
      ledgerName: record.ledgerName || '',
      transactionType: record.transactionType || '',
      advDepNo: record.advDepNo || '',
      voucherNo: record.voucherNo || '',
      voucherDate: record.voucherDate || '',
      voucherType: record.voucherType || '',
      amount: record.amount ? record.amount.toLocaleString('en-IN') : '',
      nameDesignation: record.nameDesignation || '',
      description: record.description || '',
      status: record.status || 'Active',
      nameOfScheme: record.nameOfScheme || '',
      nameOfWork: record.nameOfWork || '',
      nameOfContractor: record.nameOfContractor || '',
      nameOfSupplier: record.nameOfSupplier || '',
      estimateValue: record.estimateValue ? record.estimateValue.toLocaleString('en-IN') : '',
      valueOfWorkDone: record.valueOfWorkDone ? record.valueOfWorkDone.toLocaleString('en-IN') : '',
      workAmount: record.workAmount ? record.workAmount.toLocaleString('en-IN') : '',
      nameOfEmployee: hasMultipleEmployees ? '' : (record.nameOfEmployee || ''),
      designation: hasMultipleEmployees ? '' : (record.designation || ''),
      section: hasMultipleEmployees ? '' : (record.section || ''),
      monthYear: hasMultipleEmployees ? '' : (record.monthYear || ''),
      employeeAmount: hasMultipleEmployees ? '' : (record.employeeAmount ? record.employeeAmount.toLocaleString('en-IN') : '')
    });
    setEditingId(record.id);
    setShowRecords(false);
    clearError();
    
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleDelete = async (record) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Record',
      message: `Are you sure you want to delete the ${record.registerType.toLowerCase()} record for "${record.nameDesignation}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });

    if (confirmed) {
      const result = await executeApi(advanceDepositService.delete, record.id);
      
      setTimeout(() => {
        closeDialog();
        if (result.success) {
          showToast('Record deleted successfully!', 'success');
          loadSavedRecords();
        } else {
          showToast('Failed to delete record!', 'error');
        }
      }, 500);
    } else {
      closeDialog();
    }
  };

  const handleSearch = async () => {
    if (searchFilters.searchTerm.trim()) {
      const result = await executeApi(advanceDepositService.search, searchFilters.searchTerm);
      if (result.success) {
        // Filter by register type
        const filteredRecords = result.data.filter(record =>
          record.registerType === defaultRegisterType
        );
        setSavedRecords(filteredRecords || []);
      }
    } else {
      await loadSavedRecords();
    }
  };

  const filteredRecords = savedRecords.filter(record => {
    const { searchTerm, transactionType, voucherType } = searchFilters;
    const matchesSearch = !searchTerm ||
      record.nameDesignation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.voucherType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTransactionType = !transactionType || record.transactionType === transactionType;
    const matchesVoucherType = !voucherType || record.voucherType === voucherType;
    return matchesSearch && matchesTransactionType && matchesVoucherType;
  });

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    if (paginatedRecords.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRecords.map(item => item.id)));
    }
  };

  const handleSelectItem = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    const confirmed = await showUtilConfirmDialog(
      'Delete Selected',
      `Are you sure you want to delete ${selectedIds.size} selected record(s)? This action cannot be undone.`,
      'Delete All',
      'Cancel'
    );
    if (confirmed) {
      let count = 0;
      for (const id of selectedIds) {
        const result = await executeApi(advanceDepositService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadSavedRecords();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  const columns = [
    {
      key: '__select__',
      title: (
        <input
          type="checkbox"
          checked={paginatedRecords.length > 0 && paginatedRecords.every(item => selectedIds.has(item.id))}
          onChange={handleSelectAll}
          className="rounded"
        />
      ),
      render: (_value, row) => (
        <input
          type="checkbox"
          checked={selectedIds.has(row.id)}
          onChange={() => handleSelectItem(row.id)}
          className="rounded"
          onClick={(e) => e.stopPropagation()}
        />
      )
    },
    { key: 'financialYear', title: 'Financial Year', sortable: true },
    ...(showLedgerField ? [
      {
        key: 'ledgerCode',
        title: 'Ledger Code',
        render: (value, row) => `${value} - ${row.ledgerName}`
      }
    ] : []),
    { key: 'transactionType', title: 'Transaction Type', sortable: true },
    { key: 'advDepNo', title: 'Adv/Dep No' },
    { key: 'voucherNo', title: 'Voucher No' },
    { key: 'voucherDate', title: 'Voucher Date', sortable: true },
    { key: 'voucherType', title: 'Voucher Type' },
    { key: 'amount', title: 'Amount (₹)', render: (value) => value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { key: 'nameDesignation', title: 'Name & Designation' },
    {
      key: 'employeeEntries',
      title: 'Employees',
      render: (_value, row) => {
        const entries = row.employeeEntries;
        if (!entries || entries.length === 0) return <span className="text-gray-400 text-xs">—</span>;
        const isViewing = viewingEmployeeRecord?.id === row.id;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); setViewingEmployeeRecord(isViewing ? null : row); }}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${isViewing ? 'bg-orange-200 text-orange-800' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
          >
            <Users className="h-3 w-3" />
            <span>{entries.length} emp{entries.length !== 1 ? 's' : ''}</span>
          </button>
        );
      }
    },
    { key: 'status', title: 'Status', render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        {value || 'Active'}
      </span>
    )},
    { key: 'description', title: 'Description' },
  ];

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 bg-gradient-to-r ${registerType === 'Advance Register' ? 'from-blue-500 to-indigo-500' : 'from-green-500 to-emerald-500'} rounded-lg flex items-center justify-center`}>
            {registerType === 'Advance Register' ? (
              <CreditCard className="h-4 w-4 text-white" />
            ) : (
              <Receipt className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit' : 'Add'} {title}
            </h1>
            <p className="text-slate-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${registerType === 'Advance Register' ? 'from-blue-100 to-indigo-100' : 'from-green-100 to-emerald-100'} border ${registerType === 'Advance Register' ? 'border-blue-200' : 'border-green-200'} rounded-lg`}>
            <FileText className={`h-4 w-4 ${registerType === 'Advance Register' ? 'text-blue-600' : 'text-green-600'}`} />
            <span className={`text-sm font-semibold ${registerType === 'Advance Register' ? 'text-blue-800' : 'text-green-800'}`}>
              Total Records: {savedRecords.length}
            </span>
          </div>
          <button
            onClick={() => setShowRecords(!showRecords)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            disabled={loading}
          >
            <Eye className="h-4 w-4" />
            <span>{showRecords ? 'Hide Records' : 'Edit Records'}</span>
          </button>
          {editingId && (
            <button
              onClick={() => {
                resetForm();
                setShowRecords(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Records List */}
      {showRecords && (
        <SearchableRecords
          title="Saved Records"
          totalRecords={filteredRecords.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-purple-500"
          gradientTo="to-pink-500"
          searchPlaceholder="Search by name, voucher no, ledger, or transaction type..."
          filterConfig={{ dateRange: true, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            {
              key: 'transactionType',
              label: 'Transaction Type',
              type: 'select',
              icon: Receipt,
              options: [
                { value: '', label: 'All Types' },
                { value: 'Advance', label: 'Advance' },
                { value: 'Deposit', label: 'Deposit' },
              ]
            },
            {
              key: 'voucherType',
              label: 'Voucher Type',
              type: 'text',
              icon: FileText,
              placeholder: 'Voucher type...'
            }
          ]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
        >
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.size} record(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
                >
                  Clear
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected ({selectedIds.size})</span>
                </button>
              </div>
            </div>
          )}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchFilters.searchTerm || searchFilters.transactionType || searchFilters.voucherType ? 'No records found matching your search.' : 'No records found.'}
              </p>
              {!searchFilters.searchTerm && !searchFilters.transactionType && !searchFilters.voucherType && (
                <button
                  onClick={() => setShowRecords(false)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
                >
                  Create your first record →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={paginatedRecords}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {/* Employee Entries Detail Panel */}
              {viewingEmployeeRecord && viewingEmployeeRecord.employeeEntries?.length > 0 && (
                    <div className="m-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-md font-semibold text-orange-800 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Employee Details — {viewingEmployeeRecord.nameDesignation} ({viewingEmployeeRecord.employeeEntries.length} employee{viewingEmployeeRecord.employeeEntries.length !== 1 ? 's' : ''})
                        </h4>
                        <button onClick={() => setViewingEmployeeRecord(null)} className="text-orange-500 hover:text-orange-800">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-orange-100">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase">Emp ID</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase">Name</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase">Designation</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase">Section</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase">Period</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-orange-700 uppercase">Amount (₹)</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-orange-700 uppercase">Ledger Breakdown</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-orange-100">
                            {viewingEmployeeRecord.employeeEntries.map((emp, idx) => (
                              <tr key={idx} className="hover:bg-orange-50">
                                <td className="px-3 py-2 text-gray-600">{emp.empId || '—'}</td>
                                <td className="px-3 py-2 font-medium text-gray-900">{emp.nameOfEmployee}</td>
                                <td className="px-3 py-2 text-gray-700">{emp.designation}</td>
                                <td className="px-3 py-2 text-gray-700">{emp.section}</td>
                                <td className="px-3 py-2 text-gray-700">{emp.monthYear}</td>
                                <td className="px-3 py-2 text-right font-semibold text-green-700">
                                  ₹{(emp.employeeAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-3 py-2">
                                  {emp.ledgerEntries && emp.ledgerEntries.length > 0 ? (
                                    <div className="space-y-1">
                                      {emp.ledgerEntries.map((le, li) => (
                                        <div key={li} className="text-xs text-gray-600">
                                          {le.ledgerCode} — {le.ledgerName}: ₹{(le.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </div>
                                      ))}
                                    </div>
                                  ) : <span className="text-gray-400 text-xs">—</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-orange-100">
                            <tr>
                              <td colSpan={5} className="px-3 py-2 text-right font-semibold text-orange-800 text-sm">Total:</td>
                              <td className="px-3 py-2 text-right font-bold text-green-700">
                                ₹{viewingEmployeeRecord.employeeEntries.reduce((s, e) => s + (e.employeeAmount || 0), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
            </div>
          )}
        </SearchableRecords>
      )}

      {/* Main Form */}
      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className={`bg-gradient-to-r ${registerType === 'Advance Register' ? 'from-blue-500 to-indigo-500' : 'from-green-500 to-emerald-500'} px-6 py-4`}>
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Record Details' : 'Add New Record Details'}
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Financial Year Dropdown */}
                <SearchableDropdown
                  label="Financial Year"
                  placeholder="Select Financial Year"
                  searchPlaceholder="Search financial year..."
                  options={financialYearOptions}
                  value={formData.financialYear}
                  onChange={handleDropdownChange('financialYear')}
                  required
                  error={errors.financialYear}
                  icon={Calendar}
                  emptyMessage="No financial years available"
                />
                
                {/* Ledger Code Dropdown - Conditionally rendered */}
                {showLedgerField && (
                  <SearchableDropdown
                    label="Ledger Code"
                    placeholder="Select Ledger Account"
                    searchPlaceholder="Search by code or name..."
                    options={accountOptions}
                    value={formData.ledgerCode}
                    onChange={handleDropdownChange('ledgerCode')}
                    required
                    error={errors.ledgerCode}
                    icon={Hash}
                    emptyMessage="No accounts available"
                    maxHeight="250px"
                  />
                )}
                
                {/* Transaction Type Dropdown */}
                <SearchableDropdown
                  label="Transaction Type"
                  placeholder="Select Transaction Type"
                  searchPlaceholder="Search transaction type..."
                  options={transactionTypeOptions}
                  value={formData.transactionType}
                  onChange={handleDropdownChange('transactionType')}
                  required
                  error={errors.transactionType}
                  icon={DollarSign}
                  emptyMessage="No transaction types available"
                />
                
                <FormField
                  label="Adv / Dep No"
                  name="advDepNo"
                  value={formData.advDepNo}
                  onChange={handleChange}
                  placeholder="Enter advance/deposit number"
                />
                
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
                  required
                  error={errors.voucherDate}
                />
                
                {/* Voucher Type Dropdown */}
                <SearchableDropdown
                  label="Voucher Type"
                  placeholder="Select Voucher Type"
                  searchPlaceholder="Search voucher type..."
                  options={voucherTypeOptions}
                  value={formData.voucherType}
                  onChange={handleDropdownChange('voucherType')}
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
                  placeholder="0.00"
                  error={errors.amount}
                />
                
                <FormField
                  label="Name & Designation"
                  name="nameDesignation"
                  value={formData.nameDesignation}
                  onChange={handleChange}
                  required
                  placeholder="Enter name and designation"
                  error={errors.nameDesignation}
                />
              </div>

              {/* Conditional Sections Based on Voucher Type */}
              
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
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-slate-700 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-orange-500" />
                      Employee Details — Entry Journal Voucher (EJV)
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Add one or more employees with their amounts and optional ledger breakdown.</p>
                  </div>
                  <EmployeeSelector
                    onEmployeeEntriesChange={handleEmployeeEntriesChange}
                    initialEmployeeEntries={employeeEntries}
                    showToast={showToast}
                    showConfirmDialog={async (title, message) => window.confirm(`${title}\n\n${message}`)}
                    ledgers={[]}
                  />
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

              {/* Narration with Voice Input */}
              <VoiceInputField
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description  (தமிழ்/EN)"
                rows={3}
                error={errors.description}
                showToast={showToast}
                showLangToggle={true}
              />
              
              {/* Action Buttons */}
              <div className="flex justify-center border-t pt-6">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>Reset</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-2.5 bg-gradient-to-r ${registerType === 'Advance Register' ? 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600' : 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'} text-white rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium min-w-[140px] justify-center`}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{editingId ? 'Update' : 'Save'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
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
      />
    </div>
  );
};

export default AdvanceDeposits;