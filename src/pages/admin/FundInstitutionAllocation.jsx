
import React, { useState, useEffect } from 'react';
import { Users, Building2, Wallet, Settings, Save, Edit, Trash2, Plus, X } from 'lucide-react';
import { institutionService, fundService, fundAllocationService } from "../../services/realServices";
import { authService } from "../../services/authService";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import SearchableDropdown from '../../components/common/SearchableDropdown';// Import your dropdown component
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import SearchableRecords from '../../components/common/SearchableRecords';
import Pagination from '../../components/common/Pagination';
const FundInstitutionAllocation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [funds, setFunds] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', status: '', user: '', dateFrom: '', dateTo: '' });
  const [filterUser, setFilterUser] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const { executeApi, loading: apiLoading, error, clearError } = useApiService();
  
  const [allocationForm, setAllocationForm] = useState({
    userId: '',
    fundIds: [],
    institutionIds: [],
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canView: true
    },
    validFrom: '',
    validTo: '',
    status: 'Active'
  });

  // Dropdown options
  const userOptions = users
    .filter(user => user.status === 'Active')
    .map(user => ({
      value: user.id,
      label: user.name,
      description: `${user.username} - ${user.role}`
    }));

  const statusOptions = [
    { value: 'Active', label: 'Active', description: 'User can access allocated resources' },
    { value: 'Inactive', label: 'Inactive', description: 'Access temporarily disabled' },
    { value: 'Suspended', label: 'Suspended', description: 'Access blocked due to violations' }
  ];

  const filterUserOptions = [
    { value: '', label: 'All Users', description: 'Show allocations for all users' },
    ...users.map(user => ({
      value: user.id?.toString() || '',
      label: user.name,
      description: `${user.username} - ${user.role}`
    }))
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    clearError();

    try {
      // Load real users
      const usersResult = await executeApi(authService.getUsers);
      if (usersResult.success) {
        setUsers(usersResult.data || []);
      }

      // Load real funds
      const fundsResult = await executeApi(fundService.getAll);
      if (fundsResult.success) {
        setFunds(fundsResult.data || []);
      }

      // Load real institutions
      const institutionsResult = await executeApi(institutionService.getAll);
      if (institutionsResult.success) {
        setInstitutions(institutionsResult.data || []);
      }

      // Load allocations from real API
      const allocationsResult = await executeApi(fundAllocationService.getAll);
      if (allocationsResult.success) {
        setAllocations(allocationsResult.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error loading data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAllocationForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAllocationForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleUserChange = (e) => {
    setAllocationForm(prev => ({
      ...prev,
      userId: e.target.value
    }));
  };

  const handleStatusChange = (e) => {
    setAllocationForm(prev => ({
      ...prev,
      status: e.target.value
    }));
  };

  const handleFilterUserChange = (e) => {
    setFilterUser(e.target.value);
  };

  const handleMultiSelectChange = (field, id) => {
    setAllocationForm(prev => ({
      ...prev,
      [field]: prev[field].includes(id) 
        ? prev[field].filter(item => item !== id)
        : [...prev[field], id]
    }));
  };

  const resetForm = () => {
    setAllocationForm({
      userId: '',
      fundIds: [],
      institutionIds: [],
      permissions: {
        canCreate: true,
        canEdit: true,
        canDelete: false,
        canView: true
      },
      validFrom: '',
      validTo: '',
      status: 'Active'
    });
    setEditingAllocation(null);
  };

  const handleSubmit = async () => {
    if (!allocationForm.userId) {
      showToast('Please select a user', 'error');
      return;
    }

    if (allocationForm.fundIds.length === 0 && allocationForm.institutionIds.length === 0) {
      showToast('Please select at least one fund or institution', 'error');
      return;
    }

    setSubmitLoading(true);

    try {
      let result;
      if (editingAllocation) {
        result = await fundAllocationService.update(editingAllocation.id, allocationForm);
      } else {
        const newAllocation = {
          ...allocationForm,
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: 'admin'
        };
        result = await fundAllocationService.create(newAllocation);
      }

      if (result.success) {
        showToast(editingAllocation ? 'Allocation updated successfully!' : 'Allocation created successfully!', 'success');
        await loadAllData();
        setShowAllocationModal(false);
        resetForm();
      } else {
        showToast(result.message || 'Failed to save allocation. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving allocation:', error);
      showToast('Error saving allocation. Please try again.', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (allocation) => {
    setAllocationForm(allocation);
    setEditingAllocation(allocation);
    setShowAllocationModal(true);
  };

  // const handleDelete = (id) => {
  //   if (window.confirm('Are you sure you want to delete this allocation?')) {
  //     const updatedAllocations = allocations.filter(alloc => alloc.id !== id);
  //     localStorage.setItem('userAllocations', JSON.stringify(updatedAllocations));
  //     setAllocations(updatedAllocations);
  //     showToast('Allocation deleted successfully!', 'success');
  //   }
  // };
  const handleDelete = async (id) => {
  const allocation = allocations.find(alloc => alloc.id === id);
  const user = users.find(u => 
    String(u.id) === String(allocation?.id) || 
    String(u.id) === String(allocation?.userId)
  );
  const userName = user?.name || 'this user';
  
  const confirmed = await showConfirmDialog({
    title: 'Delete Allocation',
    message: `Are you sure you want to delete the allocation for "${userName}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await fundAllocationService.delete(id);
    if (result.success) {
      setAllocations(prev => prev.filter(alloc => alloc.id !== id));
      showToast('Allocation deleted successfully!', 'success');
    } else {
      showToast(result.message || 'Failed to delete allocation', 'error');
    }
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

  const getUserName = (userId) => {
    const user = users.find(u => 
      String(u.id) === String(userId)
    );
    return user ? user.name : 'Unknown User';
  };

  const getFundNames = (fundIds) => {
    if (!Array.isArray(fundIds)) return [];
    return fundIds.map(id => {
      const fund = funds.find(f => f.id === id);
      return fund ? fund.fundName : 'Unknown Fund';
    });
  };

  const getInstitutionNames = (institutionIds) => {
    if (!Array.isArray(institutionIds)) return [];
    return institutionIds.map(id => {
      const institution = institutions.find(i => i.id === id);
      return institution ? institution.institutionName : 'Unknown Institution';
    });
  };

  const filteredAllocations = allocations.filter(allocation => {
    const user = users.find(u =>
      String(u.id) === String(allocation.id) ||
      String(u.id) === String(allocation.userId)
    );
    const { searchTerm, status, user: userFilter, dateFrom, dateTo } = searchFilters;
    const matchesSearch = !searchTerm ||
                         (user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user?.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (allocation.status || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUserFilter = !userFilter ||
                             String(allocation.id) === String(userFilter) ||
                             String(allocation.userId) === String(userFilter);
    const matchesStatus = !status || allocation.status === status;
    const matchesDateFrom = !dateFrom || (allocation.validFrom && allocation.validFrom >= dateFrom);
    const matchesDateTo = !dateTo || (allocation.validTo && allocation.validTo <= dateTo);
    return matchesSearch && matchesUserFilter && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.ceil(filteredAllocations.length / PAGE_SIZE);
  const paginatedAllocations = filteredAllocations.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = () => {
    if (paginatedAllocations.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedAllocations.map(item => item.id)));
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
        const result = await fundAllocationService.delete(id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadAllData();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  const allocationModalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              {editingAllocation ? 'Edit Allocation' : 'Create New Allocation'}
            </h3>
            <button
              onClick={() => {setShowAllocationModal(false); resetForm();}}
              className="text-white hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* User Selection */}
          <div>
            <SearchableDropdown
              label="Select User"
              options={userOptions}
              value={allocationForm.userId}
              onChange={handleUserChange}
              placeholder="Choose a user to allocate resources"
              searchPlaceholder="Search users..."
              required={true}
              icon={Users}
              allowClear={true}
              emptyMessage="No active users available"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Institution Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allocate Institutions
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                {institutions.filter(inst => inst.status === 'Active').length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No active institutions available</p>
                ) : (
                  institutions.filter(inst => inst.status === 'Active').map(institution => (
                    <label key={institution.id} className="flex items-center space-x-3 py-2 hover:bg-white px-2 rounded">
                      <input
                        type="checkbox"
                        checked={allocationForm.institutionIds.includes(institution.id)}
                        onChange={() => handleMultiSelectChange('institutionIds', institution.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{institution.institutionName}</div>
                        <div className="text-xs text-gray-500">{institution.state} - {institution.localBodyType?.replace('_', ' ')}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Selected: {allocationForm.institutionIds.length} institutions
              </div>
            </div>

            {/* Fund Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allocate Funds
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto bg-gray-50">
                {funds.filter(fund => fund.status === 'Active').length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No active funds available</p>
                ) : (
                  funds.filter(fund => fund.status === 'Active').map(fund => (
                    <label key={fund.id} className="flex items-center space-x-3 py-2 hover:bg-white px-2 rounded">
                      <input
                        type="checkbox"
                        checked={allocationForm.fundIds.includes(fund.id)}
                        onChange={() => handleMultiSelectChange('fundIds', fund.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{fund.fundName}</div>
                        <div className="text-xs text-gray-500">Created: {fund.createdDate}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Selected: {allocationForm.fundIds.length} funds
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(allocationForm.permissions).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleFormChange(`permissions.${key}`, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm capitalize">{key.replace('can', 'Can ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Validity Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid From</label>
              <input
                type="date"
                value={allocationForm.validFrom}
                onChange={(e) => handleFormChange('validFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valid To</label>
              <input
                type="date"
                value={allocationForm.validTo}
                onChange={(e) => handleFormChange('validTo', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <SearchableDropdown
              label="Status"
              options={statusOptions}
              value={allocationForm.status}
              onChange={handleStatusChange}
              placeholder="Select allocation status"
              searchPlaceholder="Search status..."
              required={true}
              icon={Settings}
              allowClear={false}
              emptyMessage="No status options available"
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={() => {setShowAllocationModal(false); resetForm();}}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={submitLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 flex items-center space-x-2 disabled:opacity-50"
          >
            {submitLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{submitLoading ? 'Saving...' : (editingAllocation ? 'Update' : 'Create')} Allocation</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading allocation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fund & Institution Allocation</h1>
            <p className="text-slate-600">Manage user access to funds and institutions</p>
          </div>
        </div>
        <button
          onClick={() => setShowAllocationModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Allocation</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-800">{users.filter(u => u.status === 'Active').length}</div>
              <div className="text-sm text-blue-600">Active Users</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-800">{funds.filter(f => f.status === 'Active').length}</div>
              <div className="text-sm text-green-600">Available Funds</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-purple-800">{institutions.filter(i => i.status === 'Active').length}</div>
              <div className="text-sm text-purple-600">Active Institutions</div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-orange-800">{allocations.filter(a => a.status === 'Active').length}</div>
              <div className="text-sm text-orange-600">Active Allocations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocations Table */}
      <SearchableRecords
        title="User Allocations"
        totalRecords={filteredAllocations.length}
        searchFilters={searchFilters}
        onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
        loading={loading}
        gradientFrom="from-blue-500"
        gradientTo="to-purple-500"
        searchPlaceholder="Search by user name, role, status..."
        filterConfig={{ dateRange: true, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
        customFilters={[
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            icon: Settings,
            options: [
              { value: '', label: 'All Status' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Suspended', label: 'Suspended' }
            ]
          },
          {
            key: 'user',
            label: 'User',
            type: 'select',
            icon: Users,
            options: [
              { value: '', label: 'All Users' },
              ...users.map(u => ({ value: String(u.id), label: u.name }))
            ]
          }
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedAllocations.length > 0 && paginatedAllocations.every(item => selectedIds.has(item.id))}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated Funds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated Institutions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAllocations.map((allocation) => {
                const user = users.find(u =>
                  String(u.id) === String(allocation.id) ||
                  String(u.id) === String(allocation.userId)
                );
                return (
                  <tr key={allocation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(allocation.id)}
                        onChange={() => handleSelectItem(allocation.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                          <div className="text-sm text-gray-500">{user?.username} - {user?.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getFundNames(allocation.fundIds).map((name, idx) => (
                          <div key={idx} className="flex items-center mb-1">
                            <Wallet className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs">{name}</span>
                          </div>
                        ))}
                        {(allocation.fundIds?.length || 0) === 0 && <span className="text-gray-400">No funds allocated</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getInstitutionNames(allocation.institutionIds).map((name, idx) => (
                          <div key={idx} className="flex items-center mb-1">
                            <Building2 className="h-3 w-3 text-purple-500 mr-1" />
                            <span className="text-xs">{name}</span>
                          </div>
                        ))}
                        {(allocation.institutionIds?.length || 0) === 0 && <span className="text-gray-400">No institutions allocated</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(allocation.permissions || {}).map(([key, value]) => (
                          value && (
                            <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {key.replace('can', '').toLowerCase()}
                            </span>
                          )
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>From: {allocation.validFrom || 'N/A'}</div>
                      <div>To: {allocation.validTo || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        allocation.status === 'Active' ? 'bg-green-100 text-green-800' :
                        allocation.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {allocation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(allocation)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(allocation.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredAllocations.length === 0 && (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {Object.values(searchFilters).some(v => v) ? 'No allocations found matching your filters.' : 'No allocations created yet.'}
              </p>
              {!Object.values(searchFilters).some(v => v) && (
                <button
                  onClick={() => setShowAllocationModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                >
                  Create your first allocation →
                </button>
              )}
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={PAGE_SIZE} totalItems={filteredAllocations.length} />
          </div>
        )}
      </SearchableRecords>
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
      {/* Allocation Modal */}
      {showAllocationModal && allocationModalContent}
    </div>
  );
};

export default FundInstitutionAllocation;