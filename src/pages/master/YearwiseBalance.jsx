
import React, { useState, useEffect } from 'react';
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { DataTable } from "../../components/common/DataTable";
import { yearwiseBalanceService, fundService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Plus, Save, RefreshCw, Eye, FileText, BarChart3, Wallet, Trash2, Edit3 } from 'lucide-react';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import SearchableRecords from '../../components/common/SearchableRecords';
const ITEMS_PER_PAGE = 20;

const YearwiseBalance = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFundType, setSelectedFundType] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectedTaxType, setSelectedTaxType] = useState('Property Tax');
  const [balanceData, setBalanceData] = useState([]);
  const [savedRecords, setSavedRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', taxType: '' });
  const [availableFunds, setAvailableFunds] = useState([]);
  const [newEntry, setNewEntry] = useState({
    year: '',
    demand: '',
    collection: '',
    balance: ''
  });
  const [editingEntryId, setEditingEntryId] = useState(null);

  const { executeApi, loading, error, clearError } = useApiService();

  useEffect(() => {
    loadSavedRecords();
    loadAvailableFunds();
  }, []);

  const loadAvailableFunds = async () => {
    try {
      const result = await fundService.getAll();
      setAvailableFunds(result.success ? (result.data || []) : []);
    } catch (error) {
      console.error('Error loading funds:', error);
      setAvailableFunds([]);
    }
  };

  const loadSavedRecords = async () => {
    const result = await executeApi(yearwiseBalanceService.getAll);
    if (result.success) {
      setSavedRecords(result.data || []);
    }
  };

  const fundOptions = availableFunds.map(fund => ({
    value: fund.fundName,
    label: fund.fundName,
    description: `Created: ${fund.createdDate}`
  }));

  const taxTypes = [
    { value: 'Property Tax', label: 'Property Tax', icon: '🏠' },
    { value: 'Water Charges', label: 'Water Charges', icon: '💧' },
    { value: 'Profession Tax', label: 'Profession Tax', icon: '💼' },
    { value: 'MDR', label: 'Market Development Revenue (MDR)', icon: '🏪' },
    { value: 'SWM User Charges', label: 'Solid Waste Management User Charges', icon: '♻️' },
    { value: 'UGD User Charges', label: 'Underground Drainage User Charges', icon: '🚰' },
    { value: 'Trade License Fee', label: 'Trade License Fee', icon: '📜' },
    { value: 'Building Plan Approval Fee', label: 'Building Plan Approval Fee', icon: '🏗️' }
  ];

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    if (['demand', 'collection'].includes(name)) {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        processedValue = parseFloat(numericValue).toLocaleString('en-IN');
      }
    }
    
    setNewEntry(prev => {
      const updated = { ...prev, [name]: processedValue };
      
      if (name === 'demand' || name === 'collection') {
        const demand = parseFloat(updated.demand.replace(/,/g, '')) || 0;
        const collection = parseFloat(updated.collection.replace(/,/g, '')) || 0;
        const balance = demand - collection;
        updated.balance = balance.toLocaleString('en-IN');
      }
      
      return updated;
    });
  };

  const validateEntry = () => {
    if (!newEntry.year.trim()) {
      return 'Year is required';
    }
    
    if (!newEntry.demand || parseFloat(newEntry.demand.replace(/,/g, '')) <= 0) {
      return 'Demand must be greater than 0';
    }
    
    const collection = parseFloat(newEntry.collection.replace(/,/g, '')) || 0;
    
    if (collection < 0) {
      return 'Collection cannot be negative';
    }
    
    const existingEntry = balanceData.find(entry => 
      entry.year === newEntry.year && entry.id !== editingEntryId
    );
    if (existingEntry) {
      return 'Year already exists in the current list';
    }
    
    return null;
  };

  const addEntry = () => {
    const validationError = validateEntry();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    const entryData = {
      id: editingEntryId || Date.now(),
      slNo: editingEntryId ? balanceData.find(e => e.id === editingEntryId)?.slNo : balanceData.length + 1,
      year: newEntry.year,
      demand: parseFloat(newEntry.demand.replace(/,/g, '')),
      collection: parseFloat(newEntry.collection.replace(/,/g, '')) || 0,
      balance: parseFloat(newEntry.balance.replace(/,/g, ''))
    };

    if (editingEntryId) {
      setBalanceData(prev => 
        prev.map(item => item.id === editingEntryId ? entryData : item)
      );
      setEditingEntryId(null);
      showToast('Entry updated successfully', 'success');
    } else {
      setBalanceData(prev => [...prev, entryData]);
      showToast('Entry added successfully', 'success');
    }
    
    resetNewEntry();
  };

  const resetNewEntry = () => {
    setNewEntry({ year: '', demand: '', collection: '', balance: '' });
    setEditingEntryId(null);
  };
const deleteEntry = async (entry) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Entry',
    message: `Are you sure you want to delete this balance entry? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    setBalanceData(prev => {
      const filtered = prev.filter(item => item.id !== entry.id);
      return filtered.map((item, index) => ({ ...item, slNo: index + 1 }));
    });
    showToast('Entry deleted successfully', 'success');
    
    if (editingEntryId === entry.id) {
      resetNewEntry();
    }
  }
};
 
  const editEntry = (entry) => {
    setNewEntry({
      year: entry.year,
      demand: entry.demand.toLocaleString('en-IN'),
      collection: entry.collection.toLocaleString('en-IN'),
      balance: entry.balance.toLocaleString('en-IN')
    });
    setEditingEntryId(entry.id);
  };

  const handleSubmit = async () => {
    if (!selectedFundType) {
      showToast('Please select a fund type', 'error');
      return;
    }

    if (balanceData.length === 0) {
      showToast('Please add at least one entry', 'error');
      return;
    }

    const submitData = {
      fundType: selectedFundType,
      taxType: selectedTaxType,
      balanceData,
      totalDemand: balanceData.reduce((sum, entry) => sum + entry.demand, 0),
      totalCollection: balanceData.reduce((sum, entry) => sum + entry.collection, 0),
      totalBalance: balanceData.reduce((sum, entry) => sum + entry.balance, 0),
      collectionEfficiency: (balanceData.reduce((sum, entry) => sum + entry.collection, 0) / 
                            balanceData.reduce((sum, entry) => sum + entry.demand, 0)) * 100,
      yearsCount: balanceData.length
    };
    
    let result;
    if (editingRecordId) {
      result = await executeApi(yearwiseBalanceService.update, editingRecordId, submitData);
    } else {
      result = await executeApi(yearwiseBalanceService.create, submitData);
    }

    if (result.success) {
      const message = editingRecordId 
        ? `${selectedTaxType} yearwise balance updated successfully!`
        : `${selectedTaxType} yearwise balance saved successfully!`;
      
      showToast(message, 'success');
      resetForm();
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const resetForm = () => {
    setSelectedFundType('');
    setBalanceData([]);
    resetNewEntry();
    setEditingRecordId(null);
    clearError();
  };

  const handleEditRecord = (record) => {
    setSelectedFundType(record.fundType || '');
    setSelectedTaxType(record.taxType || 'Property Tax');
    // API returns flat records; convert to local balanceData format
    setBalanceData([{
      id: record.id,
      slNo: 1,
      year: record.financialYear || record.year || '',
      demand: Number(record.demand) || 0,
      collection: Number(record.collection) || 0,
      balance: Number(record.balance) || 0
    }]);
    setEditingRecordId(record.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDeleteRecord = async (id) => {
  const record = savedRecords.find(rec => rec.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Yearwise Balance Record',
    message: `Are you sure you want to delete this yearwise balance record? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(yearwiseBalanceService.delete, id);
    if (result.success) {
      showToast(result.message || 'Record deleted successfully!', 'success');
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Failed to delete record!', 'error');
    }
  }
};


  const handleSearch = async () => {
    if (searchFilters.searchTerm.trim()) {
      const result = await executeApi(yearwiseBalanceService.search, searchFilters.searchTerm);
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

  const totals = {
    demand: balanceData.reduce((sum, entry) => sum + entry.demand, 0),
    collection: balanceData.reduce((sum, entry) => sum + entry.collection, 0),
    balance: balanceData.reduce((sum, entry) => sum + entry.balance, 0),
    collectionEfficiency: balanceData.length > 0 
      ? (balanceData.reduce((sum, entry) => sum + entry.collection, 0) / 
         balanceData.reduce((sum, entry) => sum + entry.demand, 0)) * 100 
      : 0
  };

  const filteredRecords = savedRecords.filter(record => {
    const { searchTerm, taxType } = searchFilters;
    const matchesSearch = !searchTerm ||
      record.fundType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.taxType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.year?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.financialYear?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTaxType = !taxType || record.taxType === taxType;
    return matchesSearch && matchesTaxType;
  });

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    if (paginatedRecords.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedRecords.map(item => item.id)));
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
        const result = await executeApi(yearwiseBalanceService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadSavedRecords();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  const columns = [
    { key: 'slNo', title: 'Sl.No', sortable: true },
    { key: 'year', title: 'Year', sortable: true },
    { key: 'demand', title: 'Demand (₹)', render: (value) => value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { key: 'collection', title: 'Collection (₹)', render: (value) => value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { key: 'balance', title: 'Balance (₹)', render: (value) => value?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { 
      key: 'collectionRate', 
      title: 'Collection %', 
      render: (value, row) => {
        const rate = row.demand > 0 ? (row.collection / row.demand) * 100 : 0;
        return `${rate.toFixed(1)}%`;
      }
    }
  ];

  const recordColumns = [
    { key: 'fundType', title: 'Fund Type', sortable: true },
    { key: 'taxType', title: 'Tax Type', sortable: true },
    { key: 'year', title: 'Year', sortable: true, render: (_v, row) => row.financialYear || row.year || '—' },
    { key: 'demand', title: 'Demand (₹)', render: (value) => value != null ? Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—' },
    { key: 'collection', title: 'Collection (₹)', render: (value) => value != null ? Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—' },
    { key: 'balance', title: 'Balance (₹)', render: (value) => value != null ? Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—' },
    {
      key: 'collectionEfficiency',
      title: 'Efficiency %',
      render: (value) => {
        const eff = value != null ? Number(value) : null;
        if (eff == null) return '—';
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            eff >= 100 ? 'bg-purple-100 text-purple-800' :
            eff >= 80 ? 'bg-green-100 text-green-800' :
            eff >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            {eff.toFixed(1)}%
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingRecordId ? 'Edit' : 'Add'} Yearwise Balance
            </h1>
            <p className="text-slate-600">Manage year-wise tax collection and balance tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200 rounded-lg">
            <FileText className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-800">
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
          {editingRecordId && (
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

      {showRecords && (
        <SearchableRecords
          title="Saved Yearwise Balance Records"
          totalRecords={filteredRecords.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-purple-500"
          gradientTo="to-pink-500"
          searchPlaceholder="Search by fund type, tax type, or year..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            {
              key: 'taxType',
              label: 'Tax Type',
              type: 'select',
              icon: BarChart3,
              options: [
                { value: '', label: 'All Tax Types' },
                { value: 'Property Tax', label: 'Property Tax' },
                { value: 'Water Charges', label: 'Water Charges' },
                { value: 'Profession Tax', label: 'Profession Tax' },
                { value: 'MDR', label: 'MDR' },
                { value: 'SWM User Charges', label: 'SWM User Charges' },
                { value: 'UGD User Charges', label: 'UGD User Charges' },
                { value: 'Trade License Fee', label: 'Trade License Fee' },
                { value: 'Building Plan Approval Fee', label: 'Building Plan Approval Fee' },
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
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchFilters.searchTerm || searchFilters.taxType ? 'No records found matching your search.' : 'No yearwise balance records found.'}
              </p>
              {!searchFilters.searchTerm && !searchFilters.taxType && (
                <button
                  onClick={() => setShowRecords(false)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2"
                >
                  Create your first record →
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
                        checked={paginatedRecords.length > 0 && paginatedRecords.every(item => selectedIds.has(item.id))}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fund Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tax Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Demand (₹)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Collection (₹)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Balance (₹)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Efficiency %</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40 divide-y divide-slate-200">
                  {paginatedRecords.map((record) => {
                    const eff = record.collectionEfficiency != null ? Number(record.collectionEfficiency) : null;
                    return (
                      <tr key={record.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(record.id)}
                            onChange={() => handleSelectItem(record.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.fundType}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.taxType}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.financialYear || record.year || '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.demand != null ? Number(record.demand).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.collection != null ? Number(record.collection).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.balance != null ? Number(record.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}</td>
                        <td className="px-4 py-3 text-sm">
                          {eff == null ? '—' : (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              eff >= 100 ? 'bg-purple-100 text-purple-800' :
                              eff >= 80 ? 'bg-green-100 text-green-800' :
                              eff >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {eff.toFixed(1)}%
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEditRecord(record)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
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
            </div>
          )}
        </SearchableRecords>
      )}

      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingRecordId ? 'Edit Yearwise Balance' : 'Add New Yearwise Balance'}
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Fund Type Selection */}
            <div>
              <SearchableDropdown
                options={fundOptions}
                value={selectedFundType}
                onChange={(e) => setSelectedFundType(e.target.value)}
                label="Fund Type"
                placeholder="Select a fund type"
                searchPlaceholder="Search funds..."
                required
                icon={Wallet}
                emptyMessage="No funds available. Create funds first."
              />
            </div>

            {/* Tax Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Tax Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {taxTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTaxType === type.value
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedTaxType(type.value)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="taxType"
                        value={type.value}
                        checked={selectedTaxType === type.value}
                        onChange={() => setSelectedTaxType(type.value)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium text-gray-800 text-sm">{type.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Entry */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Calculator className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingEntryId ? 'Edit Entry' : 'Add New Entry'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg border">
                <FormField
                  label="Year"
                  name="year"
                  value={newEntry.year}
                  onChange={handleNewEntryChange}
                  placeholder="e.g., 2024-2025"
                  required
                />
                
                <FormField
                  label="Demand (₹)"
                  name="demand"
                  value={newEntry.demand}
                  onChange={handleNewEntryChange}
                  placeholder="0.00"
                />
                
                <FormField
                  label="Collection (₹)"
                  name="collection"
                  value={newEntry.collection}
                  onChange={handleNewEntryChange}
                  placeholder="0.00"
                />
                
                <FormField
                  label="Balance (₹)"
                  name="balance"
                  value={newEntry.balance}
                  onChange={handleNewEntryChange}
                  disabled={true}
                  placeholder="Auto-calculated"
                  help="Auto-calculated"
                />
                
                <div className="flex items-end space-x-2">
                  <button
                    type="button"
                    onClick={addEntry}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium flex-1 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingEntryId ? 'Update' : 'Add'}</span>
                  </button>
                  {editingEntryId && (
                    <button
                      type="button"
                      onClick={resetNewEntry}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md"
                      title="Cancel Edit"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Balance Data Table */}
            {balanceData.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{selectedTaxType} - Yearwise Data ({balanceData.length} entries)</span>
                </h3>
                <DataTable
                  columns={columns}
                  data={balanceData}
                  onEdit={editEntry}
                  onDelete={deleteEntry}
                />
              </div>
            )}

            {/* Summary Statistics */}
            {balanceData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Total Demand</h4>
                    <div className="text-xl font-bold text-blue-600">
                      ₹{totals.demand.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-green-800 mb-1">Total Collection</h4>
                    <div className="text-xl font-bold text-green-600">
                      ₹{totals.collection.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-red-800 mb-1">Total Balance</h4>
                    <div className="text-xl font-bold text-red-600">
                      ₹{totals.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  totals.collectionEfficiency >= 100 ? 'bg-purple-50 border-purple-200' :
                  totals.collectionEfficiency >= 80 ? 'bg-green-50 border-green-200' :
                  totals.collectionEfficiency >= 60 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="text-center">
                    <h4 className={`text-sm font-medium mb-1 ${
                      totals.collectionEfficiency >= 100 ? 'text-purple-800' :
                      totals.collectionEfficiency >= 80 ? 'text-green-800' :
                      totals.collectionEfficiency >= 60 ? 'text-yellow-800' :
                      'text-red-800'
                    }`}>Collection Efficiency</h4>
                    <div className={`text-xl font-bold ${
                      totals.collectionEfficiency >= 100 ? 'text-purple-600' :
                      totals.collectionEfficiency >= 80 ? 'text-green-600' :
                      totals.collectionEfficiency >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {totals.collectionEfficiency.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center border-t pt-6">
              <SubmitButton 
                loading={loading} 
                onClick={handleSubmit}
                disabled={balanceData.length === 0}
                icon={Save}
              >
                {editingRecordId ? 'Update Yearwise Balance' : 'Save Yearwise Balance'}
              </SubmitButton>
            </div>
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

export default YearwiseBalance;