import React, { useState, useEffect } from 'react';
import { BookOpen, Users, DollarSign, Building, CreditCard, Eye, Edit, Trash2, Plus, Save, FileText, MapPin, Wallet } from 'lucide-react';
import SearchableRecords from '../../components/common/SearchableRecords';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { ledgerService, institutionService, fundService, groupService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import Pagination from '../../components/common/Pagination';
import { useAuth } from '../../context/AuthContext';
const MasterLedgerCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    ledgerCode: '',
    ledgerName: '',
    underGroup: '',
    // localBodyType: '',
    institutionId: '',
    fundId: '', // Changed from fundType to fundId
    accountHoldersName: '',
    accountNo: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    nameOfScheme: ''
  });

  const [errors, setErrors] = useState({});
  const [ledgers, setLedgers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [funds, setFunds] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', underGroup: '' });
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const { executeApi, loading, error, clearError } = useApiService();

  // Convert group options to SearchableDropdown format (subgroups only)
  const groupOptions = groups
    .filter(g => g.isSubGroup === true)
    .map(g => ({
      value: g.groupName,
      label: g.groupCode ? `${g.groupName} (${g.groupCode})` : g.groupName,
      description: g.underMainGroup ? `Main Group: ${g.underMainGroup}` : (g.description || ''),
    }));

  // Local body type options
  const localBodyTypeOptions = [
    { value: 'municipal_corporation', label: 'Municipal Corporation', description: 'Large urban local government body for major cities' },
    { value: 'municipality', label: 'Municipality', description: 'Urban local government body for smaller cities and towns' },
    { value: 'town_panchayat', label: 'Town Panchayat', description: 'Village-level local government institution' },
    { value: 'district_panchayat', label: 'District Panchayat', description: 'District-level rural local government institution' },
    { value: 'block_panchayat', label: 'Block Panchayat', description: 'Intermediate level rural local government body' },
    { value: 'village_panchayat', label: 'Village Panchayat', description: 'District-level rural local government institution' },
    { value: 'other', label: 'Other', description: 'Other types of local government bodies' }
  ];

  useEffect(() => {
    loadLedgers();
    loadInstitutions();
    loadFunds();
    loadGroups();
  }, []);

  const loadLedgers = async () => {
    const result = await executeApi(ledgerService.getAll);
    if (result.success) {
      setLedgers(result.data || []);
    }
  };

  const loadInstitutions = async () => {
    const result = await executeApi(institutionService.getAll);
    if (result.success) {
      setInstitutions(result.data || []);
    }
  };

  const loadFunds = async () => {
    const result = await executeApi(fundService.getAll);
    if (result.success) {
      setFunds(result.data || []);
    }
  };

  const loadGroups = async () => {
    const result = await executeApi(groupService.getAll);
    if (result.success) {
      setGroups(result.data || []);
    }
  };

  // Convert institutions to SearchableDropdown format
  const institutionOptions = institutions.map(institution => ({
    value: institution.institutionId,
    label: institution.institutionName,
    description: `ID: ${institution.institutionId} | Location: ${institution.state}`
  }));

  // Convert funds to SearchableDropdown format
  const fundOptions = funds.map(fund => ({
    value: fund.id,
    label: fund.fundName,
    description: `Created: ${fund.createdDate || 'N/A'} | Status: ${fund.status || 'Active'}`
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ledgerCode.trim()) {
      newErrors.ledgerCode = 'Ledger code is required';
    }

    if (!formData.ledgerName.trim()) {
      newErrors.ledgerName = 'Ledger Head is required';
    }

    if (!formData.underGroup.trim()) {
      newErrors.underGroup = 'Under group is required';
    }

    // if (!formData.localBodyType.trim()) {
    //   newErrors.localBodyType = 'Local body type is required';
    // }

    // if (!formData.institutionId.trim()) {
    //   newErrors.institutionId = 'Institution selection is required';
    // }

    // if (!formData.fundId.trim()) {
    //   newErrors.fundId = 'Fund selection is required';
    // }
    if (!formData.institutionId || !formData.institutionId.toString().trim()) {
    newErrors.institutionId = 'Institution selection is required';
  }

  if (!formData.fundId || !formData.fundId.toString().trim()) {
    newErrors.fundId = 'Fund selection is required';
  }

    if (showBankDetails) {
      if (!formData.accountHoldersName.trim()) {
        newErrors.accountHoldersName = 'Account holder name is required';
      }

      if (!formData.accountNo.trim()) {
        newErrors.accountNo = 'Account number is required';
      }

      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC code is required';
      }

      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }

      if (!formData.branchName.trim()) {
        newErrors.branchName = 'Branch name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let transformedValue = value;
    if (name === 'ifscCode') {
      transformedValue = value.toUpperCase();
    } else if (name === 'accountNo') {
      transformedValue = value.replace(/\D/g, '');
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: transformedValue
    }));

    if (name === 'underGroup') {
      setShowBankDetails(value === 'Bank Account' || value === 'Bank Accounts');
    }

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

    if (name === 'underGroup') {
      setShowBankDetails(value === 'Bank Account' || value === 'Bank Accounts');
    }

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
    
    try {
      let result;
      
      if (editingId) {
        result = await executeApi(ledgerService.update, editingId, formData);
      } else {
        result = await executeApi(ledgerService.create, formData);
      }

      if (result.success) {
        const message = editingId ? 'Ledger updated successfully!' : 'Ledger created successfully!';
        showToast(message, 'success');
        resetForm();
        await loadLedgers();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving ledger:', error);
      showToast('Error saving ledger. Please try again.', 'error');
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
      ledgerCode: '',
      ledgerName: '',
      underGroup: '',
      localBodyType: '',
      institutionId: '',
      fundId: '',
      accountHoldersName: '',
      accountNo: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      nameOfScheme: ''
    });
    setErrors({});
    setEditingId(null);
    setShowBankDetails(false);
    clearError();
  };

  const handleEdit = (ledger) => {
    setFormData({
      ledgerCode: ledger.ledgerCode || '',
      ledgerName: ledger.ledgerName || '',
      underGroup: ledger.underGroup || '',
      localBodyType: ledger.localBodyType || '',
      institutionId: ledger.institutionId || '',
      fundId: ledger.fundId || '',
      accountHoldersName: ledger.accountHoldersName || '',
      accountNo: ledger.accountNo || '',
      ifscCode: ledger.ifscCode || '',
      bankName: ledger.bankName || '',
      branchName: ledger.branchName || '',
      nameOfScheme: ledger.nameOfScheme || ''
    });
    setEditingId(ledger.id);
    setShowBankDetails(ledger.isBankAccount || ledger.underGroup === 'Bank Account' || ledger.underGroup === 'Bank Accounts');
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const ledger = ledgers.find(l => l.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Ledger',
    message: `Are you sure you want to delete ledger "${ledger?.ledgerName || ledger?.ledgerCode || 'this ledger'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(ledgerService.delete, id);
    if (result.success) {
      showToast(result.message || 'Ledger deleted successfully!', 'success');
      await loadLedgers();
    } else {
      showToast(result.message || 'Failed to delete ledger!', 'error');
    }
  }
};
 

  // Get local body type label for display
  const getLocalBodyTypeLabel = (value) => {
    const found = localBodyTypeOptions.find(type => type.value === value);
    return found ? found.label : value;
  };

  // Get institution name for display
  const getInstitutionName = (institutionId) => {
    const institution = institutions.find(inst => inst.institutionId === institutionId);
    return institution ? institution.institutionName : institutionId;
  };

  // Get fund name for display
  const getFundName = (fundId) => {
    const fund = funds.find(f => f.id === fundId);
    return fund ? fund.fundName : fundId;
  };

  const handleSelectAll = () => {
    if (paginatedLedgers.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedLedgers.map(item => item.id)));
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
        const result = await executeApi(ledgerService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadLedgers();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  const normalizeStr = (str) => str?.replace(/\u00A0/g, ' ') || '';
  const filteredLedgers = ledgers.filter(ledger => {
    const f = searchFilters;
    const s = normalizeStr(f.searchTerm).toLowerCase();
    const searchMatch = !s ||
      normalizeStr(ledger.ledgerCode).toLowerCase().includes(s) ||
      normalizeStr(ledger.ledgerName).toLowerCase().includes(s) ||
      normalizeStr(ledger.underGroup).toLowerCase().includes(s) ||
      normalizeStr(ledger.bankName).toLowerCase().includes(s) ||
      normalizeStr(getInstitutionName(ledger.institutionId)).toLowerCase().includes(s);
    const underGroupMatch = !f.underGroup || ledger.underGroup?.toLowerCase().includes(f.underGroup.toLowerCase());
    return searchMatch && underGroupMatch;
  });

  const totalPages = Math.ceil(filteredLedgers.length / PAGE_SIZE);
  const paginatedLedgers = filteredLedgers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Master Ledger' : 'Master Ledger Creation'}
            </h1>
            <p className="text-slate-600">Create and manage ledger accounts</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
            <BookOpen className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Total Ledgers: {ledgers.length}
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

      {/* Ledger Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Ledger Details' : 'Ledger Details'}
            </h2>
          </div>
          
          <div className="p-6 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Basic Information
                </h3>
              </div>

              <FormField
                label="Ledger Code"
                name="ledgerCode"
                value={formData.ledgerCode}
                onChange={handleChange}
                required
                error={errors.ledgerCode}
                icon={BookOpen}
                placeholder="Enter ledger code (e.g., LC001)"
              />

              <FormField
                label="Ledger Head"
                name="ledgerName"
                value={formData.ledgerName}
                onChange={handleChange}
                required
                error={errors.ledgerName}
                icon={FileText}
                placeholder="Enter Ledger Head (e.g., Cash Account)"
              />
              
              <SearchableDropdown
                label="Under Group"
                placeholder="Select Account Group"
                searchPlaceholder="Search account groups..."
                options={groupOptions}
                value={formData.underGroup}
                onChange={handleDropdownChange('underGroup')}
                required
                error={errors.underGroup}
                icon={Users}
                emptyMessage="No account groups available"
                maxHeight="250px"
              />

              {/* <SearchableDropdown
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
              /> */}

              <SearchableDropdown
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
              />


              <SearchableDropdown
                label="Name of the Institution"
                placeholder="Select Institution"
                searchPlaceholder="Search institutions..."
                options={institutionOptions}
                value={formData.institutionId}
                onChange={handleDropdownChange('institutionId')}
                required
                error={errors.institutionId}
                icon={Building}
                emptyMessage="No institutions available. Please create an institution first."
                maxHeight="250px"
              />

              
              {showBankDetails && (
                <>
                  <div className="lg:col-span-3 mt-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                      Bank Account Details
                    </h3>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Additional bank details are required when "Bank Account" is selected as the group.
                      </p>
                    </div>
                  </div>
                  
                  <FormField
                    label="Account Holders Name"
                    name="accountHoldersName"
                    value={formData.accountHoldersName}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.accountHoldersName}
                    icon={Users}
                    placeholder="Enter account holder name"
                  />
                  
                  <FormField
                    label="Account Number"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.accountNo}
                    icon={CreditCard}
                    placeholder="Enter account number"
                  />
                  
                  <FormField
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.ifscCode}
                    placeholder="ABCD0123456"
                    maxLength={11}
                  />
                  
                  <FormField
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.bankName}
                    icon={Building}
                    placeholder="Enter bank name"
                  />
                  
                  <FormField
                    label="Branch Name"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.branchName}
                    placeholder="Enter branch name"
                  />
                  
                  <FormField
                    label="Name of the Scheme"
                    name="nameOfScheme"
                    value={formData.nameOfScheme}
                    onChange={handleChange}
                    error={errors.nameOfScheme}
                    placeholder="Purpose of account opening"
                  />
                </>
              )}
            </div>
            
            <div className="flex justify-center space-x-4 mt-8">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? 'Saving...' : (editingId ? 'Update' : 'Submit')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ledgers List */}
      {showTable && (
        <SearchableRecords
          title="Ledger Accounts"
          totalRecords={filteredLedgers.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-green-500"
          gradientTo="to-emerald-500"
          searchPlaceholder="Search by code, name, group, bank..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            { key: 'underGroup', label: 'Under Group', type: 'text', placeholder: 'Filter by group name' },
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
                      checked={paginatedLedgers.length > 0 && paginatedLedgers.every(item => selectedIds.has(item.id))}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ledger Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ledger Head</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Group</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Local Body</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bank Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {paginatedLedgers.map((ledger) => (
                  <tr key={ledger.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(ledger.id)}
                        onChange={() => handleSelectItem(ledger.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{ledger.ledgerCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{ledger.ledgerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{ledger.underGroup}</div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {getLocalBodyTypeLabel(ledger.localBodyType)}
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{getInstitutionName(ledger.institutionId)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{getFundName(ledger.fundId)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {(ledger.isBankAccount || ledger.underGroup === 'Bank Account' || ledger.underGroup === 'Bank Accounts') ? (
                        <div>
                          <div className="text-sm text-slate-900">{ledger.bankName}</div>
                          <div className="text-sm text-slate-500">{ledger.accountNo}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(ledger)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ledger.id)}
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
            {filteredLedgers.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No ledgers found matching your filters.</p>
                <button onClick={() => setShowTable(false)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                  Create your first ledger →
                </button>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={PAGE_SIZE} totalItems={filteredLedgers.length} />
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

export default MasterLedgerCreation;