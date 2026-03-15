
import React, { useState, useEffect } from 'react';
import { 
  History, 
  Calendar, 
  FileText,
  DollarSign,
  CheckCircle,
  Plus,
  Trash2,
  Edit3,
  Building,
  Search,
  Wallet
} from 'lucide-react';

// Import components
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { Header } from "../../components/common/Header";
import { ErrorDisplay } from "../../components/common/ErrorDisplay";
import { ToastContainer } from "../../components/common/ToastContainer";
import { SearchableRecords } from "../../components/common/SearchableRecords";
import { EmptyState } from "../../components/common/EmptyState";
import SearchableDropdown from '../../components/common/SearchableDropdown';

// Import hooks
import { useApiService } from "../../hooks/useApiService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";

// Import utilities
import { showConfirmDialog } from "../../utils/confirmDialog";
import { createVoucherService } from "../../services/createVoucherService";
import { fundService } from "../../services/apiServices";
import { ResetButton } from '../../components/common/ResetButton';

const ITEMS_PER_PAGE = 20;

const AddReconciliation = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  // Initial form data
  const initialFormData = {
    fundType: '',
    month: '',
    bankCode: '',
    debitCredit: '',
    voucherType: '',
    transactionType: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [reconciliationEntries, setReconciliationEntries] = useState([
    {
      id: 1,
      bankCode: '3062',
      type: 'BPV',
      voucherNo: '9',
      date: '2022-06-01',
      chequeNo: '042712',
      crAmount: '9,940.00',
      bankDate: '',
      isNew: false
    },
    {
      id: 2,
      bankCode: '3062',
      type: 'BPV',
      voucherNo: '10',
      date: '2022-07-01',
      chequeNo: '042716',
      crAmount: '8,000.00',
      bankDate: '',
      isNew: false
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [savedReconciliations, setSavedReconciliations] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableFunds, setAvailableFunds] = useState([]);

  const reconciliationService = createVoucherService('/bank-reconciliation');

  // Bank ledger codes
  const bankLedgers = [
    { value: '3060', label: '3060 - State Bank of India - Current A/c', description: 'State Bank of India - Current A/c' },
    { value: '3061', label: '3061 - Canara Bank - Savings A/c', description: 'Canara Bank - Savings A/c' },
    { value: '3062', label: '3062 - Union Bank of India - Current A/c', description: 'Union Bank of India - Current A/c' },
    { value: '3063', label: '3063 - HDFC Bank - Current A/c', description: 'HDFC Bank - Current A/c' },
    { value: '3064', label: '3064 - ICICI Bank - Savings A/c', description: 'ICICI Bank - Savings A/c' }
  ];

  // Debit/Credit options
  const debitCreditOptions = [
    { value: 'Both', label: 'Both', description: 'Both Debit and Credit' },
    { value: 'Receipts', label: 'Receipts', description: 'Receipts Only' },
    { value: 'Payments', label: 'Payments', description: 'Payments Only' }
  ];

  // Voucher types
  const voucherTypes = [
    { value: 'All', label: 'All', description: 'All Voucher Types' },
    { value: 'BRV', label: 'BRV - Bank Receipt Voucher', description: 'Bank Receipt Voucher' },
    { value: 'ADBRV', label: 'ADBRV - Advance Bank Receipt Voucher', description: 'Advance Bank Receipt Voucher' },
    { value: 'BPV', label: 'BPV - Bank Payment Voucher', description: 'Bank Payment Voucher' },
    { value: 'IBT', label: 'IBT - Inter Bank Transfer', description: 'Inter Bank Transfer' }
  ];

  // Transaction types
  const transactionTypes = [
    { value: 'All', label: 'All', description: 'All Transaction Types' },
    { value: 'Cash', label: 'Cash', description: 'Cash Transaction' },
    { value: 'Cheque', label: 'Cheque', description: 'Cheque Transaction' },
    { value: 'DD', label: 'DD', description: 'Demand Draft Transaction' },
    { value: 'NEFT', label: 'NEFT', description: 'NEFT Transaction' },
    { value: 'RTGS', label: 'RTGS', description: 'RTGS Transaction' },
    { value: 'IMPS', label: 'IMPS', description: 'IMPS Transaction' },
    { value: 'UPI', label: 'UPI', description: 'UPI Transaction' },
    { value: 'Ecs', label: 'Ecs', description: 'Ecs Transaction' },
    { value: 'Online', label: 'Online', description: 'Online Transaction' }
  ];

  // Month options
  const monthOptions = [
    { value: 'All', label: 'All', description: 'All months' },
    { value: 'April', label: 'April', description: 'April' },
    { value: 'May', label: 'May', description: 'May' },
    { value: 'June', label: 'June', description: 'June' },
    { value: 'July', label: 'July', description: 'July' },
    { value: 'August', label: 'August', description: 'August' },
    { value: 'September', label: 'September', description: 'September' },
    { value: 'October', label: 'October', description: 'October' },
    { value: 'November', label: 'November', description: 'November' },
    { value: 'December', label: 'December', description: 'December' },
    { value: 'January', label: 'January', description: 'January' },
    { value: 'February', label: 'February', description: 'February' },
    { value: 'March', label: 'March', description: 'March' },
    
  ];

  // Fund options
  const fundOptions = availableFunds.map(fund => ({
    value: fund.fundName,
    label: fund.fundName,
    description: `Created: ${fund.createdDate}`
  }));

  useEffect(() => {
    loadSavedReconciliations();
    loadAvailableFunds();
  }, []);

  const loadSavedReconciliations = async () => {
    const result = await executeApi(reconciliationService.getAll);
    if (result.success) {
      setSavedReconciliations(result.data || []);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEntryChange = (id, field, value) => {
    setReconciliationEntries(prev =>
      prev.map(entry => {
        if (entry.id === id) {
          let processedValue = value;
          
          // Format amount with Indian number formatting
          if (field === 'crAmount') {
            if (value) {
              const numericValue = value.toString().replace(/,/g, '');
              if (/^\d*\.?\d*$/.test(numericValue)) {
                if (numericValue !== '' && !isNaN(numericValue)) {
                  const parts = numericValue.split('.');
                  parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
                  processedValue = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
                }
              } else {
                return entry; // Don't update if invalid format
              }
            }
          }
          
          return { ...entry, [field]: processedValue };
        }
        return entry;
      })
    );
  };

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      bankCode: '3062',
      type: 'BPV',
      voucherNo: '',
      date: new Date().toISOString().split('T')[0],
      chequeNo: '',
      crAmount: '',
      bankDate: '',
      isNew: true
    };
    setReconciliationEntries(prev => [...prev, newEntry]);
  };

  const removeEntry = (id) => {
    if (reconciliationEntries.length > 1) {
      setReconciliationEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const calculateTotalAmount = () => {
    return reconciliationEntries.reduce((sum, entry) => {
      const amount = parseFloat(entry.crAmount?.toString().replace(/,/g, '') || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.fundType) {
      showToast('Fund type is required', 'error');
      return;
    }

    if (!formData.month) {
      showToast('Month is required', 'error');
      return;
    }

    if (!formData.bankCode) {
      showToast('Bank ledger code is required', 'error');
      return;
    }

    if (!formData.debitCredit) {
      showToast('Debit/Credit details are required', 'error');
      return;
    }

    if (!formData.voucherType) {
      showToast('Voucher type is required', 'error');
      return;
    }

    if (!formData.transactionType) {
      showToast('Transaction type is required', 'error');
      return;
    }

    if (reconciliationEntries.length === 0) {
      showToast('At least one entry is required', 'error');
      return;
    }

    // Validate entries
    const invalidEntries = reconciliationEntries.filter(entry => 
      !entry.voucherNo || !entry.chequeNo || !entry.crAmount || parseFloat(entry.crAmount.replace(/,/g, '')) <= 0
    );
    
    if (invalidEntries.length > 0) {
      showToast('Please fill all required fields for all entries', 'error');
      return;
    }

    const submitData = {
      ...formData,
      reconciliationType: 'Historical',
      entries: reconciliationEntries.map(entry => ({
        ...entry,
        crAmount: parseFloat(entry.crAmount.toString().replace(/,/g, '') || 0)
      })),
      totalAmount: calculateTotalAmount(),
      entriesCount: reconciliationEntries.length
    };

    let result;
    if (editingId) {
      result = await executeApi(reconciliationService.update, editingId, submitData);
    } else {
      result = await executeApi(reconciliationService.create, submitData);
    }

    if (result.success) {
      const message = editingId 
        ? 'Reconciliation updated successfully!'
        : 'Reconciliation saved successfully!';
      
      showToast(message, 'success');
      resetForm();
      await loadSavedReconciliations();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setReconciliationEntries([
      {
        id: Date.now(),
        bankCode: '3062',
        type: 'BPV',
        voucherNo: '',
        date: new Date().toISOString().split('T')[0],
        chequeNo: '',
        crAmount: '',
        bankDate: '',
        isNew: true
      }
    ]);
    setEditingId(null);
    clearError();
  };

  const handleEditReconciliation = (reconciliation) => {
    setFormData({
      fundType: reconciliation.fundType || '',
      month: reconciliation.month || '',
      bankCode: reconciliation.bankCode || '',
      debitCredit: reconciliation.debitCredit || '',
      voucherType: reconciliation.voucherType || '',
      transactionType: reconciliation.transactionType || ''
    });
    
    setReconciliationEntries(reconciliation.entries?.map(entry => ({
      ...entry,
      crAmount: entry.crAmount?.toLocaleString('en-IN') || ''
    })) || []);
    
    setEditingId(reconciliation.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteReconciliation = async (reconciliation) => {
    const confirmed = await showConfirmDialog(
      'Delete Reconciliation', 
      `Are you sure you want to delete this reconciliation?`,
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      const result = await executeApi(reconciliationService.delete, reconciliation.id);
      if (result.success) {
        showToast('Reconciliation deleted successfully!', 'success');
        await loadSavedReconciliations();
      } else {
        showToast('Failed to delete reconciliation!', 'error');
      }
    }
  };

  const filteredReconciliations = savedReconciliations.filter(reconciliation =>
    reconciliation.fundType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.bankCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.debitCredit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.voucherType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.entries?.some(entry =>
      entry.bankCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.chequeNo?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredReconciliations.length / ITEMS_PER_PAGE);
  const paginatedReconciliations = filteredReconciliations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFormHandler = () => {
    resetForm();
    setShowRecords(false);
  };

  const totalAmount = calculateTotalAmount();

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Add Reconciliation"
        subtitle="Manage historical reconciliation data"
        icon={History}
        totalRecords={savedReconciliations.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-purple-500"
        gradientTo="to-pink-500"
        countBg="from-purple-100"
        countTo="to-pink-100"
        countBorder="border-purple-200"
        countText="text-purple-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Reconciliations"
          totalRecords={savedReconciliations.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          gradientFrom="from-purple-500"
          gradientTo="to-pink-500"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
        >
          {filteredReconciliations.length === 0 ? (
            <EmptyState
              icon={History}
              title="No reconciliations found."
              actionText="Create your first reconciliation"
              onAction={() => setShowRecords(false)}
              searchTerm={searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {paginatedReconciliations.map((reconciliation) => (
                <div
                  key={reconciliation.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <History className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reconciliation.fundType || 'Historical Reconciliation'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Month: {reconciliation.month}
                        </p>
                        {reconciliation.fundType && (
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <Wallet className="h-4 w-4" />
                            <span>Fund: {reconciliation.fundType}</span>
                          </p>
                        )}
                        {reconciliation.debitCredit && (
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>Debit/Credit: {reconciliation.debitCredit}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">Total: ₹{reconciliation.totalAmount?.toLocaleString('en-IN')}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Historical Data | {reconciliation.entriesCount} entries
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditReconciliation(reconciliation)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Reconciliation"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReconciliation(reconciliation)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Reconciliation"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Entries: </span>
                      <span className="font-medium">{reconciliation.entriesCount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Bank Ledger Code: </span>
                      <span className="font-medium">{reconciliation.bankCode}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Voucher Type: </span>
                      <span className="font-medium">{reconciliation.voucherType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Transaction Type: </span>
                      <span className="font-medium">{reconciliation.transactionType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SearchableRecords>
      )}

      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Reconciliation' : 'Add Reconciliation'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                options={monthOptions}
                value={formData.month}
                onChange={(e) => handleChange({ target: { name: 'month', value: e.target.value } })}
                label="Month"
                placeholder="Select month"
                searchPlaceholder="Search months..."
                required
                icon={Calendar}
                emptyMessage="No months available"
              />
              
              <SearchableDropdown
                options={bankLedgers}
                value={formData.bankCode}
                onChange={(e) => handleChange({ target: { name: 'bankCode', value: e.target.value } })}
                label="Bank Ledger Code"
                placeholder="Select bank ledger code"
                searchPlaceholder="Search bank codes..."
                required
                icon={Building}
                emptyMessage="No bank codes available"
              />
              
              <SearchableDropdown
                options={debitCreditOptions}
                value={formData.debitCredit}
                onChange={(e) => handleChange({ target: { name: 'debitCredit', value: e.target.value } })}
                label="Debit/Credit Details"
                placeholder="Select debit/credit details"
                searchPlaceholder="Search debit/credit options..."
                required
                icon={DollarSign}
                emptyMessage="No options available"
              />
              
              <SearchableDropdown
                options={voucherTypes}
                value={formData.voucherType}
                onChange={(e) => handleChange({ target: { name: 'voucherType', value: e.target.value } })}
                label="Voucher Type"
                placeholder="Select voucher type"
                searchPlaceholder="Search voucher types..."
                required
                icon={FileText}
                emptyMessage="No voucher types available"
              />
              
              <SearchableDropdown
                options={transactionTypes}
                value={formData.transactionType}
                onChange={(e) => handleChange({ target: { name: 'transactionType', value: e.target.value } })}
                label="Transaction Type"
                placeholder="Select transaction type"
                searchPlaceholder="Search transaction types..."
                required
                icon={DollarSign}
                emptyMessage="No transaction types available"
              />
            </div>

            {/* Reconciliation Entries */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <History className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Reconciliation Entries</h3>
                </div>
                <button
                  onClick={addNewEntry}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Entry</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left">Bank Code</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Voucher No</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Cheque No</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Cr.Amount (₹)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Bank Date</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {reconciliationEntries.map((entry) => (
                      <tr key={entry.id} className={`hover:bg-gray-50 ${entry.isNew ? 'bg-green-50' : ''}`}>
                        <td className="border border-gray-300 px-4 py-3">
                          <select
                            value={entry.bankCode}
                            onChange={(e) => handleEntryChange(entry.id, 'bankCode', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {bankLedgers.map((bank) => (
                              <option key={bank.value} value={bank.value}>
                                {bank.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <select
                            value={entry.type}
                            onChange={(e) => handleEntryChange(entry.id, 'type', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {voucherTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="text"
                            value={entry.voucherNo}
                            onChange={(e) => handleEntryChange(entry.id, 'voucherNo', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Voucher No"
                            required
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="date"
                            value={entry.date}
                            onChange={(e) => handleEntryChange(entry.id, 'date', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="text"
                            value={entry.chequeNo}
                            onChange={(e) => handleEntryChange(entry.id, 'chequeNo', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Cheque No"
                            required
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="text"
                            value={entry.crAmount}
                            onChange={(e) => handleEntryChange(entry.id, 'crAmount', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.00"
                            required
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <input
                            type="date"
                            value={entry.bankDate}
                            onChange={(e) => handleEntryChange(entry.id, 'bankDate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex space-x-1">
                            <button
                              onClick={addNewEntry}
                              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                              title="Add Entry"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                            {reconciliationEntries.length > 1 && (
                              <button
                                onClick={() => removeEntry(entry.id)}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                title="Remove Entry"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total Entries: {reconciliationEntries.length}</span>
                  <span className="font-semibold text-green-600">
                    Total Amount: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
 <div className="flex justify-center border-t pt-6">
                <div className="flex items-center space-x-4">
                   <ResetButton
   onClick={resetForm}
    loading={loading}
  />
                  
                  <SubmitButton
                    loading={loading}
                    onClick={handleSubmit}
                    editingId={editingId}
                    text=" Reconciliation"
                    gradientFrom="from-purple-500"
                    gradientTo="to-pink-500"
                  />
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReconciliation;
