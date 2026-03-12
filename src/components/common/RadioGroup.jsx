import React from 'react';

export const RadioGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false,
  columns = 2,
  className = ''
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-4">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
      {options.map((option) => (
        <label 
          key={option.value} 
          className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
            value === option.value
              ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="text-blue-600 focus:ring-blue-500 focus:ring-2"
          />
          <div className="ml-3 flex-1">
            <span className={`font-medium text-base ${
              value === option.value ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {option.label}
            </span>
            {option.description && (
              <p className={`text-sm mt-1 ${
                value === option.value ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {option.description}
              </p>
            )}
          </div>
          {value === option.value && (
            <div className="ml-2">
              <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
          )}
        </label>
      ))}
    </div>
  </div>
);

// Default export for compatibility
export default RadioGroup;