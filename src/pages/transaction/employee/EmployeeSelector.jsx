import React, { useState, useEffect } from 'react';
import { User, Users, Plus, Trash2, Search, Calendar, DollarSign, BookOpen, Minus, Edit3, AlertTriangle } from 'lucide-react';
import SearchableDropdown from '../../../components/common/SearchableDropdown';
import { FormField } from '../../../components/common/FormField';

import { employeeService } from "../../../services/realServices";
import { useApiService } from '../../../hooks/useApiService';

const EmployeeSelector = ({ 
  onEmployeeEntriesChange, 
  initialEmployeeEntries = [], 
  showToast,
  showConfirmDialog,
  ledgers = []
}) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(initialEmployeeEntries);
  const [currentEntry, setCurrentEntry] = useState({
    employeeId: '',
    monthYear: '',
    employeeAmount: '',
    remarks: '',
    ledgerEntries: []
  });
  const [currentLedgerEntry, setCurrentLedgerEntry] = useState({
    ledgerCode: '',
    ledgerName: '',
    amount: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showLedgerDetails, setShowLedgerDetails] = useState(false);

  const { executeApi, loading } = useApiService();

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    onEmployeeEntriesChange(selectedEmployees);
  }, [selectedEmployees, onEmployeeEntriesChange]);

  const loadEmployees = async () => {
    try {
      const result = await employeeService.getAll();
      const employeesList = result.success ? (result.data || []) : [];
      setEmployees(employeesList);
      if (employeesList.length === 0) {
        showToast('No employees found. Please create employees first.', 'warning');
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      showToast('Failed to load employees', 'error');
      setEmployees([]);
    }
  };

  const getLedgerTotal = () => {
    return currentEntry.ledgerEntries.reduce((sum, entry) => sum + entry.amount, 0);
  };

  const getRemainingAmount = () => {
    if (!currentEntry.employeeAmount) return 0;
    const mainAmount = parseFloat(currentEntry.employeeAmount.replace(/,/g, ''));
    const ledgerTotal = getLedgerTotal();
    return mainAmount - ledgerTotal;
  };

  // Convert ledgers to dropdown format and remove duplicates
  const uniqueLedgers = ledgers.filter((ledger, index, self) => 
    index === self.findIndex(l => l.code === ledger.code)
  );
  
  const ledgerOptions = uniqueLedgers.map((ledger, index) => ({
    value: ledger.code,
    label: `${ledger.code} - ${ledger.name}`,
    description: `${ledger.category} | ${ledger.name}`,
    ledger: ledger
  }));

  const handleLedgerSelect = (e) => {
    const ledgerCode = e.target.value;
    const selectedLedger = ledgers.find(ledger => ledger.code === ledgerCode);
    
    if (selectedLedger) {
      setCurrentLedgerEntry(prev => ({
        ...prev,
        ledgerCode,
        ledgerName: selectedLedger.name,
        amount: ''
      }));
    }
  };

  const handleLedgerAmountChange = (e) => {
    const { value } = e.target;
    let formattedValue = value;
    
    if (value) {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        formattedValue = parseFloat(numericValue).toLocaleString('en-IN');
      }
    }
    
    setCurrentLedgerEntry(prev => ({
      ...prev,
      amount: formattedValue
    }));
  };

  const addLedgerEntry = () => {
    if (!currentEntry.employeeAmount) {
      showToast('Please enter the main employee amount first', 'error');
      return;
    }

    if (!currentLedgerEntry.ledgerCode) {
      showToast('Please select a ledger', 'error');
      return;
    }

    if (!currentLedgerEntry.amount) {
      showToast('Ledger amount is required', 'error');
      return;
    }

    const numericAmount = parseFloat(currentLedgerEntry.amount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Ledger amount must be greater than 0', 'error');
      return;
    }

    // Check if ledger already exists
    const existingLedger = currentEntry.ledgerEntries.find(entry => 
      entry.ledgerCode === currentLedgerEntry.ledgerCode
    );

    if (existingLedger) {
      showToast('Ledger already added', 'error');
      return;
    }

    // Check if adding this amount would exceed the main amount
    const mainAmount = parseFloat(currentEntry.employeeAmount.replace(/,/g, ''));
    const currentLedgerTotal = getLedgerTotal();
    const newTotal = currentLedgerTotal + numericAmount;

    if (newTotal > mainAmount) {
      const remainingAmount = mainAmount - currentLedgerTotal;
      showToast(
        `Cannot add ₹${numericAmount.toLocaleString('en-IN')}. Only ₹${remainingAmount.toLocaleString('en-IN')} remaining from main amount of ₹${mainAmount.toLocaleString('en-IN')}`, 
        'error'
      );
      return;
    }

    const newLedgerEntry = {
      id: Date.now(),
      ledgerCode: currentLedgerEntry.ledgerCode,
      ledgerName: currentLedgerEntry.ledgerName,
      amount: numericAmount
    };

    setCurrentEntry(prev => ({
      ...prev,
      ledgerEntries: [...prev.ledgerEntries, newLedgerEntry]
    }));

    setCurrentLedgerEntry({
      ledgerCode: '',
      ledgerName: '',
      amount: ''
    });

    // Show remaining amount info
    const finalRemaining = mainAmount - newTotal;
    if (finalRemaining > 0) {
      showToast(
        `Ledger entry added. Remaining amount: ₹${finalRemaining.toLocaleString('en-IN')}`, 
        'info'
      );
    } else {
      showToast('Ledger entry added. All amounts allocated!', 'success');
    }
  };

  const removeLedgerEntry = (ledgerEntryId) => {
    const updatedLedgerEntries = currentEntry.ledgerEntries.filter(entry => entry.id !== ledgerEntryId);
    
    setCurrentEntry(prev => ({
      ...prev,
      ledgerEntries: updatedLedgerEntries
    }));

    showToast('Ledger entry removed', 'info');
  };

  const editLedgerEntry = (ledgerEntry) => {
    // Load the ledger entry data into the current ledger form for editing
    setCurrentLedgerEntry({
      ledgerCode: ledgerEntry.ledgerCode,
      ledgerName: ledgerEntry.ledgerName,
      amount: ledgerEntry.amount.toLocaleString('en-IN')
    });

    // Remove the ledger entry from the list temporarily so it can be re-added after editing
    const updatedLedgerEntries = currentEntry.ledgerEntries.filter(entry => entry.id !== ledgerEntry.id);
    
    setCurrentEntry(prev => ({
      ...prev,
      ledgerEntries: updatedLedgerEntries
    }));

    showToast('Ledger entry loaded for editing', 'info');
  };

  // Convert employees to dropdown format
  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.empId} - ${emp.employeeName}- ${emp.designation}`,
    description: `  ${emp.section} | Fund: ${emp.fundType}`,
    employee: emp
  }));

  // Filter employees based on search
  const filteredEmployeeOptions = employeeOptions.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    const selectedOption = employeeOptions.find(opt => opt.value === employeeId);
    
    if (selectedOption) {
      setCurrentEntry(prev => ({
        ...prev,
        employeeId,
        employee: selectedOption.employee
      }));
    }
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    let formattedValue = value;
    
    if (value) {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        formattedValue = parseFloat(numericValue).toLocaleString('en-IN');
      }
    }
    
    setCurrentEntry(prev => ({
      ...prev,
      employeeAmount: formattedValue
    }));
  };

  const addEmployeeEntry = async () => {
    if (!currentEntry.employeeId) {
      showToast('Please select an employee', 'error');
      return;
    }

    if (!currentEntry.monthYear) {
      showToast('Month/Year is required', 'error');
      return;
    }

    if (!currentEntry.employeeAmount) {
      showToast('Employee amount is required', 'error');
      return;
    }

    const numericAmount = parseFloat(currentEntry.employeeAmount.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Amount must be greater than 0', 'error');
      return;
    }

    // If ledger details are shown, validate that all amounts are allocated
    if (showLedgerDetails) {
      if (currentEntry.ledgerEntries.length === 0) {
        showToast('Please add at least one ledger entry or disable ledger breakdown', 'error');
        return;
      }

      const ledgerTotal = getLedgerTotal();
      const remaining = numericAmount - ledgerTotal;
      
      if (remaining !== 0) {
        const message = remaining > 0 
          ? `Cannot proceed. ₹${remaining.toLocaleString('en-IN')} is not allocated to any ledger. Please add more ledger entries.`
          : `Cannot proceed. Ledger total (₹${ledgerTotal.toLocaleString('en-IN')}) exceeds main amount (₹${numericAmount.toLocaleString('en-IN')}) by ₹${Math.abs(remaining).toLocaleString('en-IN')}`;
        
        // Show confirmation dialog for remaining amount
        const confirmed = await showConfirmDialog(
          'Amount Mismatch',
          message + '\n\nDo you want to proceed anyway?',
          'Proceed',
          'Cancel'
        );

        if (!confirmed) {
          return;
        }
      }
    }

    // Check if employee already exists for the same month/year
    const existingEntry = selectedEmployees.find(emp => 
      emp.employeeId === currentEntry.employeeId && 
      emp.monthYear === currentEntry.monthYear
    );

    if (existingEntry) {
      showToast('Employee already exists for this month/year', 'error');
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === currentEntry.employeeId);
    
    const newEntry = {
      id: Date.now(),
      employeeId: currentEntry.employeeId,
      empId: selectedEmployee.empId,
      nameOfEmployee: selectedEmployee.employeeName,
      designation: selectedEmployee.designation,
      section: selectedEmployee.section,
      monthYear: currentEntry.monthYear,
      employeeAmount: numericAmount,
      remarks: currentEntry.remarks || '',
      fundType: selectedEmployee.fundType,
      pfCpsNo: selectedEmployee.pfCpsNo,
      ledgerEntries: currentEntry.ledgerEntries || []
    };

    setSelectedEmployees(prev => [...prev, newEntry]);
    setCurrentEntry({
      employeeId: '',
      monthYear: '',
      employeeAmount: '',
      remarks: '',
      ledgerEntries: []
    });
    setShowLedgerDetails(false);
    
    showToast('Employee entry added successfully', 'success');
  };

  const removeEmployeeEntry = async (entryId) => {
    const confirmed = await showConfirmDialog(
      'Remove Employee Entry',
      'Are you sure you want to remove this employee entry?',
      'Remove',
      'Cancel'
    );

    if (confirmed) {
      setSelectedEmployees(prev => prev.filter(emp => emp.id !== entryId));
      showToast('Employee entry removed successfully', 'success');
    }
  };

  const editEmployeeEntry = (employee) => {
    // Load the employee data into the current entry form for editing
    setCurrentEntry({
      employeeId: employee.employeeId,
      monthYear: employee.monthYear,
      employeeAmount: employee.employeeAmount.toLocaleString('en-IN'),
      remarks: employee.remarks || '',
      ledgerEntries: employee.ledgerEntries || [],
      employee: employees.find(emp => emp.id === employee.employeeId)
    });

    // Show ledger details if there are ledger entries
    if (employee.ledgerEntries && employee.ledgerEntries.length > 0) {
      setShowLedgerDetails(true);
    }

    // Remove the employee from the list so it can be re-added after editing
    setSelectedEmployees(prev => prev.filter(emp => emp.id !== employee.id));
    
    showToast('Employee entry loaded for editing', 'info');
  };

  const getTotalAmount = () => {
    return selectedEmployees.reduce((sum, emp) => sum + emp.employeeAmount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Employee Selection Form */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2" />
          Add Employee Entry
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <SearchableDropdown
              label="Select Employee"
              placeholder="Choose an employee"
              searchPlaceholder="Search by employee ID, name, or section..."
              options={filteredEmployeeOptions}
              value={currentEntry.employeeId}
              onChange={handleEmployeeSelect}
              required
              icon={User}
              emptyMessage="No employees found. Create employees first."
              maxHeight="200px"
            />
          </div>

          <FormField
            label="Month/Year"
            name="monthYear"
            type="month"
            value={currentEntry.monthYear}
            onChange={(e) => setCurrentEntry(prev => ({ ...prev, monthYear: e.target.value }))}
            required
            icon={Calendar}
          />

          <FormField
            label="Amount (₹)"
            name="employeeAmount"
            value={currentEntry.employeeAmount}
            onChange={handleAmountChange}
            required
            icon={DollarSign}
            placeholder="0.00"
          />

          <div className="md:col-span-2">
            <FormField
              label="Remarks (Optional)"
              name="remarks"
              value={currentEntry.remarks}
              onChange={(e) => setCurrentEntry(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Additional notes or remarks"
            />
          </div>

          {/* Ledger Details Toggle */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Add Ledger Breakdown?</span>
              <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="showLedgerDetails"
                    value="no"
                    checked={!showLedgerDetails}
                    onChange={() => {
                      setShowLedgerDetails(false);
                      setCurrentEntry(prev => ({ ...prev, ledgerEntries: [] }));
                    }}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">No</span>
                </label>
                <label className="flex items-center space-x-1">
                  <input
                    type="radio"
                    name="showLedgerDetails"
                    value="yes"
                    checked={showLedgerDetails}
                    onChange={() => setShowLedgerDetails(true)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">Yes</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ledger Entry Section */}
          {showLedgerDetails && (
            <>
              {/* Amount Status Display */}
              {currentEntry.employeeAmount && (
                <div className="md:col-span-2">
                  <div className={`border rounded-lg p-4 ${getRemainingAmount() === 0 ? 'bg-green-50 border-green-200' : getRemainingAmount() > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getRemainingAmount() !== 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        <span className="text-sm font-medium">
                          Main Amount: ₹{parseFloat(currentEntry.employeeAmount.replace(/,/g, '')).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          Allocated: ₹{getLedgerTotal().toLocaleString('en-IN')}
                        </div>
                        <div className={`text-sm font-medium ${getRemainingAmount() === 0 ? 'text-green-600' : getRemainingAmount() > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                          Remaining: ₹{getRemainingAmount().toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h5 className="text-md font-semibold text-yellow-800 mb-4 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Add Ledger Entries
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SearchableDropdown
                    label="Ledger Code"
                    placeholder="Select ledger"
                    searchPlaceholder="Search ledgers..."
                    options={ledgerOptions}
                    value={currentLedgerEntry.ledgerCode}
                    onChange={handleLedgerSelect}
                    required
                    icon={BookOpen}
                    emptyMessage="No ledgers available"
                  />
                  
                  <FormField
                    label="Ledger Name"
                    value={currentLedgerEntry.ledgerName}
                    disabled
                    placeholder="Auto-filled"
                    className="bg-gray-100"
                  />
                  
                  <FormField
                    label="Amount (₹)"
                    name="ledgerAmount"
                    value={currentLedgerEntry.amount}
                    onChange={handleLedgerAmountChange}
                    required
                    icon={DollarSign}
                    placeholder={getRemainingAmount() > 0 ? `Max: ${getRemainingAmount().toLocaleString('en-IN')}` : "0.00"}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={addLedgerEntry}
                  disabled={!currentEntry.employeeAmount || getRemainingAmount() <= 0}
                  className="mt-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Ledger Entry</span>
                </button>
              </div>

              {/* Current Ledger Entries */}
              {currentEntry.ledgerEntries.length > 0 && (
                <div className="md:col-span-2">
                  <h6 className="text-sm font-semibold text-gray-700 mb-2">
                    Ledger Entries ({currentEntry.ledgerEntries.length}) - 
                    Total: ₹{getLedgerTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </h6>
                  <div className="space-y-2">
                    {currentEntry.ledgerEntries.map((ledgerEntry) => (
                      <div key={ledgerEntry.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {ledgerEntry.ledgerCode} - {ledgerEntry.ledgerName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-green-600">
                              ₹{ledgerEntry.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <button
                              onClick={() => editLedgerEntry(ledgerEntry)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                              title="Edit Ledger Entry"
                            >
                              <Edit3 className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => removeLedgerEntry(ledgerEntry.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                              title="Remove Ledger Entry"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={addEmployeeEntry}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Add Employee Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Employees List */}
      {selectedEmployees.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Selected Employees ({selectedEmployees.length})
              </h4>
              <div className="text-white font-semibold">
                Total: ₹{getTotalAmount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {employee.empId} - {employee.nameOfEmployee}
                        </div>
                        {employee.remarks && (
                          <div className="text-xs text-gray-500">{employee.remarks}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{employee.designation}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{employee.section}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{employee.monthYear}</td>
                    <td className="px-4 py-4 text-sm font-medium text-green-600">
                      ₹{employee.employeeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => editEmployeeEntry(employee)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Edit Employee Entry"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeEmployeeEntry(employee.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Remove Employee"
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

          {/* Summary Section */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedEmployees.length} employee{selectedEmployees.length !== 1 ? 's' : ''} selected
              </div>
              <div className="text-lg font-semibold text-gray-900">
                Total Amount: ₹{getTotalAmount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedEmployees.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No employees selected yet.</p>
          <p className="text-sm text-gray-400">Add employees using the form above.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeSelector;