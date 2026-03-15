
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Calculator, FileText, DollarSign, Plus, Trash2, Edit3 } from 'lucide-react';

const DoubtfulCollectionForm = ({ 
  onBack, 
  onSave, 
  initialData = null,
  journalNo = '',
  journalDate = '',
  ledgerCode = '',
  ledgerName = ''
}) => {
  const [entries, setEntries] = useState([
    { id: 1, description: 'Property Tax Prior year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 2, description: 'Water Charges Prior year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 3, description: 'Water Cess Prior year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 4, description: 'Profession Tax Prior year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 5, description: 'M.D.R Prior year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 6, description: 'M.D.R Prior year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 7, description: 'D&O Licence Fees Prior Year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 8, description: 'SWM User Charges Prior Year Doubtful Collection', amount: '', year: '2024-25' },
    { id: 9, description: 'UGD Charges Prior Year Doubtful Collection', amount: '', year: '2024-25' }
  ]);

  const [customEntry, setCustomEntry] = useState({ description: '', amount: '', year: '' });

  // Load initial data if editing
  useEffect(() => {
    if (initialData && initialData.entries) {
      setEntries(prevEntries => 
        prevEntries.map(entry => {
          const savedEntry = initialData.entries.find(saved => saved.id === entry.id);
          return savedEntry ? { ...entry, amount: savedEntry.amount.toLocaleString('en-IN'), year: savedEntry.year || '2024-25' } : entry;
        })
      );
    }
  }, [initialData]);

  const handleAmountChange = (id, value) => {
    // Format amount with Indian commas
    let processedValue = value;
    if (value) {
      const numericValue = value.replace(/,/g, '');
      if (/^\d*\.?\d*$/.test(numericValue)) {
        if (numericValue !== '' && !isNaN(numericValue)) {
          const parts = numericValue.split('.');
          parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
          processedValue = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
        }
      } else {
        return;
      }
    }

    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, amount: processedValue } : entry
      )
    );
  };

  const handleYearChange = (id, value) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id ? { ...entry, year: value } : entry
      )
    );
  };

  const addCustomEntry = () => {
    if (!customEntry.description.trim()) {
      alert('Please enter a description');
      return;
    }
    if (!customEntry.year.trim()) {
      alert('Please enter a year');
      return;
    }

    const newEntry = {
      id: entries.length + 1,
      description: customEntry.description,
      amount: customEntry.amount,
      year: customEntry.year,
      isCustom: true
    };

    setEntries(prev => [...prev, newEntry]);
    setCustomEntry({ description: '', amount: '', year: '' });
  };

  const removeCustomEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const calculateTotal = () => {
    return entries.reduce((sum, entry) => {
      const amount = parseFloat(entry.amount?.replace(/,/g, '') || 0);
      return sum + amount;
    }, 0);
  };

  const handleSave = () => {
    const total = calculateTotal();
    const formattedEntries = entries.map(entry => ({
      ...entry,
      amount: entry.amount ? parseFloat(entry.amount.replace(/,/g, '')) : 0,
      year: entry.year || '2024-25'
    }));

    const saveData = {
      type: 'doubtfulCollection',
      ledgerCode,
      ledgerName,
      entries: formattedEntries,
      total,
      journalNo,
      journalDate,
      timestamp: new Date().toISOString()
    };

    onSave(saveData);
  };

  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="p-2 text-white hover:bg-red-600 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Provisions for Doubtful Collection of Revenue Items
                  </h1>
                  <p className="text-red-100 mt-1">
                     {/* GJV • {journalNo} • {journalDate} */}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-red-100 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-white">
                  ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Account Head Details
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sl.No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Head
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    For the Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (₹)
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry, index) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={entry.year}
                        onChange={(e) => handleYearChange(entry.id, e.target.value)}
                        placeholder="e.g., 2024-25"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={entry.amount}
                        onChange={(e) => handleAmountChange(entry.id, e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {entry.isCustom && (
                        <button
                          onClick={() => removeCustomEntry(entry.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Remove Entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                
                {/* Total Row */}
                <tr className="bg-red-50 border-t-2 border-red-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900" colSpan="3">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-red-600">
                    ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add Custom Entry Section */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Entry
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={customEntry.description}
                  onChange={(e) => setCustomEntry(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter account head description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={customEntry.year}
                  onChange={(e) => setCustomEntry(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g., 2024-25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customEntry.amount}
                  onChange={(e) => {
                    const { value } = e.target;
                    let processedValue = value;
                    if (value) {
                      const numericValue = value.replace(/,/g, '');
                      if (/^\d*\.?\d*$/.test(numericValue)) {
                        if (numericValue !== '' && !isNaN(numericValue)) {
                          const parts = numericValue.split('.');
                          parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
                          processedValue = parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
                        }
                      } else {
                        return;
                      }
                    }
                    setCustomEntry(prev => ({ ...prev, amount: processedValue }));
                  }}
                  placeholder="Amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  onClick={addCustomEntry}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white px-6 py-4 border-t flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calculator className="h-4 w-4" />
              <span>Total entries: {entries.length}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save & Return</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubtfulCollectionForm;