import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  BookOpen, 
  Receipt, 
  ArrowDownCircle, 
  Calculator,
  FileText
} from 'lucide-react';

// Import all voucher components
import InterBankTransfer from './vouchers/InterBankTransfer';
import JournalVoucher from './vouchers/JournalVoucher';
import BankReceipt from './vouchers/BankReceipt';
import BankPayment from './vouchers/BankPayment';
import DailyCollection from './vouchers/DailyCollection';

const VoucherTabs = () => {
  const [activeTab, setActiveTab] = useState('inter-bank');

  const tabs = [
    {
      id: 'inter-bank',
      label: 'Inter Bank Transfer',
      icon: ArrowRightLeft,
      component: InterBankTransfer,
      description: 'Transfer funds between bank accounts',
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'journal',
      label: 'Journal Voucher',
      icon: BookOpen,
      component: JournalVoucher,
      description: 'Create journal entries and adjustments',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'bank-receipt',
      label: 'Bank Receipt',
      icon: Receipt,
      component: BankReceipt,
      description: 'Record incoming bank receipts',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'bank-payment',
      label: 'Bank Payment',
      icon: ArrowDownCircle,
      component: BankPayment,
      description: 'Process outgoing bank payments',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'daily-collection',
      label: 'Daily Collection',
      icon: Calculator,
      component: DailyCollection,
      description: 'Manage daily cash collections',
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Voucher Management System</h1>
                <p className="text-sm text-gray-500">Manage all your financial vouchers in one place</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            {activeTabData && (
              <>
                <activeTabData.icon className="h-6 w-6 text-gray-600" />
                <h2 className="text-2xl font-bold text-gray-900">{activeTabData.label}</h2>
              </>
            )}
          </div>
          {activeTabData && (
            <p className="text-gray-600">{activeTabData.description}</p>
          )}
        </div>

        {/* Render Active Component */}
        <div className="animate-in fade-in duration-300">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .fade-in {
          animation-name: fade-in;
        }
      `}</style>
    </div>
  );
};

export default VoucherTabs;