
// import React, { useState, useEffect } from 'react';
// import { BookOpen, Users, DollarSign, Building, CreditCard, Eye, Search, Edit, Trash2, Plus, Save } from 'lucide-react';
// import { FormField } from "../../components/common/FormField";
// import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
// import { ledgerService } from "../../services/realServices"; // Change this import when backend is ready
// import { useApiService } from "../../hooks/useApiService";
// import { ErrorDisplay } from '../../components/common/ErrorDisplay';


// const LedgerCreation = () => {
//   const [formData, setFormData] = useState({
//     ledgerCode: '',
//     underGroup: '',
//     openingBalance: '',
//     accountHoldersName: '',
//     accountNo: '',
//     ifscCode: '',
//     bankName: '',
//     branchName: '',
//     nameOfScheme: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [ledgers, setLedgers] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showBankDetails, setShowBankDetails] = useState(false);
//   const [submitLoading, setSubmitLoading] = useState(false);

//   const { executeApi, loading, error, clearError } = useApiService();

//   // Convert group options to SearchableDropdown format
//   const groupOptions = [
//     { value: 'Bank Account', label: 'Bank Account', description: 'Bank accounts for cash transactions' },
//     { value: 'Cash', label: 'Cash', description: 'Cash in hand accounts' },
//     { value: 'Current Assets', label: 'Current Assets', description: 'Short-term assets convertible to cash' },
//     { value: 'Current Liabilities', label: 'Current Liabilities', description: 'Short-term debts and obligations' },
//     { value: 'Fixed Assets', label: 'Fixed Assets', description: 'Long-term tangible assets' },
//     { value: 'Income', label: 'Income', description: 'General income accounts' },
//     { value: 'Direct Income', label: 'Direct Income', description: 'Revenue directly from business operations' },
//     { value: 'Indirect Income', label: 'Indirect Income', description: 'Revenue from secondary sources' },
//     { value: 'Expenditure', label: 'Expenditure', description: 'General expense accounts' },
//     { value: 'Direct Expenses', label: 'Direct Expenses', description: 'Costs directly related to operations' },
//     { value: 'Indirect Expenses', label: 'Indirect Expenses', description: 'Overhead and administrative costs' },
//     { value: 'Loans & Advances', label: 'Loans & Advances', description: 'Money lent or advanced to others' },
//     { value: 'Deposits', label: 'Deposits', description: 'Security deposits and advance payments' },
//     { value: 'Sundry Debtors', label: 'Sundry Debtors', description: 'Customers who owe money' },
//     { value: 'Sundry Creditors', label: 'Sundry Creditors', description: 'Suppliers to whom money is owed' }
//   ];

//   useEffect(() => {
//     loadLedgers();
//   }, []);

//   const loadLedgers = async () => {
//     const result = await executeApi(ledgerService.getAll);
//     if (result.success) {
//       setLedgers(result.data || []);
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.ledgerCode.trim()) {
//       newErrors.ledgerCode = 'Ledger code is required';
//     }

//     if (!formData.underGroup.trim()) {
//       newErrors.underGroup = 'Under group is required';
//     }

//     if (!formData.openingBalance.trim()) {
//       newErrors.openingBalance = 'Opening balance is required';
//     } else if (isNaN(formData.openingBalance) || parseFloat(formData.openingBalance) < 0) {
//       newErrors.openingBalance = 'Opening balance must be a valid positive number';
//     }

//     if (showBankDetails) {
//       if (!formData.accountHoldersName.trim()) {
//         newErrors.accountHoldersName = 'Account holder name is required';
//       }

//       if (!formData.accountNo.trim()) {
//         newErrors.accountNo = 'Account number is required';
//       }

//       if (!formData.ifscCode.trim()) {
//         newErrors.ifscCode = 'IFSC code is required';
//       } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
//         newErrors.ifscCode = 'Invalid IFSC code format';
//       }

//       if (!formData.bankName.trim()) {
//         newErrors.bankName = 'Bank name is required';
//       }

//       if (!formData.branchName.trim()) {
//         newErrors.branchName = 'Branch name is required';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     let transformedValue = value;
//     if (name === 'ifscCode') {
//       transformedValue = value.toUpperCase();
//     } else if (name === 'accountNo') {
//       transformedValue = value.replace(/\D/g, '');
//     }

//     setFormData(prevData => ({
//       ...prevData,
//       [name]: transformedValue
//     }));

//     if (name === 'underGroup') {
//       setShowBankDetails(value === 'Bank Account');
//     }

//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   // Handle dropdown changes specifically
//   const handleDropdownChange = (name) => (e) => {
//     const value = e.target.value;
    
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));

//     if (name === 'underGroup') {
//       setShowBankDetails(value === 'Bank Account');
//     }

//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }

//     // Clear global error
//     if (error) {
//       clearError();
//     }
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setSubmitLoading(true);
//     clearError();
    
//     try {
//       let result;
      
//       if (editingId) {
//         result = await executeApi(ledgerService.update, editingId, formData);
//       } else {
//         result = await executeApi(ledgerService.create, formData);
//       }

//       if (result.success) {
//         const message = editingId ? 'Ledger updated successfully!' : 'Ledger created successfully!';
//         showToast(message, 'success');
//         resetForm();
//         await loadLedgers();
//       } else {
//         showToast(result.message || 'Operation failed!', 'error');
//       }
//     } catch (error) {
//       console.error('Error saving ledger:', error);
//       showToast('Error saving ledger. Please try again.', 'error');
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const showToast = (message, type) => {
//     const toast = document.createElement('div');
//     toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
//       type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
//     }`;
//     toast.textContent = message;
//     document.body.appendChild(toast);
    
//     setTimeout(() => {
//       toast.remove();
//     }, 3000);
//   };

//   const resetForm = () => {
//     setFormData({
//       ledgerCode: '',
//       underGroup: '',
//       openingBalance: '',
//       accountHoldersName: '',
//       accountNo: '',
//       ifscCode: '',
//       bankName: '',
//       branchName: '',
//       nameOfScheme: ''
//     });
//     setErrors({});
//     setEditingId(null);
//     setShowBankDetails(false);
//     clearError();
//   };

//   const handleEdit = (ledger) => {
//     setFormData({
//       ledgerCode: ledger.ledgerCode || '',
//       underGroup: ledger.underGroup || '',
//       openingBalance: ledger.openingBalance || '',
//       accountHoldersName: ledger.accountHoldersName || '',
//       accountNo: ledger.accountNo || '',
//       ifscCode: ledger.ifscCode || '',
//       bankName: ledger.bankName || '',
//       branchName: ledger.branchName || '',
//       nameOfScheme: ledger.nameOfScheme || ''
//     });
//     setEditingId(ledger.id);
//     setShowBankDetails(ledger.underGroup === 'Bank Account');
//     setShowTable(false);
//     clearError();
//     window.scrollTo(0, 0);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this ledger?')) {
//       const result = await executeApi(ledgerService.delete, id);
//       if (result.success) {
//         showToast(result.message || 'Ledger deleted successfully!', 'success');
//         await loadLedgers();
//       } else {
//         showToast(result.message || 'Failed to delete ledger!', 'error');
//       }
//     }
//   };

//   const handleSearch = async () => {
//     if (searchTerm.trim()) {
//       const result = await executeApi(ledgerService.search, searchTerm);
//       if (result.success) {
//         setLedgers(result.data || []);
//       }
//     } else {
//       await loadLedgers();
//     }
//   };

//   const filteredLedgers = ledgers.filter(ledger =>
//     ledger.ledgerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ledger.underGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     ledger.bankName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="space-y-6 ">
    
//    <ErrorDisplay error={error} onClear={clearError} />

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
//             <BookOpen className="h-4 w-4 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-800">
//               {editingId ? 'Edit Ledger' : 'Ledger Creation'}
//             </h1>
//             <p className="text-slate-600">Create and manage ledger accounts</p>
//           </div>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
//             <BookOpen className="h-4 w-4 text-green-600" />
//             <span className="text-sm font-semibold text-green-800">
//               Total Ledgers: {ledgers.length}
//             </span>
//           </div>
//           <button
//             onClick={() => setShowTable(!showTable)}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             disabled={loading}
//           >
//             <Eye className="h-4 w-4" />
//             <span>{showTable ? 'Hide List' : 'View List'}</span>
//           </button>
//           {editingId && (
//             <button
//               onClick={() => {
//                 resetForm();
//                 setShowTable(false);
//               }}
//               className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//             >
//               <Plus className="h-4 w-4" />
//               <span>Add New</span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Ledger Form */}
//       {!showTable && (
//         <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border  border-slate-200/60 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
//             <h2 className="text-xl font-semibold text-white">
//               {editingId ? 'Edit Ledger Details' : 'Ledger Details'}
//             </h2>
//           </div>
          
//           <div className="p-6 min-h-screen ">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {/* Basic Information */}
//               <div className="lg:col-span-3">
//                 <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
//                   <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
//                   Basic Information
//                 </h3>
//               </div>

//               <FormField
//                 label="Ledger Code"
//                 name="ledgerCode"
//                 value={formData.ledgerCode}
//                 onChange={handleChange}
//                 required
//                 error={errors.ledgerCode}
//                 icon={BookOpen}
//                 placeholder="Enter ledger code"
//               />
              
//               {/* Under Group Dropdown with SearchableDropdown */}
//               <SearchableDropdown
//                 label="Under Group"
//                 placeholder="Select Account Group"
//                 searchPlaceholder="Search account groups..."
//                 options={groupOptions}
//                 value={formData.underGroup}
//                 onChange={handleDropdownChange('underGroup')}
//                 required
//                 error={errors.underGroup}
//                 icon={Users}
//                 emptyMessage="No account groups available"
//                 maxHeight="250px"
//               />
              
//               <FormField
//                 label="Opening Balance"
//                 name="openingBalance"
//                 type="number"
//                 step="0.01"
//                 value={formData.openingBalance}
//                 onChange={handleChange}
//                 required
//                 error={errors.openingBalance}
//                 icon={DollarSign}
//                 placeholder="0.00"
//               />

//               {/* Bank Account Details */}
//               {showBankDetails && (
//                 <>
//                   <div className="lg:col-span-3 mt-6">
//                     <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
//                       <CreditCard className="h-5 w-5 mr-2 text-green-500" />
//                       Bank Account Details
//                     </h3>
//                     <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                       <p className="text-sm text-blue-800">
//                         <strong>Note:</strong> Additional bank details are required when "Bank Account" is selected as the group.
//                       </p>
//                     </div>
//                   </div>
                  
//                   <FormField
//                     label="Account Holders Name"
//                     name="accountHoldersName"
//                     value={formData.accountHoldersName}
//                     onChange={handleChange}
//                     required={showBankDetails}
//                     error={errors.accountHoldersName}
//                     icon={Users}
//                     placeholder="Enter account holder name"
//                   />
                  
//                   <FormField
//                     label="Account Number"
//                     name="accountNo"
//                     value={formData.accountNo}
//                     onChange={handleChange}
//                     required={showBankDetails}
//                     error={errors.accountNo}
//                     icon={CreditCard}
//                     placeholder="Enter account number"
//                   />
                  
//                   <FormField
//                     label="IFSC Code"
//                     name="ifscCode"
//                     value={formData.ifscCode}
//                     onChange={handleChange}
//                     required={showBankDetails}
//                     error={errors.ifscCode}
//                     placeholder="ABCD0123456"
//                     maxLength={11}
//                   />
                  
//                   <FormField
//                     label="Bank Name"
//                     name="bankName"
//                     value={formData.bankName}
//                     onChange={handleChange}
//                     required={showBankDetails}
//                     error={errors.bankName}
//                     icon={Building}
//                     placeholder="Enter bank name"
//                   />
                  
//                   <FormField
//                     label="Branch Name"
//                     name="branchName"
//                     value={formData.branchName}
//                     onChange={handleChange}
//                     required={showBankDetails}
//                     error={errors.branchName}
//                     placeholder="Enter branch name"
//                   />
                  
//                   <FormField
//                     label="Name of the Scheme"
//                     name="nameOfScheme"
//                     value={formData.nameOfScheme}
//                     onChange={handleChange}
//                     error={errors.nameOfScheme}
//                     placeholder="Purpose of account opening"
//                   />
//                 </>
//               )}
//             </div>
            
//             <div className="flex justify-center space-x-4 mt-8">
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
//               >
//                 <span>Reset</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit}
//                 disabled={loading}
//                 className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
//               >
//                 {loading ? (
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 ) : (
//                   <Save className="h-4 w-4" />
//                 )}
//                 <span>{loading ? 'Saving...' : (editingId ? 'Update' : 'Submit')}</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ledgers List */}
//       {showTable && (
//         <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
//           <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-semibold text-white">Ledger Accounts ({ledgers.length})</h2>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search ledgers..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
//                 />
//               </div>
//             </div>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ledger Code</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Group</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Opening Balance</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bank Details</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white/40 divide-y divide-slate-200">
//                 {filteredLedgers.map((ledger) => (
//                   <tr key={ledger.id} className="hover:bg-white/60 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-slate-900">{ledger.ledgerCode}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-slate-900">{ledger.underGroup}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-slate-900">₹{parseFloat(ledger.openingBalance || 0).toFixed(2)}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       {ledger.underGroup === 'Bank Account' ? (
//                         <div>
//                           <div className="text-sm text-slate-900">{ledger.bankName}</div>
//                           <div className="text-sm text-slate-500">{ledger.accountNo}</div>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-slate-500">N/A</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => handleEdit(ledger)}
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                         title="Edit"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(ledger.id)}
//                         className="text-red-600 hover:text-red-900 p-1 rounded"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {filteredLedgers.length === 0 && (
//             <div className="text-center py-8">
//               <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
//               <p className="text-slate-500">
//                 {searchFilters.searchTerm ? 'No ledgers found matching your search.' : 'No ledgers created yet.'}
//               </p>
//               {!searchTerm && (
//                 <button
//                   onClick={() => setShowTable(false)}
//                   className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
//                 >
//                   Create your first ledger →
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LedgerCreation;
import React, { useState, useEffect } from 'react';
import { BookOpen, Users, DollarSign, Building, CreditCard, Eye, Search, Edit, Trash2, Plus, Save, FileText, MapPin } from 'lucide-react';
import { FormField } from "../../components/common/FormField";
import SearchableDropdown from "../../components/common/SearchableDropdown"; // Import SearchableDropdown
import { ledgerService, groupService } from "../../services/realServices"; // Added groupService
import { useApiService } from "../../hooks/useApiService";
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import Pagination from "../../components/common/Pagination";
import SearchableRecords from "../../components/common/SearchableRecords";
import { useAuth } from '../../context/AuthContext';
const LedgerCreation = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [formData, setFormData] = useState({
    ledgerCode: '',
    ledgerName: '',
    underGroup: '',
    // localBodyType: '', // Added local body type field
    // openingBalance: '',
    accountHoldersName: '',
    accountNo: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    nameOfScheme: ''
  });

  const [errors, setErrors] = useState({});
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]); // State for real groups
  const [showTable, setShowTable] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', underGroup: '', localBodyType: '' });
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  const { executeApi, loading, error, clearError } = useApiService();

  // Convert real groups to SearchableDropdown format (subgroups only)
  const groupOptions = groups
    .filter(group => !group.isMainGroup && group.underMainGroup)
    .map(group => ({
      value: group.groupName || group.name,
      label: group.groupCode ? `${group.groupName || group.name} (${group.groupCode})` : (group.groupName || group.name),
      description: group.underMainGroup || ''
    }));

  // Fallback options if API is empty
  const fallbackGroupOptions = [
    { value: 'Bank Account', label: 'Bank Account' },
    { value: 'Cash', label: 'Cash' },
    // ... other fallbacks if needed
  ];

  const finalGroupOptions = groupOptions.length > 0 ? groupOptions : fallbackGroupOptions;

  // Local body type options (copied from InstitutionCreation)
  const localBodyTypeOptions = [
    { 
      value: 'municipal_corporation', 
      label: 'Municipal Corporation', 
      description: 'Large urban local government body for major cities' 
    },
    { 
      value: 'municipality', 
      label: 'Municipality', 
      description: 'Urban local government body for smaller cities and towns' 
    },
    { 
      value: 'town_panchayat', 
      label: 'Town Panchayat', 
      description: 'Village-level local government institution' 
    },
    { 
      value: 'district_panchayat', 
      label: 'District Panchayat', 
      description: 'District-level rural local government institution' 
    },
    { 
      value: 'block_panchayat', 
      label: 'Block Panchayat', 
      description: 'Intermediate level rural local government body' 
    },
    { 
      value: 'village_panchayat', 
      label: 'Village Panchayat', 
      description: 'District-level rural local government institution' 
    },
    { 
      value: 'other', 
      label: 'Other', 
      description: 'Other types of local government bodies' 
    }
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // Load ledgers
    const ledgerResult = await executeApi(ledgerService.getAll);
    if (ledgerResult.success) {
      setLedgers(ledgerResult.data || []);
    }
    
    // Load real groups
    const groupResult = await executeApi(groupService.getAll);
    if (groupResult.success) {
      setGroups(groupResult.data || []);
    }
  };

  const loadLedgers = async () => {
    const result = await executeApi(ledgerService.getAll);
    if (result.success) {
      setLedgers(result.data || []);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.ledgerCode.trim()) {
      newErrors.ledgerCode = 'Ledger code is required';
    }

    if (!formData.ledgerName.trim()) {
      newErrors.ledgerName = 'Ledger Head is required';
    }

    if (!formData.underGroup.trim()) {
      newErrors.underGroup = 'Under group is required';
    }

    // if (!formData.localBodyType.trim()) {
    //   newErrors.localBodyType = 'Local body type is required';
    // }

    // if (!formData.openingBalance.trim()) {
    //   newErrors.openingBalance = 'Opening balance is required';
    // } else if (isNaN(formData.openingBalance) || parseFloat(formData.openingBalance) < 0) {
    //   newErrors.openingBalance = 'Opening balance must be a valid positive number';
    // }

    if (showBankDetails) {
      if (!formData.accountHoldersName.trim()) {
        newErrors.accountHoldersName = 'Account holder name is required';
      }

      if (!formData.accountNo.trim()) {
        newErrors.accountNo = 'Account number is required';
      }

      if (!formData.ifscCode.trim()) {
        newErrors.ifscCode = 'IFSC code is required';
      }

      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required';
      }

      if (!formData.branchName.trim()) {
        newErrors.branchName = 'Branch name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let transformedValue = value;
    if (name === 'ifscCode') {
      transformedValue = value.toUpperCase();
    } else if (name === 'accountNo') {
      transformedValue = value.replace(/\D/g, '');
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: transformedValue
    }));

    if (name === 'underGroup') {
      const isBank = value && (
        value.toLowerCase() === 'bank account' || 
        value.toLowerCase() === 'bank accounts' ||
        value.toLowerCase().includes('bank')
      );
      setShowBankDetails(isBank);
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle dropdown changes specifically
  const handleDropdownChange = (name) => (e) => {
    const value = e.target.value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    if (name === 'underGroup') {
      const isBank = value && (
        value.toLowerCase() === 'bank account' || 
        value.toLowerCase() === 'bank accounts' ||
        value.toLowerCase().includes('bank')
      );
      setShowBankDetails(isBank);
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error
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
        result = await executeApi(ledgerService.update, editingId, formData);
      } else {
        result = await executeApi(ledgerService.create, formData);
      }

      if (result.success) {
        const message = editingId ? 'Ledger updated successfully!' : 'Ledger created successfully!';
        showToast(message, 'success');
        resetForm();
        await loadLedgers();
      } else {
        showToast(result.message || 'Operation failed!', 'error');
      }
    } catch (error) {
      console.error('Error saving ledger:', error);
      showToast('Error saving ledger. Please try again.', 'error');
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
      ledgerCode: '',
      ledgerName: '',
      underGroup: '',
      // localBodyType: '', // Reset local body type
      // openingBalance: '',
      accountHoldersName: '',
      accountNo: '',
      ifscCode: '',
      bankName: '',
      branchName: '',
      nameOfScheme: ''
    });
    setErrors({});
    setEditingId(null);
    setShowBankDetails(false);
    clearError();
  };

  const handleEdit = (ledger) => {
    setFormData({
      ledgerCode: ledger.ledgerCode || '',
      ledgerName: ledger.ledgerName || '',
      underGroup: ledger.underGroup || '',
      // localBodyType: ledger.localBodyType || '', // Set local body type
      // openingBalance: ledger.openingBalance || '',
      accountHoldersName: ledger.accountHoldersName || '',
      accountNo: ledger.accountNo || '',
      ifscCode: ledger.ifscCode || '',
      bankName: ledger.bankName || '',
      branchName: ledger.branchName || '',
      nameOfScheme: ledger.nameOfScheme || ''
    });
    setEditingId(ledger.id);
    const isBank = ledger.underGroup && (
      ledger.underGroup.toLowerCase() === 'bank account' || 
      ledger.underGroup.toLowerCase() === 'bank accounts' ||
      ledger.underGroup.toLowerCase().includes('bank')
    );
    setShowBankDetails(isBank);
    setShowTable(false);
    clearError();
    window.scrollTo(0, 0);
  };
const handleDelete = async (id) => {
  const ledger = ledgers.find(l => l.id === id);
  const confirmed = await showConfirmDialog({
    title: 'Delete Ledger',
    message: `Are you sure you want to delete ledger "${ledger?.ledgerName || ledger?.ledgerCode || 'this ledger'}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    type: 'error'
  });

  if (confirmed) {
    const result = await executeApi(ledgerService.delete, id);
    if (result.success) {
      showToast(result.message || 'Ledger deleted successfully!', 'success');
      await loadLedgers();
    } else {
      showToast(result.message || 'Failed to delete ledger!', 'error');
    }
  }
};
  // const handleDelete = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this ledger?')) {
  //     const result = await executeApi(ledgerService.delete, id);
  //     if (result.success) {
  //       showToast(result.message || 'Ledger deleted successfully!', 'success');
  //       await loadLedgers();
  //     } else {
  //       showToast(result.message || 'Failed to delete ledger!', 'error');
  //     }
  //   }
  // };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const result = await executeApi(ledgerService.search, searchTerm);
      if (result.success) {
        setLedgers(result.data || []);
      }
    } else {
      await loadLedgers();
    }
  };

  const normalizeStr = (str) => str?.replace(/\u00A0/g, ' ') || '';
  const filteredLedgers = ledgers.filter(ledger => {
    const f = searchFilters;
    const s = normalizeStr(f.searchTerm).toLowerCase();
    const searchMatch = !s ||
      normalizeStr(ledger.ledgerCode).toLowerCase().includes(s) ||
      normalizeStr(ledger.ledgerName).toLowerCase().includes(s) ||
      normalizeStr(ledger.accountHoldersName).toLowerCase().includes(s) ||
      normalizeStr(ledger.underGroup).toLowerCase().includes(s) ||
      normalizeStr(ledger.bankName).toLowerCase().includes(s) ||
      normalizeStr(ledger.accountNo).toLowerCase().includes(s) ||
      normalizeStr(ledger.nameOfScheme).toLowerCase().includes(s);
    const underGroupMatch = !f.underGroup || ledger.underGroup?.toLowerCase().includes(f.underGroup.toLowerCase());
    const localBodyMatch = !f.localBodyType || ledger.localBodyType === f.localBodyType;
    return searchMatch && underGroupMatch && localBodyMatch;
  });

  const totalPages = Math.ceil(filteredLedgers.length / PAGE_SIZE);
  const paginatedLedgers = filteredLedgers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = () => {
    if (paginatedLedgers.every(l => selectedIds.has(l.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedLedgers.map(l => l.id)));
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
      message: `Are you sure you want to delete ${selectedIds.size} selected ledger(s)? This action cannot be undone.`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'error'
    });
    if (confirmed) {
      let count = 0;
      for (const id of selectedIds) {
        const result = await executeApi(ledgerService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadLedgers();
      showToast(`${count} ledger(s) deleted successfully!`, 'success');
    }
  };

  // Get local body type label for display
  // const getLocalBodyTypeLabel = (value) => {
  //   const found = localBodyTypeOptions.find(type => type.value === value);
  //   return found ? found.label : value;
  // };

  return (
    <div className="space-y-6 ">
    
   <ErrorDisplay error={error} onClear={clearError} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {editingId ? 'Edit Ledger' : 'Ledger Creation'}
            </h1>
            <p className="text-slate-600">Create and manage ledger accounts</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-lg">
            <BookOpen className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-800">
              Total Ledgers: {ledgers.length}
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

      {/* Ledger Form */}
      {!showTable && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border  border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Ledger Details' : 'Ledger Details'}
            </h2>
          </div>
          
          <div className="p-6 min-h-screen ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div className="lg:col-span-3">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  Basic Information
                </h3>
              </div>

              <FormField
                label="Ledger Code"
                name="ledgerCode"
                value={formData.ledgerCode}
                onChange={handleChange}
                required
                error={errors.ledgerCode}
                icon={BookOpen}
                placeholder="Enter ledger code (e.g., LC001)"
              />

              <FormField
                label="Ledger Head"
                name="ledgerName"
                value={formData.ledgerName}
                onChange={handleChange}
                required
                error={errors.ledgerName}
                icon={FileText}
                placeholder="Enter Ledger Head (e.g., Cash Account)"
              />
              
              {/* Under Group Dropdown with SearchableDropdown */}
              <SearchableDropdown
                label="Under Group"
                placeholder="Select Account Group"
                searchPlaceholder="Search account groups..."
                options={finalGroupOptions}
                value={formData.underGroup}
                onChange={handleDropdownChange('underGroup')}
                required
                error={errors.underGroup}
                icon={Users}
                emptyMessage="No account groups available"
                maxHeight="250px"
              />

              {/* Local Body Type Field with SearchableDropdown */}
              {/* <SearchableDropdown
                label="Local Body Type"
                placeholder="Select Local Body Type"
                searchPlaceholder="Search local body types..."
                options={localBodyTypeOptions}
                value={formData.localBodyType}
                onChange={handleDropdownChange('localBodyType')}
                required
                error={errors.localBodyType}
                icon={MapPin}
                emptyMessage="No local body types available"
                maxHeight="250px"
              /> */}
              
              {/* <FormField
                label="Opening Balance"
                name="openingBalance"
                type="number"
                step="0.01"
                value={formData.openingBalance}
                onChange={handleChange}
                required
                error={errors.openingBalance}
                icon={DollarSign}
                placeholder="0.00"
              /> */}

              {/* Bank Account Details */}
              {showBankDetails && (
                <>
                  <div className="lg:col-span-3 mt-6">
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                      Bank Account Details
                    </h3>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Additional bank details are required when "Bank Account" is selected as the group.
                      </p>
                    </div>
                  </div>
                  
                  <FormField
                    label="Account Holders Name"
                    name="accountHoldersName"
                    value={formData.accountHoldersName}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.accountHoldersName}
                    icon={Users}
                    placeholder="Enter account holder name"
                  />
                  
                  <FormField
                    label="Account Number"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.accountNo}
                    icon={CreditCard}
                    placeholder="Enter account number"
                  />
                  
                  <FormField
                    label="IFSC Code"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.ifscCode}
                    placeholder="ABCD0123456"
                    maxLength={11}
                  />
                  
                  <FormField
                    label="Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.bankName}
                    icon={Building}
                    placeholder="Enter bank name"
                  />
                  
                  <FormField
                    label="Branch Name"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                    required={showBankDetails}
                    error={errors.branchName}
                    placeholder="Enter branch name"
                  />
                  
                  <FormField
                    label="Name of the Scheme"
                    name="nameOfScheme"
                    value={formData.nameOfScheme}
                    onChange={handleChange}
                    error={errors.nameOfScheme}
                    placeholder="Purpose of account opening"
                  />
                </>
              )}
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
                className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
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

      {/* Ledgers List */}
      {showTable && (
        <SearchableRecords
          title={`Ledger Accounts (${ledgers.length})`}
          filters={searchFilters}
          onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
          searchPlaceholder="Search by code, name, group, bank..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            { key: 'underGroup', label: 'Under Group', type: 'text', placeholder: 'Filter by group...' },
          ]}
          totalItems={filteredLedgers.length}
        >
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mx-4 mt-4">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.size} ledger(s) selected
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
                      checked={paginatedLedgers.length > 0 && paginatedLedgers.every(l => selectedIds.has(l.id))}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ledger Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ledger Head</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Group</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Local Body</th> */}
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Opening Balance</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Bank Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white/40 divide-y divide-slate-200">
                {paginatedLedgers.map((ledger) => (
                  <tr key={ledger.id} className={`hover:bg-white/60 transition-colors ${selectedIds.has(ledger.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(ledger.id)}
                        onChange={() => handleSelectItem(ledger.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{ledger.ledgerCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{ledger.ledgerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{ledger.underGroup}</div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {getLocalBodyTypeLabel(ledger.localBodyType)}
                      </div>
                    </td> */}
                    {/* <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">₹{parseFloat(ledger.openingBalance || 0).toFixed(2)}</div>
                    </td> */}
                    <td className="px-6 py-4">
                      {ledger.underGroup && (
                        ledger.underGroup.toLowerCase().trim() === 'bank account' || 
                        ledger.underGroup.toLowerCase().trim() === 'bank accounts' ||
                        ledger.underGroup.toLowerCase().includes('bank')
                      ) ? (
                        <div>
                          <div className="text-sm text-slate-900">{ledger.bankName}</div>
                          <div className="text-sm text-slate-500">{ledger.accountNo}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">N/A</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(ledger)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ledger.id)}
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

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={PAGE_SIZE}
                totalItems={filteredLedgers.length}
              />
            </div>
          )}

          {filteredLedgers.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500">
                {searchFilters.searchTerm ? 'No ledgers found matching your search.' : 'No ledgers created yet.'}
              </p>
              {!searchFilters.searchTerm && (
                <button
                  onClick={() => setShowTable(false)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                >
                  Create your first ledger →
                </button>
              )}
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

export default LedgerCreation;