import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, FileText, Building, Save, Plus, Edit, Trash2, Eye, Search, CreditCard, Percent, Clock } from 'lucide-react';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { investmentService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { VoiceInputField } from '../../components/common/VoiceInputField';
import { useAuth } from '../../context/AuthContext';
const InvestmentDetails = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    investmentSerialNumber: '',
    investmentFileNumber: '',
    financialYear: '',
    fundType: '',
    fundName: '',
    voucherNo: '',
    voucherDate: '',
    voucherType: '',
    bankLedgerCode: '',
    bankAccountNumber: '',
    investmentAgainstLedgerCode: '',
    nameOfBank: '',
    investorName: '',
    investmentAmount: '',
    rateOfInterest: '',
    interestPayoutOption: '',
    bondFdNumber: '',
    investmentDate: '',
    investmentPeriodFrom: '',
    investmentPeriodTo: '',
    nextRenewalDate: '',
    principleAmount: '',
    interestAmount: '',
    maturityValue: '',
    investmentMaturityDate: '',
    preMaturity: '',
    investmentStatus: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [investments, setInvestments] = useState([]);
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

  const interestPayoutOptions = [
    { value: 'monthly', label: 'Monthly', description: 'Monthly interest payout' },
    { value: 'quarterly', label: 'Quarterly', description: 'Quarterly interest payout' },
    { value: 'half_yearly', label: 'Half Yearly', description: 'Half yearly interest payout' },
    { value: 'annually', label: 'Annually', description: 'Annual interest payout' },
    { value: 'compound', label: 'Compound', description: 'Compound interest' }
  ];

  const preMaturityOptions = [
    { value: 'yes', label: 'Yes', description: 'Pre-maturity applicable' },
    { value: 'no', label: 'No', description: 'No pre-maturity' }
  ];

  const investmentStatusOptions = [
    { value: 'live', label: 'Live', description: 'Active investment' },
    { value: 'partially_closed', label: 'Partially Closed', description: 'Partially withdrawn' },
    { value: 'closed', label: 'Closed', description: 'Investment closed/matured' }
  ];

  const financialYearOptions = [
    { value: '2024-25', label: '2024-25', description: 'Financial Year 2024-2025' },
    { value: '2023-24', label: '2023-24', description: 'Financial Year 2023-2024' },
    { value: '2022-23', label: '2022-23', description: 'Financial Year 2022-2023' }
  ];

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    const result = await executeApi(investmentService.getAll);
    if (result.success) {
      setInvestments(result.data || []);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.investmentSerialNumber.trim()) {
      newErrors.investmentSerialNumber = 'Investment serial number is required';
    }

    if (!formData.investmentFileNumber.trim()) {
      newErrors.investmentFileNumber = 'Investment file number is required';
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

    if (!formData.bankAccountNumber.trim()) {
      newErrors.bankAccountNumber = 'Bank account number is required';
    }

    if (!formData.nameOfBank.trim()) {
      newErrors.nameOfBank = 'Bank name is required';
    }

    if (!formData.investorName.trim()) {
      newErrors.investorName = 'Investor name is required';
    }

    if (!formData.investmentAmount.trim()) {
      newErrors.investmentAmount = 'Investment amount is required';
    } else if (isNaN(parseFloat(formData.investmentAmount))) {
      newErrors.investmentAmount = 'Investment amount must be a valid number';
    }

    if (!formData.rateOfInterest.trim()) {
      newErrors.rateOfInterest = 'Rate of interest is required';
    } else if (isNaN(parseFloat(formData.rateOfInterest))) {
      newErrors.rateOfInterest = 'Rate of interest must be a valid number';
    }

    if (!formData.interestPayoutOption) {
      newErrors.interestPayoutOption = 'Interest payout option is required';
    }

    if (!formData.investmentDate) {
      newErrors.investmentDate = 'Investment date is required';
    }

    if (!formData.investmentPeriodFrom) {
      newErrors.investmentPeriodFrom = 'Investment period from date is required';
    }

    if (!formData.investmentPeriodTo) {
      newErrors.investmentPeriodTo = 'Investment period to date is required';
    }

    if (!formData.investmentStatus) {
      newErrors.investmentStatus = 'Investment status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let transformedValue = value;
    
    // Transform numeric fields
    if (['investmentAmount', 'rateOfInterest', 'principleAmount', 'interestAmount', 'maturityValue'].includes(name)) {
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

  const calculateMaturityValue = () => {
    const principal = parseFloat(formData.principleAmount) || parseFloat(formData.investmentAmount) || 0;
    const interest = parseFloat(formData.interestAmount) || 0;
    const maturity = principal + interest;
    
    setFormData(prev => ({
      ...prev,
      maturityValue: maturity.toFixed(2)
    }));
  };

  useEffect(() => {
    if (formData.principleAmount || formData.interestAmount || formData.investmentAmount) {
      calculateMaturityValue();
    }
  }, [formData.principleAmount, formData.interestAmount, formData.investmentAmount]);

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    clearError();
    
    // Prepare data for submission - parse numeric fields and remove commas if any
    const submitData = {
      ...formData,
      investmentAmount: formData.investmentAmount ? parseFloat(String(formData.investmentAmount).replace(/,/g, '')) : 0,
      rateOfInterest: formData.rateOfInterest ? parseFloat(String(formData.rateOfInterest).replace(/,/g, '')) : 0,
      principleAmount: formData.principleAmount ? parseFloat(String(formData.principleAmount).replace(/,/g, '')) : 0,
      interestAmount: formData.interestAmount ? parseFloat(String(formData.interestAmount).replace(/,/g, '')) : 0,
      maturityValue: formData.maturityValue ? parseFloat(String(formData.maturityValue).replace(/,/g, '')) : 0
    };
    
    try {
      let result;
      
      if (editingId) {
        result = await executeApi(investmentService.update, editingId, submitData);
      } else {
        result = await executeApi(investmentService.create, submitData);
      }

      if (result.success) {
        const message = editingId ? 'Investment updated successfully!' : 'Investment created successfully!';
        showToast(message, 'success');
        resetForm();
        await loadInvestments();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving investment:', error);
      showToast('Error saving investment. Please try again.', 'error');
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
      investmentSerialNumber: '',
      investmentFileNumber: '',
      financialYear: '',
      fundType: '',
      fundName: '',
      voucherNo: '',
      voucherDate: '',
      voucherType: '',
      bankLedgerCode: '',
      bankAccountNumber: '',
      investmentAgainstLedgerCode: '',
      nameOfBank: '',
      investorName: '',
      investmentAmount: '',
      rateOfInterest: '',
      interestPayoutOption: '',
      bondFdNumber: '',
      investmentDate: '',
      investmentPeriodFrom: '',
      investmentPeriodTo: '',
      nextRenewalDate: '',
      principleAmount: '',
      interestAmount: '',
      maturityValue: '',
      investmentMaturityDate: '',
      preMaturity: '',
      investmentStatus: '',
      remarks: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (investment) => {
    setFormData(investment);
    setEditingId(investment.id);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
  const handleDelete = async (id) => {
  const investment = investments.find(inv => inv.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Investment',
    message: `Are you sure you want to delete this investment record? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(investmentService.delete, id);
    if (result.success) {
      showToast(result.message || 'Investment deleted successfully!', 'success');
      await loadInvestments();
    } else {
      showToast(result.message || 'Failed to delete investment!', 'error');
    }
  }
};

  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this investment?')) {
  //     const result = await executeApi(investmentService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Investment deleted successfully!', 'success');
  //       await loadInvestments();
  //     } else {
  //       showToast(result.message || 'Failed to delete investment!', 'error');
  //     }
  //   }
  // };

  const filteredInvestments = investments.filter(inv =>
    inv.investmentSerialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.investorName?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Investment Details' : 'Investment Details'}
            </h1>
            <p className="text-slate-600">Create and manage investment records</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Total Investments: {investments.length}
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

      {/* Investment Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Investment Information' : 'Investment Information'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Investment Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Basic Investment Information
                </h3>
              </div>

              <FormField
                label="Investment Serial Number"
                name="investmentSerialNumber"
                value={formData.investmentSerialNumber}
                onChange={handleChange}
                required
                error={errors.investmentSerialNumber}
                icon={FileText}
                placeholder="Enter serial number"
              />

              <FormField
                label="Investment File Number"
                name="investmentFileNumber"
                value={formData.investmentFileNumber}
                onChange={handleChange}
                required
                error={errors.investmentFileNumber}
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
                  Bank Information
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
                required
                error={errors.bankAccountNumber}
                icon={CreditCard}
                placeholder="Enter account number"
              />

              <FormField
                label="Investment Against Ledger Code"
                name="investmentAgainstLedgerCode"
                value={formData.investmentAgainstLedgerCode}
                onChange={handleChange}
                error={errors.investmentAgainstLedgerCode}
                icon={CreditCard}
                placeholder="Enter ledger code"
              />

              <FormField
                label="Name of the Bank"
                name="nameOfBank"
                value={formData.nameOfBank}
                onChange={handleChange}
                required
                error={errors.nameOfBank}
                icon={Building}
                placeholder="Enter bank name"
              />

              <FormField
                label="Investor's Name"
                name="investorName"
                value={formData.investorName}
                onChange={handleChange}
                required
                error={errors.investorName}
                icon={Building}
                placeholder="Enter investor name"
              />

              {/* Investment Details */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Investment Details
                </h3>
              </div>

              <FormField
                label="Investment Amount"
                name="investmentAmount"
                value={formData.investmentAmount}
                onChange={handleChange}
                required
                error={errors.investmentAmount}
                icon={DollarSign}
                placeholder="Enter investment amount"
              />

              <FormField
                label="Rate of Interest (%)"
                name="rateOfInterest"
                value={formData.rateOfInterest}
                onChange={handleChange}
                required
                error={errors.rateOfInterest}
                icon={Percent}
                placeholder="Enter interest rate"
              />

              <SearchableDropdown
                label="Interest Payout Option"
                placeholder="Select Payout Option"
                searchPlaceholder="Search payout options..."
                options={interestPayoutOptions}
                value={formData.interestPayoutOption}
                onChange={handleDropdownChange('interestPayoutOption')}
                required
                error={errors.interestPayoutOption}
                icon={Clock}
                emptyMessage="No payout options available"
              />

              <FormField
                label="Bond / Fixed Deposit Number"
                name="bondFdNumber"
                value={formData.bondFdNumber}
                onChange={handleChange}
                error={errors.bondFdNumber}
                icon={FileText}
                placeholder="Enter bond/FD number"
              />

              <FormField
                label="Investment Date"
                name="investmentDate"
                type="date"
                value={formData.investmentDate}
                onChange={handleChange}
                required
                error={errors.investmentDate}
                icon={Calendar}
              />

              {/* Investment Period */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  Investment Period
                </h3>
              </div>

              <FormField
                label="Investment Period From"
                name="investmentPeriodFrom"
                type="date"
                value={formData.investmentPeriodFrom}
                onChange={handleChange}
                required
                error={errors.investmentPeriodFrom}
                icon={Calendar}
              />

              <FormField
                label="Investment Period To"
                name="investmentPeriodTo"
                type="date"
                value={formData.investmentPeriodTo}
                onChange={handleChange}
                required
                error={errors.investmentPeriodTo}
                icon={Calendar}
              />

              <FormField
                label="Next Renewal Date"
                name="nextRenewalDate"
                type="date"
                value={formData.nextRenewalDate}
                onChange={handleChange}
                error={errors.nextRenewalDate}
                icon={Calendar}
              />

              {/* Maturity Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-yellow-500" />
                  Maturity Information
                </h3>
              </div>

              <FormField
                label="Principle Amount"
                name="principleAmount"
                value={formData.principleAmount}
                onChange={handleChange}
                error={errors.principleAmount}
                icon={DollarSign}
                placeholder="Enter principle amount"
              />

              <FormField
                label="Interest Amount"
                name="interestAmount"
                value={formData.interestAmount}
                onChange={handleChange}
                error={errors.interestAmount}
                icon={DollarSign}
                placeholder="Enter interest amount"
              />

              <FormField
                label="Maturity Value"
                name="maturityValue"
                value={formData.maturityValue}
                onChange={handleChange}
                error={errors.maturityValue}
                icon={DollarSign}
                placeholder="Calculated automatically"
                disabled
              />

              <FormField
                label="Investment Maturity / Closed Date"
                name="investmentMaturityDate"
                type="date"
                value={formData.investmentMaturityDate}
                onChange={handleChange}
                error={errors.investmentMaturityDate}
                icon={Calendar}
              />

              <SearchableDropdown
                label="Pre-Maturity if Any"
                placeholder="Select Pre-Maturity Option"
                searchPlaceholder="Search options..."
                options={preMaturityOptions}
                value={formData.preMaturity}
                onChange={handleDropdownChange('preMaturity')}
                error={errors.preMaturity}
                icon={Clock}
                emptyMessage="No options available"
              />

              <SearchableDropdown
                label="Investment Status"
                placeholder="Select Investment Status"
                searchPlaceholder="Search status..."
                options={investmentStatusOptions}
                value={formData.investmentStatus}
                onChange={handleDropdownChange('investmentStatus')}
                required
                error={errors.investmentStatus}
                icon={TrendingUp}
                emptyMessage="No status options available"
              />

              <div className="lg:col-span-3">
                {/* <FormField
                  label="Remarks"
                  name="remarks"
                  type="textarea"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={errors.remarks}
                  icon={FileText}
                  placeholder="Enter any remarks or notes"
                /> 
                    <VoiceInputField
                label="Remarks (Optional)"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks or use voice input (தமிழ்/EN)"
                rows={3}
                error={errors.remarks}
                showToast={showToast}
                showLangToggle={true}
              />*/}
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
                className="px-8 py-2.5 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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

      {/* Investments List */}
      {showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Investment Records ({investments.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search investments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-slate-600">Loading investments...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Investment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {filteredInvestments.map((investment) => (
                    <tr key={investment.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{investment.investmentSerialNumber}</div>
                          <div className="text-sm text-slate-500">{investment.investorName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{investment.fundName}</div>
                        <div className="text-sm text-slate-500">
                          {getDropdownLabel(fundTypeOptions, investment.fundType)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{investment.nameOfBank}</div>
                        <div className="text-sm text-slate-500">{investment.bankAccountNumber}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">₹{investment.investmentAmount}</div>
                        <div className="text-sm text-slate-500">Maturity: ₹{investment.maturityValue}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{investment.rateOfInterest}%</div>
                        <div className="text-sm text-slate-500">
                          {getDropdownLabel(interestPayoutOptions, investment.interestPayoutOption)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{investment.investmentDate}</div>
                        <div className="text-sm text-slate-500">
                          {investment.investmentPeriodFrom} to {investment.investmentPeriodTo}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          investment.investmentStatus === 'live' 
                            ? 'bg-green-100 text-green-800' 
                            : investment.investmentStatus === 'partially_closed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {getDropdownLabel(investmentStatusOptions, investment.investmentStatus)}
                        </span>
                        {investment.preMaturity === 'yes' && (
                          <div className="text-xs text-orange-600 mt-1">Pre-maturity</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(investment)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(investment.id)}
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
          
          {!loading && filteredInvestments.length === 0 && (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm ? 'No investments found matching your search.' : 'No investments created yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowTable(false)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium mt-2"
                >
                  Create your first investment →
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

export default InvestmentDetails;