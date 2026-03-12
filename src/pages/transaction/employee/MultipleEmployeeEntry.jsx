import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, DollarSign, BookOpen, User, Building, Calendar, Layers, CheckCircle } from 'lucide-react';

// Ledger Entries Component
const EmployeeLedgerEntries = ({ 
  ledgers = [], 
  onLedgerEntriesChange, 
  showToast,
  initialEntries = []
}) => {
  const [ledgerEntries, setLedgerEntries] = useState(initialEntries);
  const [currentLedgerEntry, setCurrentLedgerEntry] = useState({
    ledgerCode: '',
    ledgerName: '',
    amount: ''
  });

  useEffect(() => {
    setLedgerEntries(initialEntries);
  }, [initialEntries]);

  useEffect(() => {
    if (onLedgerEntriesChange) {
      onLedgerEntriesChange(ledgerEntries);
    }
  }, [ledgerEntries, onLedgerEntriesChange]);

  const handleLedgerChange = (e) => {
    const selectedCode = e.target.value;
    const selectedLedger = ledgers.find(l => l.code === selectedCode);
    
    setCurrentLedgerEntry({
      ledgerCode: selectedCode,
      ledgerName: selectedLedger ? selectedLedger.name : '',
      amount: ''
    });
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    let processedValue = value;
    
    if (value) {
      const numericValue = value.replace(/,/g, '');
      if (/^\d*\.?\d*$/.test(numericValue)) {
        if (numericValue !== '' && !isNaN(numericValue)) {
          const parts = numericValue.split('.');
          parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
          processedValue = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
        }
      } else {
        return;
      }
    }
    
    setCurrentLedgerEntry(prev => ({ ...prev, amount: processedValue }));
  };

  const addLedgerEntry = () => {
    if (!currentLedgerEntry.ledgerCode) {
      showToast('Please select a ledger', 'error');
      return;
    }

    if (!currentLedgerEntry.amount) {
      showToast('Please enter an amount', 'error');
      return;
    }

    const numericAmount = parseFloat(currentLedgerEntry.amount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    if (ledgerEntries.length >= 10) {
      showToast('Maximum 10 ledger entries allowed', 'error');
      return;
    }

    const entryData = {
      id: Date.now(),
      ledgerCode: currentLedgerEntry.ledgerCode,
      ledgerName: currentLedgerEntry.ledgerName,
      amount: numericAmount
    };

    setLedgerEntries(prev => [...prev, entryData]);
    setCurrentLedgerEntry({ ledgerCode: '', ledgerName: '', amount: '' });
    showToast('Ledger entry added successfully', 'success');
  };

  const editLedgerEntry = (entry) => {
    setCurrentLedgerEntry({
      ledgerCode: entry.ledgerCode,
      ledgerName: entry.ledgerName,
      amount: entry.amount.toLocaleString('en-IN')
    });
    setLedgerEntries(prev => prev.filter(item => item.id !== entry.id));
    showToast('Ledger entry loaded for editing', 'info');
  };

  const deleteLedgerEntry = (entryId) => {
    setLedgerEntries(prev => prev.filter(item => item.id !== entryId));
    showToast('Ledger entry deleted successfully', 'success');
  };

  const totalAmount = ledgerEntries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <h5 className="text-md font-semibold text-indigo-800 mb-3 flex items-center">
          <BookOpen className="h-4 w-4 mr-2" />
          Add Ledger Entry {ledgerEntries.length > 0 && `(${ledgerEntries.length}/10)`}
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger Code <span className="text-red-500">*</span>
            </label>
            <select
              value={currentLedgerEntry.ledgerCode}
              onChange={handleLedgerChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Ledger</option>
              {ledgers.map((ledger) => (
                <option key={ledger.code} value={ledger.code}>
                  {ledger.code} - {ledger.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger Name
            </label>
            <input
              type="text"
              value={currentLedgerEntry.ledgerName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Auto-filled"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentLedgerEntry.amount}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={addLedgerEntry}
            disabled={ledgerEntries.length >= 10}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            <span>Add Ledger</span>
          </button>
        </div>
      </div>

      {ledgerEntries.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3">
            <h5 className="text-md font-semibold text-white flex items-center justify-between">
              <span>Ledger Entries ({ledgerEntries.length})</span>
              <span>Total: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </h5>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ledger Code</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ledger Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount (₹)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{entry.ledgerCode}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{entry.ledgerName}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ₹{entry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editLedgerEntry(entry)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteLedgerEntry(entry.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Multiple Employee Entry Component with Ledger Details Toggle
const MultipleEmployeeEntry = ({ 
  formData, 
  onChange, 
  showToast, 
  showConfirmDialog, 
  onEmployeeEntriesChange, 
  initialEmployeeEntries = [],
  ledgers = []
}) => {
  const [employeeEntries, setEmployeeEntries] = useState(initialEmployeeEntries);
  const [showLedgerDetails, setShowLedgerDetails] = useState(false);
  const [currentEmployeeLedgers, setCurrentEmployeeLedgers] = useState([]);
  const [currentEmployeeEntry, setCurrentEmployeeEntry] = useState({
    nameOfEmployee: '',
    designation: '',
    section: '',
    monthYear: '',
    employeeAmount: ''
  });

  useEffect(() => {
    // console.log('MultipleEmployeeEntry: Received initial entries:', initialEmployeeEntries);
    setEmployeeEntries(initialEmployeeEntries);
  }, [initialEmployeeEntries]);

  useEffect(() => {
    if (onEmployeeEntriesChange) {
      onEmployeeEntriesChange(employeeEntries);
    }
  }, [employeeEntries, onEmployeeEntriesChange]);

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'employeeAmount') {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        const formattedValue = parseFloat(numericValue).toLocaleString('en-IN');
        setCurrentEmployeeEntry(prev => ({ ...prev, [name]: formattedValue }));
      } else {
        setCurrentEmployeeEntry(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setCurrentEmployeeEntry(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLedgerEntriesChange = (ledgerEntries) => {
    setCurrentEmployeeLedgers(ledgerEntries);
    
    // Auto-update employee amount with ledger total
    if (showLedgerDetails && ledgerEntries.length > 0) {
      const ledgerTotal = ledgerEntries.reduce((sum, entry) => sum + entry.amount, 0);
      setCurrentEmployeeEntry(prev => ({
        ...prev,
        employeeAmount: ledgerTotal.toLocaleString('en-IN')
      }));
    }
  };

  const addEmployeeEntry = () => {
    if (!currentEmployeeEntry.nameOfEmployee?.trim()) {
      showToast('Employee name is required', 'error');
      return;
    }

    if (!currentEmployeeEntry.employeeAmount?.trim()) {
      showToast('Employee amount is required', 'error');
      return;
    }

    const numericAmount = parseFloat(currentEmployeeEntry.employeeAmount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    // Validate ledger entries if enabled
    if (showLedgerDetails) {
      if (currentEmployeeLedgers.length === 0) {
        showToast('Please add at least one ledger entry', 'error');
        return;
      }

      const ledgerTotal = currentEmployeeLedgers.reduce((sum, entry) => sum + entry.amount, 0);
      if (Math.abs(ledgerTotal - numericAmount) > 0.01) {
        showToast(`Ledger total (₹${ledgerTotal.toFixed(2)}) must match employee amount (₹${numericAmount.toFixed(2)})`, 'error');
        return;
      }
    }

    const entryData = {
      id: Date.now(),
      nameOfEmployee: currentEmployeeEntry.nameOfEmployee,
      designation: currentEmployeeEntry.designation || '',
      section: currentEmployeeEntry.section || '',
      monthYear: currentEmployeeEntry.monthYear || '',
      employeeAmount: numericAmount,
      ledgerEntries: showLedgerDetails ? currentEmployeeLedgers : []
    };

    setEmployeeEntries(prev => [...prev, entryData]);
    setCurrentEmployeeEntry({
      nameOfEmployee: '',
      designation: '',
      section: '',
      monthYear: '',
      employeeAmount: ''
    });
    setCurrentEmployeeLedgers([]);
    showToast('Employee entry added successfully', 'success');
  };

  const editEmployeeEntry = (entry) => {
    setCurrentEmployeeEntry({
      nameOfEmployee: entry.nameOfEmployee,
      designation: entry.designation,
      section: entry.section,
      monthYear: entry.monthYear,
      employeeAmount: entry.employeeAmount.toLocaleString('en-IN')
    });
    setCurrentEmployeeLedgers(entry.ledgerEntries || []);
    setShowLedgerDetails(entry.ledgerEntries && entry.ledgerEntries.length > 0);
    setEmployeeEntries(prev => prev.filter(item => item.id !== entry.id));
    showToast('Employee entry loaded for editing', 'info');
  };

  const deleteEmployeeEntry = async (entry) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Employee Entry',
      message: `Are you sure you want to delete entry for "${entry.nameOfEmployee}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });
    if (confirmed) {
      setEmployeeEntries(prev => prev.filter(item => item.id !== entry.id));
      showToast('Employee entry deleted successfully', 'success');
    }
  };

  const totalEmployeeAmount = employeeEntries.reduce((sum, entry) => sum + entry.employeeAmount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Employee Entry
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="nameOfEmployee"
                value={currentEmployeeEntry.nameOfEmployee}
                onChange={handleEmployeeChange}
                placeholder="Enter employee name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="designation"
                value={currentEmployeeEntry.designation}
                onChange={handleEmployeeChange}
                placeholder="Enter designation"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="section"
                value={currentEmployeeEntry.section}
                onChange={handleEmployeeChange}
                placeholder="Enter section"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month/Year
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="monthYear"
                value={currentEmployeeEntry.monthYear}
                onChange={handleEmployeeChange}
                placeholder="e.g., Jan 2024"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="employeeAmount"
                value={currentEmployeeEntry.employeeAmount}
                onChange={handleEmployeeChange}
                placeholder="0.00"
                disabled={showLedgerDetails}
                className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  showLedgerDetails ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                title={showLedgerDetails ? 'Auto-calculated from ledger entries' : ''}
              />
            </div>
            {showLedgerDetails && (
              <p className="text-xs text-blue-600 mt-1">
                Auto-calculated from ledger total
              </p>
            )}
          </div>
        </div>
        
        {/* Toggle for Additional Ledger Details */}
        <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-700">
                Add More Ledger Details?
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="showLedgerDetails"
                  checked={!showLedgerDetails}
                  onChange={() => {
                    setShowLedgerDetails(false);
                    setCurrentEmployeeLedgers([]);
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="showLedgerDetails"
                  checked={showLedgerDetails}
                  onChange={() => setShowLedgerDetails(true)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
            </div>
          </div>
          
          {showLedgerDetails && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Add up to 10 ledger entries. The total of all ledger amounts must match the employee amount above.
              </p>
            </div>
          )}
        </div>
        
        {/* Ledger Entries Section */}
        {showLedgerDetails && (
          <div className="mt-4">
            <EmployeeLedgerEntries
              ledgers={ledgers}
              onLedgerEntriesChange={handleLedgerEntriesChange}
              showToast={showToast}
              initialEntries={currentEmployeeLedgers}
            />
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={addEmployeeEntry}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {employeeEntries.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
            <h4 className="text-lg font-semibold text-white flex items-center justify-between">
              <span className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Employee Entries ({employeeEntries.length})
              </span>
              <span className="text-blue-100">
                Total: ₹{totalEmployeeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month/Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ledgers</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeeEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.nameOfEmployee}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.designation || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.section || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{entry.monthYear || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{entry.employeeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.ledgerEntries && entry.ledgerEntries.length > 0 ? (
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                          {entry.ledgerEntries.length} ledgers
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editEmployeeEntry(entry)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit Entry"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteEmployeeEntry(entry)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Delete Entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <span className="text-lg font-semibold text-gray-900">
              Multiple Employee Summary
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Employees: {employeeEntries.length}</p>
            <p className="text-lg font-bold text-green-600">
              Total Amount: ₹{totalEmployeeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        
        {employeeEntries.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> These employee entries will be saved with your journal voucher. 
              Make sure to add corresponding debit and credit entries that match this total amount.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleEmployeeEntry;