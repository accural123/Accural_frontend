// components/common/BalanceStatus.js
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const BalanceStatus = ({ debitTotal, creditTotal }) => {
  const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01;
  
  return (
    <div className={`p-4 rounded-lg border ${
      isBalanced ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isBalanced ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          )}
          <span className={`font-semibold ${
            isBalanced ? 'text-green-800' : 'text-yellow-800'
          }`}>
            {isBalanced ? 'Entries are balanced' : 'Entries are not balanced'}
          </span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            Difference: ₹{Math.abs(debitTotal - creditTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
};