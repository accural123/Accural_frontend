import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
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
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

// Mock API service

import apiClient from '../../services/apiClient';

const yearwiseReportService = {
  generateReport: async (params) => {
    const endpoint = '/reports/' + params.reportType.replace(/_/g, '-');
    return apiClient.get(endpoint, params);
  },
  exportReport: async (data, format, reportType) => {
    return apiClient.post('/reports/export', { data, format, reportType });
  }
};


const YearwiseReports = () => {
  const { showToast, ToastContainer } = useToast();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  const [reportParams, setReportParams] = useState({
    reportType: '',
    year: new Date().getFullYear().toString(),
    fromYear: '',
    toYear: '',
    department: '',
    comparison: false,
    bankCode: ''
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const yearwiseReportTypes = [
    { value: 'receipt_expenditure_yearly', label: 'Receipt & Expenditure Yearly Summary', icon: BarChart3 },
    { value: 'yearly_trends', label: 'Income Category Trends (Yearly)', icon: TrendingUp },
    { value: 'department_wise_expenditure', label: 'Department-wise Expenditure Analysis', icon: Building },
    { value: 'bank_wise_yearly', label: 'Bank-wise Yearly Summary', icon: CreditCard },
    { value: 'voucher_type_analysis', label: 'Voucher Type Analysis (Yearly)', icon: Receipt },
    { value: 'quarterly_breakdown', label: 'Quarterly Performance Breakdown', icon: PieChart },
    { value: 'asset_wise_analysis', label: 'Asset-wise Annual Analysis', icon: Target },
  ];

  const years = Array.from({ length: 15 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'administration', label: 'Administration' },
    { value: 'public_works', label: 'Public Works' },
    { value: 'health_sanitation', label: 'Health & Sanitation' },
    { value: 'finance', label: 'Finance' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'water_supply', label: 'Water Supply' }
  ];

  const bankCodes = [
    { value: '', label: 'All Banks' },
    { value: '3060', label: '3060 - State Bank of India' },
    { value: '3061', label: '3061 - Canara Bank' },
    { value: '3062', label: '3062 - Union Bank of India' },
    { value: '3063', label: '3063 - HDFC Bank' },
    { value: '3064', label: '3064 - ICICI Bank' },
    { value: '3065', label: '3065 - Axis Bank' }
  ];

  useEffect(() => {
    if (reportData.length > 0) {
      const filtered = reportData.filter(item => {
        const searchFields = Object.values(item).join(' ').toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, reportData]);

  const handleParamChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReportParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getReportColumns = (reportType) => {
    switch (reportType) {
      case 'receipt_expenditure_yearly':
        return [
          { key: 'year', title: 'Year', sortable: true },
          { 
            key: 'totalReceipts', 
            title: 'Total Receipts (₹)', 
            render: (value) => (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'totalPayments', 
            title: 'Total Payments (₹)', 
            render: (value) => (
              <span className="text-red-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'netBalance', 
            title: 'Net Balance (₹)', 
            render: (value) => (
              <span className={`font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{value.toLocaleString('en-IN')}
              </span>
            )
          },
          { key: 'voucherCount', title: 'Total Vouchers' },
          { 
            key: 'monthlyAverage', 
            title: 'Monthly Average (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          }
        ];

      case 'yearly_trends':
        return [
          { key: 'year', title: 'Year', sortable: true },
          { key: 'category', title: 'Income Category', sortable: true },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'growth', 
            title: 'Growth (%)', 
            render: (value) => (
              <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value >= 0 ? '+' : ''}{value}%
              </span>
            )
          },
          { 
            key: 'percentage', 
            title: 'Share (%)', 
            render: (value) => `${value}%` 
          },
          { 
            key: 'target', 
            title: 'Target (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'achievement', 
            title: 'Achievement (%)', 
            render: (value) => (
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${value >= 95 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {value}%
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${value >= 95 ? 'bg-green-500' : value >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  ></div>
                </div>
              </div>
            )
          }
        ];

      case 'department_wise_expenditure':
        return [
          { key: 'department', title: 'Department', sortable: true },
          { key: 'year', title: 'Year', sortable: true },
          { 
            key: 'budget', 
            title: 'Budget (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'actual', 
            title: 'Actual (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'variance', 
            title: 'Variance (₹)', 
            render: (value) => (
              <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{value.toLocaleString('en-IN')}
              </span>
            )
          },
          { 
            key: 'utilizationRate', 
            title: 'Utilization (%)', 
            render: (value) => (
              <div className="flex items-center space-x-2">
                <span className={`font-semibold ${value >= 95 ? 'text-green-600' : value >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {value}%
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${value >= 95 ? 'bg-green-500' : value >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(value, 100)}%` }}
                  ></div>
                </div>
              </div>
            )
          }
        ];

      case 'bank_wise_yearly':
        return [
          { key: 'bankCode', title: 'Bank Code', sortable: true },
          { key: 'bankName', title: 'Bank Name', sortable: true },
          { key: 'year', title: 'Year', sortable: true },
          { 
            key: 'openingBalance', 
            title: 'Opening Balance (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'receipts', 
            title: 'Receipts (₹)', 
            render: (value) => (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'payments', 
            title: 'Payments (₹)', 
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
          },
          { key: 'transactionCount', title: 'Transactions' },
          { 
            key: 'interestEarned', 
            title: 'Interest Earned (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          }
        ];

      case 'voucher_type_analysis':
        return [
          { key: 'voucherType', title: 'Voucher Type', sortable: true },
          { key: 'description', title: 'Description', sortable: true },
          { key: 'year', title: 'Year', sortable: true },
          { key: 'count', title: 'Count' },
          { 
            key: 'totalAmount', 
            title: 'Total Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'averageAmount', 
            title: 'Average Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'percentage', 
            title: 'Share (%)', 
            render: (value) => `${value}%` 
          },
          { key: 'monthlyAverage', title: 'Monthly Average Count' }
        ];

      case 'quarterly_breakdown':
        return [
          { key: 'quarter', title: 'Quarter', sortable: true },
          { 
            key: 'receipts', 
            title: 'Receipts (₹)', 
            render: (value) => (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'payments', 
            title: 'Payments (₹)', 
            render: (value) => (
              <span className="text-red-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'netBalance', 
            title: 'Net Balance (₹)', 
            render: (value) => (
              <span className={`font-bold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{value.toLocaleString('en-IN')}
              </span>
            )
          },
          { key: 'voucherCount', title: 'Vouchers' },
          { 
            key: 'growth', 
            title: 'Growth (%)', 
            render: (value) => (
              <span className={`font-semibold ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {value >= 0 ? '+' : ''}{value}%
              </span>
            )
          }
        ];

      case 'asset_wise_analysis':
        return [
          { key: 'assetCategory', title: 'Asset Category', sortable: true },
          { key: 'year', title: 'Year', sortable: true },
          { 
            key: 'openingValue', 
            title: 'Opening Value (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'additions', 
            title: 'Additions (₹)', 
            render: (value) => (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'disposals', 
            title: 'Disposals (₹)', 
            render: (value) => (
              <span className="text-red-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'depreciation', 
            title: 'Depreciation (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'closingValue', 
            title: 'Closing Value (₹)', 
            render: (value) => (
              <span className="text-blue-600 font-bold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'depreciationRate', 
            title: 'Depreciation Rate (%)', 
            render: (value) => value ? `${value}%` : '-'
          }
        ];

      default:
        return [
          { key: 'year', title: 'Year', sortable: true },
          { key: 'description', title: 'Description' },
          { key: 'amount', title: 'Amount (₹)', render: (value) => `₹${value.toLocaleString('en-IN')}` }
        ];
    }
  };

  const handleGenerateReport = async () => {
    if (!reportParams.reportType || !reportParams.year) {
      showToast('Please select report type and year', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const filters = {
        ...reportParams,
      };
      const result = await yearwiseReportService.generateReport(filters);
      
      if (result.success) {
        setReportData(result.data);
        setFilteredData(result.data);
        setShowReport(true);
        showToast('Yearly report generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Error generating report. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    const reportTitle = yearwiseReportTypes.find(t => t.value === reportParams.reportType)?.label || 'Report';
    
    try {
      const result = await yearwiseReportService.exportReport(filteredData, format, reportParams.reportType);
      if (result.success) {
        showToast(result.message, 'success');
      }
    } catch (error) {
      showToast(`Error exporting report as ${format.toUpperCase()}`, 'error');
    }
  };

  const calculateSummary = () => {
    if (reportParams.reportType === 'receipt_expenditure_yearly') {
      const totalReceipts = filteredData.reduce((sum, item) => sum + (item.totalReceipts || 0), 0);
      const totalPayments = filteredData.reduce((sum, item) => sum + (item.totalPayments || 0), 0);
      const netBalance = totalReceipts - totalPayments;
      const totalVouchers = filteredData.reduce((sum, item) => sum + (item.voucherCount || 0), 0);
      const averageMonthly = filteredData.reduce((sum, item) => sum + (item.monthlyAverage || 0), 0) / Math.max(filteredData.length, 1);
      return { totalReceipts, totalPayments, netBalance, totalVouchers, averageMonthly };
    }
    
    if (reportParams.reportType === 'department_wise_expenditure') {
      const totalBudget = filteredData.reduce((sum, item) => sum + (item.budget || 0), 0);
      const totalActual = filteredData.reduce((sum, item) => sum + (item.actual || 0), 0);
      const totalVariance = totalBudget - totalActual;
      const avgUtilization = filteredData.reduce((sum, item) => sum + (item.utilizationRate || 0), 0) / Math.max(filteredData.length, 1);
      return { totalBudget, totalActual, totalVariance, avgUtilization };
    }
    
    const totalAmount = filteredData.reduce((sum, item) => sum + (item.amount || item.totalAmount || 0), 0);
    const totalEntries = filteredData.length;
    return { totalAmount, totalEntries };
  };

  const summary = showReport ? calculateSummary() : {};

  const resetFilters = () => {
    setReportParams({
      reportType: '',
      year: new Date().getFullYear().toString(),
      fromYear: '',
      toYear: '',
      department: '',
      comparison: false,
      bankCode: ''
    });
    setShowReport(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Yearwise Reports</h1>
            <p className="text-slate-600">Generate comprehensive annual financial reports and analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
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

      {/* Report Generation Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Report Parameters</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Primary Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
              <select
                name="reportType"
                value={reportParams.reportType}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Report Type</option>
                {yearwiseReportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
              <select
                name="year"
                value={reportParams.year}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                name="department"
                value={reportParams.department}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>{loading ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Year</label>
                <select
                  name="fromYear"
                  value={reportParams.fromYear}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select From Year</option>
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Year</label>
                <select
                  name="toYear"
                  value={reportParams.toYear}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select To Year</option>
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Code</label>
                <select
                  name="bankCode"
                  value={reportParams.bankCode}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {bankCodes.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="comparison"
                  name="comparison"
                  checked={reportParams.comparison}
                  onChange={handleParamChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="comparison" className="text-sm font-medium text-gray-700">
                  Enable Year-over-Year Comparison
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Results */}
      {showReport && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {yearwiseReportTypes.find(t => t.value === reportParams.reportType)?.label}
                </h2>
                <p className="text-indigo-100">
                  Financial Year {reportParams.year}
                  {reportParams.comparison && reportParams.fromYear && reportParams.toYear && 
                    ` (Comparison: ${reportParams.fromYear} - ${reportParams.toYear})`
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm">
                  {filteredData.length} entries
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Summary Cards */}
            {reportParams.reportType === 'receipt_expenditure_yearly' && (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Receipts</p>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{summary.totalReceipts?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Total Payments</p>
                      <p className="text-2xl font-bold text-red-700">
                        ₹{summary.totalPayments?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Net Balance</p>
                      <p className="text-2xl font-bold text-blue-700">
                        ₹{summary.netBalance?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Vouchers</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {summary.totalVouchers || '0'}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Monthly Average</p>
                      <p className="text-2xl font-bold text-orange-700">
                        ₹{Math.round(summary.averageMonthly || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </div>
            )}

            {reportParams.reportType === 'department_wise_expenditure' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Budget</p>
                      <p className="text-2xl font-bold text-blue-700">
                        ₹{summary.totalBudget?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Actual Spend</p>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{summary.totalActual?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Total Variance</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        ₹{summary.totalVariance?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Avg Utilization</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {Math.round(summary.avgUtilization || 0)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Search and Export Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in report data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportReport('pdf')}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>Hide</span>
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <tr>
                    {getReportColumns(reportParams.reportType).map((column) => (
                      <th
                        key={column.key}
                        className="border border-gray-300 px-4 py-3 text-left font-semibold"
                      >
                        {column.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        colSpan={getReportColumns(reportParams.reportType).length}
                        className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                          <p>No data found for the selected criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((row, index) => (
                      <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
                        {getReportColumns(reportParams.reportType).map((column) => (
                          <td
                            key={column.key}
                            className="border border-gray-300 px-4 py-3 text-sm"
                          >
                            {column.render
                              ? column.render(row[column.key], row)
                              : row[column.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Report Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Report Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Generated on: {new Date().toLocaleDateString('en-IN')} at {new Date().toLocaleTimeString('en-IN')}</p>
                  <p>Report Type: {yearwiseReportTypes.find(t => t.value === reportParams.reportType)?.label}</p>
                  <p>Financial Year: {reportParams.year}</p>
                  {reportParams.department && <p>Department: {departments.find(d => d.value === reportParams.department)?.label}</p>}
                  <p>Total Records: {filteredData.length}</p>
                  {searchTerm && <p>Search Filter: "{searchTerm}"</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
                <div className="space-y-1 text-sm">
                  {reportParams.reportType === 'receipt_expenditure_yearly' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Receipts:</span>
                        <span className="font-semibold text-green-600">
                          ₹{summary.totalReceipts?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Payments:</span>
                        <span className="font-semibold text-red-600">
                          ₹{summary.totalPayments?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-700 font-medium">Net Balance:</span>
                        <span className={`font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{summary.netBalance?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Average:</span>
                        <span className="font-semibold text-blue-600">
                          ₹{Math.round(summary.averageMonthly || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </>
                  ) : reportParams.reportType === 'department_wise_expenditure' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Budget:</span>
                        <span className="font-semibold text-blue-600">
                          ₹{summary.totalBudget?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual Spend:</span>
                        <span className="font-semibold text-green-600">
                          ₹{summary.totalActual?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-gray-700 font-medium">Total Variance:</span>
                        <span className={`font-bold ${summary.totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₹{summary.totalVariance?.toLocaleString('en-IN') || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Utilization:</span>
                        <span className="font-semibold text-purple-600">
                          {Math.round(summary.avgUtilization || 0)}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Entries:</span>
                        <span className="font-semibold text-blue-600">{summary.totalEntries || '0'}</span>
                      </div>
                      {summary.totalAmount && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold text-green-600">
                            ₹{summary.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Report Types */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Quick Report Access</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {yearwiseReportTypes.map((reportType) => {
              const IconComponent = reportType.icon;
              return (
                <button
                  key={reportType.value}
                  onClick={() => {
                    setReportParams(prev => ({
                      ...prev,
                      reportType: reportType.value
                    }));
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    reportParams.reportType === reportType.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      reportParams.reportType === reportType.value
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm leading-tight">{reportType.label}</h3>
                      <p className="text-xs text-gray-500 mt-1">Click to select</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* No Data State */}
      {!showReport && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <LineChart className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Generate Annual Report</h3>
            <p className="text-gray-500">
              Select your report parameters above and click "Generate" to view comprehensive yearly financial analysis.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Yearly insights</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Trend analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Export ready</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YearwiseReports;