
import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, Calendar, FileText, DollarSign, Banknote, User, Wallet, CreditCard, Plus, Trash2, Check, Edit3, CheckCircle, AlertCircle, Filter, X, ChevronDown, ChevronUp, Search, Building2 } from 'lucide-react';

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
import { ResetButton } from '../../components/common/ResetButton';
import { EmptyState } from '../../components/common/EmptyState';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import SearchableRecords from '../../components/common/SearchableRecords';

// Import utilities
import { validateVoucherForm } from '../../utils/validation';
import { showConfirmDialog } from '../../utils/confirmDialog';
import { createVoucherService } from '../../services/createVoucherService';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { VoiceInputField } from '../../components/common/VoiceInputField';



const ITEMS_PER_PAGE = 20;

const BankPayment = () => {
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

  // Simplified initial form data with only required transaction-specific fields
  const initialFormData = {
    bpvType: 'BPV',
    bpvNo: '',
    bpvDate: new Date().toISOString().split('T')[0],
    inFavourOf: '',
    description : '',
    dateOfEncashment: '',
    modeOfTransaction: 'Cash',
    fundType: '',
    // Cheque/DD specific fields
    depositorName: '',
    chequeNo: '',
    chequeDate: '',
    bankName: '',
    chequeAmount: '',
    purposeOfPayment: '',
    // Online specific fields
    transactionId: '',
    payeeName: '',
    transferAmount: '',
    purpose: '',
    // ECS specific fields
    ecsTransactionId: '',
    ecsPayeeName: '',
    ecsAmount: '',
    ecsPurpose: ''
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

  const [currentPage, setCurrentPage] = useState(1);
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
    inFavourOf: '',
    fundType: '',
    transactionMode: '',
    bpvType: ''
  });

  const bankPaymentService = createVoucherService('/bank-payments');

  const bpvTypes = [
    { value: 'BPV', label: 'BPV', description: 'Bank Payment Voucher' },
    // { value: 'ADBPV', label: 'ADBPV', description: 'Advance Bank Payment Voucher' }
  ];

  // Simplified transaction modes - only Cash, Cheque/DD, Online, and ECS
  const transactionModes = [
    { value: 'Cash', label: 'Cash', description: 'Cash Payment' },
    { value: 'Cheque / DD', label: 'Cheque / DD', description: 'Cheque or Demand Draft' },
    { value: 'Online', label: 'Online', description: 'Online Transfer' },
    { value: 'ECS', label: 'ECS', description: 'Electronic Clearing Service' }
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
    const result = await executeApi(bankPaymentService.getAll);
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
  const addCreditEntry = addEntry(creditEntries, setCreditEntries, { ledgerCode: '', ledgerName: '', amount: '' });
  const removeDebitEntry = removeEntry(debitEntries, setDebitEntries);
  const removeCreditEntry = removeEntry(creditEntries, setCreditEntries);

  // Simplified validation for transaction-specific fields
  const validateTransactionSpecificFields = () => {
    const errors = [];

    if (formData.modeOfTransaction === 'Cheque / DD') {
      if (!formData.depositorName?.trim()) errors.push('Depositor name is required for cheque/DD transactions');
      if (!formData.chequeNo?.trim()) errors.push('Cheque/DD number is required');
      if (!formData.chequeDate) errors.push('Cheque/DD date is required');
      if (!formData.bankName?.trim()) errors.push('Bank name is required for cheque/DD transactions');
      if (!formData.chequeAmount?.trim()) errors.push('Cheque amount is required');
    }

    if (formData.modeOfTransaction === 'Online') {
      if (!formData.transactionId?.trim()) errors.push('Transaction ID is required for online transactions');
      if (!formData.payeeName?.trim()) errors.push('Payee name is required for online transactions');
      if (!formData.transferAmount?.trim()) errors.push('Transfer amount is required');
    }

    if (formData.modeOfTransaction === 'ECS') {
      if (!formData.ecsTransactionId?.trim()) errors.push('Transaction ID is required for ECS transactions');
      if (!formData.ecsPayeeName?.trim()) errors.push('Payee name is required for ECS transactions');
      if (!formData.ecsAmount?.trim()) errors.push('ECS amount is required');
    }

    return errors;
  };
const handleSubmit = async () => {
  const basicErrors = validateVoucherForm(formData, debitEntries, creditEntries, ['bpvType', 'bpvNo', 'bpvDate', 'fundType']);
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
    bankLedgerCode: creditEntries[0]?.ledgerCode || '',
    debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
    creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
    debitTotal,
    creditTotal,
    entryCount: debitEntries.length + creditEntries.length,
    balanced: true
  };

  let result;
  if (editingId) {
    result = await executeApi(bankPaymentService.update, editingId, submitData);
  } else {
    result = await executeApi(bankPaymentService.create, submitData);
  }

  if (result.success) {
    showToast(editingId ? 'Bank Payment Voucher updated successfully!' : 'Bank Payment Voucher created successfully!', 'success');
    resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
    await loadSavedVouchers();
  } else {
    showToast(result.message || 'Operation failed!', 'error');
  }
};

// ===============unbalanced save logic========
  // const handleSubmit = async () => {
  //   const basicErrors = validateVoucherForm(formData, debitEntries, creditEntries, ['bpvType', 'bpvNo', 'bpvDate', 'fundType']);
  //   const transactionErrors = validateTransactionSpecificFields();
  //   const allErrors = [...basicErrors, ...transactionErrors];

  //   if (allErrors.length > 0) {
  //     showToast(allErrors[0], 'error');
  //     return;
  //   }

  //   const debitTotal = calculateTotal(debitEntries);
  //   const creditTotal = calculateTotal(creditEntries);

  //   if (Math.abs(debitTotal - creditTotal) > 0.01) {
  //     const confirmed = await showConfirmDialog(
  //       'Unbalanced Entries',
  //       `Entries are unbalanced. Difference: ₹${Math.abs(debitTotal - creditTotal).toFixed(2)}. Do you want to continue?`,
  //       'Continue',
  //       'Cancel'
  //     );
  //     if (!confirmed) return;
  //   }

  //   const submitData = {
  //     ...formData,
  //     debitEntries: debitEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
  //     creditEntries: creditEntries.map(entry => ({ ...entry, amount: parseFloat(entry.amount || 0) })),
  //     debitTotal,
  //     creditTotal,
  //     entryCount: debitEntries.length + creditEntries.length,
  //     balanced: Math.abs(debitTotal - creditTotal) < 0.01
  //   };

  //   let result;
  //   if (editingId) {
  //     result = await executeApi(bankPaymentService.update, editingId, submitData);
  //   } else {
  //     result = await executeApi(bankPaymentService.create, submitData);
  //   }

  //   if (result.success) {
  //     showToast(editingId ? 'Bank Payment Voucher updated successfully!' : 'Bank Payment Voucher created successfully!', 'success');
  //     resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
  //     await loadSavedVouchers();
  //   } else {
  //     showToast(result.message || 'Operation failed!', 'error');
  //   }
  // };

  const handleEditVoucher = (voucher) => {
    setFormData({
      bpvType: voucher.bpvType || '',
      bpvNo: voucher.bpvNo || '',
      bpvDate: voucher.bpvDate || '',
      inFavourOf: voucher.inFavourOf || '',
      description : voucher.description  || '',
      dateOfEncashment: voucher.dateOfEncashment || '',
      modeOfTransaction: voucher.modeOfTransaction || 'Cash',
      fundType: voucher.fundType || '',
      // Cheque/DD specific fields
      depositorName: voucher.depositorName || '',
      chequeNo: voucher.chequeNo || '',
      chequeDate: voucher.chequeDate || '',
      bankName: voucher.bankName || '',
      chequeAmount: voucher.chequeAmount || '',
      purposeOfPayment: voucher.purposeOfPayment || '',
      // Online specific fields
      transactionId: voucher.transactionId || '',
      payeeName: voucher.payeeName || '',
      transferAmount: voucher.transferAmount || '',
      purpose: voucher.purpose || '',
      // ECS specific fields
      ecsTransactionId: voucher.ecsTransactionId || '',
      ecsPayeeName: voucher.ecsPayeeName || '',
      ecsAmount: voucher.ecsAmount || '',
      ecsPurpose: voucher.ecsPurpose || ''
    });

    setDebitEntries(voucher.debitEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialDebitEntries);
    setCreditEntries(voucher.creditEntries?.map(entry => ({ ...entry, amount: entry.amount?.toString() || '' })) || initialCreditEntries);

    setEditingId(voucher.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

 const handleDeleteVoucher = async (voucher) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Voucher',
    message: `Are you sure you want to delete voucher "${voucher.bpvNo}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(bankPaymentService.delete, voucher.id);
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
    setCurrentPage(1);
  };

  const filteredVouchers = savedVouchers.filter(voucher => {
    const filters = searchFilters;

    const searchMatch = !filters.searchTerm ||
      voucher.bpvNo?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.inFavourOf?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.fundType?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      voucher.bpvDate?.includes(filters.searchTerm);

    const dateFromMatch = !filters.dateFrom || voucher.bpvDate >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || voucher.bpvDate <= filters.dateTo;

    const amountMinMatch = !filters.amountMin ||
      (voucher.debitTotal >= parseFloat(filters.amountMin) || voucher.creditTotal >= parseFloat(filters.amountMin));
    const amountMaxMatch = !filters.amountMax ||
      (voucher.debitTotal <= parseFloat(filters.amountMax) && voucher.creditTotal <= parseFloat(filters.amountMax));

    const inFavourOfMatch = !filters.inFavourOf ||
      voucher.inFavourOf?.toLowerCase().includes(filters.inFavourOf.toLowerCase());

    const fundTypeMatch = !filters.fundType ||
      voucher.fundType?.toLowerCase().includes(filters.fundType.toLowerCase());

    const statusMatch = !filters.status ||
      (filters.status === 'balanced' && voucher.balanced) ||
      (filters.status === 'unbalanced' && !voucher.balanced);

    const transactionModeMatch = !filters.transactionMode ||
      voucher.modeOfTransaction === filters.transactionMode;

    const bpvTypeMatch = !filters.bpvType || voucher.bpvType === filters.bpvType;

    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch &&
           amountMaxMatch && inFavourOfMatch && fundTypeMatch && statusMatch &&
           transactionModeMatch && bpvTypeMatch;
  });

  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFormHandler = () => {
    resetForm(initialFormData, initialDebitEntries, initialCreditEntries);
    setShowRecords(false);
  };

  // Simplified function to render transaction-specific fields
  const renderTransactionSpecificFields = () => {
    if (formData.modeOfTransaction === 'Cheque / DD') {
      return (
        <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold text-blue-700 flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Cheque/DD Details</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="In Favour Of"
              name="depositorName"
              value={formData.depositorName}
              onChange={handleChange}
              required
              placeholder="Enter depositor's name"
              icon={User}
            />

            <FormField
              label="Cheque/DD No"
              name="chequeNo"
              value={formData.chequeNo}
              onChange={handleChange}
              required
              placeholder="Enter cheque/DD number"
              icon={FileText}
            />

            <FormField
              label="Cheque/DD Date"
              name="chequeDate"
              type="date"
              value={formData.chequeDate}
              onChange={handleChange}
              required
              icon={Calendar}
            />

            <FormField
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
              placeholder="Enter bank name"
              icon={Building2}
            />

            <FormField
              label="Amount (₹)"
              name="chequeAmount"
              value={formData.chequeAmount}
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

                handleChange({ target: { name: 'chequeAmount', value: processedValue } });
              }}
              required
              placeholder="0.00"
              icon={DollarSign}
            />

            <FormField
              label="Purpose of Payment"
              name="purposeOfPayment"
              value={formData.purposeOfPayment}
              onChange={handleChange}
              placeholder="Enter Purpose of Payment"
              icon={FileText}
            />
          </div>
        </div>
      );
    }

    if (formData.modeOfTransaction === 'Online') {
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
              label="Name of the Payee"
              name="payeeName"
              value={formData.payeeName}
              onChange={handleChange}
              required
              placeholder="Enter payee's name"
              icon={User}
            />

            <FormField
              label="Date"
              name="dateOfEncashment"
              type="date"
              value={formData.dateOfEncashment}
              onChange={handleChange}
              required
              icon={Calendar}
            />

            <FormField
              label="Amount (₹)"
              name="transferAmount"
              value={formData.transferAmount}
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

                handleChange({ target: { name: 'transferAmount', value: processedValue } });
              }}
              required
              placeholder="0.00"
              icon={DollarSign}
            />

            <FormField
              label="Purpose of Payment"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Enter purpose of payment"
              icon={FileText}
            />
          </div>
        </div>
      );
    }

    if (formData.modeOfTransaction === 'ECS') {
      return (
        <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="text-md font-semibold text-purple-700 flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>ECS Details</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Ref.No"
              name="ecsTransactionId"
              value={formData.ecsTransactionId}
              onChange={handleChange}
              required
              placeholder="Enter transaction ID"
              icon={FileText}
            />

            <FormField
              label="Name of the Payee"
              name="ecsPayeeName"
              value={formData.ecsPayeeName}
              onChange={handleChange}
              required
              placeholder="Enter payee's name"
              icon={User}
            />

            <FormField
              label="Date"
              name="dateOfEncashment"
              type="date"
              value={formData.dateOfEncashment}
              onChange={handleChange}
              required
              icon={Calendar}
            />

            <FormField
              label="Amount (₹)"
              name="ecsAmount"
              value={formData.ecsAmount}
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

                handleChange({ target: { name: 'ecsAmount', value: processedValue } });
              }}
              required
              placeholder="0.00"
              icon={DollarSign}
            />

            <FormField
              label="Purpose of Payment"
              name="ecsPurpose"
              value={formData.ecsPurpose}
              onChange={handleChange}
              placeholder="Enter purpose of payment"
              icon={FileText}
            />
          </div>
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
        title="Bank Payment Voucher"
        subtitle="Manage bank payment vouchers for outgoing payments"
        icon={ArrowDownCircle}
        totalRecords={savedVouchers.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetFormHandler}
        loading={loading}
        gradientFrom="from-red-500"
        gradientTo="to-orange-500"
        countBg="from-red-100"
        countTo="to-orange-100"
        countBorder="border-red-200"
        countText="text-red-800"
      />

      {showRecords && (
        <SearchableRecords
          title="Saved Bank Payment Vouchers"
          totalRecords={filteredVouchers.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-red-500"
          gradientTo="to-orange-500"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
          customFilters={[
            {
              key: 'bpvType',
              label: 'BPV Type',
              type: 'select',
              icon: FileText,
              options: [
                { value: '', label: 'All Types' },
                { value: 'BPV', label: 'BPV' },
                // { value: 'ADBPV', label: 'ADBPV' }
              ]
            }
          ]}
        >
          {filteredVouchers.length === 0 ? (
            <EmptyState
              icon={ArrowDownCircle}
              title="No bank payment vouchers found."
              actionText="Create your first voucher"
              onAction={() => setShowRecords(false)}
              searchTerm={searchFilters.searchTerm}
            />
          ) : (
            <div className="space-y-4">
              {paginatedVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className="bg-gradient-to-r from-white to-gray-50 border border-red-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <ArrowDownCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {voucher.bpvType} - {voucher.bpvNo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {voucher.bpvDate} | Fund: {voucher.fundType}
                        </p>
                        {voucher.inFavourOf && (
                          <p className="text-sm text-gray-600">In Favour Of: {voucher.inFavourOf}</p>
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
                          {voucher.entryCount} entries | {voucher.modeOfTransaction}
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

                  {/* Transaction-specific details display */}
                  {voucher.modeOfTransaction === 'Cheque / DD' && (voucher.depositorName || voucher.chequeNo || voucher.chequeDate || voucher.bankName || voucher.chequeAmount || voucher.purposeOfPayment) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-2">Cheque/DD Details:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {voucher.depositorName && <div><span className="text-gray-600">Depositor:</span> {voucher.depositorName}</div>}
                        {voucher.chequeNo && <div><span className="text-gray-600">Cheque/DD No:</span> {voucher.chequeNo}</div>}
                        {voucher.chequeDate && <div><span className="text-gray-600">Cheque Date:</span> {voucher.chequeDate}</div>}
                        {voucher.bankName && <div><span className="text-gray-600">Bank:</span> {voucher.bankName}</div>}
                        {voucher.chequeAmount && <div><span className="text-gray-600">Amount:</span> ₹{voucher.chequeAmount}</div>}
                        {voucher.purposeOfPayment && <div className="col-span-full"><span className="text-gray-600">Purpose:</span> {voucher.purposeOfPayment}</div>}
                      </div>
                    </div>
                  )}

                  {voucher.modeOfTransaction === 'Online' && (voucher.transactionId || voucher.payeeName) && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">Online Transfer Details:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {voucher.transactionId && <div><span className="text-gray-600">Ref.No:</span> {voucher.transactionId}</div>}
                        {voucher.payeeName && <div><span className="text-gray-600">Payee:</span> {voucher.payeeName}</div>}
                        {voucher.dateOfEncashment && <div><span className="text-gray-600">Date:</span> {voucher.dateOfEncashment}</div>}
                        {voucher.transferAmount && <div><span className="text-gray-600">Amount:</span> ₹{voucher.transferAmount}</div>}
                        {voucher.purpose && <div className="col-span-full"><span className="text-gray-600">Purpose:</span> {voucher.purpose}</div>}
                      </div>
                    </div>
                  )}

                  {voucher.modeOfTransaction === 'ECS' && (voucher.ecsTransactionId || voucher.ecsPayeeName) && (
                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                      <h5 className="font-medium text-purple-800 mb-2">ECS Details:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {voucher.ecsTransactionId && <div><span className="text-gray-600">Ref.No:</span> {voucher.ecsTransactionId}</div>}
                        {voucher.ecsPayeeName && <div><span className="text-gray-600">Payee:</span> {voucher.ecsPayeeName}</div>}
                        {voucher.dateOfEncashment && <div><span className="text-gray-600">Date:</span> {voucher.dateOfEncashment}</div>}
                        {voucher.ecsAmount && <div><span className="text-gray-600">Amount:</span> ₹{voucher.ecsAmount}</div>}
                        {voucher.ecsPurpose && <div className="col-span-full"><span className="text-gray-600">Purpose:</span> {voucher.ecsPurpose}</div>}
                      </div>
                    </div>
                  )}

                  {/* Detailed Entry Information */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
                    {/* Debit Entries */}
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

                    {/* Credit Entries */}
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

                  {/* Additional Details */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Transaction Mode: </span>
                      <span className="font-medium">{voucher.modeOfTransaction}</span>
                    </div>
                    {voucher.dateOfEncashment && (
                      <div>
                        <span className="text-gray-600">Date of Encashment: </span>
                        <span className="font-medium">{voucher.dateOfEncashment}</span>
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
          <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Bank Payment Voucher' : 'Create New Bank Payment Voucher'}
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
                options={bpvTypes.map(type => ({
                  value: type.value,
                  label: type.label,
                  description: type.description
                }))}
                value={formData.bpvType}
                onChange={(e) => handleChange({ target: { name: 'bpvType', value: e.target.value } })}
                label="BPV Type"
                placeholder="Select BPV Type"
                searchPlaceholder="Search BPV types..."
                required
                icon={ArrowDownCircle}
                emptyMessage="No BPV types available"
              />

              <FormField
                label="BPV No"
                name="bpvNo"
                value={formData.bpvNo}
                onChange={handleChange}
                required
                placeholder="Enter BPV number"
                icon={FileText}
              />

               <FormField
                label="BPV Date"
                name="bpvDate"
                type="date"
                value={formData.bpvDate}
                onChange={handleChange}
                required
                icon={Calendar}
              />
             
            </div>

            {/* Fund Type and In Favour Of */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* <FormField
                label="In Favour Of"
                name="inFavourOf"
                value={formData.inFavourOf}
                onChange={handleChange}
                placeholder="Name of the payee"
                icon={User}
              /> */}
            </div>

            {/* Transaction Mode */}
            {/* <SearchableDropdown
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
            /> */}

         

            {/* Entries Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debit Entry Form */}
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
                      description: `${ledger.name}`
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
                      description: `${ledger.name}`
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
   {/* Fund Type and In Favour Of */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             
               {/* Transaction Mode */}
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
                label="In Favour Of"
                name="inFavourOf"
                value={formData.inFavourOf}
                onChange={handleChange}
                placeholder="Name of the payee"
                icon={User}
              />
              
            </div>
               {/* Transaction-specific fields */}
            {renderTransactionSpecificFields()}
                <VoiceInputField
                label="Description (Optional)"
                name="description"
                value={formData.description }
                onChange={handleChange}
                placeholder="Enter   description (தமிழ்/EN)"
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
    gradientFrom="from-red-500"
    gradientTo="to-orange-500"
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

export default BankPayment;