
import React, { useState, useEffect } from 'react';
import { Receipt, Calendar, FileText, DollarSign, Banknote, User, Wallet, CreditCard, Plus, Trash2, Check, Edit3, CheckCircle, AlertCircle, Filter, X, ChevronDown, ChevronUp, Search, Building2 } from 'lucide-react';

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

// Import utilities
import { validateVoucherForm } from '../../utils/validation';
import { showConfirmDialog } from '../../utils/confirmDialog';
import { createVoucherService } from '../../services/createVoucherService';
import { ResetButton } from '../../components/common/ResetButton';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { VoiceInputField } from '../../components/common/VoiceInputField';

const BankReceipt = () => {
  const { toasts, showToast, removeToast } = useToast();
    const [errors, setErrors] = useState({});
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
    amount: '',
    challanNo: ''
  });
  
  // New state for multiple cheque/DD and ECS entries
  const [currentChequeEntry, setCurrentChequeEntry] = useState({
    depositorName: '',
    chequeNumber: '',
    chequeDate: '',
    bankName: '',
    chequeAmount: '',
    purposeOfDeposit: ''
  });
  
  const [currentEcsEntry, setCurrentEcsEntry] = useState({
    ecsTransactionId: '',
    ecsDepositorName: '',
    ecsAmount: '',
    ecsPurpose: ''
  });
  
  const [chequeEntries, setChequeEntries] = useState([]);
  const [ecsEntries, setEcsEntries] = useState([]);
  
  // Updated initial form data
  const initialFormData = {
    brvType: '',
    brvNo: '',
    brvDate: new Date().toISOString().split('T')[0],
    fromWhom: '',
    description : '',
    dateOfRealization: '',
    natureOfTransaction: 'Cash',
    fundType: '',
    // Online specific fields
    transactionId: '',
    transferMode: '',
    senderBank: '',
    receiverBank: '',
    onlineAmount: '',
    onlinePurpose: ''
  };

  const initialDebitEntries = [];
  const initialCreditEntries = [];
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();

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
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    status: '',
    fromWhom: '',
    fundType: '',
    transactionMode: '',
    brvType: ''
  });

  const bankReceiptService = createVoucherService('/bank-receipts');

  const brvTypes = [
    { value: 'BRV', label: 'BRV', description: 'Bank Receipt Voucher' },
    { value: 'ADBRV', label: 'ADBRV', description: 'Advance Bank Receipt Voucher' }
  ];

  const transactionModes = [
    { value: 'Cash', label: 'Cash', description: 'Cash Receipt' },
    { value: 'Cheque / DD', label: 'Cheque / DD', description: 'Cheque or Demand Draft' },
    { value: 'Online', label: 'Online', description: 'Online Transfer' },
    { value: 'ECS', label: 'ECS', description: 'Electronic Clearing Service' }
  ];

  const onlineTransferModes = [
    { value: 'NEFT', label: 'NEFT', description: 'National Electronic Funds Transfer' },
    { value: 'RTGS', label: 'RTGS', description: 'Real Time Gross Settlement' },
    { value: 'IMPS', label: 'IMPS', description: 'Immediate Payment Service' },
    { value: 'UPI', label: 'UPI', description: 'Unified Payments Interface' },
    { value: 'Wire Transfer', label: 'Wire Transfer', description: 'Bank Wire Transfer' }
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
      setAllLedgers((result.data || []).map(l => ({ code: l.ledgerCode, name: l.ledgerName })));
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
    const result = await executeApi(bankReceiptService.getAll);
    if (result.success) {
      setSavedVouchers(result.data || []);
    }
  };

  const fundOptions = availableFunds.map(fund => ({
    value: fund.fundName,
    label: fund.fundName,
    description: `Created: ${fund.createdDate}`
  }));

  const handleDebitChange = handleEntryChange(debitEntries, setDebitEntries, allLedgers);
  const handleCreditChange = handleEntryChange(creditEntries, setCreditEntries, allLedgers);

  const addDebitEntry = addEntry(debitEntries, setDebitEntries, { ledgerCode: '', ledgerName: '', amount: '' });
  const addCreditEntry = addEntry(creditEntries, setCreditEntries, { ledgerCode: '', ledgerName: '', amount: '', challanNo: '' });
  const removeDebitEntry = removeEntry(debitEntries, setDebitEntries);
  const removeCreditEntry = removeEntry(creditEntries, setCreditEntries);

  // Helper function to format amount with Indian numbering
  const formatAmount = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/,/g, '');
    if (/^\d*\.?\d*$/.test(numericValue)) {
      if (numericValue !== '' && !isNaN(numericValue)) {
        const parts = numericValue.split('.');
        parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
        return parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
      }
    }
    return value;
  };

  // Add Cheque/DD Entry
  const addChequeEntry = () => {
    if (!currentChequeEntry.depositorName?.trim()) {
      showToast('Depositor name is required', 'error');
      return;
    }
    if (!currentChequeEntry.chequeNumber?.trim()) {
      showToast('Cheque/DD number is required', 'error');
      return;
    }
    if (!currentChequeEntry.chequeDate) {
      showToast('Cheque/DD date is required', 'error');
      return;
    }
    if (!currentChequeEntry.bankName?.trim()) {
      showToast('Bank name is required', 'error');
      return;
    }
    
    const numericAmount = parseFloat((currentChequeEntry.chequeAmount || '').replace(/,/g, ''));
    if (!currentChequeEntry.chequeAmount || isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    const entryData = {
      id: Date.now(),
      ...currentChequeEntry,
      chequeAmount: numericAmount
    };

    setChequeEntries(prev => [...prev, entryData]);
    setCurrentChequeEntry({
      depositorName: '',
      chequeNumber: '',
      chequeDate: '',
      bankName: '',
      chequeAmount: '',
      purposeOfDeposit: ''
    });
    showToast('Cheque/DD entry added successfully', 'success');
  };

  // Add ECS Entry
  const addEcsEntry = () => {
    if (!currentEcsEntry.ecsTransactionId?.trim()) {
      showToast('Transaction ID is required', 'error');
      return;
    }
    if (!currentEcsEntry.ecsDepositorName?.trim()) {
      showToast('Depositor name is required', 'error');
      return;
    }
    
    const numericAmount = parseFloat((currentEcsEntry.ecsAmount || '').replace(/,/g, ''));
    if (!currentEcsEntry.ecsAmount || isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    const entryData = {
      id: Date.now(),
      ...currentEcsEntry,
      ecsAmount: numericAmount
    };

    setEcsEntries(prev => [...prev, entryData]);
    setCurrentEcsEntry({
      ecsTransactionId: '',
      ecsDepositorName: '',
      ecsAmount: '',
      ecsPurpose: ''
    });
    showToast('ECS entry added successfully', 'success');
  };

  // Calculate totals for cheque and ECS entries
  const calculateChequeTotal = () => {
    return chequeEntries.reduce((sum, entry) => sum + (entry.chequeAmount || 0), 0);
  };

  const calculateEcsTotal = () => {
    return ecsEntries.reduce((sum, entry) => sum + (entry.ecsAmount || 0), 0);
  };

  // Updated validation function
  const validateTransactionSpecificFields = () => {
    const errors = [];
    
    if (formData.natureOfTransaction === 'Cheque / DD') {
      if (chequeEntries.length === 0) {
        errors.push('At least one Cheque/DD entry is required');
      }
    }
    
    if (formData.natureOfTransaction === 'Online') {
      if (!formData.transactionId?.trim()) errors.push('Transaction ID is required for online transfers');
      if (!formData.transferMode?.trim()) errors.push('Transfer mode is required for online transactions');
      if (!formData.senderBank?.trim()) errors.push('Sender bank is required');
      if (!formData.onlineAmount?.trim()) errors.push('Online transfer amount is required');
    }
    
    if (formData.natureOfTransaction === 'ECS') {
      if (ecsEntries.length === 0) {
        errors.push('At least one ECS entry is required');
      }
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const basicErrors = validateVoucherForm(formData, debitEntries, creditEntries, ['brvType', 'brvNo', 'brvDate', 'fundType']);
    const transactionErrors = validateTransactionSpecificFields();
    const allErrors = [...basicErrors, ...transactionErrors];

    if (allErrors.length > 0) {
      showToast(allErrors[0], 'error');
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

    const submitData = {
      ...formData,
      bankLedgerCode: debitEntries[0]?.ledgerCode || '',
      debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
      creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
      chequeEntries: formData.natureOfTransaction === 'Cheque / DD' ? chequeEntries : [],
      ecsEntries: formData.natureOfTransaction === 'ECS' ? ecsEntries : [],
      debitTotal,
      creditTotal,
      entryCount: debitEntries.length + creditEntries.length,
      balanced: true
    };

    let result;
    if (editingId) {
      result = await executeApi(bankReceiptService.update, editingId, submitData);
    } else {
      result = await executeApi(bankReceiptService.create, submitData);
    }

    if (result.success) {
      showToast(editingId ? 'Bank Receipt Voucher updated successfully!' : 'Bank Receipt Voucher created successfully!', 'success');
      resetFormHandler();
      await loadSavedVouchers();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };const handleEditVoucher = (voucher) => {
    setFormData({
      brvType: voucher.brvType || '',
      brvNo: voucher.brvNo || '',
      brvDate: voucher.brvDate || '',
      fromWhom: voucher.fromWhom || '',
      description : voucher.description  || '',
      dateOfRealization: voucher.dateOfRealization || '',
      natureOfTransaction: voucher.natureOfTransaction || 'Cash',
      fundType: voucher.fundType || '',
      transactionId: voucher.transactionId || '',
      transferMode: voucher.transferMode || '',
      senderBank: voucher.senderBank || '',
      receiverBank: voucher.receiverBank || '',
      onlineAmount: voucher.onlineAmount || '',
      onlinePurpose: voucher.onlinePurpose || ''
    });
    
    setDebitEntries(voucher.debitEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialDebitEntries);
    setCreditEntries(voucher.creditEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '', challanNo: entry.challanNo || '' })) || initialCreditEntries);
    
    setChequeEntries(voucher.chequeEntries || []);
    setEcsEntries(voucher.ecsEntries || []);
    
    setEditingId(voucher.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteVoucher = async (voucher) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Voucher',
      message: `Are you sure you want to delete voucher "${voucher.brvNo}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });
    
    if (confirmed) {
      const result = await executeApi(bankReceiptService.delete, voucher.id);
      if (result.success) {
        showToast('Voucher deleted successfully!', 'success');
        await loadSavedVouchers();
      } else {
        showToast('Failed to delete voucher!', 'error');
      }
    }
  };

  const debitTotal = calculateTotal(debitEntries);
  const creditTotal = calculateTotal(creditEntries);

  const handleAdvancedFilters = (filters) => {
    setSearchFilters(filters);
  };

  const filteredVouchers = savedVouchers.filter(voucher => {
    const filters = searchFilters;
    
    const searchMatch = !filters.searchTerm || 
      voucher.brvNo?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.fromWhom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.fundType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.brvDate?.includes(filters.searchTerm);

    const dateFromMatch = !filters.dateFrom || voucher.brvDate >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || voucher.brvDate <= filters.dateTo;

    const amountMinMatch = !filters.amountMin || 
      (voucher.debitTotal >= parseFloat(filters.amountMin) || voucher.creditTotal >= parseFloat(filters.amountMin));
    const amountMaxMatch = !filters.amountMax || 
      (voucher.debitTotal <= parseFloat(filters.amountMax) && voucher.creditTotal <= parseFloat(filters.amountMax));

    const fromWhomMatch = !filters.fromWhom || 
      voucher.fromWhom?.toLowerCase().includes(filters.fromWhom.toLowerCase());

    const fundTypeMatch = !filters.fundType || 
      voucher.fundType?.toLowerCase().includes(filters.fundType.toLowerCase());

    const statusMatch = !filters.status || 
      (filters.status === 'balanced' && voucher.balanced) ||
      (filters.status === 'unbalanced' && !voucher.balanced);

    const transactionModeMatch = !filters.transactionMode || 
      voucher.natureOfTransaction === filters.transactionMode;

    const brvTypeMatch = !filters.brvType || voucher.brvType === filters.brvType;

    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch && 
           amountMaxMatch && fromWhomMatch && fundTypeMatch && statusMatch && 
           transactionModeMatch && brvTypeMatch;
  });

  const resetFormHandler = () => {
    resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
    setChequeEntries([]);
    setEcsEntries([]);
    setCurrentChequeEntry({
      depositorName: '',
      chequeNumber: '',
      chequeDate: '',
      bankName: '',
      chequeAmount: '',
      purposeOfDeposit: ''
    });
    setCurrentEcsEntry({
      ecsTransactionId: '',
      ecsDepositorName: '',
      ecsAmount: '',
      ecsPurpose: ''
    });
    setShowRecords(false);
  };

  // Updated function to render transaction-specific fields
  const renderTransactionSpecificFields = () => {
    if (formData.natureOfTransaction === 'Cheque / DD') {
      return (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold text-blue-700 flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Cheque/DD Details</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Name of the Depositor"
              name="depositorName"
              value={currentChequeEntry.depositorName}
              onChange={(e) => setCurrentChequeEntry(prev => ({ ...prev, depositorName: e.target.value }))}
              required
              placeholder="Enter depositor's name"
              icon={User}
            />
            
            <FormField
              label="Cheque/DD No"
              name="chequeNumber"
              value={currentChequeEntry.chequeNumber}
              onChange={(e) => setCurrentChequeEntry(prev => ({ ...prev, chequeNumber: e.target.value }))}
              required
              placeholder="Enter cheque/DD number"
              icon={FileText}
            />
            
            <FormField
              label="Cheque/DD Date"
              name="chequeDate"
              type="date"
              value={currentChequeEntry.chequeDate}
              onChange={(e) => setCurrentChequeEntry(prev => ({ ...prev, chequeDate: e.target.value }))}
              required
              icon={Calendar}
            />
            
            <FormField
              label="Bank Name"
              name="bankName"
              value={currentChequeEntry.bankName}
              onChange={(e) => setCurrentChequeEntry(prev => ({ ...prev, bankName: e.target.value }))}
              required
              placeholder="Enter bank name"
              icon={Building2}
            />
            
            <FormField
              label="Amount (₹)"
              name="chequeAmount"
              value={currentChequeEntry.chequeAmount}
              onChange={(e) => {
                const processedValue = formatAmount(e.target.value);
                if (processedValue !== undefined) {
                  setCurrentChequeEntry(prev => ({ ...prev, chequeAmount: processedValue }));
                }
              }}
              required
              placeholder="0.00"
              icon={DollarSign}
            />
            
            <FormField
              label="Purpose of Deposit"
              name="purposeOfDeposit"
              value={currentChequeEntry.purposeOfDeposit}
              onChange={(e) => setCurrentChequeEntry(prev => ({ ...prev, purposeOfDeposit: e.target.value }))}
              placeholder="Enter purpose of deposit"
              icon={FileText}
            />
          </div>

          <button
            type="button"
            onClick={addChequeEntry}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cheque/DD Entry</span>
          </button>

          {chequeEntries.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-blue-700 mb-3">
                Cheque/DD Entries ({chequeEntries.length}) - Total: ₹{calculateChequeTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h5>
              <div className="space-y-2">
                {chequeEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-3 rounded border border-blue-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.depositorName}</p>
                        <p className="text-xs text-gray-600">Cheque: {entry.chequeNumber} | Bank: {entry.bankName}</p>
                        <p className="text-xs text-gray-600">Date: {entry.chequeDate}</p>
                        {entry.purposeOfDeposit && (
                          <p className="text-xs text-gray-600">Purpose: {entry.purposeOfDeposit}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-blue-600">
                          ₹{entry.chequeAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          onClick={() => {
                            setCurrentChequeEntry({
                              depositorName: entry.depositorName,
                              chequeNumber: entry.chequeNumber,
                              chequeDate: entry.chequeDate,
                              bankName: entry.bankName,
                              chequeAmount: entry.chequeAmount?.toLocaleString('en-IN'),
                              purposeOfDeposit: entry.purposeOfDeposit || ''
                            });
                            setChequeEntries(prev => prev.filter(item => item.id !== entry.id));
                            showToast('Cheque entry loaded for editing', 'info');
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit Entry"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={async () => {
                            const confirmed = await showConfirmDialog({
                              title: 'Delete Cheque Entry',
                              message: 'Are you sure you want to delete this cheque entry?',
                              confirmText: 'Delete',
                              cancelText: 'Cancel',
                              type: 'error'
                            });
                            if (confirmed) {
                              setChequeEntries(prev => prev.filter(item => item.id !== entry.id));
                              showToast('Cheque entry deleted successfully', 'success');
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    if (formData.natureOfTransaction === 'Online') {
      return (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-md font-semibold text-green-700 flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Online Transfer Details</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Ref.No"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              required
              placeholder="Enter transaction ID"
              icon={FileText}
            />
            
            <FormField
              label="Name of the Depositor"
              name="senderBank"
              value={formData.senderBank}
              onChange={handleChange}
              required
              placeholder="Enter depositor's name"
              icon={User}
            />
            
            <FormField
              label="Date"
              name="dateOfRealization"
              type="date"
              value={formData.dateOfRealization}
              onChange={handleChange}
              required
              icon={Calendar}
            />
            
            <FormField
              label="Amount (₹)"
              name="onlineAmount"
              value={formData.onlineAmount}
              onChange={(e) => {
                const processedValue = formatAmount(e.target.value);
                if (processedValue !== undefined) {
                  handleChange({ target: { name: 'onlineAmount', value: processedValue } });
                }
              }}
              required
              placeholder="0.00"
              icon={DollarSign}
            />
            
            <FormField
              label="Purpose of Deposit"
              name="onlinePurpose"
              value={formData.onlinePurpose}
              onChange={handleChange}
              placeholder="Enter purpose of deposit"
              icon={FileText}
            />
          </div>
        </div>
      );
    }
    
    if (formData.natureOfTransaction === 'ECS') {
      return (
        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-md font-semibold text-green-700 flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>ECS Details</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Ref.No"
              name="ecsTransactionId"
              value={currentEcsEntry.ecsTransactionId}
              onChange={(e) => setCurrentEcsEntry(prev => ({ ...prev, ecsTransactionId: e.target.value }))}
              required
              placeholder="Enter transaction ID"
              icon={FileText}
            />
            
            <FormField
              label="Name of the Depositor"
              name="ecsDepositorName"
              value={currentEcsEntry.ecsDepositorName}
              onChange={(e) => setCurrentEcsEntry(prev => ({ ...prev, ecsDepositorName: e.target.value }))}
              required
              placeholder="Enter depositor's name"
              icon={User}
            />
            
            <FormField
              label="Date"
              name="dateOfRealization"
              type="date"
              value={formData.dateOfRealization}
              onChange={handleChange}
              required
              icon={Calendar}
            />
            
            <FormField
              label="Amount (₹)"
              name="ecsAmount"
              value={currentEcsEntry.ecsAmount}
              onChange={(e) => {
                const processedValue = formatAmount(e.target.value);
                if (processedValue !== undefined) {
                  setCurrentEcsEntry(prev => ({ ...prev, ecsAmount: processedValue }));
                }
              }}
              required
              placeholder="0.00"
              icon={DollarSign}
            />
            
            <FormField
              label="Purpose of Deposit"
              name="ecsPurpose"
              value={currentEcsEntry.ecsPurpose}
              onChange={(e) => setCurrentEcsEntry(prev => ({ ...prev, ecsPurpose: e.target.value }))}
              placeholder="Enter purpose of deposit"
              icon={FileText}
            />
          </div>

          <button
            type="button"
            onClick={addEcsEntry}
            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add ECS Entry</span>
          </button>

          {ecsEntries.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-green-700 mb-3">
                ECS Entries ({ecsEntries.length}) - Total: ₹{calculateEcsTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h5>
              <div className="space-y-2">
                {ecsEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-3 rounded border border-green-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.ecsDepositorName}</p>
                        <p className="text-xs text-gray-600">Ref.No: {entry.ecsTransactionId}</p>
                        {entry.ecsPurpose && (
                          <p className="text-xs text-gray-600">Purpose: {entry.ecsPurpose}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-green-600">
                          ₹{entry.ecsAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <button
                          onClick={() => {
                            setCurrentEcsEntry({
                              ecsTransactionId: entry.ecsTransactionId,
                              ecsDepositorName: entry.ecsDepositorName,
                              ecsAmount: entry.ecsAmount?.toLocaleString('en-IN'),
                              ecsPurpose: entry.ecsPurpose || ''
                            });
                            setEcsEntries(prev => prev.filter(item => item.id !== entry.id));
                            showToast('ECS entry loaded for editing', 'info');
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit Entry"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={async () => {
                            const confirmed = await showConfirmDialog({
                              title: 'Delete ECS Entry',
                              message: 'Are you sure you want to delete this ECS entry?',
                              confirmText: 'Delete',
                              cancelText: 'Cancel',
                              type: 'error'
                            });
                            if (confirmed) {
                              setEcsEntries(prev => prev.filter(item => item.id !== entry.id));
                              showToast('ECS entry deleted successfully', 'success');
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Bank Receipt Voucher"
        subtitle="Manage bank receipt vouchers for incoming payments"
        icon={Receipt}
        totalRecords={savedVouchers.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-teal-500"
        gradientTo="to-cyan-500"
        countBg="from-teal-100"
        countTo="to-cyan-100"
        countBorder="border-teal-200"
        countText="text-teal-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Bank Receipt Vouchers"
          totalRecords={filteredVouchers.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-teal-500"
          gradientTo="to-cyan-500"
          customFilters={[
            {
              key: 'brvType',
              label: 'BRV Type',
              type: 'select',
              icon: FileText,
              options: [
                { value: '', label: 'All Types' },
                { value: 'BRV', label: 'BRV' },
                { value: 'ADBRV', label: 'ADBRV' }
              ]
            }
          ]}
        >
          {filteredVouchers.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No bank receipt vouchers found."
              actionText="Create your first voucher"
              onAction={() => setShowRecords(false)}
              searchTerm={searchFilters.searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {filteredVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-teal-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {voucher.brvType} - {voucher.brvNo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {voucher.brvDate} | Fund: {voucher.fundType}
                        </p>
                        {voucher.fromWhom && (
                          <p className="text-sm text-gray-600">From: {voucher.fromWhom}</p>
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
                          {voucher.entryCount} entries | {voucher.natureOfTransaction}
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

                  {voucher.natureOfTransaction === 'Cheque / DD' && voucher.chequeEntries && voucher.chequeEntries.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Cheque/DD Details ({voucher.chequeEntries.length} entries):</h5>
                      <div className="space-y-2">
                        {voucher.chequeEntries.map((entry, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 rounded border border-blue-200">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              <div><span className="text-gray-600">Depositor:</span> {entry.depositorName}</div>
                              <div><span className="text-gray-600">Cheque No:</span> {entry.chequeNumber}</div>
                              <div><span className="text-gray-600">Date:</span> {entry.chequeDate}</div>
                              <div><span className="text-gray-600">Bank:</span> {entry.bankName}</div>
                              <div><span className="text-gray-600">Amount:</span> ₹{entry.chequeAmount?.toLocaleString('en-IN')}</div>
                              {entry.purposeOfDeposit && <div className="col-span-full"><span className="text-gray-600">Purpose:</span> {entry.purposeOfDeposit}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {voucher.natureOfTransaction === 'Online' && (voucher.transactionId || voucher.senderBank) && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Online Transfer Details:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {voucher.transactionId && <div><span className="text-gray-600">Ref.No:</span> {voucher.transactionId}</div>}
                        {voucher.senderBank && <div><span className="text-gray-600">Depositor:</span> {voucher.senderBank}</div>}
                        {voucher.dateOfRealization && <div><span className="text-gray-600">Date:</span> {voucher.dateOfRealization}</div>}
                        {voucher.onlineAmount && <div><span className="text-gray-600">Amount:</span> ₹{voucher.onlineAmount}</div>}
                        {voucher.onlinePurpose && <div className="col-span-full"><span className="text-gray-600">Purpose:</span> {voucher.onlinePurpose}</div>}
                      </div>
                    </div>
                  )}

                  {voucher.natureOfTransaction === 'ECS' && voucher.ecsEntries && voucher.ecsEntries.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">ECS Details ({voucher.ecsEntries.length} entries):</h5>
                      <div className="space-y-2">
                        {voucher.ecsEntries.map((entry, idx) => (
                          <div key={idx} className="text-sm bg-white p-2 rounded border border-green-200">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              <div><span className="text-gray-600">Ref.No:</span> {entry.ecsTransactionId}</div>
                              <div><span className="text-gray-600">Depositor:</span> {entry.ecsDepositorName}</div>
                              <div><span className="text-gray-600">Amount:</span> ₹{entry.ecsAmount?.toLocaleString('en-IN')}</div>
                              {entry.ecsPurpose && <div className="col-span-full"><span className="text-gray-600">Purpose:</span> {entry.ecsPurpose}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                                  <p className="text-sm font-medium text-gray-900">{entry.ledgerCode} - {entry.ledgerName}</p>
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
                                  <p className="text-sm font-medium text-gray-900">{entry.ledgerCode} - {entry.ledgerName}</p>
                                  {entry.challanNo && (
                                    <p className="text-xs text-gray-600">Challan: {entry.challanNo}</p>
                                  )}
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

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Transaction Mode: </span>
                      <span className="font-medium">{voucher.natureOfTransaction}</span>
                    </div>
                    {voucher.dateOfRealization && (
                      <div>
                        <span className="text-gray-600">Date of Realization: </span>
                        <span className="font-medium">{voucher.dateOfRealization}</span>
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
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Bank Receipt Voucher' : 'Create New Bank Receipt Voucher'}
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
                options={brvTypes.map(type => ({
                  value: type.value,
                  label: type.label,
                  description: type.description
                }))}
                value={formData.brvType}
                onChange={(e) => handleChange({ target: { name: 'brvType', value: e.target.value } })}
                label="BRV Type"
                placeholder="Select BRV Type"
                searchPlaceholder="Search BRV types..."
                required
                icon={Receipt}
                emptyMessage="No BRV types available"
              />
              
              <FormField
                label="BRV No"
                name="brvNo"
                value={formData.brvNo}
                onChange={handleChange}
                required
                placeholder="Enter BRV number"
                icon={FileText}
              />
              <FormField
                label="BRV Date"
                name="brvDate"
                type="date"
                value={formData.brvDate}
                onChange={handleChange}
                required
                icon={Calendar}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-red-700 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Add Debit Entry</span>
                </h3>
                
                <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <SearchableDropdown
                    options={allLedgers.map(ledger => ({
                      value: ledger.code,
                      label: `${ledger.code} - ${ledger.name}`,
                      description: `${ledger.category} | ${ledger.name}`
                    }))}
                    value={currentDebitEntry?.ledgerCode || ''}
                    onChange={(e) => {
                      const selectedLedger = allLedgers.find(ledger => ledger.code === e.target.value);
                      setCurrentDebitEntry(prev => ({
                        ...prev,
                        ledgerCode: e.target.value,
                        ledgerName: selectedLedger ? selectedLedger.name : ''
                      }));
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
                      const processedValue = formatAmount(e.target.value);
                      if (processedValue !== undefined) {
                        setCurrentDebitEntry(prev => ({ ...prev, amount: processedValue }));
                      }
                    }}
                    placeholder="0.00"
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentDebitEntry?.ledgerCode?.trim()) {
                        showToast('Ledger Code is required for debit entry', 'error');
                        return;
                      }
                      
                      const numericAmount = parseFloat((currentDebitEntry.amount || '').replace(/,/g, ''));
                      if (!currentDebitEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
                        showToast('Amount must be greater than 0', 'error');
                        return;
                      }

                      const entryData = {
                        id: Date.now(),
                        ledgerCode: currentDebitEntry.ledgerCode,
                        ledgerName: currentDebitEntry.ledgerName,
                        amount: numericAmount
                      };

                      setDebitEntries(prev => [...prev, entryData]);
                      setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
                      showToast('Debit entry added successfully', 'success');
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
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
                          {debitEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-red-50 transition-colors">
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerCode}</td>
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerName}</td>
                              <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium">
                                <div className="flex items-center space-x-2">
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
                                  <button
                                    onClick={async () => {
                                      const confirmed = await showConfirmDialog({
                                        title: 'Delete Debit Entry',
                                        message: 'Are you sure you want to delete this debit entry?',
                                        confirmText: 'Delete',
                                        cancelText: 'Cancel',
                                        type: 'error'
                                      });
                                      if (confirmed) {
                                        setDebitEntries(prev => prev.filter(item => item.id !== entry.id));
                                        showToast('Debit entry deleted successfully', 'success');
                                      }
                                    }}
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
                  <SearchableDropdown
                    options={allLedgers.map(ledger => ({
                      value: ledger.code,
                      label: `${ledger.code} - ${ledger.name}`,
                      description: `${ledger.category} | ${ledger.name}`
                    }))}
                    value={currentCreditEntry?.ledgerCode || ''}
                    onChange={(e) => {
                      const selectedLedger = allLedgers.find(ledger => ledger.code === e.target.value);
                      setCurrentCreditEntry(prev => ({
                        ...prev,
                        ledgerCode: e.target.value,
                        ledgerName: selectedLedger ? selectedLedger.name : ''
                      }));
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
                      const processedValue = formatAmount(e.target.value);
                      if (processedValue !== undefined) {
                        setCurrentCreditEntry(prev => ({ ...prev, amount: processedValue }));
                      }
                    }}
                    placeholder="0.00"
                    required
                  />
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentCreditEntry?.ledgerCode?.trim()) {
                        showToast('Ledger Code is required for credit entry', 'error');
                        return;
                      }
                      
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
                        challanNo: currentCreditEntry.challanNo || ''
                      };

                      setCreditEntries(prev => [...prev, entryData]);
                      setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '', challanNo: '' });
                      showToast('Credit entry added successfully', 'success');
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Challan No</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-200">
                          {creditEntries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-green-50 transition-colors">
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerCode}</td>
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerName}</td>
                              <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.challanNo || '-'}</td>
                              <td className="px-4 py-4 text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => {
                                      setCurrentCreditEntry({
                                        ledgerCode: entry.ledgerCode,
                                        ledgerName: entry.ledgerName,
                                        amount: entry.amount?.toLocaleString('en-IN'),
                                        challanNo: entry.challanNo || ''
                                      });
                                      setCreditEntries(prev => prev.filter(item => item.id !== entry.id));
                                      showToast('Credit entry loaded for editing', 'info');
                                    }}
                                    className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                                    title="Edit Entry"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const confirmed = await showConfirmDialog({
                                        title: 'Delete Credit Entry',
                                        message: 'Are you sure you want to delete this credit entry?',
                                        confirmText: 'Delete',
                                        cancelText: 'Cancel',
                                        type: 'error'
                                      });
                                      if (confirmed) {
                                        setCreditEntries(prev => prev.filter(item => item.id !== entry.id));
                                        showToast('Credit entry deleted successfully', 'success');
                                      }
                                    }}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchableDropdown
                options={transactionModes.map(mode => ({
                  value: mode.value,
                  label: mode.label,
                  description: mode.description
                }))}
                value={formData.natureOfTransaction}
                onChange={(e) => handleChange({ target: { name: 'natureOfTransaction', value: e.target.value } })}
                label="Nature of Transaction"
                placeholder="Select transaction mode"
                searchPlaceholder="Search transaction modes..."
                required
                icon={CreditCard}
              />
              
              <FormField
                label="Date of Realization"
                name="dateOfRealization"
                type="date"
                value={formData.dateOfRealization}
                onChange={handleChange}
                icon={Calendar}
              />
            </div>

            {renderTransactionSpecificFields()}

             <VoiceInputField
                label="Description (Optional)"
                name="description"
                value={formData.description }
                onChange={handleChange}
                placeholder="Enter description or use voice input (தமிழ்/EN)"
                rows={3}
                error={errors.description}
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
                gradientFrom="from-teal-500"
                gradientTo="to-cyan-500"
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

export default BankReceipt;