
import React, { useState, useEffect } from 'react';
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
  Banknote,
  Calendar,
  UserCheck,
  Shield,
  Truck,
  Heart,
  FileCheck
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

// Mock API service for registers

import apiClient from '../../services/apiClient';

const registersService = {
  generateRegister: async (params) => {
    const endpoint = '/registers/' + params.registerType.replace(/_/g, '-');
    return apiClient.get(endpoint, params);
  },
  exportRegister: async (data, format, registerType) => {
    return apiClient.post('/registers/export', { data, format, registerType });
  }
};


const Registers = () => {
  const { showToast, ToastContainer } = useToast();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  const [registerParams, setRegisterParams] = useState({
    registerType: '',
    month: '',
    year: new Date().getFullYear().toString(),
    fromDate: '',
    toDate: '',
    ledgerCode: '',
    status: ''
  });

  const [registerData, setRegisterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const registerTypes = [
    { 
      value: 'cheque_received_register', 
      label: 'Cheque Received Register', 
      icon: Receipt,
      category: 'Banking Registers',
      description: 'Track all cheques received and their clearance status'
    },
    { 
      value: 'cheque_issued_register', 
      label: 'Cheque Issued Register', 
      icon: CreditCard,
      category: 'Banking Registers',
      description: 'Monitor all cheques issued and encashment details'
    },
    { 
      value: 'advance_register', 
      label: 'Advance Register', 
      icon: TrendingUp,
      category: 'Financial Registers',
      description: 'Manage advances given and recovery tracking'
    },
    { 
      value: 'deposits_register', 
      label: 'Deposits Register', 
      icon: Banknote,
      category: 'Financial Registers',
      description: 'Handle security deposits and their maturity'
    },
    { 
      value: 'grant_received_register', 
      label: 'Grant Received Register', 
      icon: Award,
      category: 'Grant Management',
      description: 'Track government grants received and pending'
    },
    { 
      value: 'general_ledger', 
      label: 'General Ledger', 
      icon: BookOpen,
      category: 'Accounting Registers',
      description: 'Complete ledger with all account transactions'
    },
    { 
      value: 'journal_register', 
      label: 'Journal Register', 
      icon: FileText,
      category: 'Accounting Registers',
      description: 'All journal voucher entries and references'
    },
    { 
      value: 'lapsed_deposits_register', 
      label: 'Lapsed Deposits Register', 
      icon: Clock,
      category: 'Financial Registers',
      description: 'Track deposits that have lapsed or expired'
    },
    { 
      value: 'gst_payable_register', 
      label: 'GST Payable Register', 
      icon: Calculator,
      category: 'Tax Registers',
      description: 'GST liability tracking and payment status'
    },
    { 
      value: 'income_tax_payable_register', 
      label: 'Income Tax Payable Register', 
      icon: FileCheck,
      category: 'Tax Registers',
      description: 'Income tax deductions and payment tracking'
    },
    { 
      value: 'lwf_payable_register', 
      label: 'LWF Payable Register', 
      icon: Shield,
      category: 'Employee Registers',
      description: 'Labour Welfare Fund contributions tracking'
    },
    { 
      value: 'cps_employee_contribution_register', 
      label: 'CPS Employee Contribution Payable Register', 
      icon: Users,
      category: 'Employee Registers',
      description: 'Contributory Pension Scheme employee contributions'
    },
    { 
      value: 'cps_employer_contribution_register', 
      label: 'CPS Employer Contribution Payable Register', 
      icon: Building,
      category: 'Employee Registers',
      description: 'Contributory Pension Scheme employer contributions'
    },
    { 
      value: 'provident_fund_register', 
      label: 'Provident Fund Subscription Payable Register', 
      icon: Briefcase,
      category: 'Employee Registers',
      description: 'Employee provident fund contributions'
    },
    { 
      value: 'gis_recoveries_register', 
      label: 'GIS Recoveries Payable Register', 
      icon: Shield,
      category: 'Employee Registers',
      description: 'Group Insurance Scheme recovery tracking'
    },
    { 
      value: 'gis_management_register', 
      label: 'GIS Management contribution Payable Register', 
      icon: UserCheck,
      category: 'Employee Registers',
      description: 'GIS management contribution tracking'
    },
    { 
      value: 'contractors_payable_register', 
      label: 'Contractors Payable Register', 
      icon: Truck,
      category: 'Vendor Registers',
      description: 'Outstanding payments to contractors'
    },
    { 
      value: 'suppliers_payable_register', 
      label: 'Suppliers Payable Register', 
      icon: Building,
      category: 'Vendor Registers',
      description: 'Outstanding payments to suppliers'
    },
    { 
      value: 'cooperative_loan_register', 
      label: 'Co-operative Society Loan Recoveries Payable Register', 
      icon: Home,
      category: 'Employee Registers',
      description: 'Cooperative society loan recovery tracking'
    },
    { 
      value: 'lic_premium_register', 
      label: 'L.I.C.Policy Premium Recoveries Payable Register', 
      icon: Shield,
      category: 'Employee Registers',
      description: 'LIC premium recovery from employees'
    },
    { 
      value: 'spf_gratuity_register', 
      label: 'SPF -Cum-Gratuity Scheme-Recoveries Payable Register', 
      icon: Award,
      category: 'Employee Registers',
      description: 'Special Provident Fund and gratuity tracking'
    },
    { 
      value: 'deputanists_recoveries_register', 
      label: 'Deputanists Recoveries including G.P.F.Recoveries Payable Register', 
      icon: Users,
      category: 'Employee Registers',
      description: 'Deputanist and GPF recovery tracking'
    },
    { 
      value: 'health_fund_register', 
      label: 'Health Fund Subscription (NHIS) Payable Register', 
      icon: Heart,
      category: 'Employee Registers',
      description: 'National Health Insurance Scheme contributions'
    },
    { 
      value: 'mdr_register', 
      label: 'MDR Register', 
      icon: Home,
      category: 'Revenue Registers',
      description: 'Market Development Rent collection tracking'
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

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cleared', label: 'Cleared' },
    { value: 'Outstanding', label: 'Outstanding' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Recovered', label: 'Recovered' },
    { value: 'Encashed', label: 'Encashed' }
  ];

  useEffect(() => {
    if (registerData.length > 0) {
      const filtered = registerData.filter(item => {
        const searchFields = Object.values(item).join(' ').toLowerCase();
        return searchFields.includes(searchTerm.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, registerData]);

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    setRegisterParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getRegisterColumns = (registerType) => {
    switch (registerType) {
      case 'cheque_received_register':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'chequeNo', title: 'Cheque No', sortable: true },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { key: 'draweeBank', title: 'Drawee Bank' },
          { key: 'drawerName', title: 'Drawer Name' },
          { key: 'voucherNo', title: 'Voucher No' },
          { key: 'depositDate', title: 'Deposit Date' },
          { key: 'clearanceDate', title: 'Clearance Date' },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Cleared' ? 'bg-green-100 text-green-800' :
                value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      case 'cheque_issued_register':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'chequeNo', title: 'Cheque No', sortable: true },
          { 
            key: 'amount', 
            title: 'Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { key: 'payeeName', title: 'Payee Name' },
          { key: 'voucherNo', title: 'Voucher No' },
          { key: 'bankName', title: 'Bank Name' },
          { key: 'encashmentDate', title: 'Encashment Date' },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Encashed' ? 'bg-green-100 text-green-800' :
                value === 'Outstanding' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      case 'advance_register':
        return [
          // { key: 'challanNo', title: 'Challan No', sortable: true },
          { key: 'date', title: 'Date', sortable: true },
          { key: 'employeeName', title: 'Employee/Vendor' },
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

      case 'deposits_register':
        return [
          // { key: 'challanNo', title: 'Challan No', sortable: true },
          { key: 'date', title: 'Date', sortable: true },
          { key: 'depositorName', title: 'Depositor Name' },
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

      case 'grant_received_register':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'grantCode', title: 'Grant Code' },
          { key: 'grantName', title: 'Grant Name' },
          { 
            key: 'sanctionedAmount', 
            title: 'Sanctioned (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'receivedAmount', 
            title: 'Received (₹)', 
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
          { key: 'sanctioningAuthority', title: 'Authority' },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Fully Received' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      case 'general_ledger':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'voucherNo', title: 'Voucher No' },
          { key: 'ledgerCode', title: 'Ledger Code' },
          { key: 'ledgerName', title: 'Ledger Head' },
          { key: 'particulars', title: 'Particulars' },
          { 
            key: 'debitAmount', 
            title: 'Debit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'creditAmount', 
            title: 'Credit (₹)', 
            render: (value) => value ? `₹${value.toLocaleString('en-IN')}` : '-'
          },
          { 
            key: 'balance', 
            title: 'Balance (₹)', 
            render: (value, row) => (
              <span className={`font-semibold ${row.balanceType === 'Credit' ? 'text-green-600' : 'text-blue-600'}`}>
                ₹{value.toLocaleString('en-IN')} ({row.balanceType})
              </span>
            )
          }
        ];

      case 'gst_payable_register':
        return [
          { key: 'date', title: 'Date', sortable: true },
          { key: 'invoiceNo', title: 'Invoice No' },
          { key: 'vendorName', title: 'Vendor Name' },
          { key: 'vendorGSTIN', title: 'Vendor GSTIN' },
          { 
            key: 'taxableAmount', 
            title: 'Taxable Amount (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'totalGSTAmount', 
            title: 'GST Amount (₹)', 
            render: (value) => (
              <span className="text-orange-600">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'totalAmount', 
            title: 'Total Amount (₹)', 
            render: (value) => (
              <span className="font-semibold text-blue-600">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { key: 'gstPeriod', title: 'GST Period' },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Paid' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      case 'mdr_register':
        return [
          { key: 'assessmentNo', title: 'Assessment No', sortable: true },
          { key: 'leaseholderName', title: 'Leaseholder Name' },
          { key: 'propertyDetails', title: 'Property Details' },
          { key: 'leaseArea', title: 'Lease Area' },
          { 
            key: 'monthlyRent', 
            title: 'Monthly Rent (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'demandAmount', 
            title: 'Demand (₹)', 
            render: (value) => `₹${value.toLocaleString('en-IN')}` 
          },
          { 
            key: 'collectedAmount', 
            title: 'Collected (₹)', 
            render: (value) => (
              <span className="text-green-600">₹{value.toLocaleString('en-IN')}</span>
            )
          },
          { 
            key: 'balanceAmount', 
            title: 'Balance (₹)', 
            render: (value) => (
              <span className={`font-semibold ${value > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ₹{value.toLocaleString('en-IN')}
              </span>
            )
          },
          { key: 'lastPaymentDate', title: 'Last Payment' },
          {
            key: 'status',
            title: 'Status',
            render: (value) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                value === 'Fully Paid' ? 'bg-green-100 text-green-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {value}
              </span>
            )
          }
        ];

      default:
        return [
          { key: 'id', title: 'S.No', sortable: true },
          { key: 'date', title: 'Date' },
          { key: 'particulars', title: 'Particulars' },
          { key: 'amount', title: 'Amount (₹)', render: (value) => `₹${value.toLocaleString('en-IN')}` }
        ];
    }
  };

  const handleGenerateRegister = async () => {
    if (!registerParams.registerType) {
      showToast('Please select a register type', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const paramsWithFilters = {
        ...registerParams
      };
      const result = await registersService.generateRegister(paramsWithFilters);
      
      if (result.success) {
        setRegisterData(result.data);
        setFilteredData(result.data);
        setShowRegister(true);
        showToast('Register generated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error generating register:', error);
      showToast('Error generating register. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportRegister = async (format) => {
    const registerTitle = registerTypes.find(t => t.value === registerParams.registerType)?.label || 'Register';
    
    try {
      const result = await registersService.exportRegister(filteredData, format, registerParams.registerType);
      if (result.success) {
        showToast(result.message, 'success');
      }
    } catch (error) {
      showToast(`Error exporting register as ${format.toUpperCase()}`, 'error');
    }
  };

  const calculateSummary = () => {
    if (!filteredData.length) return {};

    const totalAmount = filteredData.reduce((sum, item) => {
      const amount = item.amount || item.totalAmount || item.demandAmount || item.sanctionedAmount || 0;
      return sum + amount;
    }, 0);

    const totalBalance = filteredData.reduce((sum, item) => {
      const balance = item.balanceAmount || 0;
      return sum + balance;
    }, 0);

    return { totalAmount, totalBalance, totalEntries: filteredData.length };
  };

  const summary = showRegister ? calculateSummary() : {};

  const getRegistersByCategory = () => {
    const grouped = {};
    registerTypes.forEach(register => {
      if (!grouped[register.category]) {
        grouped[register.category] = [];
      }
      grouped[register.category].push(register);
    });
    return grouped;
  };

  const resetFilters = () => {
    setRegisterParams({
      registerType: '',
      month: '',
      year: new Date().getFullYear().toString(),
      fromDate: '',
      toDate: '',
      ledgerCode: '',
      status: ''
    });
    setShowRegister(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Accounting Registers</h1>
            <p className="text-slate-600">Manage and view all accounting registers and records</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
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

      {/* Register Generation Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Register Parameters</h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Primary Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Register Type *</label>
              <select
                name="registerType"
                value={registerParams.registerType}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Register Type</option>
                {registerTypes.map((type) => (
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
                value={registerParams.month}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                value={registerParams.year}
                onChange={handleParamChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={registerParams.fromDate}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={registerParams.toDate}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={registerParams.status}
                  onChange={handleParamChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ledger Code</label>
                <input
                  type="text"
                  name="ledgerCode"
                  value={registerParams.ledgerCode}
                  onChange={handleParamChange}
                  placeholder="e.g., 1001"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerateRegister}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <BookOpen className="h-4 w-4" />
              )}
              <span>{loading ? 'Generating...' : 'Generate Register'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Register Results */}
      {showRegister && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {registerTypes.find(t => t.value === registerParams.registerType)?.label}
                </h2>
                <p className="text-emerald-100">
                  {registerParams.month && months.find(m => m.value === registerParams.month)?.label} {registerParams.year}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Entries</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {summary.totalEntries || '0'}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Amount</p>
                    <p className="text-2xl font-bold text-green-700">
                      ₹{summary.totalAmount?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Balance Amount</p>
                    <p className="text-2xl font-bold text-orange-700">
                      ₹{summary.totalBalance?.toLocaleString('en-IN') || '0'}
                    </p>
                  </div>
                  <Calculator className="h-8 w-8 text-orange-500" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Register Type</p>
                    <p className="text-lg font-bold text-purple-700">
                      {registerTypes.find(t => t.value === registerParams.registerType)?.category}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Search and Export Options */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in register data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportRegister('pdf')}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportRegister('excel')}
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
                  onClick={() => setShowRegister(false)}
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
                <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <tr>
                    {getRegisterColumns(registerParams.registerType).map((column) => (
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
                        colSpan={getRegisterColumns(registerParams.registerType).length}
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
                        {getRegisterColumns(registerParams.registerType).map((column) => (
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

            {/* Register Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Register Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Generated on: {new Date().toLocaleDateString('en-IN')} at {new Date().toLocaleTimeString('en-IN')}</p>
                  <p>Register Type: {registerTypes.find(t => t.value === registerParams.registerType)?.label}</p>
                  <p>Period: {registerParams.month && months.find(m => m.value === registerParams.month)?.label} {registerParams.year}</p>
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance Amount:</span>
                    <span className="font-semibold text-orange-600">
                      ₹{summary.totalBalance?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="text-gray-700 font-medium">Category:</span>
                    <span className="font-bold text-purple-600">
                      {registerTypes.find(t => t.value === registerParams.registerType)?.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Types Grid */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Available Registers</h2>
        </div>
        
        <div className="p-6">
          {Object.entries(getRegistersByCategory()).map(([category, registers]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {registers.map((register) => {
                  const IconComponent = register.icon;
                  return (
                    <button
                      key={register.value}
                      onClick={() => {
                        setRegisterParams(prev => ({
                          ...prev,
                          registerType: register.value
                        }));
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        registerParams.registerType === register.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          registerParams.registerType === register.value
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm leading-tight">{register.label}</h4>
                          <p className="text-xs text-gray-500 mt-1">{register.description}</p>
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

      {/* No Register Selected State */}
      {!showRegister && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-12 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Generate Register</h3>
            <p className="text-gray-500">
              Select your register type and parameters above, then click "Generate Register" to view detailed accounting records.
            </p>
            <div className="flex justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>24+ Register Types</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Real-time Data</span>
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

export default Registers;