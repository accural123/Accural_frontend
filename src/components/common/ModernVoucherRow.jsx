import React from 'react';
import { Edit3, Trash2, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const ModernVoucherRow = ({ 
  voucher, 
  onEdit, 
  onDelete, 
  primaryField = 'journalNo',
  voucherNumberField = 'voucherNumber',
  dateField = 'journalDate',
  statusField = 'balanced',
  icon: Icon = FileText,
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-purple-500',
  borderColor = 'border-blue-200'
}) => (
  <div className={`bg-gradient-to-r from-white via-blue-50 to-purple-50 border ${borderColor} rounded-xl p-6 mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`h-12 w-12 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{voucher[primaryField]}</h3>
          <p className="text-sm text-gray-500">{voucher[voucherNumberField]}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {voucher.modeOfTransaction && (
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-semibold">
            {voucher.modeOfTransaction}
          </span>
        )}
        {voucher.brvType && (
          <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-xs font-semibold">
            {voucher.brvType}
          </span>
        )}
        {voucher.natureOfTransaction && (
          <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-xs font-semibold">
            {voucher.natureOfTransaction}
          </span>
        )}
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          voucher[statusField] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {voucher[statusField] ? 'Balanced' : 'Unbalanced'}
        </span>
      </div>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
        <p className="font-semibold text-gray-800">{voucher[dateField]}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Debit Total</p>
        <p className="font-semibold text-red-600">₹{formatCurrency(voucher.debitTotal)}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Credit Total</p>
        <p className="font-semibold text-green-600">₹{formatCurrency(voucher.creditTotal)}</p>
      </div>
      <div className="flex justify-end space-x-2">
        <button 
          onClick={() => onEdit(voucher)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          title="Edit Voucher"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button 
          onClick={() => onDelete(voucher)}
          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          title="Delete Voucher"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="border-t border-gray-200 pt-3">
      <div className="grid grid-cols-2 gap-4">
        {voucher.fromWhom && (
          <div>
            <p className="text-xs text-gray-500">From Whom:</p>
            <p className="text-sm font-medium text-gray-700">{voucher.fromWhom}</p>
          </div>
        )}
        {voucher.inFavourOf && (
          <div>
            <p className="text-xs text-gray-500">In Favour Of:</p>
            <p className="text-sm font-medium text-gray-700">{voucher.inFavourOf}</p>
          </div>
        )}
        {voucher.nameOfScheme && (
          <div>
            <p className="text-xs text-gray-500">Scheme:</p>
            <p className="text-sm font-medium text-gray-700">{voucher.nameOfScheme}</p>
          </div>
        )}
        {voucher.nameOfWork && (
          <div>
            <p className="text-xs text-gray-500">Work:</p>
            <p className="text-sm font-medium text-gray-700">{voucher.nameOfWork}</p>
          </div>
        )}
      </div>
      {voucher.narration && (
        <div className="mt-2">
          <p className="text-xs text-gray-500">Narration:</p>
          <p className="text-sm text-gray-600 truncate">{voucher.narration}</p>
        </div>
      )}
    </div>
  </div>
);
export default ModernVoucherRow;