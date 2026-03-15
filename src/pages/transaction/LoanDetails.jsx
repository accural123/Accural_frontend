import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, FileText, Building, Save, Plus, Edit, Trash2, Eye, Search, Percent, Clock, AlertCircle } from 'lucide-react';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { loanService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { VoiceInputField } from '../../components/common/VoiceInputField';
import { useAuth } from '../../context/AuthContext';
const LoanDetails = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    loanSerialNumber: '',
    loanFileNumber: '',
    financialYear: '',
    fundType: '',
    fundName: '',
    voucherNo: '',
    voucherDate: '',
    voucherType: '',
    bankLedgerCode: '',
    bankAccountNumber: '',
    loanAgainstLedgerCode: '',
    loanSanctionOrderDetails: '',
    loanSanctionDate: '',
    loanType: '',
    nameOfScheme: '',
    nameOfWork: '',
    loanReceivedFrom: '',
    overallLoanAmount: '',
    overallInterestAmount: '',
    rateOfInterest: '',
    loanPeriodYears: '',
    loanPeriodMonths: '',
    loanPayoutOption: '',
    principleInstallment: '',
    interestInstallment: '',
    noOfInstallments: '',
    installmentStartDate: '',
    installmentEndDate: '',
    loanClosedDate: '',
    principleAmountWaiver: '',
    penalty: '',
    penaltyRateOfInterest: '',
    purposeOfLoan: '',
    loanStatus: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [loans, setLoans] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const { executeApi, loading, error, clearError } = useApiService();

  // Dropdown options
  const fundTypeOptions = [
    { value: 'general_fund', label: 'General Fund', description: 'Primary operational fund' },
    { value: 'infrastructure_fund', label: 'Infrastructure Fund', description: 'Capital development fund' },
    { value: 'social_welfare_fund', label: 'Social Welfare Fund', description: 'Community welfare fund' },
    { value: 'emergency_fund', label: 'Emergency Fund', description: 'Contingency fund' },
    { value: 'development_fund', label: 'Development Fund', description: 'Urban development fund' }
  ];

  const voucherTypeOptions = [
    { value: 'payment', label: 'Payment Voucher', description: 'Payment transaction voucher' },
    { value: 'receipt', label: 'Receipt Voucher', description: 'Receipt transaction voucher' },
    { value: 'journal', label: 'Journal Voucher', description: 'Journal entry voucher' },
    { value: 'contra', label: 'Contra Voucher', description: 'Bank to bank transfer' }
  ];

  const loanTypeOptions = [
    { value: 'interest_loan', label: 'Interest Loan', description: 'Loan with interest charges' },
    { value: 'interest_free_loan', label: 'Interest Free Loan', description: 'Loan without interest charges' }
  ];

  const loanPayoutOptions = [
    { value: 'monthly', label: 'Monthly', description: 'Monthly installment payout' },
    { value: 'quarterly', label: 'Quarterly', description: 'Quarterly installment payout' },
    { value: 'half_yearly', label: 'Half Yearly', description: 'Half yearly installment payout' },
    { value: 'annually', label: 'Annually', description: 'Annual installment payout' },
    { value: 'others', label: 'Others', description: 'Other payout options' }
  ];

  const yesNoOptions = [
    { value: 'yes', label: 'Yes', description: 'Yes' },
    { value: 'no', label: 'No', description: 'No' }
  ];

  const loanStatusOptions = [
    { value: 'live', label: 'Live', description: 'Active loan' },
    { value: 'partially_closed', label: 'Partially Closed', description: 'Partially repaid' },
    { value: 'closed', label: 'Closed', description: 'Loan fully repaid' }
  ];

  const financialYearOptions = [
    { value: '2024-25', label: '2024-25', description: 'Financial Year 2024-2025' },
    { value: '2023-24', label: '2023-24', description: 'Financial Year 2023-2024' },
    { value: '2022-23', label: '2022-23', description: 'Financial Year 2022-2023' }
  ];

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    const result = await executeApi(loanService.getAll);
    if (result.success) {
      setLoans(result.data || []);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.loanSerialNumber.trim()) {
      newErrors.loanSerialNumber = 'Loan serial number is required';
    }

    if (!formData.loanFileNumber.trim()) {
      newErrors.loanFileNumber = 'Loan file number is required';
    }

    if (!formData.financialYear) {
      newErrors.financialYear = 'Financial year is required';
    }

    if (!formData.fundType) {
      newErrors.fundType = 'Fund type is required';
    }

    if (!formData.fundName.trim()) {
      newErrors.fundName = 'Fund name is required';
    }

    if (!formData.voucherNo.trim()) {
      newErrors.voucherNo = 'Voucher number is required';
    }

    if (!formData.voucherDate) {
      newErrors.voucherDate = 'Voucher date is required';
    }

    if (!formData.voucherType) {
      newErrors.voucherType = 'Voucher type is required';
    }

    if (!formData.loanType) {
      newErrors.loanType = 'Loan type is required';
    }

    if (!formData.overallLoanAmount.trim()) {
      newErrors.overallLoanAmount = 'Overall loan amount is required';
    } else if (isNaN(parseFloat(formData.overallLoanAmount))) {
      newErrors.overallLoanAmount = 'Overall loan amount must be a valid number';
    }

    if (formData.loanType === 'interest_loan' && !formData.rateOfInterest.trim()) {
      newErrors.rateOfInterest = 'Rate of interest is required for interest loans';
    }

    if (!formData.loanStatus) {
      newErrors.loanStatus = 'Loan status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let transformedValue = value;
    
    // Transform numeric fields
    if (['overallLoanAmount', 'overallInterestAmount', 'rateOfInterest', 'penaltyRateOfInterest', 
         'principleInstallment', 'interestInstallment', 'loanPeriodYears', 'loanPeriodMonths', 
         'noOfInstallments'].includes(name)) {
      transformedValue = value.replace(/[^0-9.]/g, '');
    }
    
    // Transform account number (only numbers)
    if (name === 'bankAccountNumber') {
      transformedValue = value.replace(/\D/g, '');
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: transformedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    clearError();
    
    // Prepare data for submission - parse numeric fields and remove commas if any
    const submitData = {
      ...formData,
      overallLoanAmount: parseFloat(formData.overallLoanAmount.replace(/,/g, '')),
      overallInterestAmount: formData.overallInterestAmount ? parseFloat(formData.overallInterestAmount.replace(/,/g, '')) : 0,
      rateOfInterest: formData.rateOfInterest ? parseFloat(formData.rateOfInterest.replace(/,/g, '')) : 0,
      principleInstallment: formData.principleInstallment ? parseFloat(formData.principleInstallment.replace(/,/g, '')) : 0,
      interestInstallment: formData.interestInstallment ? parseFloat(formData.interestInstallment.replace(/,/g, '')) : 0,
      noOfInstallments: formData.noOfInstallments ? parseInt(formData.noOfInstallments) : 0,
      loanPeriodYears: formData.loanPeriodYears ? parseInt(formData.loanPeriodYears) : 0,
      loanPeriodMonths: formData.loanPeriodMonths ? parseInt(formData.loanPeriodMonths) : 0,
      penaltyRateOfInterest: formData.penaltyRateOfInterest ? parseFloat(formData.penaltyRateOfInterest.replace(/,/g, '')) : 0
    };
    
    try {
      let result;
      
      if (editingId) {
        result = await executeApi(loanService.update, editingId, submitData);
      } else {
        result = await executeApi(loanService.create, submitData);
      }

      if (result.success) {
        const message = editingId ? 'Loan updated successfully!' : 'Loan created successfully!';
        showToast(message, 'success');
        resetForm();
        await loadLoans();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving loan:', error);
      showToast('Error saving loan. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      loanSerialNumber: '',
      loanFileNumber: '',
      financialYear: '',
      fundType: '',
      fundName: '',
      voucherNo: '',
      voucherDate: '',
      voucherType: '',
      bankLedgerCode: '',
      bankAccountNumber: '',
      loanAgainstLedgerCode: '',
      loanSanctionOrderDetails: '',
      loanSanctionDate: '',
      loanType: '',
      nameOfScheme: '',
      nameOfWork: '',
      loanReceivedFrom: '',
      overallLoanAmount: '',
      overallInterestAmount: '',
      rateOfInterest: '',
      loanPeriodYears: '',
      loanPeriodMonths: '',
      loanPayoutOption: '',
      principleInstallment: '',
      interestInstallment: '',
      noOfInstallments: '',
      installmentStartDate: '',
      installmentEndDate: '',
      loanClosedDate: '',
      principleAmountWaiver: '',
      penalty: '',
      penaltyRateOfInterest: '',
      purposeOfLoan: '',
      loanStatus: '',
      remarks: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (loan) => {
    setFormData(loan);
    setEditingId(loan.id);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const loan = loans.find(l => l.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Loan',
    message: `Are you sure you want to delete this loan record? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(loanService.delete, id);
    if (result.success) {
      showToast(result.message || 'Loan deleted successfully!', 'success');
      await loadLoans();
    } else {
      showToast(result.message || 'Failed to delete loan!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this loan?')) {
  //     const result = await executeApi(loanService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Loan deleted successfully!', 'success');
  //       await loadLoans();
  //     } else {
  //       showToast(result.message || 'Failed to delete loan!', 'error');
  //     }
  //   }
  // };

  const filteredLoans = loans.filter(loan =>
    loan.loanSerialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.loanReceivedFrom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDropdownLabel = (options, value) => {
    const found = options.find(option => option.value === value);
    return found ? found.label : value;
  };

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Loan Details' : 'Loan Details'}
            </h1>
            <p className="text-slate-600">Create and manage loan records</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg">
            <CreditCard className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">
              Total Loans: {loans.length}
            </span>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            <Eye className="h-4 w-4" />
            <span>{showTable ? 'Hide List' : 'View List'}</span>
          </button>
          {editingId && (
            <button
              onClick={() => {
                resetForm();
                setShowTable(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Loan Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Loan Information' : 'Loan Information'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Loan Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-500" />
                  Basic Loan Information
                </h3>
              </div>

              <FormField
                label="Loan Serial Number"
                name="loanSerialNumber"
                value={formData.loanSerialNumber}
                onChange={handleChange}
                required
                error={errors.loanSerialNumber}
                icon={FileText}
                placeholder="Enter serial number"
              />

              <FormField
                label="Loan File Number"
                name="loanFileNumber"
                value={formData.loanFileNumber}
                onChange={handleChange}
                required
                error={errors.loanFileNumber}
                icon={FileText}
                placeholder="Enter file number"
              />

              <SearchableDropdown
                label="Financial Year"
                placeholder="Select Financial Year"
                searchPlaceholder="Search financial years..."
                options={financialYearOptions}
                value={formData.financialYear}
                onChange={handleDropdownChange('financialYear')}
                required
                error={errors.financialYear}
                icon={Calendar}
                emptyMessage="No financial years available"
              />

              <SearchableDropdown
                label="Fund Type"
                placeholder="Select Fund Type"
                searchPlaceholder="Search fund types..."
                options={fundTypeOptions}
                value={formData.fundType}
                onChange={handleDropdownChange('fundType')}
                required
                error={errors.fundType}
                icon={DollarSign}
                emptyMessage="No fund types available"
              />

              <FormField
                label="Fund Name"
                name="fundName"
                value={formData.fundName}
                onChange={handleChange}
                required
                error={errors.fundName}
                icon={DollarSign}
                placeholder="Enter fund name"
              />

              {/* Voucher Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Voucher Information
                </h3>
              </div>

              <FormField
                label="Voucher No"
                name="voucherNo"
                value={formData.voucherNo}
                onChange={handleChange}
                required
                error={errors.voucherNo}
                icon={FileText}
                placeholder="Enter voucher number"
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
                label="Voucher Type"
                placeholder="Select Voucher Type"
                searchPlaceholder="Search voucher types..."
                options={voucherTypeOptions}
                value={formData.voucherType}
                onChange={handleDropdownChange('voucherType')}
                required
                error={errors.voucherType}
                icon={FileText}
                emptyMessage="No voucher types available"
              />

              {/* Bank Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-purple-500" />
                  Bank & Ledger Information
                </h3>
              </div>

              <FormField
                label="Bank Ledger Code"
                name="bankLedgerCode"
                value={formData.bankLedgerCode}
                onChange={handleChange}
                error={errors.bankLedgerCode}
                icon={CreditCard}
                placeholder="Enter bank ledger code"
              />

              <FormField
                label="Bank Account Number"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                error={errors.bankAccountNumber}
                icon={CreditCard}
                placeholder="Enter account number"
              />

              <FormField
                label="Loan Against Ledger Code"
                name="loanAgainstLedgerCode"
                value={formData.loanAgainstLedgerCode}
                onChange={handleChange}
                error={errors.loanAgainstLedgerCode}
                icon={CreditCard}
                placeholder="Enter ledger code"
              />

              {/* Loan Sanction Details */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-green-500" />
                  Loan Sanction Details
                </h3>
              </div>

              <div className="lg:col-span-2">
                <FormField
                  label="Loan Sanction Order Details"
                  name="loanSanctionOrderDetails"
                  type="textarea"
                  value={formData.loanSanctionOrderDetails}
                  onChange={handleChange}
                  error={errors.loanSanctionOrderDetails}
                  icon={FileText}
                  placeholder="Enter sanction order details"
                />
              </div>

              <FormField
                label="Loan Sanction Date"
                name="loanSanctionDate"
                type="date"
                value={formData.loanSanctionDate}
                onChange={handleChange}
                error={errors.loanSanctionDate}
                icon={Calendar}
              />

              <SearchableDropdown
                label="Loan Type"
                placeholder="Select Loan Type"
                searchPlaceholder="Search loan types..."
                options={loanTypeOptions}
                value={formData.loanType}
                onChange={handleDropdownChange('loanType')}
                required
                error={errors.loanType}
                icon={CreditCard}
                emptyMessage="No loan types available"
              />

              <FormField
                label="Name of the Scheme"
                name="nameOfScheme"
                value={formData.nameOfScheme}
                onChange={handleChange}
                error={errors.nameOfScheme}
                icon={FileText}
                placeholder="Enter scheme name"
              />

              <FormField
                label="Name of the Work"
                name="nameOfWork"
                value={formData.nameOfWork}
                onChange={handleChange}
                error={errors.nameOfWork}
                icon={FileText}
                placeholder="Enter work name"
              />

              <FormField
                label="Loan Received From"
                name="loanReceivedFrom"
                value={formData.loanReceivedFrom}
                onChange={handleChange}
                error={errors.loanReceivedFrom}
                icon={Building}
                placeholder="Enter loan provider"
              />

              {/* Loan Amount Details */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Loan Amount Details
                </h3>
              </div>

              <FormField
                label="Overall Loan Amount"
                name="overallLoanAmount"
                value={formData.overallLoanAmount}
                onChange={handleChange}
                required
                error={errors.overallLoanAmount}
                icon={DollarSign}
                placeholder="Enter loan amount"
              />

              <FormField
                label="Overall Interest Amount"
                name="overallInterestAmount"
                value={formData.overallInterestAmount}
                onChange={handleChange}
                error={errors.overallInterestAmount}
                icon={DollarSign}
                placeholder="Enter interest amount"
              />

              <FormField
                label="Rate of Interest (%)"
                name="rateOfInterest"
                value={formData.rateOfInterest}
                onChange={handleChange}
                required={formData.loanType === 'interest_loan'}
                error={errors.rateOfInterest}
                icon={Percent}
                placeholder="Enter interest rate"
                disabled={formData.loanType === 'interest_free_loan'}
              />

              <FormField
                label="Loan Period (Years)"
                name="loanPeriodYears"
                value={formData.loanPeriodYears}
                onChange={handleChange}
                error={errors.loanPeriodYears}
                icon={Clock}
                placeholder="Enter years"
              />

              <FormField
                label="Loan Period (Months)"
                name="loanPeriodMonths"
                value={formData.loanPeriodMonths}
                onChange={handleChange}
                error={errors.loanPeriodMonths}
                icon={Clock}
                placeholder="Enter months"
              />

              <SearchableDropdown
                label="Loan Payout Option"
                placeholder="Select Payout Option"
                searchPlaceholder="Search payout options..."
                options={loanPayoutOptions}
                value={formData.loanPayoutOption}
                onChange={handleDropdownChange('loanPayoutOption')}
                error={errors.loanPayoutOption}
                icon={Clock}
                emptyMessage="No payout options available"
              />

              {/* Monthly Installment Details */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                  Monthly Installment Payable Amount
                </h3>
              </div>

              <FormField
                label="Principle"
                name="principleInstallment"
                value={formData.principleInstallment}
                onChange={handleChange}
                error={errors.principleInstallment}
                icon={DollarSign}
                placeholder="Enter principle installment"
              />

              <FormField
                label="Interest"
                name="interestInstallment"
                value={formData.interestInstallment}
                onChange={handleChange}
                error={errors.interestInstallment}
                icon={DollarSign}
                placeholder="Enter interest installment"
              />

              <FormField
                label="No. of Installments"
                name="noOfInstallments"
                value={formData.noOfInstallments}
                onChange={handleChange}
                error={errors.noOfInstallments}
                icon={FileText}
                placeholder="Enter number of installments"
              />

              <FormField
                label="Monthly Installment's Starts From"
                name="installmentStartDate"
                type="date"
                value={formData.installmentStartDate}
                onChange={handleChange}
                error={errors.installmentStartDate}
                icon={Calendar}
              />

              <FormField
                label="Monthly Installment's Ends To"
                name="installmentEndDate"
                type="date"
                value={formData.installmentEndDate}
                onChange={handleChange}
                error={errors.installmentEndDate}
                icon={Calendar}
              />

              <FormField
                label="Loan Closed Date"
                name="loanClosedDate"
                type="date"
                value={formData.loanClosedDate}
                onChange={handleChange}
                error={errors.loanClosedDate}
                icon={Calendar}
              />

              {/* Additional Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                  Additional Information
                </h3>
              </div>

              <SearchableDropdown
                label="Principle Amount Waiver if Any"
                placeholder="Select Option"
                searchPlaceholder="Search options..."
                options={yesNoOptions}
                value={formData.principleAmountWaiver}
                onChange={handleDropdownChange('principleAmountWaiver')}
                error={errors.principleAmountWaiver}
                icon={AlertCircle}
                emptyMessage="No options available"
              />

              <SearchableDropdown
                label="Penalty if Any"
                placeholder="Select Option"
                searchPlaceholder="Search options..."
                options={yesNoOptions}
                value={formData.penalty}
                onChange={handleDropdownChange('penalty')}
                error={errors.penalty}
                icon={AlertCircle}
                emptyMessage="No options available"
              />

              <FormField
                label="Penalty Rate of Interest (%)"
                name="penaltyRateOfInterest"
                value={formData.penaltyRateOfInterest}
                onChange={handleChange}
                error={errors.penaltyRateOfInterest}
                icon={Percent}
                placeholder="Enter penalty rate"
                disabled={formData.penalty !== 'yes'}
              />

              <div className="lg:col-span-2">
                <FormField
                  label="Purpose of Loan"
                  name="purposeOfLoan"
                  type="textarea"
                  value={formData.purposeOfLoan}
                  onChange={handleChange}
                  error={errors.purposeOfLoan}
                  icon={FileText}
                  placeholder="Enter purpose of loan"
                />
              </div>

              <SearchableDropdown
                label="Loan Status"
                placeholder="Select Loan Status"
                searchPlaceholder="Search status..."
                options={loanStatusOptions}
                value={formData.loanStatus}
                onChange={handleDropdownChange('loanStatus')}
                required
                error={errors.loanStatus}
                icon={CreditCard}
                emptyMessage="No status options available"
              />

              <div className="lg:col-span-3">
                   <VoiceInputField
                              label="Remarks (Optional)"
                              name="remarks"
                              value={formData.remarks}
                              onChange={handleChange}
                              placeholder="Enter remarks  (தமிழ்/EN)"
                              rows={3}
                              error={errors.remarks}
                              showToast={showToast}
                              showLangToggle={true}
                            />
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-8">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                disabled={submitLoading}
              >
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitLoading}
                className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {submitLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{submitLoading ? 'Saving...' : (editingId ? 'Update' : 'Submit')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loans List */}
      {showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Loan Records ({loans.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search loans..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <span className="ml-2 text-slate-600">Loading loans...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Loan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {filteredLoans.map((loan) => (
                    <tr key={loan.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{loan.loanSerialNumber}</div>
                          <div className="text-sm text-slate-500">{loan.nameOfScheme}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{loan.fundName}</div>
                        <div className="text-sm text-slate-500">
                          {getDropdownLabel(fundTypeOptions, loan.fundType)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          loan.loanType === 'interest_loan' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getDropdownLabel(loanTypeOptions, loan.loanType)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">₹{loan.overallLoanAmount}</div>
                        <div className="text-sm text-slate-500">Interest: ₹{loan.overallInterestAmount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{loan.rateOfInterest}%</div>
                        <div className="text-sm text-slate-500">
                          {getDropdownLabel(loanPayoutOptions, loan.loanPayoutOption)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{loan.loanReceivedFrom}</div>
                        <div className="text-sm text-slate-500">{loan.loanSanctionDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          loan.loanStatus === 'live' 
                            ? 'bg-green-100 text-green-800' 
                            : loan.loanStatus === 'partially_closed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getDropdownLabel(loanStatusOptions, loan.loanStatus)}
                        </span>
                        {loan.principleAmountWaiver === 'yes' && (
                          <div className="text-xs text-blue-600 mt-1">Waiver</div>
                        )}
                        {loan.penalty === 'yes' && (
                          <div className="text-xs text-red-600 mt-1">Penalty</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(loan)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(loan.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && filteredLoans.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm ? 'No loans found matching your search.' : 'No loans created yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowTable(false)}
                  className="text-orange-600 hover:text-orange-800 text-sm font-medium mt-2"
                >
                  Create your first loan →
                </button>
              )}
            </div>
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
/>
    </div>
  );
};

export default LoanDetails;