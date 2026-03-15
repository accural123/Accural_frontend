import React, { useState, useEffect } from 'react';
import { Wallet, Search, Edit, Trash2, Eye, Plus, Save } from 'lucide-react';
import { fundService } from "../../services/realServices"; // Change this import when backend is ready
import { useApiService } from "../../hooks/useApiService";
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import SearchableRecords from '../../components/common/SearchableRecords';
const FundCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const [formData, setFormData] = useState({
    fundName: ''
  });

  const [errors, setErrors] = useState({});
  const [funds, setFunds] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', dateFrom: '', dateTo: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { executeApi, loading, error, clearError } = useApiService();

  // Load funds from localStorage on component mount
  useEffect(() => {
    loadFunds();
  }, []);

 const loadFunds = async () => {
  try {
    const result = await executeApi(fundService.getAll); 
    if (result.success) {
      setFunds(result.data || []);
    }
  } catch (error) {
    console.error('Error loading funds:', error);
    setFunds([]);
  }
};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fundName.trim()) {
      newErrors.fundName = 'Fund name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setSubmitLoading(true);

  try {
    const submissionData = {
      ...formData,
      id: editingId || Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      // status: 'Active'
    };

    let result;

    if (editingId) {
      result = await executeApi(() => fundService.update(editingId, submissionData));
      showToast('Fund updated successfully!', 'success');
    } else {
      result = await executeApi(() => fundService.create(submissionData));
      showToast('Fund created successfully!', 'success');
    }

    if (result.success) {
      // reload from service so UI matches data source
      loadFunds();
      resetForm();
    } else {
      showToast(result.message || 'Error saving fund.', 'error');
    }
  } catch (error) {
    console.error('Error saving fund:', error);
    showToast('Error saving fund. Please try again.', 'error');
  } finally {
    setSubmitLoading(false);
  }
};


  // const handleSubmit = (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setSubmitLoading(true);
    
  //   try {
  //     const submissionData = {
  //       ...formData,
  //       id: editingId || Date.now().toString(),
  //       createdDate: new Date().toISOString().split('T')[0],
  //       status: 'Active'
  //     };

  //     let updatedFunds;
  //     if (editingId) {
  //       updatedFunds = funds.map(fund => 
  //         fund.id === editingId ? { ...submissionData, id: editingId } : fund
  //       );
  //       showToast('Fund updated successfully!', 'success');
  //     } else {
  //       updatedFunds = [...funds, submissionData];
  //       showToast('Fund created successfully!', 'success');
  //     }

  //     localStorage.setItem('funds', JSON.stringify(updatedFunds));
  //     setFunds(updatedFunds);
  //     resetForm();
  //   } catch (error) {
  //     console.error('Error saving fund:', error);
  //     showToast('Error saving fund. Please try again.', 'error');
  //   } finally {
  //     setSubmitLoading(false);
  //   }
  // };

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
      fundName: ''
    });
    setErrors({});
    setEditingId(null);
  };

  const handleEdit = (fund) => {
    setFormData({
      fundName: fund.fundName || ''
    });
    setEditingId(fund.id);
    window.scrollTo(0, 0);
  };

  // const handleDelete = (id) => {
  //   if (window.confirm('Are you sure you want to delete this fund?')) {
  //     const updatedFunds = funds.filter(fund => fund.id !== id);
  //     localStorage.setItem('funds', JSON.stringify(updatedFunds));
  //     setFunds(updatedFunds);
  //     showToast('Fund deleted successfully!', 'success');
  //   }
  // };
const handleDelete = async (id) => {
  const fund = funds.find(f => f.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Fund',
    message: `Are you sure you want to delete the fund "${fund?.fundName || 'this fund'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await fundService.delete(id);
    if (result.success) {
      setFunds(prev => prev.filter(f => f.id !== id));
      showToast('Fund deleted successfully!', 'success');
    } else {
      showToast(result.message || 'Failed to delete fund', 'error');
    }
  }
};
  // Filter funds locally
  const filteredFunds = funds.filter(fund => {
    const f = searchFilters;
    const searchMatch = !f.searchTerm || fund.fundName?.toLowerCase().includes(f.searchTerm.toLowerCase());
    const dateFromMatch = !f.dateFrom || fund.createdDate >= f.dateFrom;
    const dateToMatch = !f.dateTo || fund.createdDate <= f.dateTo;
    return searchMatch && dateFromMatch && dateToMatch;
  });

  const handleSelectAll = () => {
    if (filteredFunds.every(item => selectedIds.has(item.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredFunds.map(item => item.id)));
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
        const result = await fundService.delete(id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadFunds();
      showToast(`${count} record(s) deleted successfully!`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Wallet className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {editingId ? 'Edit Fund' : 'Fund Creation'}
              </h1>
              <p className="text-slate-600">
                Create and manage investment funds
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">
                Total Funds: {funds.length}
              </span>
            </div>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>All Funds</span>
            </button>
            {editingId && (
              <button
                onClick={() => resetForm()}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </button>
            )}
          </div>
        </div>

        {/* Fund Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Fund Name' : 'Create New Fund'}
            </h2>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fund Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wallet className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="fundName"
                    value={formData.fundName}
                    onChange={handleChange}
                    placeholder="Enter fund name"
                    className={`block w-full pl-10 pr-4 py-3 bg-white/60 border ${
                      errors.fundName ? 'border-red-300' : 'border-slate-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors`}
                  />
                </div>
                {errors.fundName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fundName}</p>
                )}
              </div>
              
              <div className="flex justify-center space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  disabled={submitLoading}
                >
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitLoading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{submitLoading ? 'Saving...' : (editingId ? 'Update Fund' : 'Create Fund')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Funds List */}
        <SearchableRecords
          title="All Funds"
          totalRecords={filteredFunds.length}
          searchFilters={searchFilters}
          onFiltersChange={setSearchFilters}
          loading={false}
          gradientFrom="from-green-500"
          gradientTo="to-emerald-500"
          searchPlaceholder="Search funds by name..."
          filterConfig={{ dateRange: true, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
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
                      checked={filteredFunds.length > 0 && filteredFunds.every(item => selectedIds.has(item.id))}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fund Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {filteredFunds.map((fund) => (
                  <tr key={fund.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(fund.id)}
                        onChange={() => handleSelectItem(fund.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Wallet className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-slate-900">{fund.fundName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{fund.createdDate}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(fund)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(fund.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredFunds.length === 0 && (
              <div className="text-center py-8">
                <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">{searchFilters.searchTerm || searchFilters.dateFrom || searchFilters.dateTo ? 'No funds found matching your filters.' : 'No funds created yet.'}</p>
                {!searchFilters.searchTerm && !searchFilters.dateFrom && !searchFilters.dateTo && (
                  <p className="text-green-600 text-sm font-medium mt-2">Create your first fund using the form above ↑</p>
                )}
              </div>
            )}
          </div>
        </SearchableRecords>
      </div>
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

export default FundCreation;
// import React, { useState, useEffect } from 'react';
// import { Wallet, Search, Edit, Trash2, Eye, Plus, Save, AlertCircle } from 'lucide-react';
// // import { fundService } from "../../services/apiServices"; // Changed to apiServices
// import { useApiService } from "../../hooks/useApiService";
// import { fundService } from "../../services/realServices"; // Keep for now
// const FundCreation = () => {
//   const [formData, setFormData] = useState({
//     fundName: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingId, setEditingId] = useState(null);
  
//   // Use the hook's data state instead of local funds state
//   const { executeApi, loading, error, data: funds, clearError, reset } = useApiService();

//   useEffect(() => {
//     loadFunds();
//     return () => reset(); // Cleanup on unmount
//   }, []);

//   const loadFunds = async () => {
//     await executeApi(fundService.getAll);
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.fundName.trim()) {
//       newErrors.fundName = 'Fund name is required';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     const submissionData = {
//       ...formData,
//       createdDate: new Date().toISOString().split('T')[0]
//     };

//     let result;
//     if (editingId) {
//       result = await executeApi(fundService.update, editingId, submissionData);
//     } else {
//       result = await executeApi(fundService.create, submissionData);
//     }

//     if (result.success) {
//       showToast(editingId ? 'Fund updated successfully!' : 'Fund created successfully!', 'success');
//       await loadFunds(); // Reload fresh data
//       resetForm();
//     } else {
//       showToast(result.message || 'Error saving fund.', 'error');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this fund?')) return;

//     const result = await executeApi(fundService.delete, id);
    
//     if (result.success) {
//       showToast('Fund deleted successfully!', 'success');
//       await loadFunds(); // Reload after delete
//     } else {
//       showToast(result.message || 'Error deleting fund.', 'error');
//     }
//   };

//   const showToast = (message, type) => {
//     const toast = document.createElement('div');
//     toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
//       type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//     }`;
//     toast.textContent = message;
//     document.body.appendChild(toast);
//     setTimeout(() => toast.remove(), 3000);
//   };

//   const resetForm = () => {
//     setFormData({ fundName: '' });
//     setErrors({});
//     setEditingId(null);
//   };

//   const handleEdit = (fund) => {
//     setFormData({ fundName: fund.fundName || '' });
//     setEditingId(fund.id);
//     window.scrollTo(0, 0);
//   };

//   // Safe filtering with null check
//   const filteredFunds = (funds || []).filter(fund =>
//     fund.fundName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Error Alert */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
//             <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
//             <div className="flex-1">
//               <p className="text-sm text-red-800">{error}</p>
//               <button
//                 onClick={clearError}
//                 className="text-xs text-red-600 hover:text-red-800 mt-1 underline"
//               >
//                 Dismiss
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
//               <Wallet className="h-4 w-4 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-slate-800">
//                 {editingId ? 'Edit Fund' : 'Fund Creation'}
//               </h1>
//               <p className="text-slate-600">Create and manage investment funds</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
//               <Wallet className="h-4 w-4 text-green-600" />
//               <span className="text-sm font-semibold text-green-800">
//                 Total Funds: {funds?.length || 0}
//               </span>
//             </div>
//             {editingId && (
//               <button
//                 onClick={resetForm}
//                 className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Add New</span>
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Fund Form */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
//           <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
//             <h2 className="text-xl font-semibold text-white">
//               {editingId ? 'Edit Fund Name' : 'Create New Fund'}
//             </h2>
//           </div>
          
//           <form onSubmit={handleSubmit} className="p-8">
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   Fund Name <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Wallet className="h-4 w-4 text-slate-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="fundName"
//                     value={formData.fundName}
//                     onChange={handleChange}
//                     placeholder="Enter fund name"
//                     disabled={loading}
//                     className={`block w-full pl-10 pr-4 py-3 bg-white/60 border ${
//                       errors.fundName ? 'border-red-300' : 'border-slate-300'
//                     } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
//                   />
//                 </div>
//                 {errors.fundName && (
//                   <p className="mt-1 text-sm text-red-600">{errors.fundName}</p>
//                 )}
//               </div>
              
//               <div className="flex justify-center space-x-4 pt-4">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   disabled={loading}
//                   className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   ) : (
//                     <Save className="h-4 w-4" />
//                   )}
//                   <span>{loading ? 'Saving...' : (editingId ? 'Update Fund' : 'Create Fund')}</span>
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Funds List */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
//           <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-white">
//                 All Funds ({funds?.length || 0})
//               </h2>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search funds..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {loading && !funds ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//               <p className="text-slate-600 mt-4">Loading funds...</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                       Fund Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                       Created Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white/40 divide-y divide-slate-200">
//                   {filteredFunds.map((fund) => (
//                     <tr key={fund.id} className="hover:bg-white/60 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <Wallet className="h-4 w-4 text-green-600 mr-2" />
//                           <span className="text-sm font-medium text-slate-900">
//                             {fund.fundName}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-slate-900">{fund.createdDate}</div>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium space-x-2">
//                         <button
//                           onClick={() => handleEdit(fund)}
//                           disabled={loading}
//                           className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
//                           title="Edit"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(fund.id)}
//                           disabled={loading}
//                           className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
//                           title="Delete"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
          
//           {!loading && filteredFunds.length === 0 && (
//             <div className="text-center py-8">
//               <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//               <p className="text-slate-500">
//                 {searchTerm ? 'No funds found matching your search.' : 'No funds created yet.'}
//               </p>
//               {!searchTerm && (
//                 <p className="text-green-600 text-sm font-medium mt-2">
//                   Create your first fund using the form above ↑
//                 </p>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FundCreation;