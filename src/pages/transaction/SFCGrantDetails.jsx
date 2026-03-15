import React, { useState, useEffect } from 'react';
import { Gift, DollarSign, Calendar, FileText, Building, Save, Plus, Edit, Trash2, Eye, CreditCard, Receipt } from 'lucide-react';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { sfcGrantService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { VoiceInputField } from '../../components/common/VoiceInputField';
import { useAuth } from '../../context/AuthContext';
import SearchableRecords from '../../components/common/SearchableRecords';
const SFCGrantDetails = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    financialYear: '',
    fundType: '',
    fundName: '',
    voucherNo: '',
    voucherDate: '',
    voucherType: '',
    transactionType: '',
    transactionDate: '',
    referenceNoAndDate: '',
    year: '',
    periodOf: '',
    grossAmount: '',
    deductionAmount: '',
    netAmount: '',
    adjustmentDate: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [grants, setGrants] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', transactionType: '', fundType: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const { executeApi, loading, error, clearError } = useApiService();

  // Dropdown options
  const fundTypeOptions = [
    { value: 'general_fund', label: 'General Fund', description: 'Primary operational fund' },
    { value: 'infrastructure_fund', label: 'Infrastructure Fund', description: 'Capital development fund' },
    { value: 'social_welfare_fund', label: 'Social Welfare Fund', description: 'Community welfare fund' },
    { value: 'emergency_fund', label: 'Emergency Fund', description: 'Contingency fund' },
    { value: 'development_fund', label: 'Development Fund', description: 'Urban development fund' },
    { value: 'sfc_fund', label: 'SFC Fund', description: 'State Finance Commission Fund' },
    { value: 'property_transfer_fund', label: 'Property Transfer Fund', description: 'Property transfer duty fund' }
  ];

  const voucherTypeOptions = [
    { value: 'BRV', label: 'BRV', description: 'Bank Receipt Voucher' },
    { value: 'ADBRV', label: 'ADBRV', description: 'Additional Bank Receipt Voucher' },
    { value: 'BPV', label: 'BPV', description: 'Bank Payment Voucher' },
    { value: 'EJV', label: 'EJV', description: 'Electronic Journal Voucher' },
    { value: 'PJV', label: 'PJV', description: 'Paper Journal Voucher' },
    { value: 'CJV', label: 'CJV', description: 'Cash Journal Voucher' },
    { value: 'FAJV', label: 'FAJV', description: 'Fixed Asset Journal Voucher' },
    { value: 'GJV', label: 'GJV', description: 'General Journal Voucher' }
  ];

  const transactionTypeOptions = [
    { value: 'cash', label: 'Cash', description: 'Cash transaction' },
    { value: 'cheque', label: 'Cheque', description: 'Cheque transaction' },
    { value: 'dd', label: 'DD', description: 'Demand Draft' },
    { value: 'ecs', label: 'ECS', description: 'Electronic Clearing Service' },
    { value: 'others', label: 'Others', description: 'Other transaction types' }
  ];

  const financialYearOptions = [
    { value: '2024-25', label: '2024-25', description: 'Financial Year 2024-2025' },
    { value: '2023-24', label: '2023-24', description: 'Financial Year 2023-2024' },
    { value: '2022-23', label: '2022-23', description: 'Financial Year 2022-2023' }
  ];

  const yearOptions = [
    { value: '2024', label: '2024', description: 'Year 2024' },
    { value: '2023', label: '2023', description: 'Year 2023' },
    { value: '2022', label: '2022', description: 'Year 2022' },
    { value: '2021', label: '2021', description: 'Year 2021' }
  ];

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    const result = await executeApi(sfcGrantService.getAll);
    if (result.success) {
      setGrants(result.data || []);
    }
  };

  // Calculate net amount when gross amount or deduction amount changes
  useEffect(() => {
    const gross = parseFloat(formData.grossAmount) || 0;
    const deduction = parseFloat(formData.deductionAmount) || 0;
    const net = gross - deduction;
    
    if (formData.grossAmount || formData.deductionAmount) {
      setFormData(prev => ({
        ...prev,
        netAmount: net.toFixed(2)
      }));
    }
  }, [formData.grossAmount, formData.deductionAmount]);

  const validateForm = () => {
    const newErrors = {};

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

    if (!formData.transactionType) {
      newErrors.transactionType = 'Transaction type is required';
    }

    if (!formData.transactionDate) {
      newErrors.transactionDate = 'Transaction date is required';
    }

    if (!formData.grossAmount.trim()) {
      newErrors.grossAmount = 'Gross amount is required';
    } else if (isNaN(parseFloat(formData.grossAmount))) {
      newErrors.grossAmount = 'Gross amount must be a valid number';
    }

    if (formData.deductionAmount && isNaN(parseFloat(formData.deductionAmount))) {
      newErrors.deductionAmount = 'Deduction amount must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let transformedValue = value;
    
    // Transform numeric fields
    if (['grossAmount', 'deductionAmount', 'netAmount'].includes(name)) {
      transformedValue = value.replace(/[^0-9.]/g, '');
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
      grossAmount: parseFloat(formData.grossAmount.replace(/,/g, '')),
      deductionAmount: formData.deductionAmount ? parseFloat(formData.deductionAmount.replace(/,/g, '')) : 0,
      netAmount: parseFloat(formData.netAmount.replace(/,/g, ''))
    };
    
    try {
      let result;
      
      if (editingId) {
        result = await executeApi(sfcGrantService.update, editingId, submitData);
      } else {
        result = await executeApi(sfcGrantService.create, submitData);
      }

      if (result.success) {
        const message = editingId ? 'Grant updated successfully!' : 'Grant created successfully!';
        showToast(message, 'success');
        resetForm();
        await loadGrants();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving grant:', error);
      showToast('Error saving grant. Please try again.', 'error');
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
      financialYear: '',
      fundType: '',
      fundName: '',
      voucherNo: '',
      voucherDate: '',
      voucherType: '',
      transactionType: '',
      transactionDate: '',
      referenceNoAndDate: '',
      year: '',
      periodOf: '',
      grossAmount: '',
      deductionAmount: '',
      netAmount: '',
      adjustmentDate: '',
      remarks: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (grant) => {
    setFormData(grant);
    setEditingId(grant.id);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const grant = grants.find(g => g.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Grant Record',
    message: `Are you sure you want to delete this SFC grant record? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(sfcGrantService.delete, id);
    if (result.success) {
      showToast(result.message || 'Grant deleted successfully!', 'success');
      await loadGrants();
    } else {
      showToast(result.message || 'Failed to delete grant!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this grant record?')) {
  //     const result = await executeApi(sfcGrantService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Grant deleted successfully!', 'success');
  //       await loadGrants();
  //     } else {
  //       showToast(result.message || 'Failed to delete grant!', 'error');
  //     }
  //   }
  // };

  const filteredGrants = grants.filter(grant => {
    const { searchTerm, transactionType, fundType } = searchFilters;
    const matchesSearch = !searchTerm ||
      grant.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.referenceNoAndDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.year?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTransactionType = !transactionType || grant.transactionType === transactionType;
    const matchesFundType = !fundType || grant.fundType === fundType;
    return matchesSearch && matchesTransactionType && matchesFundType;
  });

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
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Gift className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit SFC & Duty Grant Details' : 'SFC & Duty on Transfer of Property Grant Details'}
            </h1>
            <p className="text-slate-600">Create and manage SFC and property transfer grant records</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-lg">
            <Gift className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">
              Total Grants: {grants.length}
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

      {/* Grant Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Grant Information' : 'Grant Information'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-500" />
                  Basic Information
                </h3>
              </div>

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

              {/* Transaction Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                  Transaction Information
                </h3>
              </div>

              <SearchableDropdown
                label="Transaction Type"
                placeholder="Select Transaction Type"
                searchPlaceholder="Search transaction types..."
                options={transactionTypeOptions}
                value={formData.transactionType}
                onChange={handleDropdownChange('transactionType')}
                required
                error={errors.transactionType}
                icon={CreditCard}
                emptyMessage="No transaction types available"
              />

              <FormField
                label="Transaction Date"
                name="transactionDate"
                type="date"
                value={formData.transactionDate}
                onChange={handleChange}
                required
                error={errors.transactionDate}
                icon={Calendar}
              />

              <FormField
                label="Reference No & Date"
                name="referenceNoAndDate"
                value={formData.referenceNoAndDate}
                onChange={handleChange}
                error={errors.referenceNoAndDate}
                icon={FileText}
                placeholder="Enter reference number and date"
              />

              <SearchableDropdown
                label="Year"
                placeholder="Select Year"
                searchPlaceholder="Search years..."
                options={yearOptions}
                value={formData.year}
                onChange={handleDropdownChange('year')}
                error={errors.year}
                icon={Calendar}
                emptyMessage="No years available"
              />

              <FormField
                label="Period of"
                name="periodOf"
                value={formData.periodOf}
                onChange={handleChange}
                error={errors.periodOf}
                icon={Calendar}
                placeholder="Enter period description"
              />

              {/* Amount Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                  Amount Information
                </h3>
              </div>

              <FormField
                label="Gross Amount"
                name="grossAmount"
                value={formData.grossAmount}
                onChange={handleChange}
                required
                error={errors.grossAmount}
                icon={DollarSign}
                placeholder="Enter gross amount"
              />

              <FormField
                label="Deduction Amount"
                name="deductionAmount"
                value={formData.deductionAmount}
                onChange={handleChange}
                error={errors.deductionAmount}
                icon={DollarSign}
                placeholder="Enter deduction amount"
              />

              <FormField
                label="Net Amount Rs"
                name="netAmount"
                value={formData.netAmount}
                onChange={handleChange}
                error={errors.netAmount}
                icon={DollarSign}
                placeholder="Calculated automatically"
                disabled
              />

              <FormField
                label="Adjustment Date"
                name="adjustmentDate"
                type="date"
                value={formData.adjustmentDate}
                onChange={handleChange}
                error={errors.adjustmentDate}
                icon={Calendar}
              />

              <div className="lg:col-span-3">
                   <VoiceInputField
                              label="Remarks (Optional)"
                              name="remarks"
                              value={formData.remarks}
                              onChange={handleChange}
                              placeholder="Enter remarks (தமிழ்/EN)"
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
                className="px-8 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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

      {/* Grants List */}
      {showTable && (
        <SearchableRecords
          title="Grant Records"
          totalRecords={filteredGrants.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => setSearchFilters(f)}
          loading={loading}
          gradientFrom="from-purple-500"
          gradientTo="to-indigo-500"
          searchPlaceholder="Search by voucher no, fund name, or reference..."
          filterConfig={{ dateRange: true, amountRange: true, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            {
              key: 'transactionType',
              label: 'Transaction Type',
              type: 'select',
              icon: Receipt,
              options: [
                { value: '', label: 'All Types' },
                { value: 'receipt', label: 'Receipt' },
                { value: 'utilization', label: 'Utilization' },
                { value: 'adjustment', label: 'Adjustment' },
                { value: 'refund', label: 'Refund' },
              ]
            }
          ]}
        >
          {filteredGrants.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchFilters.searchTerm || searchFilters.transactionType ? 'No grants found matching your search.' : 'No grants created yet.'}
              </p>
              {!searchFilters.searchTerm && !searchFilters.transactionType && (
                <button
                  onClick={() => setShowTable(false)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
                >
                  Create your first grant →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Voucher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amounts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {filteredGrants.map((grant) => (
                    <tr key={grant.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{grant.voucherNo}</div>
                          <div className="text-sm text-slate-500">
                            {getDropdownLabel(voucherTypeOptions, grant.voucherType)}
                          </div>
                          <div className="text-sm text-slate-500">{grant.voucherDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{grant.fundName}</div>
                        <div className="text-sm text-slate-500">
                          {getDropdownLabel(fundTypeOptions, grant.fundType)}
                        </div>
                        <div className="text-sm text-slate-500">FY: {grant.financialYear}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {getDropdownLabel(transactionTypeOptions, grant.transactionType)}
                        </div>
                        <div className="text-sm text-slate-500">{grant.transactionDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">Gross: ₹{grant.grossAmount}</div>
                        <div className="text-sm text-slate-500">Deduction: ₹{grant.deductionAmount || '0'}</div>
                        <div className="text-sm font-medium text-green-700">Net: ₹{grant.netAmount}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">Year: {grant.year}</div>
                        <div className="text-sm text-slate-500">{grant.periodOf}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{grant.referenceNoAndDate}</div>
                        {grant.adjustmentDate && (
                          <div className="text-sm text-slate-500">Adj: {grant.adjustmentDate}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(grant)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(grant.id)}
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
        </SearchableRecords>
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

export default SFCGrantDetails;