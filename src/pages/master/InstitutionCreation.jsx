import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, FileText, Save, Plus, Edit, Trash2, Eye, Hash } from 'lucide-react';
import SearchableRecords from '../../components/common/SearchableRecords';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
import { institutionService, fundService } from "../../services/realServices"; // Change this import when backend is ready
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { useAuth } from "../../context/AuthContext";
import Pagination from '../../components/common/Pagination';
const InstitutionCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [formData, setFormData] = useState({
    institutionId: '', // New field
    institutionName: '',
    mailingName: '',
    address: '',
    state: '',
    district: '',
    country: 'India',
    pincode: '',
    localBodyType: '',
    // ledgerCode: '',
    // ledgerName: '',
    // fundId: '', // New field for fund selection
    telephone: '',
    alternateTelephone: '',
    mobileNo: '',
    alternateMobileNo: '',
    email: '',
    panNo: '',
    gstNo: ''
  });

  const [errors, setErrors] = useState({});
  const [institutions, setInstitutions] = useState([]);
  const [funds, setFunds] = useState([]); // New state for funds
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', state: '', localBodyType: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const { executeApi, loading, error, clearError } = useApiService();
  const { user, getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();

  // Convert local body type options to SearchableDropdown format
  const localBodyTypeOptions = [
    { 
      value: 'municipal_corporation', 
      label: 'Municipal Corporation', 
      description: 'Large urban local government body for major cities' 
    },
    { 
      value: 'municipality', 
      label: 'Municipality', 
      description: 'Urban local government body for smaller cities and towns' 
    },
    { 
      value: 'town_panchayat', 
      label: 'Town Panchayat', 
      description: 'Village-level local government institution' 
    },
    { 
      value: 'district_panchayat', 
      label: 'District Panchayat', 
      description: 'District-level rural local government institution' 
    },
    { 
      value: 'block_panchayat', 
      label: 'Block Panchayat', 
      description: 'Intermediate level rural local government body' 
    },
    { 
      value: 'village_panchayat', 
      label: 'Village Panchayat', 
      description: 'District-level rural local government institution' 
    },
    { 
      value: 'other', 
      label: 'Other', 
      description: 'Other types of local government bodies' 
    }
  ];

  // Ledger code options for SearchableDropdown
  const ledgerCodeOptions = [
    { 
      value: 'ACC001', 
      label: 'ACC001', 
      description: 'General Account Code' 
    },
    { 
      value: 'ADM001', 
      label: 'ADM001', 
      description: 'Administration Account Code' 
    },
    { 
      value: 'FIN001', 
      label: 'FIN001', 
      description: 'Finance Account Code' 
    },
    { 
      value: 'OPR001', 
      label: 'OPR001', 
      description: 'Operations Account Code' 
    },
    { 
      value: 'AST001', 
      label: 'AST001', 
      description: 'Assets Account Code' 
    },
    { 
      value: 'LIB001', 
      label: 'LIB001', 
      description: 'Liabilities Account Code' 
    },
    { 
      value: 'REV001', 
      label: 'REV001', 
      description: 'Revenue Account Code' 
    },
    { 
      value: 'EXP001', 
      label: 'EXP001', 
      description: 'Expense Account Code' 
    }
  ];

  // Load institutions and funds on component mount
  useEffect(() => {
    if (user) {
      loadInstitutions();
      loadFunds();
    }
  }, [user]);

  // Function to load institutions with optional filtering
  const loadInstitutions = async (searchTerm = '') => {
    let params = {};
    if (searchTerm) {
      params.q = searchTerm;
    }
    // No need to manually add institutionId anymore, apiClient handles it
    const result = await executeApi(institutionService.getAll, params);
    if (result.success) {
      setInstitutions(result.data || []);
    }
  };

  // New function to load funds
  const loadFunds = async () => {
    const result = await executeApi(fundService.getAll);
    if (result.success) {
      setFunds(result.data || []);
    }
  };

  // Convert funds to SearchableDropdown format
  const fundOptions = funds.map(fund => ({
    value: fund.id,
    label: fund.fundName,
    description: `Created: ${fund.createdDate || 'N/A'} | Status: ${fund.status || 'Active'}`
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.institutionId.trim()) {
      newErrors.institutionId = 'Institution ID is required';
    }

    if (!formData.institutionName.trim()) {
      newErrors.institutionName = 'Institution name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (!formData.localBodyType) {
      newErrors.localBodyType = 'Local body type is required';
    }

    // if (!formData.ledgerCode.trim()) {
    //   newErrors.ledgerCode = 'Ledger code is required';
    // }

    // if (!formData.ledgerName.trim()) {
    //   newErrors.ledgerName = 'Ledger Head is required';
    // }

    // if (!formData.fundId) {
    //   newErrors.fundId = 'Fund selection is required';
    // }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be 10 digits';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.panNo.trim()) {
      newErrors.panNo = 'PAN number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Transform specific fields
    let transformedValue = value;
    if (name === 'panNo') {
      transformedValue = value.toUpperCase();
    } else if (name === 'gstNo') {
      transformedValue = value.toUpperCase();
    } else if (['pincode', 'mobileNo', 'telephone', 'alternateTelephone', 'alternateMobileNo'].includes(name)) {
      transformedValue = value.replace(/\D/g, '');
    } else if (name === 'institutionId') {
      transformedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: transformedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle dropdown changes specifically
const handleDropdownChange = (name) => (valueOrEvent) => {
    // Check if it's an event object or direct value
    const value = valueOrEvent?.target?.value ?? valueOrEvent;
    
    setFormData(prevData => ({
      ...prevData,
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    clearError();
    
    try {
      let result;
      
      if (editingId) {
        result = await executeApi(institutionService.update, editingId, formData);
      } else {
        result = await executeApi(institutionService.create, formData);
      }

      if (result.success) {
        // Show success message
        const message = editingId ? 'Institution updated successfully!' : 'Institution created successfully!';
        
        // Create and show toast notification
        showToast(message, 'success');
        
        resetForm();
        await loadInstitutions();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving institution:', error);
      showToast('Error saving institution. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const showToast = (message, type) => {
    // Simple toast implementation - you can enhance this
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
      institutionId: '',
      institutionName: '',
      mailingName: '',
      address: '',
      state: '',
      country: 'India',
      pincode: '',
      localBodyType: '',
      // ledgerCode: '',
      // ledgerName: '',
      fundId: '',
      telephone: '',
      alternateTelephone: '',
      mobileNo: '',
      alternateMobileNo: '',
      email: '',
      panNo: '',
      gstNo: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (institution) => {
    setFormData({
      institutionId: institution.institutionId || '',
      institutionName: institution.institutionName || '',
      mailingName: institution.mailingName || '',
      address: institution.address || '',
      state: institution.state || '',
      country: institution.country || 'India',
      pincode: institution.pincode || '',
      localBodyType: institution.localBodyType || '',
      // ledgerCode: institution.ledgerCode || '',
      // ledgerName: institution.ledgerName || '',
      // fundId: institution.fundId || '',
      telephone: institution.telephone || '',
      alternateTelephone: institution.alternateTelephone || '',
      mobileNo: institution.mobileNo || '',
      alternateMobileNo: institution.alternateMobileNo || '',
      email: institution.email || '',
      panNo: institution.panNo || '',
      gstNo: institution.gstNo || ''
    });
    setEditingId(institution.id);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const institution = institutions.find(inst => inst.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Institution',
    message: `Are you sure you want to delete "${institution?.institutionName || 'this institution'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(institutionService.delete, id);
    if (result.success) {
      showToast(result.message || 'Institution deleted successfully!', 'success');
      await loadInstitutions();
    } else {
      showToast(result.message || 'Failed to delete institution!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this institution?')) {
  //     const result = await executeApi(institutionService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Institution deleted successfully!', 'success');
  //       await loadInstitutions();
  //     } else {
  //       showToast(result.message || 'Failed to delete institution!', 'error');
  //     }
  //   }
  // };

  const handleSelectAll = () => {
    if (paginatedInstitutions.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedInstitutions.map(item => item.id)));
    }
  };

  const handleSelectItem = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Selected',
      message: `Are you sure you want to delete ${selectedIds.size} selected record(s)? This action cannot be undone.`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'error'
    });
    if (confirmed) {
      let count = 0;
      for (const id of selectedIds) {
        const result = await executeApi(institutionService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadInstitutions();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  // Filter institutions locally
  const normalizeStr = (str) => str?.replace(/\u00A0/g, ' ') || '';
  const filteredInstitutions = institutions.filter(inst => {
    const f = searchFilters;
    const s = normalizeStr(f.searchTerm).toLowerCase();
    const searchMatch = !s ||
      normalizeStr(inst.institutionName).toLowerCase().includes(s) ||
      normalizeStr(inst.mailingName).toLowerCase().includes(s) ||
      normalizeStr(inst.state).toLowerCase().includes(s) ||
      normalizeStr(inst.panNo).toLowerCase().includes(s) ||
      normalizeStr(inst.mobileNo).includes(s) ||
      normalizeStr(inst.alternateMobileNo).includes(s) ||
      normalizeStr(inst.telephone).includes(s) ||
      normalizeStr(inst.email).toLowerCase().includes(s) ||
      normalizeStr(inst.gstNo).toLowerCase().includes(s) ||
      normalizeStr(inst.institutionId).toLowerCase().includes(s);
    const stateMatch = !f.state || inst.state?.toLowerCase().includes(f.state.toLowerCase());
    const localBodyTypeMatch = !f.localBodyType || inst.localBodyType === f.localBodyType;
    return searchMatch && stateMatch && localBodyTypeMatch;
  });

  const totalPages = Math.ceil(filteredInstitutions.length / PAGE_SIZE);
  const paginatedInstitutions = filteredInstitutions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Get local body type label for display
  const getLocalBodyTypeLabel = (value) => {
    const found = localBodyTypeOptions.find(type => type.value === value);
    return found ? found.label : value;
  };

  // Get ledger code label for display
  // const getLedgerCodeLabel = (value) => {
  //   const found = ledgerCodeOptions.find(code => code.value === value);
  //   return found ? found.label : value;
  // };

  // Get fund name for display
  // const getFundName = (fundId) => {
  //   const fund = funds.find(f => f.id === fundId);
  //   return fund ? fund.fundName : fundId;
  // };

  return (
    <div className="space-y-6">
        <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Institution' : 'Institution Creation'}
            </h1>
            <p className="text-slate-600">Create and manage institutional details</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-lg">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              Total Institutions: {institutions.length}
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

      {/* Institution Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Institution Details' : 'Institution Details'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-purple-500" />
                  Basic Information
                </h3>
              </div>

              <FormField
                label="Institution ID"
                name="institutionId"
                value={formData.institutionId}
                onChange={handleChange}
                required
                error={errors.institutionId}
                icon={Hash}
                placeholder="Enter unique institution ID"
              />

              <FormField
                label="Name of the Institution"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                required
                error={errors.institutionName}
                icon={Building2}
                placeholder="Enter institution name"
              />
              
              <FormField
                label="Mailing Name"
                name="mailingName"
                value={formData.mailingName}
                onChange={handleChange}
                error={errors.mailingName}
                placeholder="Enter mailing name"
              />

              <FormField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                error={errors.country}
                placeholder="Enter country"
              />
              
              <div className="lg:col-span-3">
                <FormField
                  label="Address"
                  name="address"
                  type="textarea"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  error={errors.address}
                  icon={MapPin}
                  placeholder="Enter complete address"
                />
              </div>
              
              <FormField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                error={errors.state}
                placeholder="Enter state"
              />
              
              <FormField
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                error={errors.district}
                placeholder="Enter district"
              />

              <FormField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                error={errors.pincode}
                maxLength={6}
                placeholder="6-digit pincode"
              />

              {/* Local Body Type Field with SearchableDropdown */}
              <SearchableDropdown
                label="Local Body Type"
                placeholder="Select Local Body Type"
                searchPlaceholder="Search local body types..."
                options={localBodyTypeOptions}
                value={formData.localBodyType}
                onChange={handleDropdownChange('localBodyType')}
                required
                error={errors.localBodyType}
                icon={MapPin}
                emptyMessage="No local body types available"
                maxHeight="250px"
              />

              {/* Ledger Code Field with SearchableDropdown */}
              {/* <SearchableDropdown
                label="Ledger Code"
                placeholder="Select Ledger Code"
                searchPlaceholder="Search ledger codes..."
                options={ledgerCodeOptions}
                value={formData.ledgerCode}
                onChange={handleDropdownChange('ledgerCode')}
                required
                error={errors.ledgerCode}
                icon={BookOpen}
                emptyMessage="No ledger codes available"
                maxHeight="250px"
              /> */}

              {/* Ledger Head Field */}
              {/* <FormField
                label="Ledger Head"
                name="ledgerName"
                value={formData.ledgerName}
                onChange={handleChange}
                required
                error={errors.ledgerName}
                placeholder="Enter Ledger Head"
                icon={BookOpen}
              /> */}

              {/* Fund Selection Field */}
              {/* <SearchableDropdown
                label="Select Fund"
                placeholder="Select Fund"
                searchPlaceholder="Search funds..."
                options={fundOptions}
                value={formData.fundId}
                onChange={handleDropdownChange('fundId')}
                required
                error={errors.fundId}
                icon={Wallet}
                emptyMessage="No funds available. Please create a fund first."
                maxHeight="250px"
              /> */}

              {/* Contact Information */}
              <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-500" />
                  Contact Information
                </h3>
              </div>
              
              <FormField
                label="Primary Telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                error={errors.telephone}
                icon={Phone}
                placeholder="Enter telephone number"
              />
              
              <FormField
                label="Alternate Telephone"
                name="alternateTelephone"
                type="tel"
                value={formData.alternateTelephone}
                onChange={handleChange}
                error={errors.alternateTelephone}
                icon={Phone}
                placeholder="Enter alternate telephone"
              />
              
              <FormField
                label="Mobile Number"
                name="mobileNo"
                type="tel"
                value={formData.mobileNo}
                onChange={handleChange}
                required
                error={errors.mobileNo}
                maxLength={10}
                icon={Phone}
                placeholder="10-digit mobile number"
              />
              
              <FormField
                label="Alternate Mobile Number"
                name="alternateMobileNo"
                type="tel"
                value={formData.alternateMobileNo}
                onChange={handleChange}
                error={errors.alternateMobileNo}
                maxLength={10}
                icon={Phone}
                placeholder="10-digit alternate mobile"
              />
              
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
                icon={Mail}
                placeholder="Enter email address"
              />

              {/* Legal Information */}
              {/* <div className="lg:col-span-3 mt-6">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  Legal Information
                </h3>
              </div> */}
              
              <FormField
                label="PAN Number"
                name="panNo"
                value={formData.panNo}
                onChange={handleChange}
                required
                error={errors.panNo}
                placeholder="ABCDE1234F"
                maxLength={10}
                icon={FileText}
              />
              
              <FormField
                label="GST Number"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
                error={errors.gstNo}
                placeholder="33ABCDE1234F1Z5"
                maxLength={15}
                icon={FileText}
              />
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
                className="px-8 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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

      {/* Institutions List */}
      {showTable && (
        <SearchableRecords
          title="Registered Institutions"
          totalRecords={filteredInstitutions.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-blue-500"
          gradientTo="to-cyan-500"
          searchPlaceholder="Search by name, state, PAN, mobile, email..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            { key: 'state', label: 'State', type: 'text', placeholder: 'Filter by state' },
            {
              key: 'localBodyType',
              label: 'Local Body Type',
              type: 'select',
              options: [
                { value: '', label: 'All Types' },
                { value: 'municipal_corporation', label: 'Municipal Corporation' },
                { value: 'municipality', label: 'Municipality' },
                { value: 'town_panchayat', label: 'Town Panchayat' },
                { value: 'district_panchayat', label: 'District Panchayat' },
                { value: 'block_panchayat', label: 'Block Panchayat' },
                { value: 'village_panchayat', label: 'Village Panchayat' },
                { value: 'other', label: 'Other' },
              ],
            },
          ]}
        >
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.size} record(s) selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
                >
                  Clear
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Selected ({selectedIds.size})</span>
                </button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedInstitutions.length > 0 && paginatedInstitutions.every(item => selectedIds.has(item.id))}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Local Body</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pan No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Gst No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {paginatedInstitutions.map((institution) => (
                  <tr key={institution.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(institution.id)}
                        onChange={() => handleSelectItem(institution.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{institution.institutionName}</div>
                        <div className="text-sm text-slate-500">{institution.mailingName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{institution.state}</div>
                      <div className="text-sm text-slate-500">{institution.pincode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{getLocalBodyTypeLabel(institution.localBodyType)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{institution.mobileNo}</div>
                      <div className="text-sm text-slate-500">{institution.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{institution.panNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-500">{institution.gstNo || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(institution)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(institution.id)} className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredInstitutions.length === 0 && (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No institutions found matching your filters.</p>
                <button onClick={() => setShowTable(false)} className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2">
                  Create your first institution →
                </button>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={PAGE_SIZE} totalItems={filteredInstitutions.length} />
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

export default InstitutionCreation;