import React, { useState, useEffect, useRef } from 'react';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { employeeService } from "../../services/realServices";
import { User, Building, Calendar, DollarSign, Plus, Edit3, Trash2, CheckCircle } from 'lucide-react';

const MultipleEmployeeEntry = ({ formData, onChange, showToast, showConfirmDialog, onEmployeeEntriesChange, initialEmployeeEntries = [] }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeEntries, setEmployeeEntries] = useState(initialEmployeeEntries);
  const [currentEmployeeEntry, setCurrentEmployeeEntry] = useState({
    employeeId: '',
    nameOfEmployee: '',
    designation: '',
    section: '',
    monthYear: '',
    employeeAmount: ''
  });

  // Keep callback ref stable — avoids stale closure without causing re-render loops
  const onChangeRef = useRef(onEmployeeEntriesChange);
  useEffect(() => { onChangeRef.current = onEmployeeEntriesChange; });

  useEffect(() => {
    loadEmployees();
  }, []);

  // Only sync from parent on initial mount (for edit mode pre-population)
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      if (initialEmployeeEntries && initialEmployeeEntries.length > 0) {
        setEmployeeEntries(initialEmployeeEntries);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Notify parent when entries change — use ref to avoid dependency on callback identity
  useEffect(() => {
    if (onChangeRef.current) {
      onChangeRef.current(employeeEntries);
    }
  }, [employeeEntries]);

  const loadEmployees = async () => {
    try {
      const result = await employeeService.getAll();
      setEmployees(result.success ? (result.data || []) : []);
    } catch (error) {
      setEmployees([]);
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.empId} - ${emp.employeeName}`,
    description: `${emp.designation} | ${emp.section}`,
    employee: emp
  }));

  const handleEmployeeSelect = (e) => {
    const selectedId = e.target.value;
    const option = employeeOptions.find(opt => opt.value === selectedId);
    if (option) {
      setCurrentEmployeeEntry(prev => ({
        ...prev,
        employeeId: selectedId,
        nameOfEmployee: option.employee.employeeName,
        designation: option.employee.designation || '',
        section: option.employee.section || '',
      }));
    } else {
      setCurrentEmployeeEntry(prev => ({
        ...prev,
        employeeId: '',
        nameOfEmployee: '',
        designation: '',
        section: '',
      }));
    }
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'employeeAmount') {
      const numericValue = value.replace(/,/g, '');
      if (!isNaN(numericValue) && numericValue !== '') {
        setCurrentEmployeeEntry(prev => ({ ...prev, [name]: parseFloat(numericValue).toLocaleString('en-IN') }));
      } else {
        setCurrentEmployeeEntry(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setCurrentEmployeeEntry(prev => ({ ...prev, [name]: value }));
    }
  };

  const addEmployeeEntry = () => {
    if (!currentEmployeeEntry.nameOfEmployee?.trim()) {
      showToast('Please select an employee', 'error');
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

    const entryData = {
      id: Date.now(),
      employeeId: currentEmployeeEntry.employeeId,
      nameOfEmployee: currentEmployeeEntry.nameOfEmployee,
      designation: currentEmployeeEntry.designation || '',
      section: currentEmployeeEntry.section || '',
      monthYear: currentEmployeeEntry.monthYear || '',
      employeeAmount: numericAmount
    };

    setEmployeeEntries(prev => [...prev, entryData]);
    setCurrentEmployeeEntry({
      employeeId: '',
      nameOfEmployee: '',
      designation: '',
      section: '',
      monthYear: '',
      employeeAmount: ''
    });
    showToast('Employee entry added successfully', 'success');
  };

  const editEmployeeEntry = (entry) => {
    setCurrentEmployeeEntry({
      employeeId: entry.employeeId || '',
      nameOfEmployee: entry.nameOfEmployee,
      designation: entry.designation,
      section: entry.section,
      monthYear: entry.monthYear,
      employeeAmount: entry.employeeAmount.toLocaleString('en-IN')
    });
    setEmployeeEntries(prev => prev.filter(item => item.id !== entry.id));
    showToast('Employee entry loaded for editing', 'info');
  };

  const deleteEmployeeEntry = async (entry) => {
    const confirmed = await showConfirmDialog(
      'Delete Employee Entry',
      `Are you sure you want to delete entry for "${entry.nameOfEmployee}"?`,
      'Delete',
      'Cancel'
    );
    if (confirmed) {
      setEmployeeEntries(prev => prev.filter(item => item.id !== entry.id));
      showToast('Employee entry deleted successfully', 'success');
    }
  };

  const totalEmployeeAmount = employeeEntries.reduce((sum, entry) => sum + entry.employeeAmount, 0);

  return (
    <div className="space-y-6">
      {/* Add Employee Form */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Employee Entry
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Employee selector dropdown */}
          <div className="md:col-span-3">
            <SearchableDropdown
              label="Employee Name"
              placeholder="Search and select employee..."
              searchPlaceholder="Search by ID, name, designation..."
              options={employeeOptions}
              value={currentEmployeeEntry.employeeId}
              onChange={handleEmployeeSelect}
              icon={User}
              emptyMessage="No employees found. Create employees first."
              maxHeight="220px"
            />
          </div>

          <FormField
            label="Designation"
            name="designation"
            value={currentEmployeeEntry.designation}
            onChange={handleEmployeeChange}
            placeholder="Auto-filled from employee"
            icon={Building}
          />

          <FormField
            label="Section"
            name="section"
            value={currentEmployeeEntry.section}
            onChange={handleEmployeeChange}
            placeholder="Auto-filled from employee"
            icon={Building}
          />

          <FormField
            label="Month/Year"
            name="monthYear"
            value={currentEmployeeEntry.monthYear}
            onChange={handleEmployeeChange}
            placeholder="e.g., Jan 2024"
            icon={Calendar}
          />

          <FormField
            label="Amount (₹)"
            name="employeeAmount"
            value={currentEmployeeEntry.employeeAmount}
            onChange={handleEmployeeChange}
            placeholder="0.00"
            icon={DollarSign}
            textAlign="right"
          />
        </div>

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

      {/* Employee Entries List */}
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

      {/* Summary Card */}
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
              <strong>Note:</strong> These employee entries will be saved with your advance/deposit record.
              Make sure the total amount matches your transaction amount.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleEmployeeEntry;
