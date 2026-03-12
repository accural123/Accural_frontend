
import React, { useState, useEffect } from 'react';
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { DataTable } from "../../components/common/DataTable";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
import { mdrService, accountService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { Building, MapPin, Calendar, AlertCircle, CheckCircle, Plus, Save, RefreshCw, Eye, FileText, Search, DollarSign, Hash, Clock } from 'lucide-react';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";

const MDRDetails = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [formData, setFormData] = useState({
    leaseNo: '',
    assessmentNo: '',
    financialYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
    ledgerCode: '',
    ledgerName: '',
    leasePropertyDetails: '',
    leasePeriod: '',
    leaseFromDate: '',
    leaseToDate: '',
    nextRenewalDate: '',
    lesseeName: '',
    lesseeAddress: '',
    depositAmount: '',
    depositChallanDetails: '',
    monthlyInstallment: '',
    totalDemandPerYear: '',
    gstPercentage: '',
    ITPercentage: '',
    gstReceivable: '',
    itReceivable: '',
    // status: 'Active'
  });

  const [accounts, setAccounts] = useState([]);
  const [savedRecords, setSavedRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});

  const { executeApi, loading, error, clearError } = useApiService();

  // Load data on component mount
  useEffect(() => {
    loadAccounts();
    loadSavedRecords();
  }, []);

  useEffect(() => {
    // Auto-calculate total demand per year when monthly installment changes
    if (formData.monthlyInstallment) {
      const monthlyAmount = parseFloat(formData.monthlyInstallment.replace(/,/g, '')) || 0;
      const yearlyAmount = monthlyAmount * 12;
      setFormData(prev => ({
        ...prev,
        totalDemandPerYear: yearlyAmount.toLocaleString('en-IN')
      }));
    }
  }, [formData.monthlyInstallment]);

  useEffect(() => {
    // Auto-calculate GST receivable when monthly installment or GST percentage changes
    if (formData.monthlyInstallment && formData.gstPercentage) {
      const monthlyAmount = parseFloat(formData.monthlyInstallment.replace(/,/g, '')) || 0;
      const gstPercent = parseFloat(formData.gstPercentage) || 0;
      const yearlyAmount = monthlyAmount * 12;
      const gstAmount = (yearlyAmount * gstPercent) / 100;
      setFormData(prev => ({
        ...prev,
        gstReceivable: gstAmount.toLocaleString('en-IN')
      }));
    }
  }, [formData.monthlyInstallment, formData.gstPercentage]);

  const loadAccounts = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) {
      setAccounts(result.data || []);
    }
  };

  const loadSavedRecords = async () => {
    const result = await executeApi(mdrService.getAll);
    if (result.success) {
      setSavedRecords(result.data || []);
    }
  };

  // Convert options to SearchableDropdown format
  const financialYearOptions = [
    { value: '2022-23', label: '2022-23', description: 'Financial Year 2022-23' },
    { value: '2023-24', label: '2023-24', description: 'Financial Year 2023-24' },
    { value: '2024-25', label: '2024-25', description: 'Financial Year 2024-25' },
    { value: '2025-26', label: '2025-26', description: 'Financial Year 2025-26' }
  ];

  const leasePeriodOptions = [
    { value: '11 months', label: '11 months', description: 'Short-term lease (11 months)' },
    { value: '1 year', label: '1 year', description: 'One year lease agreement' },
    { value: '2 years', label: '2 years', description: 'Two year lease agreement' },
    { value: '3 years', label: '3 years', description: 'Three year lease agreement' },
    { value: '5 years', label: '5 years', description: 'Five year lease agreement' },
    { value: '10 years', label: '10 years', description: 'Ten year lease agreement' },
    { value: '20 years', label: '20 years', description: 'Twenty year lease agreement' },
    { value: '30 years', label: '30 years', description: 'Thirty year lease agreement' },
    { value: '99 years', label: '99 years', description: 'Long-term lease (99 years)' }
  ];

  // Convert accounts to SearchableDropdown format
  const accountOptions = accounts.map(account => ({
    value: account.ledgerCode,
    label: `${account.ledgerCode} - ${account.ledgerName}`,
    description: account.description || `Account: ${account.ledgerName}`
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ledgerCode') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setFormData(prev => ({
        ...prev,
        ledgerCode: value,
        ledgerName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else if (['depositAmount', 'monthlyInstallment', 'totalDemandPerYear', 'gstReceivable', 'itReceivable'].includes(name)) {
      // Format amount fields with commas
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
    } else if (name === 'gstPercentage') {
      // Handle GST percentage (allow decimal values up to 2 decimal places)
      const numericValue = value.replace(/[^0-9.]/g, '');
      if (numericValue === '' || (!isNaN(parseFloat(numericValue)) && parseFloat(numericValue) <= 100)) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
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

  // Handle dropdown changes specifically
  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    if (name === 'ledgerCode') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setFormData(prev => ({
        ...prev,
        ledgerCode: value,
        ledgerName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaseNo.trim()) {
      newErrors.leaseNo = 'Lease number is required';
    }

    if (!formData.assessmentNo.trim()) {
      newErrors.assessmentNo = 'Assessment number is required';
    }

    if (!formData.financialYear) {
      newErrors.financialYear = 'Financial year is required';
    }

    if (!formData.ledgerCode) {
      newErrors.ledgerCode = 'Ledger code is required';
    }

    if (!formData.lesseeName.trim()) {
      newErrors.lesseeName = 'Lessee name is required';
    }

    if (!formData.leasePropertyDetails.trim()) {
      newErrors.leasePropertyDetails = 'Lease property details are required';
    }

    if (!formData.lesseeAddress.trim()) {
      newErrors.lesseeAddress = 'Lessee address is required';
    }

    // Validate lease period dates
    if (formData.leaseFromDate && formData.leaseToDate) {
      const fromDate = new Date(formData.leaseFromDate);
      const toDate = new Date(formData.leaseToDate);
      if (fromDate >= toDate) {
        newErrors.leaseToDate = 'To date must be after from date';
      }
    }

    // Check for duplicate lease number
    const existingRecord = savedRecords.find(record => 
      record.leaseNo === formData.leaseNo && 
      record.id !== editingId
    );
    if (existingRecord) {
      newErrors.leaseNo = 'Lease number already exists';
    }

    // Check for duplicate assessment number for the same financial year
    const existingAssessment = savedRecords.find(record => 
      record.assessmentNo === formData.assessmentNo && 
      record.financialYear === formData.financialYear &&
      record.id !== editingId
    );
    if (existingAssessment) {
      newErrors.assessmentNo = 'Assessment number already exists for this financial year';
    }

    // Validate amount fields
    ['depositAmount', 'monthlyInstallment', 'gstReceivable', 'itReceivable'].forEach(field => {
      if (formData[field]) {
        const numericValue = parseFloat(formData[field].replace(/,/g, ''));
        if (isNaN(numericValue) || numericValue < 0) {
          newErrors[field] = 'Must be a valid positive number';
        }
      }
    });

    // Validate GST percentage
    if (formData.gstPercentage) {
      const gstPercent = parseFloat(formData.gstPercentage);
      if (isNaN(gstPercent) || gstPercent < 0 || gstPercent > 100) {
        newErrors.gstPercentage = 'GST percentage must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert amount fields back to numbers
    const submitData = {
      ...formData,
      depositAmount: formData.depositAmount ? parseFloat(formData.depositAmount.replace(/,/g, '')) : 0,
      monthlyInstallment: formData.monthlyInstallment ? parseFloat(formData.monthlyInstallment.replace(/,/g, '')) : 0,
      totalDemandPerYear: formData.totalDemandPerYear ? parseFloat(formData.totalDemandPerYear.replace(/,/g, '')) : 0,
      gstPercentage: formData.gstPercentage ? parseFloat(formData.gstPercentage) : 0,
      ITPercentage: formData.ITPercentage ? parseFloat(formData.ITPercentage) : 0,
      gstReceivable: formData.gstReceivable ? parseFloat(formData.gstReceivable.replace(/,/g, '')) : 0,
      itReceivable: formData.itReceivable ? parseFloat(formData.itReceivable.replace(/,/g, '')) : 0
    };
    
    let result;
    if (editingId) {
      result = await executeApi(mdrService.update, editingId, submitData);
    } else {
      result = await executeApi(mdrService.create, submitData);
    }

    if (result.success) {
      const message = editingId 
        ? 'MDR Details updated successfully!'
        : 'MDR Details saved successfully!';
      
      showToast(message, 'success');
      resetForm();
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      leaseNo: '',
      assessmentNo: '',
      financialYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
      ledgerCode: '',
      ledgerName: '',
      leasePropertyDetails: '',
      leasePeriod: '',
      leaseFromDate: '',
      leaseToDate: '',
      nextRenewalDate: '',
      lesseeName: '',
      lesseeAddress: '',
      depositAmount: '',
      depositChallanDetails: '',
      monthlyInstallment: '',
      totalDemandPerYear: '',
      gstPercentage: '',
      gstReceivable: '',
      itReceivable: '',
      // status: 'Active'
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (record) => {
    setFormData({
      leaseNo: record.leaseNo || '',
      assessmentNo: record.assessmentNo || '',
      financialYear: record.financialYear || '',
      ledgerCode: record.ledgerCode || '',
      ledgerName: record.ledgerName || '',
      leasePropertyDetails: record.leasePropertyDetails || '',
      leasePeriod: record.leasePeriod || '',
      leaseFromDate: record.leaseFromDate || '',
      leaseToDate: record.leaseToDate || '',
      nextRenewalDate: record.nextRenewalDate || '',
      lesseeName: record.lesseeName || '',
      lesseeAddress: record.lesseeAddress || '',
      depositAmount: record.depositAmount ? record.depositAmount.toLocaleString('en-IN') : '',
      depositChallanDetails: record.depositChallanDetails || '',
      monthlyInstallment: record.monthlyInstallment ? record.monthlyInstallment.toLocaleString('en-IN') : '',
      totalDemandPerYear: record.totalDemandPerYear ? record.totalDemandPerYear.toLocaleString('en-IN') : '',
      gstPercentage: record.gstPercentage?.toString() || '',
      ITPercentage: record.ITPercentage?.toString() || '',
      gstReceivable: record.gstReceivable ? record.gstReceivable.toLocaleString('en-IN') : '',
      itReceivable: record.itReceivable ? record.itReceivable.toLocaleString('en-IN') : '',
      status: record.status || 'Active'
    });
    setEditingId(record.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const mdrRecord = savedRecords.find(record => record.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete MDR Record',
    message: `Are you sure you want to delete MDR record "${mdrRecord?.challanNo || mdrRecord?.name || 'this record'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(mdrService.delete, id);
    if (result.success) {
      showToast(result.message || 'MDR record deleted successfully!', 'success');
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Failed to delete MDR record!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this MDR record?')) {
  //     const result = await executeApi(mdrService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'MDR record deleted successfully!', 'success');
  //       await loadSavedRecords();
  //     } else {
  //       showToast(result.message || 'Failed to delete MDR record!', 'error');
  //     }
  //   }
  // };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const result = await executeApi(mdrService.search, searchTerm);
      if (result.success) {
        setSavedRecords(result.data || []);
      }
    } else {
      await loadSavedRecords();
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

  // Filter records locally
  const filteredRecords = savedRecords.filter(record =>
    record.leaseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.assessmentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.lesseeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.leasePropertyDetails?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'leaseNo', title: 'Lease No', sortable: true },
    { key: 'assessmentNo', title: 'Assessment No', sortable: true },
    { key: 'financialYear', title: 'Financial Year', sortable: true },
    { 
      key: 'ledgerCode', 
      title: 'Ledger', 
      render: (value, row) => `${value} - ${row.ledgerName}` 
    },
    { key: 'lesseeName', title: 'Lessee Name' },
    { key: 'leasePeriod', title: 'Lease Period' },
    { key: 'monthlyInstallment', title: 'Monthly Rent (₹)', render: (value) => value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { key: 'totalDemandPerYear', title: 'Yearly Demand (₹)', render: (value) => value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { key: 'nextRenewalDate', title: 'Next Renewal', sortable: true },
    // { 
    //   key: 'status', 
    //   title: 'Status', 
    //   render: (value) => (
    //     <span className={`px-2 py-1 rounded text-xs font-medium ${
    //       value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    //     }`}>
    //       {value}
    //     </span>
    //   )
    // }
  ];

  return (
    <div className="space-y-6">
       <ErrorDisplay error={error} onClear={clearError} />


      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <Building className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit' : 'Add'} MDR Details
            </h1>
            <p className="text-slate-600">Manage Market Development Revenue (MDR) property lease records</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-teal-100 border border-green-200 rounded-lg">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Total Records: {savedRecords.length}
            </span>
          </div>
          <button
            onClick={() => setShowRecords(!showRecords)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            disabled={loading}
          >
            <Eye className="h-4 w-4" />
            <span>{showRecords ? 'Hide Records' : 'Edit Records'}</span>
          </button>
          {editingId && (
            <button
              onClick={() => {
                resetForm();
                setShowRecords(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* Records List */}
      {showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">MDR Records ({savedRecords.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-slate-600">Loading records...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">
                    {searchTerm ? 'No records found matching your search.' : 'No MDR records found.'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowRecords(false)}
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
                    >
                      Create your first MDR record →
                    </button>
                  )}
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredRecords}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit MDR Record' : 'Add New MDR Record'}
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    label="Lease No"
                    name="leaseNo"
                    value={formData.leaseNo}
                    onChange={handleChange}
                    required
                    error={errors.leaseNo}
                    placeholder="Enter lease number"
                  />

                  <FormField
                    label="Assessment No"
                    name="assessmentNo"
                    value={formData.assessmentNo}
                    onChange={handleChange}
                    required
                    error={errors.assessmentNo}
                    placeholder="Enter assessment number"
                  />
                  
                  {/* Financial Year with SearchableDropdown */}
                  <SearchableDropdown
                    label="Financial Year"
                    placeholder="Select Financial Year"
                    searchPlaceholder="Search financial year..."
                    options={financialYearOptions}
                    value={formData.financialYear}
                    onChange={handleDropdownChange('financialYear')}
                    required
                    error={errors.financialYear}
                    icon={Calendar}
                    emptyMessage="No financial years available"
                  />
                  
                  {/* Ledger Code with SearchableDropdown */}
                  <SearchableDropdown
                    label="Ledger Code"
                    placeholder="Select Ledger Account"
                    searchPlaceholder="Search by code or name..."
                    options={accountOptions}
                    value={formData.ledgerCode}
                    onChange={handleDropdownChange('ledgerCode')}
                    required
                    error={errors.ledgerCode}
                    icon={Hash}
                    emptyMessage="No accounts available"
                    maxHeight="250px"
                  />
                </div>
              </div>

              {/* Property & Lease Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  Property & Lease Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2 lg:col-span-3">
                    <FormField
                      label="Lease Property Details"
                      name="leasePropertyDetails"
                      type="textarea"
                      value={formData.leasePropertyDetails}
                      onChange={handleChange}
                      required
                      error={errors.leasePropertyDetails}
                      placeholder="Enter detailed property description including location, area, etc."
                      rows="3"
                    />
                  </div>
                  
                  {/* Lease Period with SearchableDropdown */}
                  <SearchableDropdown
                    label="Lease Period"
                    placeholder="Select Lease Period"
                    searchPlaceholder="Search lease periods..."
                    options={leasePeriodOptions}
                    value={formData.leasePeriod}
                    onChange={handleDropdownChange('leasePeriod')}
                    icon={Clock}
                    emptyMessage="No lease periods available"
                  />
                  
                  <FormField
                    label="From Date"
                    name="leaseFromDate"
                    type="date"
                    value={formData.leaseFromDate}
                    onChange={handleChange}
                    error={errors.leaseFromDate}
                    icon={Calendar}
                  />

                  <FormField
                    label="To Date"
                    name="leaseToDate"
                    type="date"
                    value={formData.leaseToDate}
                    onChange={handleChange}
                    error={errors.leaseToDate}
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
                </div>
              </div>

              {/* Lessee Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-500" />
                  Lessee Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Lessee Name"
                    name="lesseeName"
                    value={formData.lesseeName}
                    onChange={handleChange}
                    required
                    error={errors.lesseeName}
                    placeholder="Enter lessee full name"
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      label="Lessee Address"
                      name="lesseeAddress"
                      type="textarea"
                      value={formData.lesseeAddress}
                      onChange={handleChange}
                      required
                      error={errors.lesseeAddress}
                      placeholder="Enter complete lessee address"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-purple-500" />
                  Financial Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <FormField
                    label="Deposit Amount (₹)"
                    name="depositAmount"
                    value={formData.depositAmount}
                    onChange={handleChange}
                    error={errors.depositAmount}
                    placeholder="0.00"
                    
                  />
                  
                  <FormField
                    label="Monthly Installment (₹)"
                    name="monthlyInstallment"
                    value={formData.monthlyInstallment}
                    onChange={handleChange}
                    error={errors.monthlyInstallment}
                    placeholder="0.00"
                  />
                  
                  <FormField
                    label="Total Demand / Year (₹)"
                    name="totalDemandPerYear"
                    value={formData.totalDemandPerYear}
                    onChange={handleChange}
                    placeholder="Auto-calculated"
                    disabled={true}
                    help="Auto-calculated from monthly installment"
                  />
                  
                  <FormField
                    label="GST Percentage (%)"
                    name="gstPercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.gstPercentage}
                    onChange={handleChange}
                    error={errors.gstPercentage}
                    placeholder="18.00"
                    help="Enter GST rate (e.g., 18 for 18%)"
                  />
                  
                  <FormField
                    label="GST Receivable (₹)"
                    name="gstReceivable"
                    value={formData.gstReceivable}
                    onChange={handleChange}
                    error={errors.gstReceivable}
                    placeholder="Auto-calculated"
                    disabled={true}
                    help="Auto-calculated from yearly amount and GST %"
                  />

                  <FormField
                    label="IT Percentage (%)"
                    name="ITPercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.ITPercentage}
                    onChange={handleChange}
                    error={errors.ITPercentage}
                    placeholder="10.00"
                    help="Enter IT rate (e.g., 10 for 10%)"
                  />
                  
                  <FormField
                    label="IT Receivable (₹)"
                    name="itReceivable"
                    value={formData.itReceivable}
                    onChange={handleChange}
                    error={errors.itReceivable}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4">Additional Details</h3>
                <FormField
                  label="Deposit Challan Details"
                  name="depositChallanDetails"
                  type="textarea"
                  value={formData.depositChallanDetails}
                  onChange={handleChange}
                  placeholder="Enter deposit challan details, reference numbers, dates, etc."
                  rows="3"
                />
              </div>
              
              <div className="flex justify-center space-x-4 border-t pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
                <SubmitButton
                  loading={loading}
                  icon={Save}
                  onClick={handleSubmit}
                >
                  {editingId ? 'Update MDR Record' : 'Save MDR Record'}
                </SubmitButton>
              </div>
            </form>
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
/>
    </div>
  );
};

export default MDRDetails;