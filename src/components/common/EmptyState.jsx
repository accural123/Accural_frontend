// ===== src/components/common/EmptyState.jsx =====
/**
 * EmptyState component for when no records exist
 * Features: icon, title, description, optional action button
 */
import React from 'react';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  onAction,
  searchTerm
}) => (
  <div className="text-center py-12">
    <Icon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-slate-900 mb-2">
      {searchTerm ? 'No results found' : title}
    </h3>
    <p className="text-slate-500 mb-6 max-w-md mx-auto">
      {searchTerm 
        ? `No records found matching "${searchTerm}". Try adjusting your search terms.`
        : description
      }
    </p>
    {!searchTerm && actionText && onAction && (
      <button
        onClick={onAction}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        {actionText}
      </button>
    )}
  </div>
);

// Default export for compatibility
export default EmptyState;