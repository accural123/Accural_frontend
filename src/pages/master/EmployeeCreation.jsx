import React, { useState, useEffect } from 'react';
import { Users, User, Briefcase, Building, Wallet, CreditCard, Eye, Edit, Trash2, Plus, Save, FileText, UserCheck } from 'lucide-react';
import SearchableRecords from '../../components/common/SearchableRecords';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown";
import { employeeService, fundService } from "../../services/realServices";
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/common/Pagination';
const EmployeeCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    empId: '',
    employeeName: '',
    designation: '',
    section: '',
    fundType: '',
    pfCpsNo: ''
  });

  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [funds, setFunds] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', designation: '', section: '', fundType: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const { executeApi, loading, error, clearError } = useApiService();

  // Section options for dropdown
  const sectionOptions = [
    { value: 'general', label: 'General Section', description: 'General administrative tasks and operations' },
    { value: 'admin', label: 'Admin Section', description: 'Administrative management and coordination' },
    { value: 'finance', label: 'Finance Section', description: 'Financial management and accounting' },
    { value: 'establishment', label: 'Establishment Section', description: 'Human resources and establishment matters' },
    { value: 'revenue', label: 'Revenue Section', description: 'Revenue collection and management' },
    { value: 'water_supply', label: 'Water Supply Section', description: 'Water supply management and operations' },
    { value: 'engineering', label: 'Engineering Section', description: 'Engineering projects and infrastructure' },
    { value: 'town_planning', label: 'Town Planning Section', description: 'Urban planning and development' },
    { value: 'public_health', label: 'Public Health Section', description: 'Public health and sanitation' },
    { value: 'other', label: 'Other Section', description: 'Other departments and sections' }
  ];

  useEffect(() => {
    loadEmployees();
    loadFunds();
  }, []);

  const loadEmployees = async () => {
    const result = await executeApi(employeeService.getAll);
    if (result.success) {
      setEmployees(result.data || []);
    }
  };

  const loadFunds = async () => {
    const result = await executeApi(fundService.getAll);
    if (result.success) {
      setFunds(result.data || []);
    }
  };

  // Convert funds to SearchableDropdown format
  const fundOptions = funds.map(fund => ({
    value: fund.id,
    label: fund.fundName,
    description: `Created: ${fund.createdDate || 'N/A'} | Status: ${fund.status || 'Active'}`
  }));

  const validateForm = () => {
    const newErrors = {};

    if (!formData.empId.trim()) {
      newErrors.empId = 'Employee ID is required';
    }

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.section || !formData.section.toString().trim()) {
      newErrors.section = 'Section selection is required';
    }

    if (!formData.fundType || !formData.fundType.toString().trim()) {
      newErrors.fundType = 'Fund type selection is required';
    }

    if (!formData.pfCpsNo.trim()) {
      newErrors.pfCpsNo = 'PF/CPS Number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let transformedValue = value;
    if (name === 'empId') {
      transformedValue = value.toUpperCase();
    } else if (name === 'pfCpsNo') {
      transformedValue = value.replace(/[^A-Za-z0-9]/g, '');
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: transformedValue
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
    
    setFormData(prevData => ({
      ...prevData,
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    clearError();
    
    try {
      let result;
      
      if (editingId) {
        result = await executeApi(employeeService.update, editingId, formData);
      } else {
        result = await executeApi(employeeService.create, formData);
      }

      if (result.success) {
        const message = editingId ? 'Employee updated successfully!' : 'Employee created successfully!';
        showToast(message, 'success');
        resetForm();
        await loadEmployees();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
      showToast('Error saving employee. Please try again.', 'error');
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
      empId: '',
      employeeName: '',
      designation: '',
      section: '',
      fundType: '',
      pfCpsNo: ''
    });
    setErrors({});
    setEditingId(null);
    clearError();
  };

  const handleEdit = (employee) => {
    setFormData({
      empId: employee.empId || '',
      employeeName: employee.employeeName || '',
      designation: employee.designation || '',
      section: employee.section || '',
      fundType: employee.fundType || '',
      pfCpsNo: employee.pfCpsNo || ''
    });
    setEditingId(employee.id);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const employee = employees.find(emp => emp.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Employee',
    message: `Are you sure you want to delete employee "${employee?.name || 'this employee'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(employeeService.delete, id);
    if (result.success) {
      showToast(result.message || 'Employee deleted successfully!', 'success');
      await loadEmployees();
    } else {
      showToast(result.message || 'Failed to delete employee!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this employee?')) {
  //     const result = await executeApi(employeeService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Employee deleted successfully!', 'success');
  //       await loadEmployees();
  //     } else {
  //       showToast(result.message || 'Failed to delete employee!', 'error');
  //     }
  //   }
  // };

  const normalizeStr = (str) => str?.replace(/\u00A0/g, ' ') || '';
  const filteredEmployees = employees.filter(employee => {
    const f = searchFilters;
    const s = normalizeStr(f.searchTerm).toLowerCase();
    const searchMatch = !s ||
      normalizeStr(employee.empId).toLowerCase().includes(s) ||
      normalizeStr(employee.employeeName).toLowerCase().includes(s) ||
      normalizeStr(employee.designation).toLowerCase().includes(s) ||
      normalizeStr(employee.pfCpsNo).toLowerCase().includes(s);
    const designationMatch = !f.designation || employee.designation?.toLowerCase().includes(f.designation.toLowerCase());
    const sectionMatch = !f.section || employee.section === f.section;
    const fundTypeMatch = !f.fundType || employee.fundType === f.fundType;
    return searchMatch && designationMatch && sectionMatch && fundTypeMatch;
  });

  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = () => {
    if (paginatedEmployees.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedEmployees.map(item => item.id)));
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
        const result = await executeApi(employeeService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadEmployees();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  // Get section label for display
  const getSectionLabel = (value) => {
    const found = sectionOptions.find(section => section.value === value);
    return found ? found.label : value;
  };

  // Get fund name for display
  const getFundName = (fundId) => {
    const fund = funds.find(f => f.id === fundId);
    return fund ? fund.fundName : fundId;
  };

  return (
    <div className="space-y-6">
      <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Employee' : 'Employee Creation'}
            </h1>
            <p className="text-slate-600">Create and manage employee records</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Total Employees: {employees.length}
            </span>
          </div>
          <button
            onClick={() => setShowTable(!showTable)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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

      {/* Employee Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Employee Details' : 'Employee Details'}
            </h2>
          </div>
          
          <div className="p-6 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-500" />
                  Employee Information
                </h3>
              </div>

              <FormField
                label="Employee ID"
                name="empId"
                value={formData.empId}
                onChange={handleChange}
                required
                error={errors.empId}
                icon={UserCheck}
                placeholder="Enter employee ID (e.g., EMP001)"
              />

              <FormField
                label="Name of the Employee"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
                error={errors.employeeName}
                icon={User}
                placeholder="Enter employee full name"
              />

              <FormField
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                error={errors.designation}
                icon={Briefcase}
                placeholder="Enter designation (e.g., Manager, Clerk)"
              />
              
              <SearchableDropdown
                label="Section"
                placeholder="Select Section"
                searchPlaceholder="Search sections..."
                options={sectionOptions}
                value={formData.section}
                onChange={handleDropdownChange('section')}
                required
                error={errors.section}
                icon={Building}
                emptyMessage="No sections available"
                maxHeight="250px"
              />

              <SearchableDropdown
                label="Fund Type"
                placeholder="Select Fund Type"
                searchPlaceholder="Search fund types..."
                options={fundOptions}
                value={formData.fundType}
                onChange={handleDropdownChange('fundType')}
                required
                error={errors.fundType}
                icon={Wallet}
                emptyMessage="No fund types available. Please create a fund first."
                maxHeight="250px"
              />

              <FormField
                label="PF/CPS No"
                name="pfCpsNo"
                value={formData.pfCpsNo}
                onChange={handleChange}
                required
                error={errors.pfCpsNo}
                icon={CreditCard}
                placeholder="Enter PF/CPS number"
              />
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
                className="px-8 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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

      {/* Employees List */}
      {showTable && (
        <SearchableRecords
          title="Employee Records"
          totalRecords={filteredEmployees.length}
          searchFilters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          loading={loading}
          gradientFrom="from-indigo-500"
          gradientTo="to-purple-500"
          searchPlaceholder="Search by ID, name, designation, PF/CPS..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            { key: 'designation', label: 'Designation', type: 'text', placeholder: 'Filter by designation' },
            {
              key: 'section',
              label: 'Section',
              type: 'select',
              options: [
                { value: '', label: 'All Sections' },
                { value: 'general', label: 'General Section' },
                { value: 'admin', label: 'Admin Section' },
                { value: 'finance', label: 'Finance Section' },
                { value: 'establishment', label: 'Establishment Section' },
                { value: 'revenue', label: 'Revenue Section' },
                { value: 'water_supply', label: 'Water Supply Section' },
                { value: 'engineering', label: 'Engineering Section' },
                { value: 'town_planning', label: 'Town Planning Section' },
                { value: 'public_health', label: 'Public Health Section' },
                { value: 'other', label: 'Other Section' },
              ],
            },
            {
              key: 'fundType',
              label: 'Fund Type',
              type: 'select',
              options: [
                { value: '', label: 'All Funds' },
                ...funds.map(f => ({ value: f.id, label: f.fundName })),
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
                      checked={paginatedEmployees.length > 0 && paginatedEmployees.every(item => selectedIds.has(item.id))}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">PF/CPS No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(employee.id)}
                        onChange={() => handleSelectItem(employee.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4"><div className="text-sm font-medium text-slate-900">{employee.empId}</div></td>
                    <td className="px-6 py-4"><div className="text-sm font-medium text-slate-900">{employee.employeeName}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-slate-900">{employee.designation}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-slate-900">{getSectionLabel(employee.section)}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-slate-900">{getFundName(employee.fundType)}</div></td>
                    <td className="px-6 py-4"><div className="text-sm text-slate-900">{employee.pfCpsNo}</div></td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:text-blue-900 p-1 rounded" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(employee.id)} className="text-red-600 hover:text-red-900 p-1 rounded" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No employees found matching your filters.</p>
                <button onClick={() => setShowTable(false)} className="text-purple-600 hover:text-purple-800 text-sm font-medium mt-2">
                  Create your first employee →
                </button>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={PAGE_SIZE} totalItems={filteredEmployees.length} />
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

export default EmployeeCreation;