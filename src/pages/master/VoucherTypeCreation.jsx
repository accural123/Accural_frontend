import React, { useState, useEffect } from 'react';
import { FileText, Edit, Trash2, Eye, Plus, Save, Receipt, Settings, Hash } from 'lucide-react';
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
import { VoiceInputField } from "../../components/common/VoiceInputField"; // Import VoiceInputField
import { SubmitButton } from "../../components/common/SubmitButton";
import { DataTable } from "../../components/common/DataTable";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { voucherTypeService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import SearchableRecords from '../../components/common/SearchableRecords';
import { useAuth } from '../../context/AuthContext';

const ITEMS_PER_PAGE = 10;

const VoucherTypeCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    voucherName: '',
    alias: '',
    selectTypeOfVoucher: '',
    abbreviation: '',
    numberingMethod: 'Auto',
    startingNumber: '1',
    prefix: '',
    suffix: '',
    isActive: true,
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [voucherTypes, setVoucherTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', voucherType: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { executeApi, loading, error, clearError } = useApiService();

  const voucherTypeOptions = [
    {
      value: 'Bank Receipt',
      label: 'Bank Receipt',
      description: 'For recording money received into bank accounts'
    },
    {
      value: 'Bank Payment',
      label: 'Bank Payment',
      description: 'For recording money paid from bank accounts'
    },
    {
      value: 'Journal',
      label: 'Journal',
      description: 'For recording adjustments and non-cash transactions'
    },
    {
      value: 'Daily Collection',
      label: 'Daily Collection',
      description: 'For recording daily cash collections'
    },
    {
      value: 'Inter Bank Transfer',
      label: 'Inter Bank Transfer',
      description: 'For recording transfers between bank accounts'
    },
  ];

  useEffect(() => {
    loadVoucherTypes();
  }, []);

  const loadVoucherTypes = async () => {
    const result = await executeApi(voucherTypeService.getAll);
    if (result.success) {
      setVoucherTypes(result.data || []);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.voucherName.trim()) {
      newErrors.voucherName = 'Voucher name is required';
    }

    if (!formData.alias.trim()) {
      newErrors.alias = 'Alias is required';
    } else if (formData.alias.length > 10) {
      newErrors.alias = 'Alias should be 10 characters or less';
    }

    if (!formData.selectTypeOfVoucher) {
      newErrors.selectTypeOfVoucher = 'Voucher type selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let transformedValue = value;
    
    if (name === 'alias') {
      transformedValue = value.toUpperCase();
    } else if (name === 'startingNumber') {
      transformedValue = value.replace(/\D/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : transformedValue
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

    if (error) {
      clearError();
    }
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
      
      if (editingId) {
        result = await executeApi(voucherTypeService.update, editingId, formData);
      } else {
        result = await executeApi(voucherTypeService.create, formData);
      }

      if (result.success) {
        const message = editingId ? 'Voucher type updated successfully!' : 'Voucher type created successfully!';
        showToast(message, 'success');
        
        resetForm();
        await loadVoucherTypes();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving voucher type:', error);
      showToast('Error saving voucher type. Please try again.', 'error');
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
      voucherName: '',
      alias: '',
      selectTypeOfVoucher: '',
      abbreviation: '',
      prefix: '',
      suffix: '',
      isActive: true,
      description: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (voucherType) => {
    setFormData({
      voucherName: voucherType.voucherName || '',
      alias: voucherType.alias || '',
      selectTypeOfVoucher: voucherType.selectTypeOfVoucher || '',
      abbreviation: voucherType.abbreviation || '',
      prefix: voucherType.prefix || '',
      suffix: voucherType.suffix || '',
      isActive: voucherType.isActive !== undefined ? voucherType.isActive : true,
      description: voucherType.description || ''
    });
    setEditingId(voucherType.id);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
  const handleDelete = async (id) => {
  const voucherType = voucherTypes.find(vt => vt.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Voucher Type',
    message: `Are you sure you want to delete voucher type "${voucherType?.name || voucherType?.type || 'this voucher type'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(voucherTypeService.delete, id);
    if (result.success) {
      showToast(result.message || 'Voucher type deleted successfully!', 'success');
      await loadVoucherTypes();
    } else {
      showToast(result.message || 'Failed to delete voucher type!', 'error');
    }
  }
};

  

  const normalizeStr = (str) => str?.replace(/\u00A0/g, ' ') || '';
  const filteredVoucherTypes = voucherTypes.filter(vt => {
    const { searchTerm, voucherType } = searchFilters;
    const s = normalizeStr(searchTerm).toLowerCase();
    const matchesSearch = !s ||
      normalizeStr(vt.voucherName).toLowerCase().includes(s) ||
      normalizeStr(vt.alias).toLowerCase().includes(s) ||
      normalizeStr(vt.selectTypeOfVoucher).toLowerCase().includes(s);
    const matchesType = !voucherType || vt.selectTypeOfVoucher === voucherType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredVoucherTypes.length / ITEMS_PER_PAGE);
  const paginatedVoucherTypes = filteredVoucherTypes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    if (paginatedVoucherTypes.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedVoucherTypes.map(item => item.id)));
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
        const result = await executeApi(voucherTypeService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadVoucherTypes();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Receipt className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Voucher Type' : 'Voucher Type Creation'}
            </h1>
            <p className="text-slate-600">Create and manage voucher types for transactions</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 rounded-lg">
            <Receipt className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-800">
              Total Types: {voucherTypes.length}
            </span>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
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

      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Voucher Type Details' : 'Voucher Type Details'}
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-teal-500" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Voucher Name"
                    name="voucherName"
                    value={formData.voucherName}
                    onChange={handleChange}
                    required
                    error={errors.voucherName}
                    icon={FileText}
                    placeholder="e.g., Bank Receipt Voucher"
                  />
                  
                  <FormField
                    label="Alias"
                    name="alias"
                    value={formData.alias}
                    onChange={handleChange}
                    required
                    error={errors.alias}
                    placeholder="e.g., BRV"
                    maxLength={10}
                  />
                  
                  <SearchableDropdown
                    label="Select Type of Voucher"
                    placeholder="Select Voucher Type"
                    searchPlaceholder="Search voucher types..."
                    options={voucherTypeOptions}
                    value={formData.selectTypeOfVoucher}
                    onChange={handleDropdownChange('selectTypeOfVoucher')}
                    required
                    error={errors.selectTypeOfVoucher}
                    icon={Receipt}
                    emptyMessage="No voucher types available"
                  />
                </div>
              </div>

              {/* Description with Voice Input - Tamil as default */}
              <VoiceInputField
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter voucher type description (தமிழ்/EN)"
                rows={3}
                error={errors.description}
                showToast={showToast}
                showLangToggle={true}
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
                  className="px-8 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{submitLoading ? 'Saving...' : (editingId ? 'Update' : 'Create Voucher Type')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTable && (
        <SearchableRecords
          title="Registered Voucher Types"
          totalRecords={filteredVoucherTypes.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-teal-500"
          gradientTo="to-cyan-500"
          searchPlaceholder="Search by voucher name, alias, or type..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            {
              key: 'voucherType',
              label: 'Voucher Type',
              type: 'select',
              icon: Receipt,
              options: [
                { value: '', label: 'All Types' },
                { value: 'Bank Receipt', label: 'Bank Receipt' },
                { value: 'Bank Payment', label: 'Bank Payment' },
                { value: 'Journal', label: 'Journal' },
                { value: 'Daily Collection', label: 'Daily Collection' },
                { value: 'Inter Bank Transfer', label: 'Inter Bank Transfer' },
              ]
            }
          ]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
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
          {filteredVoucherTypes.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchFilters.searchTerm || searchFilters.voucherType ? 'No voucher types found matching your search.' : 'No voucher types created yet.'}
              </p>
              {!searchFilters.searchTerm && !searchFilters.voucherType && (
                <button
                  onClick={() => setShowTable(false)}
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium mt-2"
                >
                  Create your first voucher type →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={paginatedVoucherTypes.length > 0 && paginatedVoucherTypes.every(item => selectedIds.has(item.id))}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Voucher Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Alias</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {paginatedVoucherTypes.map((voucherType) => (
                    <tr key={voucherType.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(voucherType.id)}
                          onChange={() => handleSelectItem(voucherType.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900">{voucherType.voucherName}</div>
                          {voucherType.description && (
                            <div className="text-sm text-slate-500">{voucherType.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{voucherType.alias}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900">{voucherType.selectTypeOfVoucher}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(voucherType)}
                          className="text-teal-600 hover:text-teal-900 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(voucherType.id)}
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

export default VoucherTypeCreation;