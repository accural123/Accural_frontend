import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Calendar, 
  Building,
  Search,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Table,
  MessageSquare
} from 'lucide-react';

// Import common components and hooks
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { Header } from "../../components/common/Header";
import { ErrorDisplay } from "../../components/common/ErrorDisplay";
import { ToastContainer } from "../../components/common/ToastContainer";
import { SearchableRecords } from "../../components/common/SearchableRecords";
import { EmptyState } from "../../components/common/EmptyState";
import { ModernVoucherRow } from "../../components/common/ModernVoucherRow";
import { RadioGroup } from "../../components/common/RadioGroup";

import { useApiService } from "../../hooks/useApiService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { validateVoucherForm } from "../../utils/validation";
import { showConfirmDialog } from "../../utils/confirmDialog";
import { createVoucherService } from "../../services/createVoucherService";

const ITEMS_PER_PAGE = 20;

const Reconciliation = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  // Initial form data
  const [formData, setFormData] = useState({
    month: '',
    bankLedgerCode: '',
    debitCreditDetails: 'Credit'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [reconciliationEntries, setReconciliationEntries] = useState([]);
  const [savedReconciliations, setSavedReconciliations] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesLoaded, setEntriesLoaded] = useState(false);

  const reconciliationService = createVoucherService('/bank-reconciliation');

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

  // Bank ledger codes
  const bankLedgers = [
    { code: '3060', name: 'State Bank of India - Current A/c' },
    { code: '3061', name: 'Canara Bank - Savings A/c' },
    { code: '3062', name: 'Union Bank of India - Current A/c' },
    { code: '3063', name: 'HDFC Bank - Current A/c' },
    { code: '3064', name: 'ICICI Bank - Savings A/c' },
    { code: '3065', name: 'Axis Bank - Current A/c' },
    { code: '3066', name: 'Punjab National Bank - Savings A/c' },
    { code: '3067', name: 'Bank of Baroda - Current A/c' }
  ];

  // Debit/Credit options
  const debitCreditOptions = [
    { value: 'Credit', label: 'Credit', description: 'Credit Transactions' },
    { value: 'Debit', label: 'Debit', description: 'Debit Transactions' }
  ];

  useEffect(() => {
    loadSavedReconciliations();
  }, []);

  const loadSavedReconciliations = async () => {
    const result = await executeApi(reconciliationService.getAll);
    if (result.success) {
      setSavedReconciliations(result.data || []);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset entries when criteria changes
    if (name === 'month' || name === 'bankLedgerCode' || name === 'debitCreditDetails') {
      setReconciliationEntries([]);
      setEntriesLoaded(false);
    }
  };

  const handleBankDateChange = (id, bankDate) => {
    setReconciliationEntries(prev =>
      prev.map(entry =>
        entry.id === id ? { ...entry, bankDate } : entry
      )
    );
  };

  const handleLoadEntries = async () => {
    const errors = [];
    if (!formData.month) errors.push('Month is required');
    if (!formData.bankLedgerCode) errors.push('Bank Ledger Code is required');
    
    if (errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }

    showToast('Loading reconciliation entries...', 'info');

    const result = await executeApi(reconciliationService.getAll, filters);

    if (result.success) {
      const entries = Array.isArray(result.data) ? result.data : [];
      setReconciliationEntries(entries);
      setEntriesLoaded(true);
      showToast(`${entries.length} entries loaded successfully!`, 'success');
    } else {
      showToast(result.message || 'Failed to load entries', 'error');
    }
  };

  const handleSubmit = async () => {
    const errors = [];
    if (!formData.month) errors.push('Month is required');
    if (!formData.bankLedgerCode) errors.push('Bank Ledger Code is required');
    if (reconciliationEntries.length === 0) errors.push('No reconciliation entries to process');
    
    if (errors.length > 0) {
      showToast(errors[0], 'error');
      return;
    }

    // Check if all entries have bank dates
    const entriesWithoutBankDate = reconciliationEntries.filter(entry => !entry.bankDate);
    if (entriesWithoutBankDate.length > 0) {
      const confirmed = await showConfirmDialog(
        'Incomplete Bank Dates',
        `${entriesWithoutBankDate.length} entries don't have bank dates. Do you want to continue?`,
        'Continue',
        'Cancel'
      );
      if (!confirmed) return;
    }

    const submitData = {
      ...formData,
      entries: reconciliationEntries,
      totalAmount: reconciliationEntries.reduce((sum, entry) => sum + entry.amount, 0),
      entriesCount: reconciliationEntries.length,
      reconciledEntries: reconciliationEntries.filter(entry => entry.bankDate).length,
      pendingEntries: reconciliationEntries.filter(entry => !entry.bankDate).length
    };

    let result;
    if (editingId) {
      result = await executeApi(reconciliationService.update, editingId, submitData);
    } else {
      result = await executeApi(reconciliationService.create, submitData);
    }

    if (result.success) {
      showToast(editingId ? 'Reconciliation updated successfully!' : 'Reconciliation completed successfully!', 'success');
      resetForm();
      await loadSavedReconciliations();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      month: '',
      bankLedgerCode: '',
      debitCreditDetails: 'Credit'
    });
    setReconciliationEntries([]);
    setEntriesLoaded(false);
    setEditingId(null);
    clearError();
  };

  const handleEditReconciliation = (reconciliation) => {
    setFormData({
      month: reconciliation.month || '',
      bankLedgerCode: reconciliation.bankLedgerCode || '',
      debitCreditDetails: reconciliation.debitCreditDetails || 'Credit'
    });
    
    setReconciliationEntries(reconciliation.entries || []);
    setEntriesLoaded(reconciliation.entries?.length > 0);
    setEditingId(reconciliation.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteReconciliation = async (reconciliation) => {
    const confirmed = await showConfirmDialog(
      'Delete Reconciliation', 
      `Are you sure you want to delete reconciliation for "${reconciliation.month} - ${reconciliation.bankLedgerCode}"?`,
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
    reconciliation.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.bankLedgerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.debitCreditDetails?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalAmount = reconciliationEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const reconciledEntries = reconciliationEntries.filter(entry => entry.bankDate).length;
  const pendingEntries = reconciliationEntries.length - reconciledEntries;

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Bank Reconciliation"
        subtitle="Reconcile bank transactions and maintain accurate records"
        icon={Calculator}
        totalRecords={savedReconciliations.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-orange-500"
        gradientTo="to-red-500"
        countBg="from-orange-100"
        countTo="to-red-100"
        countBorder="border-orange-200"
        countText="text-orange-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Reconciliations"
          totalRecords={savedReconciliations.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          gradientFrom="from-orange-500"
          gradientTo="to-red-500"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
        >
          {filteredReconciliations.length === 0 ? (
            <EmptyState
              icon={Calculator}
              title="No reconciliations found."
              actionText="Create your first reconciliation"
              onAction={() => setShowRecords(false)}
              searchTerm={searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {paginatedReconciliations.map((reconciliation) => (
                <ModernVoucherRow
                  key={reconciliation.id}
                  voucher={reconciliation}
                  onEdit={handleEditReconciliation}
                  onDelete={handleDeleteReconciliation}
                  primaryField="month"
                  voucherNumberField="reconciledEntries"
                  dateField="createdDate"
                  icon={Calculator}
                  gradientFrom="from-orange-500"
                  gradientTo="to-red-500"
                  borderColor="border-orange-200"
                  additionalInfo={{
                    'Bank': reconciliation.bankLedgerCode || 'N/A',
                    'Type': reconciliation.debitCreditDetails || 'N/A',
                    'Entries': `${reconciliation.entriesCount || 0} entries`,
                    'Amount': `₹${(reconciliation.totalAmount || 0).toLocaleString('en-IN')}`
                  }}
                />
              ))}
            </div>
          )}
        </SearchableRecords>
      )}

      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Reconciliation Details' : 'Add Reconciliation Details'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Selection Criteria */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">Selection Criteria</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Month</option>
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Ledger Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bankLedgerCode"
                    value={formData.bankLedgerCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Select Bank</option>
                    {bankLedgers.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.code} - {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Debit/Credit Details */}
            <RadioGroup
              label="Transaction Type"
              name="debitCreditDetails"
              value={formData.debitCreditDetails}
              onChange={handleChange}
              options={debitCreditOptions}
              required
              columns={2}
            />

            {/* Load Entries Button */}
            <div className="flex justify-center py-4">
              <button
                onClick={handleLoadEntries}
                disabled={loading || !formData.month || !formData.bankLedgerCode}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-all duration-200"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span>Load Entries</span>
              </button>
            </div>

            {/* Reconciliation Entries */}
            {entriesLoaded && reconciliationEntries.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Table className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Reconciliation Entries</h3>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Total Entries</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{reconciliationEntries.length}</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Reconciled</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">{reconciledEntries}</p>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">{pendingEntries}</p>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Total Amount</span>
                    </div>
                    <p className="text-xl font-bold text-purple-900">₹{totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                
                {/* Entries Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full border-collapse bg-white">
                    <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Bank Code</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Voucher No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Reference No</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Bank Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reconciliationEntries.map((entry, index) => (
                        <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-orange-50 transition-colors`}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.bankCode}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                              {entry.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.voucherNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.chequeNo}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-green-600">
                            ₹{entry.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="date"
                              value={entry.bankDate}
                              onChange={(e) => handleBankDateChange(entry.id, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {entriesLoaded && reconciliationEntries.length > 0 && (
              <SubmitButton
                loading={loading}
                onClick={handleSubmit}
                editingId={editingId}
                text="Reconciliation"
                gradientFrom="from-orange-500"
                gradientTo="to-red-500"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reconciliation;