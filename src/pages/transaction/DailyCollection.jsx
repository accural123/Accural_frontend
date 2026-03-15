import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calculator, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Plus, 
  Save, 
  RefreshCw, 
  Eye, 
  FileText, 
  Search, 
  Receipt,
  Trash2,
  Edit3,
  CreditCard,
  Banknote,
  DollarSign,
  IndianRupee,
  User,
  MessageSquare,
  Wallet
} from 'lucide-react';

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

const ITEMS_PER_PAGE = 20;

const DailyCollection = () => {
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
  
  const [editingDebitIndex, setEditingDebitIndex] = useState(null);
  const [editingCreditIndex, setEditingCreditIndex] = useState(null);
  
  // Initial form data
  const initialFormData = {
    challanNo: '',
    collectionDate: new Date().toISOString().split('T')[0],
    fundType: '',
    fromWhom: '',
    purpose: ''
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

  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecords, setSavedRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
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
    fundType: ''
  });

  const dailyCollectionService = createVoucherService('/daily-collections');

  useEffect(() => {
    loadSavedRecords();
    loadAvailableFunds();
    loadLedgers();
    
    const editingVoucherData = localStorage.getItem('editingVoucher');
    const correctionMode = localStorage.getItem('correctionMode');
    
    if (editingVoucherData && correctionMode === 'true') {
      const voucher = JSON.parse(editingVoucherData);
      handleEditRecord(voucher);
      localStorage.removeItem('editingVoucher');
      localStorage.removeItem('correctionMode');
      showToast('Record loaded for correction', 'success');
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
      const result = await executeApi(fundService.getAll);
      setAvailableFunds(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Error loading funds:', error);
      setAvailableFunds([]);
    }
  };

  const loadSavedRecords = async () => {
    const result = await executeApi(dailyCollectionService.getAll);
    if (result.success) {
      setSavedRecords(result.data || []);
    }
  };

  const fundOptions = useMemo(() => availableFunds.map(fund => ({
    value: fund.fundName,
    label: fund.fundName,
    description: `Created: ${fund.createdDate}`
  })), [availableFunds]);

  const handleSubmit = async () => {
    const errors = validateVoucherForm(formData, debitEntries, creditEntries, ['collectionDate', 'fundType']);

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
      debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
      creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
      debitTotal,
      creditTotal,
      entryCount: debitEntries.length + creditEntries.length,
      balanced: Math.abs(debitTotal - creditTotal) < 0.01
    };

    let result;
    if (editingId) {
      result = await executeApi(dailyCollectionService.update, editingId, submitData);
    } else {
      result = await executeApi(dailyCollectionService.create, submitData);
    }

    if (result.success) {
      showToast(editingId ? 'Daily Collection updated successfully!' : 'Daily Collection created successfully!', 'success');
      resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const handleEditRecord = (record) => {
    setFormData({
      challanNo: record.challanNo || '',
      collectionDate: record.collectionDate || new Date().toISOString().split('T')[0],
      fundType: record.fundType || '',
      fromWhom: record.fromWhom || '',
      purpose: record.purpose || ''
    });
    
    setDebitEntries(record.debitEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialDebitEntries);
    setCreditEntries(record.creditEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialCreditEntries);
    
    setEditingId(record.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteRecord = async (record) => {
    const confirmed = await showConfirmDialog({
      title:'Delete Collection Record', 
      message:`Are you sure you want to delete the collection record for ${record.collectionDate}?`,
      confirmText:'Delete',
      cancelText:'Cancel',
      type: 'error'
    });
    
    if (confirmed) {
      const result = await executeApi(dailyCollectionService.delete, record.id);
      if (result.success) {
        showToast('Record deleted successfully!', 'success');
        await loadSavedRecords();
      } else {
        showToast('Failed to delete record!', 'error');
      }
    }
  };

  const handleEditDebitEntry = (entry, index) => {
    setCurrentDebitEntry({
      ledgerCode: entry.ledgerCode,
      ledgerName: entry.ledgerName,
      amount: entry.amount.toLocaleString('en-IN')
    });
    setEditingDebitIndex(index);
  };

  const handleUpdateDebitEntry = () => {
    if (!currentDebitEntry?.ledgerCode?.trim()) {
      showToast('Ledger Code is required for debit entry', 'error');
      return;
    }
    
    const numericAmount = parseFloat((currentDebitEntry.amount || '').replace(/,/g, ''));
    if (!currentDebitEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    const updatedEntries = [...debitEntries];
    updatedEntries[editingDebitIndex] = {
      ...updatedEntries[editingDebitIndex],
      ledgerCode: currentDebitEntry.ledgerCode,
      ledgerName: currentDebitEntry.ledgerName,
      amount: numericAmount
    };

    setDebitEntries(updatedEntries);
    setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
    setEditingDebitIndex(null);
    showToast('Debit entry updated successfully', 'success');
  };

  const handleEditCreditEntry = (entry, index) => {
    setCurrentCreditEntry({
      ledgerCode: entry.ledgerCode,
      ledgerName: entry.ledgerName,
      amount: entry.amount.toLocaleString('en-IN')
    });
    setEditingCreditIndex(index);
  };

  const handleUpdateCreditEntry = () => {
    if (!currentCreditEntry?.ledgerCode?.trim()) {
      showToast('Ledger Code is required for credit entry', 'error');
      return;
    }
    
    const numericAmount = parseFloat((currentCreditEntry.amount || '').replace(/,/g, ''));
    if (!currentCreditEntry.amount || isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    const updatedEntries = [...creditEntries];
    updatedEntries[editingCreditIndex] = {
      ...updatedEntries[editingCreditIndex],
      ledgerCode: currentCreditEntry.ledgerCode,
      ledgerName: currentCreditEntry.ledgerName,
      amount: numericAmount
    };

    setCreditEntries(updatedEntries);
    setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
    setEditingCreditIndex(null);
    showToast('Credit entry updated successfully', 'success');
  };

  const debitTotal = useMemo(() => calculateTotal(debitEntries), [debitEntries, calculateTotal]);
  const creditTotal = useMemo(() => calculateTotal(creditEntries), [creditEntries, calculateTotal]);

  const handleAdvancedFilters = (filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
  };

  const filteredRecords = useMemo(() => savedRecords.filter(record => {
    const filters = searchFilters;
    
    const searchMatch = !filters.searchTerm || 
      record.collectionDate?.includes(filters.searchTerm) ||
      record.fromWhom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.fundType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.purpose?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      record.challanNo?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const dateFromMatch = !filters.dateFrom || record.collectionDate >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || record.collectionDate <= filters.dateTo;

    const amountMinMatch = !filters.amountMin || 
      (record.debitTotal >= parseFloat(filters.amountMin) || record.creditTotal >= parseFloat(filters.amountMin));
    const amountMaxMatch = !filters.amountMax || 
      (record.debitTotal <= parseFloat(filters.amountMax) && record.creditTotal <= parseFloat(filters.amountMax));

    const fromWhomMatch = !filters.fromWhom || 
      record.fromWhom?.toLowerCase().includes(filters.fromWhom.toLowerCase());

    const fundTypeMatch = !filters.fundType || 
      record.fundType?.toLowerCase().includes(filters.fundType.toLowerCase());

    const statusMatch = !filters.status || 
      (filters.status === 'balanced' && record.balanced) ||
      (filters.status === 'unbalanced' && !record.balanced);

    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch &&
           amountMaxMatch && fromWhomMatch && fundTypeMatch && statusMatch;
  }), [savedRecords, searchFilters]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFormHandler = () => {
    resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
    setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
    setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
    setEditingDebitIndex(null);
    setEditingCreditIndex(null);
    setShowRecords(false);
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Daily Collection"
        subtitle="Manage daily collection details and money receipts"
        icon={Receipt}
        totalRecords={savedRecords.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-blue-500"
        gradientTo="to-green-500"
        countBg="from-blue-100"
        countTo="to-green-100"
        countBorder="border-blue-200"
        countText="text-blue-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Daily Collection Records"
          totalRecords={filteredRecords.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-blue-500"
          gradientTo="to-green-500"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
        >
          {filteredRecords.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No daily collection records found."
              actionText="Create your first collection record"
              onAction={() => setShowRecords(false)}
              searchTerm={searchFilters.searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {paginatedRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Daily Collection - {record.collectionDate}
                        </h3>
                        {record.challanNo && (
                          <p className="text-sm text-gray-600">Challan No: {record.challanNo}</p>
                        )}
                        <p className="text-sm text-gray-600">
                          Fund: {record.fundType}
                        </p>
                        {record.fromWhom && (
                          <p className="text-sm text-gray-600">From: {record.fromWhom}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-red-600">Dr: ₹{record.debitTotal?.toLocaleString('en-IN')}</span>
                          <span className="text-green-600">Cr: ₹{record.creditTotal?.toLocaleString('en-IN')}</span>
                          {record.balanced ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {record.entryCount} entries
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditRecord(record)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Record"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                    {record.debitEntries && record.debitEntries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>Debit Entries ({record.debitEntries.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {record.debitEntries.map((entry, index) => (
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
                            Total: ₹{record.debitTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}

                    {record.creditEntries && record.creditEntries.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center space-x-1">
                          <Banknote className="h-4 w-4" />
                          <span>Credit Entries ({record.creditEntries.length})</span>
                        </h4>
                        <div className="space-y-2">
                          {record.creditEntries.map((entry, index) => (
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
                            Total: ₹{record.creditTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {record.purpose && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Purpose: </span>
                        {record.purpose}
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
          <div className="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Daily Collection' : 'Create New Daily Collection'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Challan No"
                name="challanNo"
                value={formData.challanNo}
                onChange={handleChange}
                placeholder="Enter challan number"
                icon={Receipt}
              />

              <FormField
                label="Collection Date"
                name="collectionDate"
                type="date"
                value={formData.collectionDate}
                onChange={handleChange}
                required
                icon={Calendar}
              />

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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debit Entry Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-red-700 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>{editingDebitIndex !== null ? 'Edit' : 'Add'} Debit Entry</span>
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
                  
                  <div className="flex space-x-2">
                    {editingDebitIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentDebitEntry({ ledgerCode: '', ledgerName: '', amount: '' });
                          setEditingDebitIndex(null);
                        }}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (editingDebitIndex !== null) {
                          handleUpdateDebitEntry();
                        } else {
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
                        }
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                    >
                      {editingDebitIndex !== null ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update Entry</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Entry</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {debitEntries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3 text-red-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
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
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerName}</td>
                              <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditDebitEntry(entry, index)}
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

              {/* Credit Entry Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-green-700 flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span>{editingCreditIndex !== null ? 'Edit' : 'Add'} Credit Entry</span>
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
                  
                  <div className="flex space-x-2">
                    {editingCreditIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentCreditEntry({ ledgerCode: '', ledgerName: '', amount: '' });
                          setEditingCreditIndex(null);
                        }}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (editingCreditIndex !== null) {
                          handleUpdateCreditEntry();
                        } else {
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
                        }
                      }}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2 transition-colors"
                    >
                      {editingCreditIndex !== null ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Update Entry</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Entry</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {creditEntries.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3 text-green-700 flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
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
                              <td className="px-4 py-4 text-sm text-slate-900">{entry.ledgerName}</td>
                              <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                                ₹{entry.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEditCreditEntry(entry, index)}
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
              <FormField
                label="From Whom"
                name="fromWhom"
                value={formData.fromWhom}
                onChange={handleChange}
                placeholder="Name of the person/entity"
                icon={User}
              />

              <FormField
                label="Purpose of Receipt"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Additional details or remarks"
                icon={MessageSquare}
              />
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <ResetButton 
                onClick={resetFormHandler}
                loading={loading}
              />
              <SubmitButton
                loading={loading}
                onClick={handleSubmit}
                editingId={editingId}
                text="Collection"
                gradientFrom="from-blue-500"
                gradientTo="to-green-500"
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

export default DailyCollection;