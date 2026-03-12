import React, { useState, useEffect } from 'react';
import { 
  History, 
  Calendar, 
  FileText,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Plus,
  Trash2,
  Eye,
  Wallet,
  Edit3,
  Building,
  Search
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
import { useToast } from "../../hooks/useToast";

// Import utilities
import { showConfirmDialog } from "../../utils/confirmDialog";
import { createVoucherService } from "../../services/createVoucherService";
import { fundService } from "../../services/apiServices";
import { ResetButton } from '../../components/common/ResetButton';
import { VoiceInputField } from '../../components/common/VoiceInputField';

const PreviousReconciliation = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();

  // Initial form data
  const initialFormData = {
    fundType: '',
    month: '',
    bankCode: '',
    voucherType: '',
    voucherNo: '',
    voucherDate: new Date().toISOString().split('T')[0],
    transactionType: '',
    chequeNo: '',
    amount: '',
    description : ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [savedReconciliations, setSavedReconciliations] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableFunds, setAvailableFunds] = useState([]);
  const [errors, setErrors] = useState({});

  const reconciliationService = createVoucherService('/bank-reconciliation');

  // Bank ledger codes
  const bankLedgers = [
    { value: '3060', label: '3060 - State Bank of India - Current A/c', description: 'State Bank of India - Current A/c' },
    { value: '3061', label: '3061 - Canara Bank - Savings A/c', description: 'Canara Bank - Savings A/c' },
    { value: '3062', label: '3062 - Union Bank of India - Current A/c', description: 'Union Bank of India - Current A/c' },
    { value: '3063', label: '3063 - HDFC Bank - Current A/c', description: 'HDFC Bank - Current A/c' },
    { value: '3064', label: '3064 - ICICI Bank - Savings A/c', description: 'ICICI Bank - Savings A/c' }
  ];

  // Voucher types
  const voucherTypes = [
    { value: 'BRV', label: 'BRV - Bank Receipt Voucher', description: 'Bank Receipt Voucher' },
    { value: 'ADBRV', label: 'ADBRV - Advance Bank Receipt Voucher', description: 'Advance Bank Receipt Voucher' },
    { value: 'BPV', label: 'BPV - Bank Payment Voucher', description: 'Bank Payment Voucher' },
    { value: 'IBT', label: 'IBT - Inter Bank Transfer', description: 'Inter Bank Transfer' }
  ];

  // Transaction types
  const transactionTypes = [
    { value: 'Cash', label: 'Cash', description: 'Cash Transaction' },
    { value: 'Cheque', label: 'Cheque', description: 'Cheque Transaction' },
    { value: 'DD', label: 'DD', description: 'Demand Draft Transaction' }
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
      const result = await fundService.getAll();
      setAvailableFunds(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Error loading funds:', error);
      setAvailableFunds([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
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

  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (!formData.fundType) {
      newErrors.fundType = 'Fund type is required';
    }

    if (!formData.month) {
      newErrors.month = 'Month is required';
    }

    if (!formData.bankCode) {
      newErrors.bankCode = 'Bank ledger code is required';
    }

    if (!formData.voucherType) {
      newErrors.voucherType = 'Voucher type is required';
    }

    if (!formData.voucherNo) {
      newErrors.voucherNo = 'Voucher number is required';
    }

    if (!formData.voucherDate) {
      newErrors.voucherDate = 'Voucher date is required';
    }

    if (!formData.transactionType) {
      newErrors.transactionType = 'Transaction type is required';
    }

    if (!formData.chequeNo) {
      newErrors.chequeNo = 'Cheque/DD number is required';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const numericAmount = parseFloat(formData.amount.replace(/,/g, ''));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        newErrors.amount = 'Amount must be a valid positive number';
      }
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
      ...formData,
      amount: parseFloat(formData.amount.replace(/,/g, '')),
      reconciliationType: 'Historical'
    };

    let result;
    if (editingId) {
      result = await executeApi(reconciliationService.update, editingId, submitData);
    } else {
      result = await executeApi(reconciliationService.create, submitData);
    }

    if (result.success) {
      const message = editingId 
        ? 'Previous reconciliation updated successfully!'
        : 'Previous reconciliation saved successfully!';
      
      showToast(message, 'success');
      resetForm();
      await loadSavedReconciliations();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEditReconciliation = (reconciliation) => {
    setFormData({
      fundType: reconciliation.fundType || '',
      month: reconciliation.month || '',
      bankCode: reconciliation.bankCode || '',
      voucherType: reconciliation.voucherType || '',
      voucherNo: reconciliation.voucherNo || '',
      voucherDate: reconciliation.voucherDate || '',
      transactionType: reconciliation.transactionType || '',
      chequeNo: reconciliation.chequeNo || '',
      amount: reconciliation.amount ? reconciliation.amount.toLocaleString('en-IN') : '',
      description : reconciliation.description  || ''
    });
    setEditingId(reconciliation.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteReconciliation = async (reconciliation) => {
    const confirmed = await showConfirmDialog(
      'Delete Previous Reconciliation', 
      `Are you sure you want to delete reconciliation with voucher "${reconciliation.voucherNo || 'Untitled'}"?`,
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      const result = await executeApi(reconciliationService.delete, reconciliation.id);
      if (result.success) {
        showToast('Previous reconciliation deleted successfully!', 'success');
        await loadSavedReconciliations();
      } else {
        showToast('Failed to delete previous reconciliation!', 'error');
      }
    }
  };

  const filteredReconciliations = savedReconciliations.filter(reconciliation =>
    reconciliation.fundType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.bankCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.voucherType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.chequeNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reconciliation.description ?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetFormHandler = () => {
    resetForm();
    setShowRecords(false);
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Previous Reconciliation"
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
          title="Saved Previous Reconciliations"
          totalRecords={savedReconciliations.length}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          gradientFrom="from-purple-500"
          gradientTo="to-pink-500"
        >
          {filteredReconciliations.length === 0 ? (
            <EmptyState
              icon={History}
              title="No previous reconciliations found."
              actionText="Create your first reconciliation"
              onAction={() => setShowRecords(false)}
              searchTerm={searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {filteredReconciliations.map((reconciliation) => (
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
                          {reconciliation.voucherNo || 'Historical Reconciliation'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {reconciliation.voucherDate}
                        </p>
                        {reconciliation.fundType && (
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <Wallet className="h-4 w-4" />
                            <span>Fund: {reconciliation.fundType}</span>
                          </p>
                        )}
                        {reconciliation.month && (
                          <p className="text-sm text-gray-600 flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Month: {reconciliation.month}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-green-600">Amount: ₹{reconciliation.amount?.toLocaleString('en-IN')}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {reconciliation.voucherType} | {reconciliation.transactionType}
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
                      <span className="text-gray-600">Bank Ledger Code: </span>
                      <span className="font-medium">{reconciliation.bankCode}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cheque/DD No: </span>
                      <span className="font-medium">{reconciliation.chequeNo}</span>
                    </div>
                  </div>
                  
                  {reconciliation.description  && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">description : </span>
                        {reconciliation.description }
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
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Previous Reconciliation' : 'Create Previous Reconciliation'}
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SearchableDropdown
                  options={fundOptions}
                  value={formData.fundType}
                  onChange={handleDropdownChange('fundType')}
                  label="Fund Type"
                  placeholder="Select a fund type"
                  searchPlaceholder="Search funds..."
                  required
                  error={errors.fundType}
                  icon={Wallet}
                  emptyMessage="No funds available. Create funds first."
                />
                
                <SearchableDropdown
                  options={monthOptions}
                  value={formData.month}
                  onChange={handleDropdownChange('month')}
                  label="Month"
                  placeholder="Select month"
                  searchPlaceholder="Search months..."
                  required
                  error={errors.month}
                  icon={Calendar}
                  emptyMessage="No months available"
                />
                
                <SearchableDropdown
                  options={bankLedgers}
                  value={formData.bankCode}
                  onChange={handleDropdownChange('bankCode')}
                  label="Bank Ledger Code"
                  placeholder="Select bank ledger code"
                  searchPlaceholder="Search bank codes..."
                  required
                  error={errors.bankCode}
                  icon={Building}
                  emptyMessage="No bank codes available"
                />
                
                <SearchableDropdown
                  options={voucherTypes}
                  value={formData.voucherType}
                  onChange={handleDropdownChange('voucherType')}
                  label="Voucher Type"
                  placeholder="Select voucher type"
                  searchPlaceholder="Search voucher types..."
                  required
                  error={errors.voucherType}
                  icon={FileText}
                  emptyMessage="No voucher types available"
                />
                
                <FormField
                  label="Voucher No"
                  name="voucherNo"
                  value={formData.voucherNo}
                  onChange={handleChange}
                  required
                  placeholder="Enter voucher number"
                  error={errors.voucherNo}
                  icon={FileText}
                />
                
                <FormField
                  label="Voucher Date"
                  name="voucherDate"
                  type="date"
                  value={formData.voucherDate}
                  onChange={handleChange}
                  required
                  error={errors.voucherDate}
                  icon={Calendar}
                />
                
                <SearchableDropdown
                  options={transactionTypes}
                  value={formData.transactionType}
                  onChange={handleDropdownChange('transactionType')}
                  label="Transaction Type"
                  placeholder="Select transaction type"
                  searchPlaceholder="Search transaction types..."
                  required
                  error={errors.transactionType}
                  icon={DollarSign}
                  emptyMessage="No transaction types available"
                />
                
                <FormField
                  label="Cheque/DD No"
                  name="chequeNo"
                  value={formData.chequeNo}
                  onChange={handleChange}
                  required
                  placeholder="Enter cheque/DD number"
                  error={errors.chequeNo}
                  icon={FileText}
                />
                
                <FormField
                  label="Amount (₹)"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  error={errors.amount}
                  icon={DollarSign}
                  textAlign="right"
                />
              </div>

                 <VoiceInputField
                             label="Description (Optional)"
                             name="description"
                             value={formData.description}
                             onChange={handleChange}
                             placeholder="Enter description or use voice input (தமிழ்/EN)"
                             rows={3}
                             error={errors.description}
                             showToast={showToast}
                             showLangToggle={true}
                           />

              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <CheckCircle className="h-5 w-5 text-red-400 mr-3" />
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
                    text="Previous Reconciliation"
                    gradientFrom="from-purple-500"
                    gradientTo="to-pink-500"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousReconciliation;
