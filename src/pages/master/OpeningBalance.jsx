import React, { useState, useEffect } from 'react';
import { Calculator, FileText, AlertCircle, CheckCircle, Plus, Save, RefreshCw, AlertTriangle, Hash } from 'lucide-react';

// Import your existing components
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
import { SubmitButton } from "../../components/common/SubmitButton";
import { DataTable } from "../../components/common/DataTable";
import { ToastContainer } from "../../components/common/ToastContainer";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
import { openingBalanceService, ledgerService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { useToast } from "../../hooks/useToast"; // Assuming you have this hook

// Import only the confirmation dialog from popup components
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { useAuth } from '../../context/AuthContext';


const OpeningBalance = () => {
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [balanceType, setBalanceType] = useState('Debit');
  const [currentEntry, setCurrentEntry] = useState({
    ledgerCode: '',
    ledgerHead: '',
    amount: ''
  });

  const [openingBalanceDetails, setOpeningBalanceDetails] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [savedOpeningBalances, setSavedOpeningBalances] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [showSavedBalances, setShowSavedBalances] = useState(false);

  const { executeApi, loading, error, clearError } = useApiService();
  const { toasts, showToast, removeToast } = useToast(); // Your existing toast hook
  
  // Only confirmation dialog hook
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();

  // Load data on component mount
  useEffect(() => {
    loadLedgers();
    loadSavedOpeningBalances();
  }, []);

  // Debug: Log when openingBalanceDetails changes
  useEffect(() => {
    console.log('Opening balance details updated:', openingBalanceDetails.length);
  }, [openingBalanceDetails]);

  const loadLedgers = async () => {
    const result = await executeApi(ledgerService.getAll);
    if (result.success) {
      setLedgers(result.data || []);
    }
  };

  const loadSavedOpeningBalances = async () => {
    const result = await executeApi(openingBalanceService.getAll);
    if (result.success) {
      const entries = result.data?.entries ?? result.data ?? [];
      setSavedOpeningBalances(Array.isArray(entries) ? entries : []);
    }
  };

  // Convert ledgers to SearchableDropdown format
  const ledgerOptions = ledgers.map(ledger => ({
    value: ledger.ledgerCode || ledger.code,
    label: `${ledger.ledgerCode || ledger.code} - ${ledger.ledgerName || ledger.name}`,
    description: ledger.description || `Ledger: ${ledger.ledgerName || ledger.name}`
  }));

  const handleEntryChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'ledgerCode') {
      const selectedLedger = ledgers.find(led => (led.ledgerCode || led.code) === value);
      setCurrentEntry(prev => ({
        ...prev,
        ledgerCode: value,
        ledgerHead: selectedLedger ? (selectedLedger.ledgerName || selectedLedger.name) : ''
      }));
    } else {
      setCurrentEntry(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (error) {
      clearError();
    }
  };

  // Handle dropdown changes specifically
  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    if (name === 'ledgerCode') {
      const selectedLedger = ledgers.find(led => (led.ledgerCode || led.code) === value);
      setCurrentEntry(prev => ({
        ...prev,
        ledgerCode: value,
        ledgerHead: selectedLedger ? (selectedLedger.ledgerName || selectedLedger.name) : ''
      }));
    } else {
      setCurrentEntry(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  const validateEntry = () => {
    if (!currentEntry.ledgerCode.trim()) {
      return 'Ledger code is required';
    }
    if (!currentEntry.ledgerHead.trim()) {
      return 'Ledger head is required';
    }
    if (!currentEntry.amount || parseFloat(currentEntry.amount) <= 0) {
      return 'Amount must be greater than 0';
    }
    
    // Check if ledger already exists with the same type (debit/credit)
    const existingEntry = openingBalanceDetails.find(entry => 
      entry.ledgerCode === currentEntry.ledgerCode && 
      entry.type === balanceType &&
      entry.id !== editingEntryId
    );
    if (existingEntry) {
      return `Ledger code already exists as a ${balanceType.toLowerCase()} entry`;
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
      ledgerCode: currentEntry.ledgerCode,
      ledgerHead: currentEntry.ledgerHead,
      type: balanceType,
      amount: parseFloat(currentEntry.amount),
      id: editingEntryId || Date.now()
    };

    if (editingEntryId) {
      // Update existing entry
      setOpeningBalanceDetails(prev => {
        const updated = prev.map(item => item.id === editingEntryId ? entryData : item);
        console.log('Updated entries count:', updated.length);
        return updated;
      });
      setEditingEntryId(null);
      showToast('Entry updated successfully!', 'success');
    } else {
      // Add new entry
      setOpeningBalanceDetails(prev => {
        const updated = [...prev, entryData];
        console.log('Added entry, new count:', updated.length);
        return updated;
      });
      showToast('Entry added successfully!', 'success');
    }
    
    resetCurrentEntry();
  };

  const resetCurrentEntry = () => {
    setCurrentEntry({
      ledgerCode: '',
      ledgerHead: '',
      amount: ''
    });
    setEditingEntryId(null);
  };

  const editEntry = (entry) => {
    setCurrentEntry({
      ledgerCode: entry.ledgerCode,
      ledgerHead: entry.ledgerHead,
      amount: entry.amount.toString()
    });
    setBalanceType(entry.type);
    setEditingEntryId(entry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteEntry = async (entry) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Entry',
      message: `Are you sure you want to delete this ${entry.type.toLowerCase()} entry for "${entry.ledgerHead}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });

    if (confirmed) {
      setOpeningBalanceDetails(prev => {
        const updated = prev.filter(item => item.id !== entry.id);
        console.log('Deleted entry, new count:', updated.length);
        return updated;
      });
      
      if (editingEntryId === entry.id) {
        resetCurrentEntry();
      }
      
      setTimeout(() => {
        closeDialog();
        showToast('Entry deleted successfully!', 'success');
      }, 500);
    } else {
      closeDialog();
    }
  };

  const calculateTotals = () => {
    const debitTotal = openingBalanceDetails
      .filter(entry => entry.type === 'Debit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const creditTotal = openingBalanceDetails
      .filter(entry => entry.type === 'Credit')
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    return { debitTotal, creditTotal };
  };

  const handleSave = async () => {
    if (openingBalanceDetails.length === 0) {
      showToast('Please add at least one entry before saving.', 'warning');
      return;
    }

    const { debitTotal, creditTotal } = calculateTotals();
    const isBalanced = debitTotal === creditTotal;
    const difference = Math.abs(debitTotal - creditTotal);
    
    // Show confirmation dialog for unbalanced entries
    if (!isBalanced) {
      const confirmed = await showConfirmDialog({
        title: 'Unbalanced Opening Balance',
        message: (
          <div className="space-y-3">
            <p>Warning: Opening balance is unbalanced!</p>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Debit Total:</span>
                <span className="text-red-600 font-semibold">₹{debitTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Credit Total:</span>
                <span className="text-green-600 font-semibold">₹{creditTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Difference:</span>
                <span className="text-orange-600 font-semibold">₹{difference.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Do you want to save this unbalanced opening balance?</p>
          </div>
        ),
        confirmText: 'Save Anyway',
        cancelText: 'Cancel',
        type: 'warning'
      });
        
      if (!confirmed) {
        closeDialog();
        return;
      }
    }

    const openingBalanceData = {
      entries: openingBalanceDetails,
      debitTotal,
      creditTotal,
      isBalanced,
      difference: isBalanced ? 0 : difference,
      balanceStatus: isBalanced ? 'Balanced' : 'Unbalanced',
      description: `Opening Balance - ${new Date().toLocaleDateString()} ${isBalanced ? '(Balanced)' : '(Unbalanced)'}`,
      status: 'Active'
    };
    
    const result = await executeApi(openingBalanceService.create, openingBalanceData);
    
    if (result.success) {
      // Close any open dialogs
      if (dialogState.isOpen) closeDialog();
      
      // Show success toast
      showToast(`Opening Balance saved successfully! Status: ${isBalanced ? 'Balanced' : 'Unbalanced'}`, 'success');
      
      // Reset form
      setOpeningBalanceDetails([]);
      resetCurrentEntry();
      await loadSavedOpeningBalances();
    } else {
      if (dialogState.isOpen) closeDialog();
      showToast(result.message || 'Failed to save opening balance', 'error');
    }
  };

  const loadOpeningBalance = async (openingBalanceId) => {
    const result = await executeApi(openingBalanceService.getById, openingBalanceId);
    if (result.success && result.data) {
      setOpeningBalanceDetails(result.data.entries || []);
      setShowSavedBalances(false);
      showToast('Opening balance loaded successfully!', 'success');
    } else {
      showToast('Failed to load opening balance', 'error');
    }
  };

  const { debitTotal, creditTotal } = calculateTotals();
  const isBalanced = debitTotal === creditTotal;
  const difference = Math.abs(debitTotal - creditTotal);

  // Updated columns with separate Debit and Credit amounts
  const columns = [
    { key: 'ledgerCode', title: 'Ledger Code', sortable: true },
    { key: 'ledgerHead', title: 'Ledger Head', sortable: true },
    { 
      key: 'debitAmount', 
      title: 'Debit Amount (₹)', 
      render: (value, row) => row.type === 'Debit' ? 
        `₹${row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'
    },
    { 
      key: 'creditAmount', 
      title: 'Credit Amount (₹)', 
      render: (value, row) => row.type === 'Credit' ? 
        `₹${row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-'
    }
  ];

  return (
    <div className="space-y-6 ">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Error Display */}
       <ErrorDisplay error={error} onClear={clearError} />


      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Opening Balance</h1>
            <p className="text-slate-600">Set up initial account balances for the financial year</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-800">
              {showSavedBalances 
                ? `Saved Records: ${savedOpeningBalances?.length || 0}`
                : `Total Entries: ${savedOpeningBalances?.length || 0}`
              }
            </span>
          </div>
          <button
            onClick={() => setShowSavedBalances(!showSavedBalances)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>{showSavedBalances ? 'Hide Saved' : 'View Saved'}</span>
          </button>
        </div>
      </div>

      {/* Saved Opening Balances */}
      {showSavedBalances && (
        <div className="bg-white/60  backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Saved Opening Balances</h2>
          </div>
          <div className="p-6">
            {savedOpeningBalances.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No saved opening balances found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Ledger Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Account Head</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Financial Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/40 divide-y divide-slate-200">
                    {savedOpeningBalances.map((balance) => (
                      <tr key={balance.id} className="hover:bg-white/60 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-900">{balance.accountCode || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-900">{balance.accountHead || '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            balance.type === 'Debit' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {balance.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          ₹{Number(balance.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{balance.financialYear || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {balance.createdDate ? new Date(balance.createdDate).toLocaleDateString() : '-'}
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

      {/* Main Form */}
      {!showSavedBalances && (
        <div className="bg-white/60 min-h-screen backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Opening Balance Entry</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Balance Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Balance Type <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="balanceType"
                    value="Debit"
                    checked={balanceType === 'Debit'}
                    onChange={(e) => setBalanceType(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-gray-700 font-medium">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Debit Balance
                  </span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="balanceType"
                    value="Credit"
                    checked={balanceType === 'Credit'}
                    onChange={(e) => setBalanceType(e.target.value)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700 font-medium">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Credit Balance
                  </span>
                </label>
              </div>
            </div>

            {/* Entry Form */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {editingEntryId ? `Edit ${balanceType} Entry` : `Add ${balanceType} Entry`}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Account Code with SearchableDropdown */}
                <SearchableDropdown
                  label="Ledger Code"
                  placeholder="Select Ledger"
                  searchPlaceholder="Search by code or name..."
                  options={ledgerOptions}
                  value={currentEntry.ledgerCode}
                  onChange={handleDropdownChange('ledgerCode')}
                  required
                  icon={Hash}
                  emptyMessage="No ledgers available"
                  maxHeight="250px"
                />
                
                <FormField
                  label="Ledger Head"
                  name="ledgerHead"
                  value={currentEntry.ledgerHead}
                  onChange={handleEntryChange}
                  required
                  placeholder="Ledger Head will auto-fill"
                  disabled={true}
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
                
                <div className="flex items-end space-x-2">
                  <button
                    type="button"
                    onClick={addEntry}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium flex-1 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{editingEntryId ? 'Update' : 'Add'}</span>
                  </button>
                  {editingEntryId && (
                    <button
                      type="button"
                      onClick={resetCurrentEntry}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-md"
                      title="Cancel Edit"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Opening Balance Details Table */}
            {openingBalanceDetails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Opening Balance Details</h3>
                <DataTable
                  columns={columns}
                  data={openingBalanceDetails}
                  onEdit={editEntry}
                  onDelete={deleteEntry}
                />
              </div>
            )}

            {/* Totals Summary */}
            {openingBalanceDetails.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-red-800 mb-2">Debit Total</h4>
                    <div className="text-3xl font-bold text-red-600">
                      ₹{debitTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-red-600 mt-1">
                      {openingBalanceDetails.filter(e => e.type === 'Debit').length} entries
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-green-800 mb-2">Credit Total</h4>
                    <div className="text-3xl font-bold text-green-600">
                      ₹{creditTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      {openingBalanceDetails.filter(e => e.type === 'Credit').length} entries
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Balance Validation */}
            {openingBalanceDetails.length > 0 && (
              <div className={`p-4 rounded-lg border ${
                isBalanced 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-center space-x-4">
                  {isBalanced ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="text-green-800 font-medium">
                        ✅ Balanced! Debit total equals Credit total (₹{debitTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                      <div className="text-center">
                        <div className="text-yellow-800 font-medium mb-1">
                          ⚠️ Unbalanced! Difference: ₹{difference.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          {debitTotal > creditTotal ? ' (Debit exceeds Credit)' : ' (Credit exceeds Debit)'}
                        </div>
                        <div className="text-sm text-yellow-700">
                          You can still save this opening balance, but it will be marked as unbalanced.
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-center border-t pt-6">
              <SubmitButton 
                loading={loading} 
                onClick={handleSave}
                disabled={openingBalanceDetails.length === 0}
                icon={Save}
              >
                Save Opening Balance
              </SubmitButton>
            </div>
          </div>
        </div>
      )}

      {/* Only Confirm Dialog Component - No more popup */}
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

export default OpeningBalance;