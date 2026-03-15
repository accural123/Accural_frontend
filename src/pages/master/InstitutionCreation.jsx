import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Phone, Mail, FileText, Save, Plus, Edit, Trash2, Eye, Search, BookOpen, Wallet, Hash } from 'lucide-react';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
import { institutionService, fundService } from "../../services/realServices"; // Change this import when backend is ready
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { useAuth } from "../../context/AuthContext";
const InstitutionCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [formData, setFormData] = useState({
    institutionId: '', // New field
    institutionName: '',
    mailingName: '',
    address: '',
    state: '',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

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

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const result = await executeApi(institutionService.search, searchTerm);
      if (result.success) {
        setInstitutions(result.data || []);
      }
    } else {
      await loadInstitutions();
    }
  };

  // Filter institutions locally as fallback
  const filteredInstitutions = institutions.filter(inst =>
    inst.institutionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.mailingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Registered Institutions ({institutions.length})</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search institutions..."
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-slate-600">Loading institutions...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Institution ID</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Institution</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Local Body</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ledger</th> */}
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Legal</th> */}
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {filteredInstitutions.map((institution) => (
                    <tr key={institution.id} className="hover:bg-white/60 transition-colors">
                      {/* <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{institution.institutionId}</div>
                      </td> */}
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
                        <div className="text-sm text-slate-900">
                          {getLocalBodyTypeLabel(institution.localBodyType)}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{getLedgerCodeLabel(institution.ledgerCode)}</div>
                        <div className="text-sm text-slate-500">{institution.ledgerName}</div>
                      </td> */}
                     
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{institution.mobileNo}</div>
                        <div className="text-sm text-slate-500">{institution.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{institution.panNo}</div>
                        <div className="text-sm text-slate-500">{institution.gstNo || 'N/A'}</div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          institution.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {institution.status || 'Active'}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(institution)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(institution.id)}
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
          
          {!loading && filteredInstitutions.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchTerm ? 'No institutions found matching your search.' : 'No institutions created yet.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowTable(false)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
                >
                  Create your first institution →
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

export default InstitutionCreation;