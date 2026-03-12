import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const GSTReturns = () => {
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedReturn, setSelectedReturn] = useState('');

  const returnTypes = [
    { id: 'gstr1', name: 'GSTR-1', description: 'Details of outward supplies of taxable goods and/or services effected' },
    { id: 'gstr3b', name: 'GSTR-3B', description: 'Monthly return for registered taxpayers' },
    { id: 'gstr9', name: 'GSTR-9', description: 'Annual return for registered taxpayers' },
    { id: 'gstr9c', name: 'GSTR-9C', description: 'Reconciliation statement & certification by CA/CMA' }
  ];

  const periods = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2024-02', label: 'February 2024' },
    { value: '2024-03', label: 'March 2024' },
    { value: '2024-04', label: 'April 2024' },
    { value: '2024-05', label: 'May 2024' },
    { value: '2024-06', label: 'June 2024' },
    { value: '2024-07', label: 'July 2024' },
    { value: '2024-08', label: 'August 2024' },
    { value: '2024-09', label: 'September 2024' },
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' }
  ];

  const handleGenerateReturn = () => {
    if (!selectedPeriod || !selectedReturn) {
      alert('Please select both period and return type');
      return;
    }

    const filters = {
      period: selectedPeriod,
      returnType: selectedReturn,
    };

    console.log('Generating GST Return with filters:', filters);
    alert(`Generating ${selectedReturn.toUpperCase()} for ${periods.find(p => p.value === selectedPeriod)?.label} (Institution: ${userSession?.selectedInstitution?.name || 'Default'})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">GST Returns</h1>
            <p className="text-slate-600">Generate and manage GST returns</p>
          </div>
        </div>
      </div>

      {/* Return Generation Form */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Generate GST Return</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Period Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Select Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose a period</option>
              {periods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          {/* Return Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">Select Return Type</label>
            <select
              value={selectedReturn}
              onChange={(e) => setSelectedReturn(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose return type</option>
              {returnTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateReturn}
          className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Generate Return
        </button>
      </div>

      {/* Return Types Information */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Available Return Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {returnTypes.map((type) => (
            <div
              key={type.id}
              className="p-4 bg-white/40 rounded-xl border border-slate-200/60 hover:bg-white/60 transition-all duration-200"
            >
              <h3 className="font-semibold text-slate-800 mb-2">{type.name}</h3>
              <p className="text-sm text-slate-600">{type.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Returns */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Recent Returns</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Return Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Period</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Generated Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 hover:bg-white/40">
                <td className="py-3 px-4 text-slate-600">GSTR-3B</td>
                <td className="py-3 px-4 text-slate-600">December 2024</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Filed
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">2024-12-15</td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 font-medium">
                    View
                  </button>
                </td>
              </tr>
              <tr className="border-b border-slate-100 hover:bg-white/40">
                <td className="py-3 px-4 text-slate-600">GSTR-1</td>
                <td className="py-3 px-4 text-slate-600">November 2024</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    Draft
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">2024-11-30</td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GSTReturns;
