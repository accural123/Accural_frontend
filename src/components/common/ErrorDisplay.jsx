import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export const ErrorDisplay = ({ error, onClear }) => {
  // Don't render if no error
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            Error
          </h3>
          <div className="mt-1 text-sm text-red-700">
            {typeof error === 'string' ? (
              <p>{error}</p>
            ) : (
              <div>
                {Array.isArray(error) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {error.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{error.message || 'An unexpected error occurred'}</p>
                )}
              </div>
            )}
          </div>
        </div>
        {onClear && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClear}
                className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors"
                title="Dismiss error"
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ErrorDisplay;