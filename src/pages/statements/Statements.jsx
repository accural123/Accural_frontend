import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Building,
  Search,
  Eye,
  X,
  BarChart3,
  PieChart,
  LineChart,
  CreditCard,
  BookOpen,
  Receipt,
  Calculator,
  Users,
  Home,
  Briefcase,
  Target,
  Award,
  Landmark,
  Banknote
} from 'lucide-react';

// Modern Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
      <div className={`${getToastStyles()} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center space-x-3 min-w-80`}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
};

// Mock API service for statements

import apiClient from '../../services/apiClient';

const statementsService = {
  generateStatement: async (params) => {
    const endpoint = '/statements/' + params.statementType.replace(/_/g, '-');
    return apiClient.get(endpoint, params);
  },
  exportStatement: async (data, format, statementType) => {
    return apiClient.post('/statements/export', { data, format, statementType });
  }
};


const Statements = () => {
  const { showToast, ToastContainer } = useToast();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  const [statementParams, setStatementParams] = useState({
    statementType: '',
    month: '',
    year: new Date().getFullYear().toString(),
    fromDate: '',
    toDate: '',
    ledgerCode: '',
    category: ''
  });

  const [statementData, setStatementData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const statementTypes = [
    { 
      value: 'opening_balance', 
      label: 'Opening Balance', 
      icon: Calculator,
      category: 'Basic Statements',
      description: 'Account-wise opening balance details'
    },
    { 
      value: 'detailed_income', 
      label: 'Detailed Income', 
      icon: TrendingUp,
      category: 'Income Statements',
      description: 'Detailed income transaction records'
    },
    { 
      value: 'category_wise_income', 
      label: 'Category Wise Income', 
      icon: PieChart,
      category: 'Income Statements',
      description: 'Income categorized by type'
    },
    { 
      value: 'abstract_of_income', 
      label: 'Abstract Of Income', 
      icon: BarChart3,
      category: 'Income Statements',
      description: 'Summary of total income'
    },
    { 
      value: 'detailed_expenditure', 
      label: 'Detailed Expenditure', 
      icon: TrendingDown,
      category: 'Expenditure Statements',
      description: 'Detailed expenditure transaction records'
    },
    { 
      value: 'category_wise_expenditure', 
      label: 'Category Wise Expenditure', 
      icon: PieChart,
      category: 'Expenditure Statements',
      description: 'Expenditure categorized by type'
    },
    { 
      value: 'abstract_of_expenditure', 
      label: 'Abstract Of Expenditure', 
      icon: BarChart3,
      category: 'Expenditure Statements',
      description: 'Summary of total expenditure'
    },
    { 
      value: 'net_deficit_calculation', 
      label: 'Net Deficit Calculation', 
      icon: Calculator,
      category: 'Financial Analysis',
      description: 'Income vs expenditure analysis'
    },
    { 
      value: 'detailed_trial_balance', 
      label: 'Detailed Trail Balance (Code Wise)', 
      icon: BookOpen,
      category: 'Trial Balance',
      description: 'Code-wise trial balance details'
    },
    { 
      value: 'category_wise_trial_balance', 
      label: 'Category Wise Trail Balance', 
      icon: BookOpen,
      category: 'Trial Balance',
      description: 'Category-wise trial balance'
    },
    { 
      value: 'abstract_trial_balance', 
      label: 'Abstract Of Trail Balance (Category Wise)', 
      icon: BookOpen,
      category: 'Trial Balance',
      description: 'Trial balance summary'
    },
    { 
      value: 'trial_balance_abstract', 
      label: 'Trail Balance Abstract', 
      icon: FileText,
      category: 'Trial Balance',
      description: 'Condensed trial balance'
    },
    { 
      value: 'assets_liabilities', 
      label: 'Assets & Liabilities', 
      icon: Building,
      category: 'Balance Sheet',
      description: 'Assets and liabilities statement'
    },
    { 
      value: 'balance_sheet', 
      label: 'Balance Sheet', 
      icon: FileText,
      category: 'Balance Sheet',
      description: 'Complete balance sheet'
    },
    { 
      value: 'advances', 
      label: 'Advances', 
      icon: CreditCard,
      category: 'Registers',
      description: 'Advances given and recovery status'
    },
    { 
      value: 'deposits', 
      label: 'Deposits', 
      icon: Banknote,
      category: 'Registers',
      description: 'Deposit details and status'
    },
    { 
      value: 'demand_collection_balance', 
      label: 'Demand Collection Balance (DCB)', 
      icon: Receipt,
      category: 'Collection Reports',
      description: 'Demand vs collection analysis'
    },
    { 
      value: 'depreciation_statement', 
      label: 'Depreciation Statement', 
      icon: TrendingDown,
      category: 'Asset Management',
      description: 'Asset depreciation details'
    },
    { 
      value: 'depreciation_code_wise', 
      label: 'Depreciation Code Wise', 
      icon: BarChart3,
      category: 'Asset Management',
      description: 'Code-wise depreciation breakdown'
    },
    { 
      value: 'investment_details', 
      label: 'Investment Details', 
      icon: Target,
      category: 'Investments',
      description: 'Investment portfolio details'
    },
    { 
      value: 'loan_details', 
      label: 'Loan Details (All Codes)', 
      icon: Briefcase,
      category: 'Loans',
      description: 'Comprehensive loan details'
    },
    { 
      value: 'grant_utilization_scheme', 
      label: 'Grant Utilization Statement Scheme wise', 
      icon: Award,
      category: 'Grants',
      description: 'Scheme-wise grant utilization'
    },
    { 
      value: 'grant_utilization_work', 
      label: 'Grant Utilization Statement Work wise', 
      icon: Building,
      category: 'Grants',
      description: 'Work-wise grant utilization'
    },
    { 
      value: 'grant_receivable_details', 
      label: 'Grant Receivable Details', 
      icon: Landmark,
      category: 'Grants',
      description: 'Pending grant receivables'
    },
    { 
      value: 'doubtful_collection_details', 
      label: 'Doubtful Collection Details', 
      icon: AlertCircle,
      category: 'Collection Reports',
      description: 'Doubtful debt analysis'
    },
    { 
      value: 'surplus_statement', 
      label: 'Surplus Statement', 
      icon: TrendingUp,
      category: 'Financial Analysis',
      description: 'Surplus calculation and analysis'
    },
    { 
      value: 'project_progress_general', 
      label: 'Project in Progress (General Fund)', 
      icon: Building,
      category: 'Project Management',
      description: 'General fund project status'
    },
    { 
      value: 'project_progress_scheme', 
      label: 'Project in Progress (Scheme)', 
      icon: Target,
      category: 'Project Management',
      description: 'Scheme-wise project progress'
    },
    { 
      value: 'payables_abstract', 
      label: 'Payables Abstract', 
      icon: CreditCard,
      category: 'Payables',
      description: 'Summary of outstanding payables'
    },
    { 
      value: 'duty_transfer_property', 
      label: 'Duty on Transfer of Property', 
      icon: Home,
      category: 'Revenue',
      description: 'Property transfer duty details'
    },
    { 
      value: 'devolution_fund', 
      label: 'Devolution Fund (SFC)', 
      icon: Landmark,
      category: 'Funds',
      description: 'State Finance Commission fund details'
    },
    { 
      value: 'grant_statement_schemes', 
      label: 'Grant Statement (Schemes)', 
      icon: Award,
      category: 'Grants',
      description: 'Scheme-wise grant statement'
    },
    { 
      value: 'prior_year_income', 
      label: 'Prior Year Income', 
      icon: TrendingUp,
      category: 'Prior Year Adjustments',
      description: 'Previous year income adjustments'
    },
    { 
      value: 'prior_year_expenses', 
      label: 'Prior Year Expenses', 
      icon: TrendingDown,
      category: 'Prior Year Adjustments',
      description: 'Previous year expense adjustments'
    },
    { 
      value: 'reconciliation_details', 
      label: 'Reconciliation Details', 
      icon: CheckCircle,
      category: 'Bank Reconciliation',
      description: 'Bank reconciliation statement'
    },
    { 
      value: 'uncashed_cheque_details', 
      label: 'Uncashed Cheque Details', 
      icon: Receipt,
      category: 'Bank Reconciliation',
      description: 'Outstanding uncashed cheques'
    },
    { 
      value: 'remittance_not_credited', 
      label: 'Remittance Not Credited at Bank Details', 
      icon: AlertCircle,
      category: 'Bank Reconciliation',
      description: 'Uncleared bank remittances'
    },
    { 
      value: 'contractor_payment_details', 
      label: 'Contractor Payment Details', 
      icon: Users,
      category: 'Payments',
      description: 'Contractor payment tracking'
    }
  ];

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const categories = [
    'Basic Statements',
    'Income Statements',
    'Expenditure Statements',
    'Financial Analysis',
    'Trial Balance',
    'Balance Sheet',
    'Registers',
    'Collection Reports',
    'Asset Management',
    'Investments',
    'Loans',
    'Grants',
    'Project Management',
    'Payables',
    'Revenue',
    'Funds',
    'Prior Year Adjustments',
    'Bank Reconciliation',
    'Payments'
  ];

  useEffect(() => {
    if (statementData.length > 0) {
      const filtered = statementData.filter(item => {
        const searchFields = Object.values(item).join(' ').toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, statementData]);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setStatementParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatementColumns = (statementType) => {
    switch (statementType) {
      case 'opening_balance':
        return [
          { key: 'ledgerCode', title: 'Ledger Code', sortable: true },
          { key: 'ledgerName', title: 'Ledger Head', sortable: true },
          { 
            key: 'openingBalance', 
            title: 'Opening Balance (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'debitMovement', 
            title: 'Debit Movement (₹)', 
            render: (value) => (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'creditMovement', 
            title: 'Credit Movement (₹)', 
            render: (value) => (
              <span className="text-red-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'closingBalance', 
            title: 'Closing Balance (₹)', 
            render: (value) => (
              <span className="text-blue-600 font-bold">₹{value.toLocaleString('en-IN')}</span>
            )
          }
        ];

      case 'detailed_income':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherNo', title: 'Voucher No', sortable: true },
          { key: 'ledgerCode', title: 'Ledger Code' },
          { key: 'ledgerName', title: 'Ledger Head' },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { key: 'particulars', title: 'Particulars' }
        ];

      case 'balance_sheet':
        return [
          { key: 'category', title: 'Category', sortable: true },
          { key: 'subcategory', title: 'Sub Category' },
          { key: 'particulars', title: 'Particulars' },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'percentage', 
            title: 'Percentage (%)', 
            render: (value) => `${value}%` 
          }
        ];

      case 'trial_balance':
        return [
          { key: 'ledgerCode', title: 'Ledger Code', sortable: true },
          { key: 'ledgerName', title: 'Ledger Head', sortable: true },
          { 
            key: 'debitBalance', 
            title: 'Debit Balance (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'creditBalance', 
            title: 'Credit Balance (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { key: 'group', title: 'Group' }
        ];

      case 'advances':
        return [
          // { key: 'challanNo', title: 'Challan No', sortable: true },
          { key: 'date', title: 'Date', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'recoveredAmount', 
            title: 'Recovered (₹)', 
            render: (value) => (
              <span className="text-green-600">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'balanceAmount', 
            title: 'Balance (₹)', 
            render: (value) => (
              <span className={`font-semibold ${value > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                ₹{value.toLocaleString('en-IN')}
              </span>
            )
          },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Recovered' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      case 'deposits':
        return [
          // { key: 'challanNo', title: 'Challan No', sortable: true },
          { key: 'date', title: 'Date', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'interestRate', 
            title: 'Interest Rate (%)', 
            render: (value) => `${value}%` 
          },
          { key: 'maturityDate', title: 'Maturity Date' },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Active' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      default:
        return [
          { key: 'id', title: 'S.No', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { key: 'amount', title: 'Amount (₹)', render: (value) => `₹${value.toLocaleString('en-IN')}` }
        ];
    }
  };

  const handleGenerateStatement = async () => {
    if (!statementParams.statementType) {
      showToast('Please select a statement type', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const filters = {
        ...statementParams,
      };
      const result = await statementsService.generateStatement(filters);
      
      if (result.success) {
        setStatementData(result.data);
        setFilteredData(result.data);
        setShowStatement(true);
        showToast('Statement generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating statement:', error);
      showToast('Error generating statement. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportStatement = async (format) => {
    const statementTitle = statementTypes.find(t => t.value === statementParams.statementType)?.label || 'Statement';
    
    try {
      const result = await statementsService.exportStatement(filteredData, format, statementParams.statementType);
      if (result.success) {
        showToast(result.message, 'success');
      }
    } catch (error) {
      showToast(`Error exporting statement as ${format.toUpperCase()}`, 'error');
    }
  };

  const calculateSummary = () => {
    if (!filteredData.length) return {};

    const totalAmount = filteredData.reduce((sum, item) => {
      const amount = item.amount || item.closingBalance || item.debitBalance || item.creditBalance || 0;
      return sum + amount;
    }, 0);

    return { totalAmount, totalEntries: filteredData.length };
  };

  const summary = showStatement ? calculateSummary() : {};

  const getStatementsByCategory = () => {
    const grouped = {};
    statementTypes.forEach(statement => {
      if (!grouped[statement.category]) {
        grouped[statement.category] = [];
      }
      grouped[statement.category].push(statement);
    });
    return grouped;
  };

  const resetFilters = () => {
    setStatementParams({
      statementType: '',
      month: '',
      year: new Date().getFullYear().toString(),
      fromDate: '',
      toDate: '',
      ledgerCode: '',
      category: ''
    });
    setShowStatement(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Financial Statements</h1>
            <p className="text-slate-600">Generate comprehensive financial statements and reports</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Statement Generation Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Statement Parameters</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Primary Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Statement Type *</label>
              <select
                name="statementType"
                value={statementParams.statementType}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Statement Type</option>
                {statementTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                name="month"
                value={statementParams.month}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <select
                name="year"
                value={statementParams.year}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={statementParams.fromDate}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={statementParams.toDate}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ledger Code</label>
                <input
                  type="text"
                  name="ledgerCode"
                  value={statementParams.ledgerCode}
                  onChange={handleParamChange}
                  placeholder="Enter ledger code"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center border-t pt-6">
            <button
              onClick={handleGenerateStatement}
              disabled={loading}
              className={`flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-5 w-5" />
                  <span>Generate Statement</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Result View */}
      {showStatement && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-blue-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="bg-blue-500 h-2 w-6 rounded-full mr-3"></span>
              {statementTypes.find(t => t.value === statementParams.statementType)?.label}
            </h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => exportStatement('excel')}
                className="p-2 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-2"
                title="Export as Excel"
              >
                <Download className="h-4 w-4 text-green-400" />
                <span className="text-xs font-semibold">Excel</span>
              </button>
              <button 
                onClick={() => exportStatement('pdf')}
                className="p-2 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-2"
                title="Export as PDF"
              >
                <FileText className="h-4 w-4 text-red-400" />
                <span className="text-xs font-semibold">PDF</span>
              </button>
              <button className="p-2 bg-slate-700 text-slate-200 hover:bg-slate-600 rounded-lg transition-colors">
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Search and Quick Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in statement records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Information and Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 mb-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Statement Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Generated on: {new Date().toLocaleDateString('en-IN')} at {new Date().toLocaleTimeString('en-IN')}</p>
                  <p>Statement Type: {statementTypes.find(t => t.value === statementParams.statementType)?.label}</p>
                  <p>Period: {statementParams.month && months.find(m => m.value === statementParams.month)?.label} {statementParams.year}</p>
                  <p>Total Records: {filteredData.length}</p>
                  {searchTerm && <p>Search Filter: "{searchTerm}"</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Entries:</span>
                    <span className="font-semibold text-blue-600">{summary.totalEntries || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-green-600">
                      ₹{summary.totalAmount?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="text-gray-700 font-medium">Category:</span>
                    <span className="font-bold text-purple-600">
                      {statementTypes.find(t => t.value === statementParams.statementType)?.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Data Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                    {getStatementColumns(statementParams.statementType).map(col => (
                      <th key={col.key} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                        {getStatementColumns(statementParams.statementType).map(col => (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-700">
                            {col.render ? col.render(row[col.key], row) : row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={getStatementColumns(statementParams.statementType).length + 1} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <Eye className="h-10 w-10 text-gray-300" />
                          <p className="text-gray-500 italic">No records found for the selected parameters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Statement Types Grid */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Available Statements</h2>
        </div>
        
        <div className="p-6">
          {Object.entries(getStatementsByCategory()).map(([category, statements]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statements.map((statement) => {
                  const IconComponent = statement.icon;
                  return (
                    <button
                      key={statement.value}
                      onClick={() => {
                        setStatementParams(prev => ({
                          ...prev,
                          statementType: statement.value
                        }));
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        statementParams.statementType === statement.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          statementParams.statementType === statement.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm leading-tight">{statement.label}</h4>
                          <p className="text-xs text-gray-500 mt-1">{statement.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Statement Selected State */}
      {!showStatement && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Generate Financial Statement</h3>
            <p className="text-gray-500">
              Select your statement type and parameters above, then click "Generate Statement" to view comprehensive financial reports.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>38+ Statement Types</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Quick Generation</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Export Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statements;