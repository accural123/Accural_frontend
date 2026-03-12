
import React, { useState, useEffect } from 'react';
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { DataTable } from "../../components/common/DataTable";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
import { autoGjvService, accountService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { Settings, Calendar, AlertCircle, CheckCircle, Plus, Save, RefreshCw, Eye, FileText, Hash, CreditCard, Clock } from 'lucide-react';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { useAuth } from '../../context/AuthContext';

const AutoGJV = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [selectedGJVType, setSelectedGJVType] = useState('');
  const [gjvEntries, setGjvEntries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [savedConfigurations, setSavedConfigurations] = useState([]);
  const [showSavedConfigs, setShowSavedConfigs] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editingSavedConfigId, setEditingSavedConfigId] = useState(null);
  const [currentEntry, setCurrentEntry] = useState({
    particulars: '',
    debitAccount: '',
    debitAccountName: '',
    creditAccount: '',
    creditAccountName: '',
    amount: '',
    frequency: 'Monthly',
    effectiveDate: '',
    description: ''
  });

  const { executeApi, loading, error, clearError } = useApiService();

  // Load data on component mount
  useEffect(() => {
    loadAccounts();
    loadSavedConfigurations();
  }, []);

  const loadAccounts = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) {
      setAccounts(result.data || []);
    }
  };

  const loadSavedConfigurations = async () => {
    const result = await executeApi(autoGjvService.getAll);
    if (result.success) {
      setSavedConfigurations(result.data || []);
    }
  };

  // Convert accounts to SearchableDropdown format
  const accountOptions = accounts.map(account => ({
    value: account.ledgerCode,
    label: `${account.ledgerCode} - ${account.ledgerName}`,
    description: account.description || `Account: ${account.ledgerName}`
  }));

  // Convert frequency options to SearchableDropdown format
  const frequencyOptions = [
    { value: 'Daily', label: 'Daily', description: 'Execute every day' },
    { value: 'Weekly', label: 'Weekly', description: 'Execute every week' },
    { value: 'Monthly', label: 'Monthly', description: 'Execute every month' },
    { value: 'Quarterly', label: 'Quarterly', description: 'Execute every quarter (3 months)' },
    { value: 'Half-Yearly', label: 'Half-Yearly', description: 'Execute twice a year (6 months)' },
    { value: 'Yearly', label: 'Yearly', description: 'Execute once a year' },
    { value: 'One-time', label: 'One-time', description: 'Execute only once on specified date' }
  ];

  const gjvTypes = [
    { 
      value: 'Grant GJV', 
      label: '1. Grant GJV',
      description: 'Automatic journal entries for grant accounting and fund utilization tracking',
      icon: '💰'
    },
    { 
      value: 'Depreciation GJV', 
      label: '2. Depreciation GJV',
      description: 'Monthly depreciation entries for fixed assets based on depreciation policy',
      icon: '📉'
    },
    { 
      value: 'Doubtful Collection GJV', 
      label: '3. Doubtful Collection GJV',
      description: 'Provision for doubtful debts based on aging analysis',
      icon: '⚠️'
    },
    { 
      value: 'Lapsed Deposit GJV', 
      label: '4. Lapsed Deposit GJV',
      description: 'Transfer of unclaimed/lapsed deposits to income after statutory period',
      icon: '🔄'
    },
    {
      value: 'Interest Accrual GJV',
      label: '5. Interest Accrual GJV',
      description: 'Monthly accrual of interest on investments and loans',
      icon: '📈'
    },
    {
      value: 'Prepaid Amortization GJV',
      label: '6. Prepaid Amortization GJV',
      description: 'Monthly amortization of prepaid expenses',
      icon: '📊'
    }
  ];

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'debitAccount') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setCurrentEntry(prev => ({
        ...prev,
        debitAccount: value,
        debitAccountName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else if (name === 'creditAccount') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setCurrentEntry(prev => ({
        ...prev,
        creditAccount: value,
        creditAccountName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else {
      setCurrentEntry(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  // Handle dropdown changes specifically
  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    if (name === 'debitAccount') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setCurrentEntry(prev => ({
        ...prev,
        debitAccount: value,
        debitAccountName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else if (name === 'creditAccount') {
      const selectedAccount = accounts.find(acc => acc.ledgerCode === value);
      setCurrentEntry(prev => ({
        ...prev,
        creditAccount: value,
        creditAccountName: selectedAccount ? selectedAccount.ledgerName : ''
      }));
    } else {
      setCurrentEntry(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateEntry = () => {
    if (!currentEntry.particulars.trim()) {
      return 'Particulars is required';
    }
    if (!currentEntry.debitAccount.trim()) {
      return 'Debit account is required';
    }
    if (!currentEntry.creditAccount.trim()) {
      return 'Credit account is required';
    }
    if (currentEntry.debitAccount === currentEntry.creditAccount) {
      return 'Debit and Credit accounts cannot be the same';
    }
    if (!currentEntry.amount || parseFloat(currentEntry.amount) <= 0) {
      return 'Amount must be greater than 0';
    }
    if (!currentEntry.effectiveDate) {
      return 'Effective date is required';
    }
    
    // Check if entry already exists for this GJV type (except when editing)
    const existingEntry = gjvEntries.find(entry => 
      entry.particulars.toLowerCase() === currentEntry.particulars.toLowerCase() && 
      entry.id !== editingEntryId
    );
    if (existingEntry) {
      return 'An entry with this particulars already exists';
    }
    
    return null;
  };

  const addGJVEntry = () => {
    const validationError = validateEntry();
    if (validationError) {
      showToast(validationError, 'error');
      return;
    }

    const entryData = {
      particulars: currentEntry.particulars,
      debitAccount: currentEntry.debitAccount,
      debitAccountName: currentEntry.debitAccountName,
      creditAccount: currentEntry.creditAccount,
      creditAccountName: currentEntry.creditAccountName,
      amount: parseFloat(currentEntry.amount),
      frequency: currentEntry.frequency,
      effectiveDate: currentEntry.effectiveDate,
      description: currentEntry.description,
      gjvType: selectedGJVType,
      id: editingEntryId || Date.now()
    };

    if (editingEntryId) {
      // Update existing entry
      setGjvEntries(prev => 
        prev.map(item => item.id === editingEntryId ? entryData : item)
      );
      setEditingEntryId(null);
      showToast('Entry updated successfully', 'success');
    } else {
      // Add new entry
      setGjvEntries(prev => [...prev, entryData]);
      showToast('Entry added successfully', 'success');
    }
    
    resetCurrentEntry();
  };

  const resetCurrentEntry = () => {
    setCurrentEntry({
      particulars: '',
      debitAccount: '',
      debitAccountName: '',
      creditAccount: '',
      creditAccountName: '',
      amount: '',
      frequency: 'Monthly',
      effectiveDate: '',
      description: ''
    });
    setEditingEntryId(null);
  };

  const editEntry = (entry) => {
    setCurrentEntry({
      particulars: entry.particulars,
      debitAccount: entry.debitAccount,
      debitAccountName: entry.debitAccountName,
      creditAccount: entry.creditAccount,
      creditAccountName: entry.creditAccountName,
      amount: entry.amount.toString(),
      frequency: entry.frequency,
      effectiveDate: entry.effectiveDate,
      description: entry.description || ''
    });
    setEditingEntryId(entry.id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
const deleteEntry = async (entry) => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Entry',
    message: `Are you sure you want to delete this GJV entry? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    setGjvEntries(prev => prev.filter(item => item.id !== entry.id));
    showToast('Entry deleted successfully', 'success');
    
    // Clear edit mode if deleting the entry being edited
    if (editingEntryId === entry.id) {
      resetCurrentEntry();
    }
  }
};
  // const deleteEntry = (entry) => {
  //   if (window.confirm('Are you sure you want to delete this entry?')) {
  //     setGjvEntries(prev => prev.filter(item => item.id !== entry.id));
  //     showToast('Entry deleted successfully', 'success');
      
  //     // Clear edit mode if deleting the entry being edited
  //     if (editingEntryId === entry.id) {
  //       resetCurrentEntry();
  //     }
  //   }
  // };

  const handleSaveConfiguration = async () => {
    if (!selectedGJVType || gjvEntries.length === 0) {
      showToast('Please select GJV type and add at least one entry', 'error');
      return;
    }

    const configurationData = {
      gjvType: selectedGJVType,
      entries: gjvEntries,
      totalEntries: gjvEntries.length,
      status: 'Active',
      description: `Auto GJV configuration for ${selectedGJVType}`
    };
    
    const result = editingSavedConfigId
      ? await executeApi(autoGjvService.update, editingSavedConfigId, configurationData)
      : await executeApi(autoGjvService.create, configurationData);

    if (result.success) {
      showToast(`${selectedGJVType} configuration ${editingSavedConfigId ? 'updated' : 'saved'} successfully!`, 'success');
      setGjvEntries([]);
      resetCurrentEntry();
      setSelectedGJVType('');
      setEditingSavedConfigId(null);
      await loadSavedConfigurations();
    } else {
      showToast(result.message || 'Failed to save configuration', 'error');
    }
  };

  const loadConfiguration = async (configId) => {
    const result = await executeApi(autoGjvService.getById, configId);
    if (result.success && result.data) {
      setSelectedGJVType(result.data.gjvType);
      setGjvEntries(result.data.entries || []);
      setEditingSavedConfigId(configId);
      setShowSavedConfigs(false);
      showToast('Configuration loaded for editing', 'success');
    } else {
      showToast('Failed to load configuration', 'error');
    }
  };

  const handleDeleteConfig = async (config) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Configuration',
      message: `Are you sure you want to delete the "${config.gjvType}" configuration?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });
    if (confirmed) {
      const result = await executeApi(autoGjvService.delete, config.id);
      closeDialog();
      if (result.success) {
        showToast('Configuration deleted successfully', 'success');
        await loadSavedConfigurations();
      } else {
        showToast(result.message || 'Failed to delete', 'error');
      }
    } else {
      closeDialog();
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

  const columns = [
    { key: 'particulars', title: 'Particulars', sortable: true },
    { 
      key: 'debitAccount', 
      title: 'Debit Account', 
      render: (value, row) => `${value} - ${row.debitAccountName}` 
    },
    { 
      key: 'creditAccount', 
      title: 'Credit Account', 
      render: (value, row) => `${value} - ${row.creditAccountName}` 
    },
    { key: 'amount', title: 'Amount (₹)', render: (value) => value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) },
    { key: 'frequency', title: 'Frequency' },
    { key: 'effectiveDate', title: 'Effective Date' }
  ];

  return (
    <div className="space-y-6">
      {/* Error Display */}
   <ErrorDisplay error={error} onClear={clearError} />
    

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Auto GJV Configuration</h1>
            <p className="text-slate-600">Configure automatic journal voucher entries</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 border border-teal-200 rounded-lg">
            <FileText className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-semibold text-teal-800">
              Total Configurations: {savedConfigurations.length}
            </span>
          </div>
          <button
            onClick={() => setShowSavedConfigs(!showSavedConfigs)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{showSavedConfigs ? 'Hide Saved' : 'View Saved'}</span>
          </button>
        </div>
      </div>

      {/* Saved Configurations */}
      {showSavedConfigs && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Saved Auto GJV Configurations</h2>
          </div>
          <div className="p-6">
            {savedConfigurations.length === 0 ? (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No saved configurations found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">GJV Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Entries</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Created Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/40 divide-y divide-slate-200">
                    {savedConfigurations.map((config) => (
                      <tr key={config.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{config.gjvType}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{config.description}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{config.totalEntries || 0}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            config.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {config.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{config.createdDate}</td>
                        <td className="px-6 py-4 text-sm font-medium space-x-3">
                          <button onClick={() => loadConfiguration(config.id)} className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button onClick={() => handleDeleteConfig(config)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Configuration Form */}
      {!showSavedConfigs && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Auto GJV Configuration</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* GJV Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Auto GJV Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gjvTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedGJVType === type.value
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedGJVType(type.value)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="gjvType"
                        value={type.value}
                        checked={selectedGJVType === type.value}
                        onChange={() => setSelectedGJVType(type.value)}
                        className="mt-1 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{type.icon}</span>
                          <h3 className="font-medium text-gray-800">{type.label}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Entry Form */}
            {selectedGJVType && (
              <div className="border-t pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-5 w-5 text-teal-600" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Configure {selectedGJVType} {editingEntryId ? '(Editing)' : ''}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg border">
                  <FormField
                    label="Particulars"
                    name="particulars"
                    value={currentEntry.particulars}
                    onChange={handleEntryChange}
                    required
                    placeholder="Description of the journal entry"
                  />
                  
                  {/* Debit Account with SearchableDropdown */}
                  <SearchableDropdown
                    label="Debit Account"
                    placeholder="Select Debit Account"
                    searchPlaceholder="Search debit accounts..."
                    options={accountOptions}
                    value={currentEntry.debitAccount}
                    onChange={handleDropdownChange('debitAccount')}
                    required
                    icon={CreditCard}
                    emptyMessage="No accounts available"
                    maxHeight="250px"
                  />
                  
                  {/* Credit Account with SearchableDropdown */}
                  <SearchableDropdown
                    label="Credit Account"
                    placeholder="Select Credit Account"
                    searchPlaceholder="Search credit accounts..."
                    options={accountOptions}
                    value={currentEntry.creditAccount}
                    onChange={handleDropdownChange('creditAccount')}
                    required
                    icon={Hash}
                    emptyMessage="No accounts available"
                    maxHeight="250px"
                  />
                  
                  <FormField
                    label="Amount (₹)"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={currentEntry.amount}
                    onChange={handleEntryChange}
                    required
                    placeholder="0.00"
                  />
                  
                  {/* Frequency with SearchableDropdown */}
                  <SearchableDropdown
                    label="Frequency"
                    placeholder="Select Frequency"
                    searchPlaceholder="Search frequency options..."
                    options={frequencyOptions}
                    value={currentEntry.frequency}
                    onChange={handleDropdownChange('frequency')}
                    icon={Clock}
                    emptyMessage="No frequency options available"
                  />
                  
                  <FormField
                    label="Effective Date"
                    name="effectiveDate"
                    type="date"
                    value={currentEntry.effectiveDate}
                    onChange={handleEntryChange}
                    required
                  />
                  
                  <div className="md:col-span-2 lg:col-span-3">
                    <FormField
                      label="Description"
                      name="description"
                      type="textarea"
                      value={currentEntry.description}
                      onChange={handleEntryChange}
                      placeholder="Additional details about this auto entry"
                    />
                  </div>
                  
                  <div className="md:col-span-2 lg:col-span-3 flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={addGJVEntry}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingEntryId ? 'Update Entry' : 'Add Entry'}</span>
                    </button>
                    {editingEntryId && (
                      <button
                        type="button"
                        onClick={resetCurrentEntry}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        title="Cancel Edit"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Configured Entries Table */}
            {gjvEntries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Configured Auto GJV Entries ({gjvEntries.length})</span>
                </h3>
                <DataTable
                  columns={columns}
                  data={gjvEntries}
                  onEdit={editEntry}
                  onDelete={deleteEntry}
                />
              </div>
            )}

            {/* Save Configuration */}
            {gjvEntries.length > 0 && (
              <div className="flex justify-center border-t pt-6">
                <SubmitButton 
                  loading={loading} 
                  onClick={handleSaveConfiguration}
                  icon={Save}
                >
                  Save Auto GJV Configuration
                </SubmitButton>
              </div>
            )}
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

export default AutoGJV;