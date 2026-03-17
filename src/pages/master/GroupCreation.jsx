import React, { useState, useEffect } from 'react';
import { Layers, Edit, Trash2, Eye, Plus, Save, Shield, Crown, Folder, Building2, Users, Hash } from 'lucide-react';
import SearchableRecords from '../../components/common/SearchableRecords';
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { DataTable } from "../../components/common/DataTable";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { groupService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { VoiceInputField } from '../../components/common/VoiceInputField';
import Pagination from '../../components/common/Pagination';

import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { useAuth } from '../../context/AuthContext';
const GroupCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [isAdmin, setIsAdmin] = useState(true);
  const [groupType, setGroupType] = useState('regular');
  
  const [formData, setFormData] = useState({
    groupCode: '',
    groupName: '',
    underMainGroup: '',
    underGroup: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', mainGroup: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const { executeApi, loading, error, clearError } = useApiService();

  const mainGroupOptions = [
    { value: 'Income', label: 'Income', description: 'Revenue and earnings from operations' },
    { value: 'Expenditure', label: 'Expenditure', description: 'Costs and expenses incurred' },
    { value: 'Assets', label: 'Assets', description: 'Resources owned by the organization' },
    { value: 'Liabilities', label: 'Liabilities', description: 'Debts and obligations owed to others' },
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const result = await executeApi(groupService.getAll);
    if (result.success) {
      setGroups(result.data || []);
    }
  };

  const getGroupName = (group) => group.groupName || group.name || 'N/A';
  
  const isMainGroupValue = (val) => ['Income', 'Expenditure', 'Assets', 'Liabilities'].includes(val);

  const isMainGroup = (group) => group.isMainGroup === true || (!group.underMainGroup && !group.underGroup);
  
  const isRegularGroup = (group) => {
    if (isMainGroup(group)) return false;
    const parent = group.underGroup || group.underMainGroup;
    return isMainGroupValue(parent);
  };

  const isSubGroup = (group) => {
    if (isMainGroup(group)) return false;
    return !isRegularGroup(group);
  };

  const getRegularGroupOptions = () => {
    return groups
      .filter(group => isRegularGroup(group))
      .map(group => {
        const name = getGroupName(group);
        return {
          value: name,
          label: name,
          description: group.description || `Regular group under ${group.underMainGroup}`
        };
      });
  };

  const getGroupsUnderMainGroup = () => {
    return groups
      .filter(group => 
        !isMainGroup(group) && 
        !isSubGroup(group) && 
        (group.underMainGroup === formData.underMainGroup || !formData.underMainGroup)
      )
      .map(group => {
        const name = getGroupName(group);
        return {
          value: name,
          label: name,
          description: group.description || `Group under ${group.underMainGroup}`
        };
      });
  };

  // Check if group code already exists
  const isGroupCodeExists = (code) => {
    if (!code || editingId) return false; // Skip check when editing
    return groups.some(group => 
      group.groupCode?.toLowerCase() === code.toLowerCase() && 
      group.id !== editingId
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Group code validation
    if (!formData.groupCode.trim()) {
      newErrors.groupCode = 'Group code is required';
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.groupCode)) {
      newErrors.groupCode = 'Group code can only contain letters, numbers, hyphens, and underscores';
    } else if (formData.groupCode.length < 2) {
      newErrors.groupCode = 'Group code must be at least 2 characters';
    } else if (formData.groupCode.length > 20) {
      newErrors.groupCode = 'Group code must not exceed 20 characters';
    } else if (isGroupCodeExists(formData.groupCode)) {
      newErrors.groupCode = 'This group code already exists';
    }

    // Group name validation
    if (!formData.groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }

    // Validation based on group type
    if (groupType === 'regular' && !formData.underMainGroup) {
      newErrors.underMainGroup = 'Main group selection is required';
    }

    if (groupType === 'sub') {
      if (!formData.underMainGroup) {
        newErrors.underMainGroup = 'Main group selection is required';
      }
      if (!formData.underGroup) {
        newErrors.underGroup = 'Parent group selection is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-format group code: uppercase and replace spaces with underscores
    let processedValue = value;
    if (name === 'groupCode') {
      processedValue = value.toUpperCase().replace(/\s+/g, '_');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // If main group changes, reset the group selection for sub groups
    if (name === 'underMainGroup' && groupType === 'sub') {
      setFormData(prev => ({
        ...prev,
        underGroup: ''
      }));
    }
  };

  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'underMainGroup' && groupType === 'sub') {
      setFormData(prev => ({
        ...prev,
        underGroup: ''
      }));
    }

    if (error) {
      clearError();
    }
  };

  const handleGroupTypeChange = (type) => {
    setGroupType(type);
    setFormData({
      groupCode: '',
      groupName: '',
      underMainGroup: '',
      underGroup: '',
      description: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    clearError();
    
    try {
      let result;
      
      const submissionData = {
        groupCode: formData.groupCode,
        groupName: formData.groupName,
        description: formData.description,
        isMainGroup: groupType === 'main',
        isSubGroup: groupType === 'sub',
        underMainGroup: groupType === 'main' ? null : formData.underMainGroup,
        underGroup: groupType === 'main' ? null : 
                   (groupType === 'regular' ? formData.underMainGroup : formData.underGroup),
        status: 'Active'
      };

      if (editingId) {
        result = await executeApi(groupService.update, editingId, submissionData);
      } else {
        result = await executeApi(groupService.create, submissionData);
      }

      if (result.success) {
        const groupTypeLabel = groupType === 'main' ? 'Main Group' : 
                              groupType === 'sub' ? 'Sub Group' : 'Group';
        const message = editingId ? `${groupTypeLabel} updated successfully!` : `${groupTypeLabel} created successfully!`;
        showToast(message, 'success');
        
        resetForm();
        await loadGroups();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving group:', error);
      showToast('Error saving group. Please try again.', 'error');
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
      groupCode: '',
      groupName: '',
      underMainGroup: '',
      underGroup: '',
      description: ''
    });
    setErrors({});
    setEditingId(null);
    setGroupType('regular');
    clearError();
  };

  const handleEdit = (group) => {
    const name = getGroupName(group);
    setFormData({
      groupCode: group.groupCode || '',
      groupName: name,
      underMainGroup: group.underMainGroup || '',
      underGroup: group.underGroup || '',
      description: group.description || ''
    });
    setEditingId(group.id);
    
    if (isMainGroup(group)) {
      setGroupType('main');
    } else if (isSubGroup(group)) {
      setGroupType('sub');
    } else {
      setGroupType('regular');
    }
    
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const group = groups.find(g => g.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Group',
    message: `Are you sure you want to delete the group "${group?.name || 'this group'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(groupService.delete, id);
    if (result.success) {
      showToast(result.message || 'Group deleted successfully!', 'success');
      await loadGroups();
    } else {
      showToast(result.message || 'Failed to delete group!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this group?')) {
  //     const result = await executeApi(groupService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Group deleted successfully!', 'success');
  //       await loadGroups();
  //     } else {
  //       showToast(result.message || 'Failed to delete group!', 'error');
  //     }
  //   }
  // };

  const normalizeStr = (str) => str?.replace(/\u00A0/g, ' ') || '';
  const filteredGroups = groups.filter(group => {
    const f = searchFilters;
    const name = getGroupName(group);
    const code = group.groupCode || '';
    const main = group.underMainGroup || '';
    const parent = group.underGroup || '';
    const s = normalizeStr(f.searchTerm).toLowerCase();
    const searchMatch = !s ||
      normalizeStr(code).toLowerCase().includes(s) ||
      normalizeStr(name).toLowerCase().includes(s) ||
      normalizeStr(main).toLowerCase().includes(s) ||
      normalizeStr(parent).toLowerCase().includes(s);
    const mainGroupMatch = !f.mainGroup || group.underMainGroup === f.mainGroup || group.underGroup === f.mainGroup;
    return searchMatch && mainGroupMatch;
  });

  const totalPages = Math.ceil(filteredGroups.length / PAGE_SIZE);
  const paginatedGroups = filteredGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = () => {
    if (paginatedGroups.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedGroups.map(item => item.id)));
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
        const group = groups.find(g => g.id === id);
        if (group && isMainGroup(group)) continue;
        const result = await executeApi(groupService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadGroups();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  const getGroupTypeInfo = () => {
    switch (groupType) {
      case 'sub':
        return {
          title: 'Sub Group Creation',
          description: 'Create and manage sub groups under parent groups',
          icon: Folder,
          gradient: 'from-green-500 to-emerald-500',
          hoverGradient: 'hover:from-green-600 hover:to-emerald-600'
        };
      default:
        return {
          title: 'Group Creation',
          description: 'Create and manage account groups',
          icon: Layers,
          gradient: 'from-blue-500 to-indigo-500',
          hoverGradient: 'hover:from-blue-600 hover:to-indigo-600'
        };
    }
  };

  const groupTypeInfo = getGroupTypeInfo();

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`h-8 w-8 bg-gradient-to-r ${groupTypeInfo.gradient} rounded-lg flex items-center justify-center`}>
            <groupTypeInfo.icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Group' : groupTypeInfo.title}
            </h1>
            <p className="text-slate-600">
              {groupTypeInfo.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 rounded-lg">
            <Layers className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              Total Groups: {groups.length}
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

      {/* Group Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className={`bg-gradient-to-r ${groupTypeInfo.gradient} px-6 py-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {editingId ? 'Edit Group Details' : 'Group Details'}
              </h2>
              
              {!editingId && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleGroupTypeChange('sub')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      groupType === 'sub' 
                        ? 'bg-white text-green-600 shadow-sm' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Folder className="h-4 w-4 inline mr-1" />
                    Sub Group
                  </button>
                  <button
                    onClick={() => handleGroupTypeChange('regular')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      groupType === 'regular' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <Layers className="h-4 w-4 inline mr-1" />
                    Regular Group
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-2 flex items-center space-x-2 text-white/90">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                {groupType === 'regular' && 'Creating a regular group under a main group'}
                {groupType === 'sub' && 'Creating a sub group under a parent group'}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6 min-h-screen">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Group Code Field */}
                <FormField
                  label="Group Code"
                  name="groupCode"
                  value={formData.groupCode}
                  onChange={handleChange}
                  required
                  error={errors.groupCode}
                  icon={Hash}
                  placeholder="Enter unique group code (e.g., GRP_001)"
                  maxLength={20}
                />

                {/* Group Name Field */}
                <FormField
                  label={`${groupType === 'main' ? 'Main ' : groupType === 'sub' ? 'Sub ' : ''}Group Name`}
                  name="groupName"
                  value={formData.groupName}
                  onChange={handleChange}
                  required
                  error={errors.groupName}
                  icon={groupTypeInfo.icon}
                  placeholder={`Enter ${groupType === 'main' ? 'main ' : groupType === 'sub' ? 'sub ' : ''}group name`}
                />

                {/* Under Main Group */}
                {groupType !== 'main' && (
                  <SearchableDropdown
                    label="Under Accounting Group"
                    placeholder="Select Accounting Group"
                    searchPlaceholder="Search main groups..."
                    options={mainGroupOptions}
                    value={formData.underMainGroup}
                    onChange={handleDropdownChange('underMainGroup')}
                    required
                    error={errors.underMainGroup}
                    icon={Building2}
                    emptyMessage="No main groups available"
                  />
                )}

                {/* Under Parent Group (for sub groups) */}
                {groupType === 'sub' && (
                  <SearchableDropdown
                    label="Under Parent Group"
                    placeholder="Select Parent Group"
                    searchPlaceholder="Search parent groups..."
                    options={getGroupsUnderMainGroup()}
                    value={formData.underGroup}
                    onChange={handleDropdownChange('underGroup')}
                    required
                    error={errors.underGroup}
                    icon={Users}
                    emptyMessage={
                      !formData.underMainGroup 
                        ? "Please select a main group first" 
                        : "No groups available under selected main group"
                    }
                    disabled={!formData.underMainGroup}
                  />
                )}

                {/* Visual indicators */}
                {groupType === 'main' && (
                  <div className="flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <Crown className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-purple-700 font-medium">Main Group</p>
                      <p className="text-xs text-purple-600">Top-level group</p>
                    </div>
                  </div>
                )}

                {groupType === 'regular' && formData.underMainGroup && (
                  <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <Layers className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-blue-700 font-medium">Regular Group</p>
                      <p className="text-xs text-blue-600">Under {formData.underMainGroup}</p>
                    </div>
                  </div>
                )}
              </div>

              <VoiceInputField
                label="Description (Optional)"
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder={`Enter ${groupType === 'main' ? 'main ' : groupType === 'sub' ? 'sub ' : ''}group description`}
                rows={3}
              />
              
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  disabled={submitLoading}
                >
                  <span>Reset</span>
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`px-8 py-2.5 bg-gradient-to-r ${groupTypeInfo.gradient} ${groupTypeInfo.hoverGradient} text-white rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50`}
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{submitLoading ? 'Saving...' : (editingId ? 'Update' : 'Submit')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Groups List */}
      {showTable && (
        <SearchableRecords
          title="Registered Groups"
          totalRecords={filteredGroups.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-blue-500"
          gradientTo="to-indigo-500"
          searchPlaceholder="Search by code, name, main group..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            {
              key: 'mainGroup',
              label: 'Main Group',
              type: 'select',
              options: [
                { value: '', label: 'All Main Groups' },
                { value: 'Income', label: 'Income' },
                { value: 'Expenditure', label: 'Expenditure' },
                { value: 'Assets', label: 'Assets' },
                { value: 'Liabilities', label: 'Liabilities' },
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
                        checked={paginatedGroups.length > 0 && paginatedGroups.every(item => selectedIds.has(item.id))}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Group Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Group Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Main Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Parent Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {paginatedGroups.map((group) => (
                    <tr key={group.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(group.id)}
                          onChange={() => handleSelectItem(group.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {isMainGroup(group) ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              <Crown className="h-3 w-3 mr-1" />
                              Main
                            </span>
                          ) : isSubGroup(group) ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              <Folder className="h-3 w-3 mr-1" />
                              Sub
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              <Layers className="h-3 w-3 mr-1" />
                              Regular
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Hash className="h-3 w-3 text-slate-400 mr-1" />
                          <span className="text-sm font-mono font-medium text-slate-900">{group.groupCode || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{getGroupName(group)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {isMainGroup(group) ? (
                            <span className="text-purple-600 font-medium">-</span>
                          ) : (
                            group.underMainGroup || 'N/A'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">
                          {isSubGroup(group) || (group.underGroup && group.underGroup !== group.underMainGroup) ? (
                            group.underGroup || 'N/A'
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-500">{group.description || 'N/A'}</div>
                      </td>
                      {/* <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          group.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {group.status || 'Active'}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(group)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                          disabled={group.isMainGroup && !isAdmin}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredGroups.length === 0 && (
              <div className="text-center py-8">
                <Layers className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No groups found matching your filters.</p>
                <button onClick={() => setShowTable(false)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                  Create your first group →
                </button>
              </div>
            )}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={PAGE_SIZE} totalItems={filteredGroups.length} />
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

export default GroupCreation;