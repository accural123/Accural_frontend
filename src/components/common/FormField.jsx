// // components/common/FormField.jsx
// import React from 'react';

// export const FormField = ({ 
//   label, 
//   type = 'text', 
//   value, 
//   onChange, 
//   options = [], 
//   placeholder, 
//   required = false,
//   className = '',
//   ...props 
// }) => {
//   const inputClasses = `w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`;

//   const renderInput = () => {
//     switch (type) {
//       case 'select':
//         return (
//           <select 
//             value={value} 
//             onChange={onChange} 
//             className={inputClasses}
//             required={required}
//             {...props}
//           >
//             <option value="">Select {label}</option>
//             {options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );
//       case 'textarea':
//         return (
//           <textarea 
//             value={value} 
//             onChange={onChange} 
//             placeholder={placeholder}
//             className={`${inputClasses} min-h-[100px]`}
//             required={required}
//             {...props}
//           />
//         );
//       case 'radio':
//         return (
//           <div className="flex flex-wrap gap-4">
//             {options.map((option) => (
//               <label key={option.value} className="flex items-center space-x-2">
//                 <input
//                   type="radio"
//                   value={option.value}
//                   checked={value === option.value}
//                   onChange={onChange}
//                   className="text-teal-600 focus:ring-teal-500"
//                   required={required}
//                   {...props}
//                 />
//                 <span className="text-gray-700">{option.label}</span>
//               </label>
//             ))}
//           </div>
//         );
//       default:
//         return (
//           <input 
//             type={type} 
//             value={value} 
//             onChange={onChange} 
//             placeholder={placeholder}
//             className={inputClasses}
//             required={required}
//             {...props}
//           />
//         );
//     }
//   };

//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-medium text-gray-700 mb-2">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       {renderInput()}
//     </div>
//   );
// };





// components/common/FormField.jsx
import React from 'react';

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  error,
  icon: Icon,
  className = '',
  rows = 3,
  maxLength,
  step,
  ...props
}) => {
  const baseClasses = `w-full pr-3 py-2.5 bg-white/60 backdrop-blur-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
    error ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'
  } ${className}`;

  const inputClasses = `${baseClasses} ${Icon ? 'pl-10' : 'pl-3'}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <select
              name={name}
              value={value || ''}
              onChange={onChange}
              className={inputClasses}
              required={required}
              {...props}
            >
              <option value="">Select {label}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'textarea':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute top-3 left-3 pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <textarea
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={inputClasses}
              rows={rows}
              required={required}
              maxLength={maxLength}
              {...props}
            />
          </div>
        );

      case 'radio':
        return (
          <div className="flex flex-wrap gap-4">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  className="w-4 h-4 text-purple-600 bg-white/60 backdrop-blur-sm border-2 border-slate-200 focus:ring-purple-500 focus:ring-2"
                  required={required}
                  {...props}
                />
                <span className="text-slate-700 text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex flex-wrap gap-4">
            {options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value) : value === option.value}
                  onChange={onChange}
                  className="w-4 h-4 text-purple-600 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded focus:ring-purple-500 focus:ring-2"
                  {...props}
                />
                <span className="text-slate-700 text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type="number"
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={inputClasses}
              required={required}
              step={step}
              maxLength={maxLength}
              {...props}
            />
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type="date"
              name={name}
              value={value || ''}
              onChange={onChange}
              className={inputClasses}
              required={required}
              {...props}
            />
          </div>
        );

      case 'time':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type="time"
              name={name}
              value={value || ''}
              onChange={onChange}
              className={inputClasses}
              required={required}
              {...props}
            />
          </div>
        );

      case 'email':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type="email"
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={inputClasses}
              required={required}
              maxLength={maxLength}
              {...props}
            />
          </div>
        );

      case 'tel':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type="tel"
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={inputClasses}
              required={required}
              maxLength={maxLength}
              {...props}
            />
          </div>
        );

      case 'password':
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type="password"
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={inputClasses}
              required={required}
              maxLength={maxLength}
              {...props}
            />
          </div>
        );

      case 'file':
        return (
          <div className="relative">
            <input
              type="file"
              name={name}
              onChange={onChange}
              className={`${baseClasses} pl-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer cursor-pointer`}
              required={required}
              {...props}
            />
          </div>
        );

      default:
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
            )}
            <input
              type={type}
              name={name}
              value={value || ''}
              onChange={onChange}
              placeholder={placeholder}
              className={inputClasses}
              required={required}
              maxLength={maxLength}
              {...props}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {maxLength && (
        <p className="text-slate-400 text-xs">
          {(value?.length || 0)}/{maxLength} characters
        </p>
      )}
    </div>
  );
};
export default FormField