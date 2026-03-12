
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Calendar, FileText, DollarSign, Banknote, User, Wallet, CreditCard, Plus, Trash2, Check, Edit3, CheckCircle, AlertCircle, Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';

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
import { ConfirmDialog,useConfirmDialog } from '../../components/common/Popup';
import { VoiceInputField } from '../../components/common/VoiceInputField';

const InterBankTransfer = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
   const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
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
  
  // Initial form data
  const initialFormData = {
    ibtType: 'IBT',
    ibtNo: '',
    ibtDate: new Date().toISOString().split('T')[0],
    modeOfTransaction: 'NEFT',
    chequeNo: '',
    chequeDate: '',
    description: '',
    fundType: ''
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

  const [savedTransfers, setSavedTransfers] = useState([]);
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
    fundType: '',
    transactionMode: '',
    ibtType: ''
  });

  const interBankTransferService = createVoucherService('/inter-bank-transfers');

  const ibtTypes = [
    { value: 'IBT', label: 'IBT', description: 'Inter Bank Transfer' },
    // { value: 'AIBT', label: 'AIBT', description: 'Automatic Inter Bank Transfer' }
  ];

  const transactionModes = [
    { value: 'NEFT', label: 'NEFT', description: 'National Electronic Funds Transfer' },
    { value: 'RTGS', label: 'RTGS', description: 'Real Time Gross Settlement' },
    { value: 'IMPS', label: 'IMPS', description: 'Immediate Payment Service' },
    { value: 'UPI', label: 'UPI', description: 'Unified Payments Interface' },
    { value: 'Cheque / DD', label: 'Cheque / DD', description: 'Cheque or Demand Draft' }
  ];

// Fix for the useEffect hook - replace loadSavedVouchers with loadSavedTransfers

 useEffect(() => {
  loadSavedTransfers(); // Changed from loadSavedVouchers()
  loadAvailableFunds(); // if you have this function
  loadLedgers();
  
  // Handle correction mode - when redirected from correction page
  const editingVoucherData = localStorage.getItem('editingVoucher');
  const correctionMode = localStorage.getItem('correctionMode');
 
  if (editingVoucherData && correctionMode === 'true') {
    const voucher = JSON.parse(editingVoucherData);
    
    // Use your existing handleEditTransfer function (changed from handleEditVoucher)
    handleEditTransfer(voucher);
    
    // Clean up localStorage
    localStorage.removeItem('editingVoucher');
    localStorage.removeItem('correctionMode');
    
    showToast('Transfer loaded for correction', 'success'); // Changed message
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

  const loadLedgers = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) {
      setAllLedgers((result.data || []).map(l => ({ code: l.ledgerCode, name: l.ledgerName })));
    }
  };

  const loadSavedTransfers = async () => {
    const result = await executeApi(interBankTransferService.getAll);
    if (result.success) {
      setSavedTransfers(result.data || []);
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
  const addCreditEntry = addEntry(creditEntries, setCreditEntries, { ledgerCode: '', ledgerName: '', amount: '' });
  const removeDebitEntry = removeEntry(debitEntries, setDebitEntries);
  const removeCreditEntry = removeEntry(creditEntries, setCreditEntries);

  const handleSubmit = async () => {
    const errors = validateVoucherForm(formData, debitEntries, creditEntries, ['ibtType', 'ibtNo', 'ibtDate', 'fundType']);

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

    const submitData = {
      ...formData,
      fromBankLedgerCode: debitEntries[0]?.ledgerCode || '',
      toBankLedgerCode: creditEntries[0]?.ledgerCode || '',
      debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
      creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
      debitTotal,
      creditTotal,
      entryCount: debitEntries.length + creditEntries.length,
      balanced: true
    };

    let result;
    if (editingId) {
      result = await executeApi(interBankTransferService.update, editingId, submitData);
    } else {
      result = await executeApi(interBankTransferService.create, submitData);
    }

    if (result.success) {
      showToast(editingId ? 'Inter Bank Transfer updated successfully!' : 'Inter Bank Transfer created successfully!', 'success');
      resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
      await loadSavedTransfers();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const handleEditTransfer = (transfer) => {
    setFormData({
      ibtType: transfer.ibtType || '',
      ibtNo: transfer.ibtNo || '',
      ibtDate: transfer.ibtDate || '',
      modeOfTransaction: transfer.modeOfTransaction || 'NEFT',
      chequeNo: transfer.chequeNo || '',
      chequeDate: transfer.chequeDate || '',
      description: transfer.description || '',
      fundType: transfer.fundType || ''
    });
    
    setDebitEntries(transfer.debitEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialDebitEntries);
    setCreditEntries(transfer.creditEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialCreditEntries);
    
    setEditingId(transfer.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteTransfer = async (transfer) => {
    const confirmed = await showConfirmDialog({
     title: 'Delete Transfer', 
     message: `Are you sure you want to delete transfer "${transfer.ibtNo}"?`,
       confirmText:'Delete',
      cancelText:'Cancel',
      type: 'error'}
    );
    
    if (confirmed) {
      const result = await executeApi(interBankTransferService.delete, transfer.id);
      if (result.success) {
        showToast('Transfer deleted successfully!', 'success');
        await loadSavedTransfers();
      } else {
        showToast('Failed to delete transfer!', 'error');
      }
    }
  };

  const debitTotal = calculateTotal(debitEntries);
  const creditTotal = calculateTotal(creditEntries);

  const handleAdvancedFilters = (filters) => {
    setSearchFilters(filters);
  };

  const filteredTransfers = savedTransfers.filter(transfer => {
    const filters = searchFilters;
    
    const searchMatch = !filters.searchTerm || 
      transfer.ibtNo?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      transfer.fundType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      transfer.ibtDate?.includes(filters.searchTerm);

    const dateFromMatch = !filters.dateFrom || transfer.ibtDate >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || transfer.ibtDate <= filters.dateTo;

    const amountMinMatch = !filters.amountMin || 
      (transfer.debitTotal >= parseFloat(filters.amountMin) || transfer.creditTotal >= parseFloat(filters.amountMin));
    const amountMaxMatch = !filters.amountMax || 
      (transfer.debitTotal <= parseFloat(filters.amountMax) && transfer.creditTotal <= parseFloat(filters.amountMax));

    const fundTypeMatch = !filters.fundType || 
      transfer.fundType?.toLowerCase().includes(filters.fundType.toLowerCase());

    const statusMatch = !filters.status || 
      (filters.status === 'balanced' && transfer.balanced) ||
      (filters.status === 'unbalanced' && !transfer.balanced);

    const transactionModeMatch = !filters.transactionMode || 
      transfer.modeOfTransaction === filters.transactionMode;

    const ibtTypeMatch = !filters.ibtType || transfer.ibtType === filters.ibtType;

    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch && 
           amountMaxMatch && fundTypeMatch && statusMatch && 
           transactionModeMatch && ibtTypeMatch;
  });

  const resetFormHandler = () => {
    resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
    setShowRecords(false);
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Inter Bank Transfer"
        subtitle="Transfer funds between different bank accounts"
        icon={ArrowRightLeft}
        totalRecords={savedTransfers.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-green-500"
        gradientTo="to-blue-500"
        countBg="from-green-100"
        countTo="to-blue-100"
        countBorder="border-green-200"
        countText="text-green-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Inter Bank Transfers"
          totalRecords={filteredTransfers.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-green-500"
          gradientTo="to-blue-500"
          customFilters={[
            {
              key: 'ibtType',
              label: 'IBT Type',
              type: 'select',
              icon: FileText,
              options: [
                { value: '', label: 'All Types' },
                { value: 'IBT', label: 'IBT' },
                // { value: 'AIBT', label: 'AIBT' }
              ]
            }
          ]}
        >
          {filteredTransfers.length === 0 ? (
            <EmptyState
              icon={ArrowRightLeft}
              title="No inter bank transfers found."
              actionText="Create your first transfer"
              onAction={() => setShowRecords(false)}
              searchTerm={searchFilters.searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {filteredTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-green-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <ArrowRightLeft className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transfer.ibtType} - {transfer.ibtNo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {transfer.ibtDate} | Fund: {transfer.fundType}
                        </p>
                        <p className="text-sm text-gray-600">
                          Mode: {transfer.modeOfTransaction}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-red-600">Dr: ₹{transfer.debitTotal?.toLocaleString('en-IN')}</span>
                          <span className="text-green-600">Cr: ₹{transfer.creditTotal?.toLocaleString('en-IN')}</span>
                          {transfer.balanced ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {transfer.entryCount} entries
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditTransfer(transfer)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Transfer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransfer(transfer)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Transfer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Entry Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                    {/* Debit Entries */}
                    {transfer.debitEntries && transfer.debitEntries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Debit Entries  ({transfer.debitEntries.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {transfer.debitEntries.map((entry, index) => (
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
                            Total: ₹{transfer.debitTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Credit Entries */}
                    {transfer.creditEntries && transfer.creditEntries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center space-x-1">
                          <Banknote className="h-4 w-4" />
                          <span>Credit Entries  ({transfer.creditEntries.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {transfer.creditEntries.map((entry, index) => (
                            <div key={index} className="bg-green-50 p-3 rounded border border-green-200">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{entry.ledgerCode} - {entry.ledgerName}</p>
                                </div>
                                <p className="text-sm font-semibold text-green-600">₹{entry.amount?.toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 p-2 bg-green-100 rounded text-right">
                          <span className="text-sm font-bold text-green-700">
                            Total: ₹{transfer.creditTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Mode-specific transaction details */}
                  {(transfer.modeOfTransaction === 'Cheque' || transfer.modeOfTransaction === 'Cheque / DD') && (transfer.chequeNo || transfer.chequeDate) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-800 mb-2 flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>Cheque/DD Details</span>
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {transfer.chequeNo && <div><span className="text-gray-600">Cheque/DD No: </span><span className="font-medium">{transfer.chequeNo}</span></div>}
                        {transfer.chequeDate && <div><span className="text-gray-600">Cheque Date: </span><span className="font-medium">{transfer.chequeDate}</span></div>}
                      </div>
                    </div>
                  )}

                  {(['NEFT', 'RTGS', 'IMPS', 'Online', 'UPI'].includes(transfer.modeOfTransaction)) && transfer.chequeNo && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-800 mb-2 flex items-center space-x-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{transfer.modeOfTransaction} Transfer Details</span>
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {transfer.chequeNo && <div><span className="text-gray-600">Ref. No: </span><span className="font-medium">{transfer.chequeNo}</span></div>}
                        {transfer.chequeDate && <div><span className="text-gray-600">Date: </span><span className="font-medium">{transfer.chequeDate}</span></div>}
                      </div>
                    </div>
                  )}

                  {transfer.description && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Description: </span>
                        {transfer.description}
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
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Inter Bank Transfer' : 'Create New Inter Bank Transfer'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
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
                options={ibtTypes.map(type => ({
                  value: type.value,
                  label: type.label,
                  description: type.description
                }))}
                value={formData.ibtType}
                onChange={(e) => handleChange({ target: { name: 'ibtType', value: e.target.value } })}
                label="IBT Type"
                placeholder="Select IBT Type"
                searchPlaceholder="Search IBT types..."
                required
                icon={ArrowRightLeft}
                emptyMessage="No IBT types available"
              />
              
              <FormField
                label="IBT No"
                name="ibtNo"
                value={formData.ibtNo}
                onChange={handleChange}
                required
                placeholder="Enter IBT number"
                icon={FileText}
              />
              
              <FormField
                label="IBT Date"
                name="ibtDate"
                type="date"
                value={formData.ibtDate}
                onChange={handleChange}
                required
                icon={Calendar}
              />
           
            </div>

            {/* Fund Type and Transaction Mode */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              

            
            </div> */}

            {/* Entries Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debit Entry Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-red-700 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Add Debit Entry </span>
                </h3>
                
                <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <SearchableDropdown
                    options={allLedgers.map(ledger => ({
                      value: ledger.code,
                      label: `${ledger.code} - ${ledger.name}`,
                      description: ledger.name
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
                    placeholder="Select Ledger Code"
                    searchPlaceholder="Search Ledger Code..."
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
                  />
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentDebitEntry?.ledgerCode?.trim()) {
                        showToast('Bank account is required for debit entry', 'error');
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

                {/* Debit Entries Table */}
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Bank Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Bank Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Amount (₹)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-red-200">
                          {debitEntries.map((entry, index) => (
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
       } );
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

              {/* Credit Entry Form */}
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
                      description: ledger.name
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
                    placeholder="Select Ledger Code"
                    searchPlaceholder="Search Ledger Code..."
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
                        amount: numericAmount
                      };

                      setCreditEntries(prev => [...prev, entryData]);
                      setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
                      showToast('Credit entry added successfully', 'success');
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Credit Entry</span>
                  </button>
                </div>

                {/* Credit Entries Table */}
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
                            <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Bank Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Bank Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Amount (₹)</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-green-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-green-200">
                          {creditEntries.map((entry, index) => (
                            <tr key={entry.id} className="hover:bg-green-50 transition-colors">
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerCode}</td>
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerName}</td>
                              <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
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

            {/* Reference Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SearchableDropdown
                options={transactionModes.map(mode => ({
                  value: mode.value,
                  label: mode.label,
                  description: mode.description
                }))}
                value={formData.modeOfTransaction}
                onChange={(e) => handleChange({ target: { name: 'modeOfTransaction', value: e.target.value } })}
                label="Mode of Transaction"
                placeholder="Select transaction mode"
                searchPlaceholder="Search transaction modes..."
                required
                icon={CreditCard}
              />
              <FormField
                label={formData.modeOfTransaction === 'Cheque / DD' ? 'Cheque/DD No' : 'Reference No'}
                name="chequeNo"
                value={formData.chequeNo}
                onChange={handleChange}
                icon={FileText}
                placeholder={`Enter ${formData.modeOfTransaction === 'Cheque / DD' ? 'cheque/DD number' : 'reference number'}`}
              />
              
              <FormField
                label={formData.modeOfTransaction === 'Cheque / DD' ? 'Cheque/DD Date' : 'Transaction Date'}
                name="chequeDate"
                type="date"
                value={formData.chequeDate}
                onChange={handleChange}
                icon={Calendar}
              />
            </div>

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
              text="Transfer"
              gradientFrom="from-green-500"
              gradientTo="to-blue-500"
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

export default InterBankTransfer;