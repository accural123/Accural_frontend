
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
  Receipt
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

const reportService = {
  generateReport: async (params) => {
    const endpoint = '/reports/' + params.reportType.replace(/_/g, '-');
    return apiClient.get(endpoint, params);
  },
  exportReport: async (data, format, reportType) => {
    return apiClient.post('/reports/export', { data, format, reportType });
  }
};


const DatewiseReports = () => {
  const { showToast, ToastContainer } = useToast();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  const [reportParams, setReportParams] = useState({
    reportType: '',
    fromDate: '',
    toDate: '',
    ledgerCode: '',
    voucherType: '',
    bankCode: '',
    status: ''
  });

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const datewiseReportTypes = [
    { value: 'receipt_expenditure', label: 'Receipt & Expenditure Details', icon: DollarSign },
    { value: 'voucher_register', label: 'Voucher Register', icon: FileText },
    { value: 'ledger_statement', label: 'Ledger Statement', icon: BarChart3 },
    { value: 'cash_book', label: 'Cash Book', icon: TrendingUp },
    { value: 'bank_book', label: 'Bank Book', icon: Building },
    { value: 'trial_balance', label: 'Trial Balance', icon: PieChart },
    { value: 'income_statement', label: 'Income Statement', icon: LineChart },
    { value: 'balance_sheet', label: 'Balance Sheet', icon: BarChart3 }
  ];

  const voucherTypes = [
    { value: '', label: 'All Vouchers' },
    { value: 'BRV', label: 'Bank Receipt Voucher' },
    { value: 'BPV', label: 'Bank Payment Voucher' },
    { value: 'JV', label: 'Journal Voucher' },
    { value: 'MR', label: 'Money Receipt' },
    { value: 'IBT', label: 'Inter Bank Transfer' },
    { value: 'ADBRV', label: 'Advance Bank Receipt Voucher' }
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

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Cleared', label: 'Cleared' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Journal', label: 'Journal' }
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
    const { name, value } = e.target;
    setReportParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getReportColumns = (reportType) => {
    switch (reportType) {
      case 'receipt_expenditure':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherType', title: 'Type', sortable: true },
          { key: 'voucherNo', title: 'Voucher No', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { key: 'ledgerName', title: 'Ledger' },
          { 
            key: 'debit', 
            title: 'Debit (₹)', 
            render: (value) => value ? (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            ) : '-'
          },
          { 
            key: 'credit', 
            title: 'Credit (₹)', 
            render: (value) => value ? (
              <span className="text-red-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            ) : '-'
          },
          { 
            key: 'balance', 
            title: 'Balance (₹)', 
            render: (value) => (
              <span className="text-blue-600 font-bold">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Cleared' ? 'bg-green-100 text-green-800' :
                value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                value === 'Cash' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {value}
              </span>
            )
          }
        ];
      
      case 'voucher_register':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherType', title: 'Type', sortable: true },
          { key: 'voucherNo', title: 'Voucher No', sortable: true },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { key: 'createdBy', title: 'Created By' },
          { key: 'approvedBy', title: 'Approved By' },
          { 
            key: 'status', 
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Approved' ? 'bg-green-100 text-green-800' : 
                value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {value}
              </span>
            )
          },
          { key: 'remarks', title: 'Remarks' }
        ];

      case 'ledger_statement':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherNo', title: 'Voucher No', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { key: 'ledgerName', title: 'Ledger' },
          { 
            key: 'debit', 
            title: 'Debit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'credit', 
            title: 'Credit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'balance', 
            title: 'Balance (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}`
          }
        ];

      case 'cash_book':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherNo', title: 'Voucher No', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { 
            key: 'receipts', 
            title: 'Receipts (₹)', 
            render: (value) => value ? (
              <span className="text-green-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            ) : '-'
          },
          { 
            key: 'payments', 
            title: 'Payments (₹)', 
            render: (value) => value ? (
              <span className="text-red-600 font-semibold">₹{value.toLocaleString('en-IN')}</span>
            ) : '-'
          },
          { 
            key: 'balance', 
            title: 'Balance (₹)', 
            render: (value) => (
              <span className="text-blue-600 font-bold">₹{value.toLocaleString('en-IN')}</span>
            )
          }
        ];

      case 'bank_book':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherNo', title: 'Voucher No', sortable: true },
          { key: 'particulars', title: 'Particulars' },
          { key: 'chequeNo', title: 'Cheque No' },
          { key: 'bankName', title: 'Bank' },
          { 
            key: 'debit', 
            title: 'Debit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'credit', 
            title: 'Credit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'balance', 
            title: 'Balance (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}`
          }
        ];

      case 'trial_balance':
        return [
          { key: 'ledgerCode', title: 'Ledger Code', sortable: true },
          { key: 'ledgerName', title: 'Ledger Head', sortable: true },
          { 
            key: 'debit', 
            title: 'Debit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'credit', 
            title: 'Credit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          }
        ];

      case 'income_statement':
        return [
          { key: 'category', title: 'Category', sortable: true },
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

      case 'balance_sheet':
        return [
          { key: 'category', title: 'Category', sortable: true },
          { key: 'subCategory', title: 'Sub Category', sortable: true },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          }
        ];
      
      default:
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'particulars', title: 'Description' },
          { key: 'amount', title: 'Amount (₹)', render: (value) => `₹${value.toLocaleString('en-IN')}` },
          { key: 'type', title: 'Type' }
        ];
    }
  };

  const handleGenerateReport = async () => {
    if (!reportParams.reportType || !reportParams.fromDate || !reportParams.toDate) {
      showToast('Please select report type and date range', 'error');
      return;
    }

    if (new Date(reportParams.fromDate) > new Date(reportParams.toDate)) {
      showToast('From date cannot be greater than to date', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const filters = {
        ...reportParams,
      };
      const result = await reportService.generateReport(filters);
      
      if (result.success) {
        setReportData(result.data);
        setFilteredData(result.data);
        setShowReport(true);
        showToast('Report generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showToast('Error generating report. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    const reportTitle = datewiseReportTypes.find(t => t.value === reportParams.reportType)?.label || 'Report';
    
    try {
      const result = await reportService.exportReport(filteredData, format, reportParams.reportType);
      if (result.success) {
        showToast(result.message, 'success');
      }
    } catch (error) {
      showToast(`Error exporting report as ${format.toUpperCase()}`, 'error');
    }
  };

  const calculateSummary = () => {
    if (reportParams.reportType === 'receipt_expenditure' || reportParams.reportType === 'cash_book') {
      const totalReceipts = filteredData.reduce((sum, item) => sum + (item.debit || item.receipts || 0), 0);
      const totalPayments = filteredData.reduce((sum, item) => sum + (item.credit || item.payments || 0), 0);
      const netBalance = totalReceipts - totalPayments;
      const totalEntries = filteredData.length;
      return { totalReceipts, totalPayments, netBalance, totalEntries };
    }
    
    const totalAmount = filteredData.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalEntries = filteredData.length;
    return { totalAmount, totalEntries };
  };

  const summary = showReport ? calculateSummary() : {};

  const resetFilters = () => {
    setReportParams({
      reportType: '',
      fromDate: '',
      toDate: '',
      ledgerCode: '',
      voucherType: '',
      bankCode: '',
      status: ''
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
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Calendar className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Datewise Reports</h1>
            <p className="text-slate-600">Generate comprehensive financial reports by date range</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Report Parameters</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Primary Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
              <select
                name="reportType"
                value={reportParams.reportType}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Report Type</option>
                {datewiseReportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
              <input
                type="date"
                name="fromDate"
                value={reportParams.fromDate}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date *</label>
              <input
                type="date"
                name="toDate"
                value={reportParams.toDate}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ledger Code</label>
                <input
                  type="text"
                  name="ledgerCode"
                  value={reportParams.ledgerCode}
                  onChange={handleParamChange}
                  placeholder="e.g., 1001"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
                <select
                  name="voucherType"
                  value={reportParams.voucherType}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {voucherTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bankCodes.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={reportParams.status}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FileText className="h-4 w-4" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Results */}
      {showReport && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {datewiseReportTypes.find(t => t.value === reportParams.reportType)?.label}
                </h2>
                <p className="text-green-100">
                  Period: {reportParams.fromDate} to {reportParams.toDate}
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
            {(reportParams.reportType === 'receipt_expenditure' || reportParams.reportType === 'cash_book') && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      <p className="text-sm font-medium text-purple-600">Total Entries</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {summary.totalEntries || '0'}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-500" />
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
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
                <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
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

            {/* Report Footer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Report Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Generated on: {new Date().toLocaleDateString('en-IN')} at {new Date().toLocaleTimeString('en-IN')}</p>
                  <p>Report Type: {datewiseReportTypes.find(t => t.value === reportParams.reportType)?.label}</p>
                  <p>Date Range: {reportParams.fromDate} to {reportParams.toDate}</p>
                  <p>Total Records: {filteredData.length}</p>
                  {searchTerm && <p>Search Filter: "{searchTerm}"</p>}
                </div>
              </div>

              {(reportParams.reportType === 'receipt_expenditure' || reportParams.reportType === 'cash_book') && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Financial Summary</h4>
                  <div className="space-y-1 text-sm">
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
                  </div>
                </div>
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {datewiseReportTypes.map((reportType) => {
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
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      reportParams.reportType === reportType.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{reportType.label}</h3>
                      <p className="text-xs text-gray-500">Click to select</p>
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
            <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Generate Your Report</h3>
            <p className="text-gray-500">
              Select your report parameters above and click "Generate Report" to view comprehensive financial data.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Real-time data</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Fast generation</span>
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

export default DatewiseReports;