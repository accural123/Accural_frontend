import React from 'react';
import { Eye, Plus, FileText } from 'lucide-react';

export const Header = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  totalRecords = 0, 
  showRecords = false, 
  setShowRecords, 
  editingId = null, 
  resetForm, 
  loading = false,
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-green-500',
  countBg = 'from-blue-100',
  countTo = 'to-green-100',
  countBorder = 'border-blue-200',
  countText = 'text-blue-800',
  countIcon = 'text-blue-600'
}) => {
  return (
    <div className="flex items-center justify-between">
      {/* Left side - Title and subtitle */}
      <div className="flex items-center space-x-3">
        <div className={`h-8 w-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg flex items-center justify-center`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {editingId ? 'Edit' : 'Create'} {title}
          </h1>
          <p className="text-slate-600">{subtitle}</p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Record count */}
        <div className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r ${countBg} ${countTo} border ${countBorder} rounded-lg`}>
          <FileText className={`h-4 w-4 ${countIcon}`} />
          <span className={`text-sm font-semibold ${countText}`}>
            Total Records: {totalRecords}
          </span>
        </div>

        {/* View/Hide Records button */}
        <button
          onClick={() => setShowRecords(!showRecords)}
          className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={loading}
        >
          <Eye className="h-4 w-4" />
          <span>{showRecords ? 'Hide Records' : 'Edit Records'}</span>
        </button>

        {/* Add New button (only shown when editing) */}
        {editingId && (
          <button
            onClick={() => {
              resetForm();
              setShowRecords(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            title="Cancel editing and add new record"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Default export for easier importing
export default Header;