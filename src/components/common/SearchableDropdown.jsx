
// import React, { useState, useEffect, useRef } from 'react';
// import { Search, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

// // Reusable Searchable Dropdown Component
// const SearchableDropdown = ({
//   options = [],
//   value = '',
//   onChange,
//   placeholder = 'Select an option',
//   searchPlaceholder = 'Search...',
//   label,
//   required = false,
//   disabled = false,
//   error = '',
//   icon: Icon,
//   maxHeight = '200px',
//   allowClear = true,
//   emptyMessage = 'No options available',
//   className = ''
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [dropdownPosition, setDropdownPosition] = useState('below');
//   const dropdownRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const buttonRef = useRef(null);

//   // Calculate dropdown position
//   useEffect(() => {
//     if (isOpen && buttonRef.current) {
//       const buttonRect = buttonRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;
//       const spaceBelow = windowHeight - buttonRect.bottom;
//       const spaceAbove = buttonRect.top;
      
//       // If there's not enough space below (less than 250px) and more space above
//       if (spaceBelow < 250 && spaceAbove > spaceBelow) {
//         setDropdownPosition('above');
//       } else {
//         setDropdownPosition('below');
//       }
//     }
//   }, [isOpen]);

//   // Filter options based on search term
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = options.filter(option => 
//         option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         option.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         option.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredOptions(filtered);
//     } else {
//       setFilteredOptions(options);
//     }
//   }, [searchTerm, options]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSearchTerm('');
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Focus search input when dropdown opens
//   useEffect(() => {
//     if (isOpen && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isOpen]);

//   const toggleDropdown = () => {
//     if (!disabled) {
//       setIsOpen(!isOpen);
//       setSearchTerm('');
//     }
//   };

//   const handleOptionSelect = (option) => {
//     onChange({
//       target: {
//         name: onChange.name || 'dropdown',
//         value: option.value
//       }
//     });
//     setIsOpen(false);
//     setSearchTerm('');
//   };

//   const handleClear = (e) => {
//     e.stopPropagation();
//     onChange({
//       target: {
//         name: onChange.name || 'dropdown',
//         value: ''
//       }
//     });
//   };

//   const selectedOption = options.find(option => option.value === value);
//   const displayValue = selectedOption ? selectedOption.label : '';

//   return (
//     <div className={`relative ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-slate-700 mb-2">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
      
//       <div className="relative" ref={dropdownRef}>
//         {/* Main Dropdown Button */}
//         <button
//           ref={buttonRef}
//           type="button"
//           onClick={toggleDropdown}
//           disabled={disabled}
//           className={`relative w-full bg-white/60 border rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//             error ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
//           } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//         >
//           <div className="flex items-center">
//             {Icon && (
//               <Icon className="h-4 w-4 text-slate-400 mr-3 flex-shrink-0" />
//             )}
//             <span className={`block truncate ${
//               displayValue ? 'text-slate-900' : 'text-slate-500'
//             }`}>
//               {displayValue || placeholder}
//             </span>
//           </div>
          
//           <span className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
//             {value && allowClear && !disabled && (
//               <button
//                 type="button"
//                 onClick={handleClear}
//                 className="p-1 hover:bg-slate-200 rounded transition-colors"
//               >
//                 <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
//               </button>
//             )}
//             {isOpen ? (
//               <ChevronUp className="h-4 w-4 text-slate-400" />
//             ) : (
//               <ChevronDown className="h-4 w-4 text-slate-400" />
//             )}
//           </span>
//         </button>

//         {/* Dropdown Panel */}
//         {isOpen && (
//           <div className={`absolute z-50 w-full bg-white shadow-lg max-h-96 rounded-lg border border-slate-200 overflow-hidden ${
//             dropdownPosition === 'above' 
//               ? 'bottom-full mb-1' 
//               : 'top-full mt-1'
//           }`}>
//             {/* Search Input */}
//             <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder={searchPlaceholder}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 />
//                 {searchTerm && (
//                   <button
//                     type="button"
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded transition-colors"
//                   >
//                     <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Options List */}
//             <div 
//               className="overflow-y-auto"
//               style={{ maxHeight }}
//             >
//               {filteredOptions.length === 0 ? (
//                 <div className="px-4 py-6 text-sm text-slate-500 text-center">
//                   {searchTerm ? (
//                     <div>
//                       <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
//                       <p>No results found for "{searchTerm}"</p>
//                       <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <div className="h-8 w-8 bg-slate-200 rounded mx-auto mb-2"></div>
//                       <p>{emptyMessage}</p>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 filteredOptions.map((option, index) => (
//                   <button
//                     key={option.value || index}
//                     type="button"
//                     onClick={() => handleOptionSelect(option)}
//                     className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-l-4 ${
//                       value === option.value 
//                         ? 'bg-blue-100 text-blue-700 border-blue-500' 
//                         : 'text-slate-900 border-transparent hover:border-blue-200'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="font-medium text-sm">{option.label}</div>
//                         {option.description && (
//                           <div className="text-xs text-slate-500 mt-1">{option.description}</div>
//                         )}
//                       </div>
//                       {value === option.value && (
//                         <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
//                       )}
//                     </div>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Error Message */}
//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}
//     </div>
//   );
// }; 
// export default SearchableDropdown
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

// Reusable Searchable Dropdown Component - Fixed nested button issue
const SearchableDropdown = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select an option',
  searchPlaceholder = 'Search...',
  label,
  required = false,
  disabled = false,
  error = '',
  icon: Icon,
  maxHeight = '200px',
  allowClear = true,
  emptyMessage = 'No options available',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [dropdownPosition, setDropdownPosition] = useState('below');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const buttonRef = useRef(null);

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      // If there's not enough space below (less than 250px) and more space above
      if (spaceBelow < 250 && spaceAbove > spaceBelow) {
        setDropdownPosition('above');
      } else {
        setDropdownPosition('below');
      }
    }
  }, [isOpen]);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option => 
        option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleOptionSelect = (option) => {
    onChange({
      target: {
        name: onChange.name || 'dropdown',
        value: option.value
      }
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange({
      target: {
        name: onChange.name || 'dropdown',
        value: ''
      }
    });
  };

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : '';

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        {/* Main Dropdown Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`relative w-full bg-white/60 border rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            error ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center">
            {Icon && (
              <Icon className="h-4 w-4 text-slate-400 mr-3 flex-shrink-0" />
            )}
            <span className={`block truncate ${
              displayValue ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {displayValue || placeholder}
            </span>
          </div>
          
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {value && allowClear && !disabled && (
              <div
                onClick={handleClear}
                className="p-1 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClear(e);
                  }
                }}
              >
                <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
              </div>
            )}
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </span>
        </button>

        {/* Dropdown Panel */}
        {isOpen && (
          <div className={`absolute z-50 w-full bg-white shadow-lg max-h-96 rounded-lg border border-slate-200 overflow-hidden ${
            dropdownPosition === 'above' 
              ? 'bottom-full mb-1' 
              : 'top-full mt-1'
          }`}>
            {/* Search Input */}
            <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {searchTerm && (
                  <div
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSearchTerm('');
                      }
                    }}
                  >
                    <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Options List */}
            <div 
              className="overflow-y-auto"
              style={{ maxHeight }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500 text-center">
                  {searchTerm ? (
                    <div>
                      <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p>No results found for "{searchTerm}"</p>
                      <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    <div>
                      <div className="h-8 w-8 bg-slate-200 rounded mx-auto mb-2"></div>
                      <p>{emptyMessage}</p>
                    </div>
                  )}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={option.value || index}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-l-4 ${
                      value === option.value 
                        ? 'bg-blue-100 text-blue-700 border-blue-500' 
                        : 'text-slate-900 border-transparent hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-slate-500 mt-1">{option.description}</div>
                        )}
                      </div>
                      {value === option.value && (
                        <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}; 

export default SearchableDropdown;
// import React, { useState, useEffect, useRef } from 'react';
// import { Search, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

// // Reusable Searchable Dropdown Component - Fixed visibility issues
// const SearchableDropdown = ({
//   options = [],
//   value = '',
//   onChange,
//   placeholder = 'Select an option',
//   searchPlaceholder = 'Search...',
//   label,
//   required = false,
//   disabled = false,
//   error = '',
//   icon: Icon,
//   maxHeight = '200px',
//   allowClear = true,
//   emptyMessage = 'No options available',
//   className = ''
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [dropdownPosition, setDropdownPosition] = useState('below');
//   const dropdownRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const buttonRef = useRef(null);

//   // Calculate dropdown position
//   useEffect(() => {
//     if (isOpen && buttonRef.current) {
//       const buttonRect = buttonRef.current.getBoundingClientRect();
//       const windowHeight = window.innerHeight;
//       const spaceBelow = windowHeight - buttonRect.bottom;
//       const spaceAbove = buttonRect.top;
      
//       // If there's not enough space below (less than 250px) and more space above
//       if (spaceBelow < 250 && spaceAbove > spaceBelow) {
//         setDropdownPosition('above');
//       } else {
//         setDropdownPosition('below');
//       }
//     }
//   }, [isOpen]);

//   // Filter options based on search term
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = options.filter(option => 
//         option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         option.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         option.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredOptions(filtered);
//     } else {
//       setFilteredOptions(options);
//     }
//   }, [searchTerm, options]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSearchTerm('');
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Focus search input when dropdown opens
//   useEffect(() => {
//     if (isOpen && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isOpen]);

//   const toggleDropdown = () => {
//     if (!disabled) {
//       setIsOpen(!isOpen);
//       setSearchTerm('');
//     }
//   };

//   const handleOptionSelect = (option) => {
//     onChange({
//       target: {
//         name: onChange.name || 'dropdown',
//         value: option.value
//       }
//     });
//     setIsOpen(false);
//     setSearchTerm('');
//   };

//   const handleClear = (e) => {
//     e.stopPropagation();
//     onChange({
//       target: {
//         name: onChange.name || 'dropdown',
//         value: ''
//       }
//     });
//   };

//   const selectedOption = options.find(option => option.value === value);
//   const displayValue = selectedOption ? selectedOption.label : '';

//   return (
//     <div className={`relative ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-slate-700 mb-2">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
      
//       <div className="relative" ref={dropdownRef}>
//         {/* Main Dropdown Button */}
//         <button
//           ref={buttonRef}
//           type="button"
//           onClick={toggleDropdown}
//           disabled={disabled}
//           className={`relative w-full bg-white/60 border rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//             error ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
//           } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//         >
//           <div className="flex items-center">
//             {Icon && (
//               <Icon className="h-4 w-4 text-slate-400 mr-3 flex-shrink-0" />
//             )}
//             <span className={`block truncate ${
//               displayValue ? 'text-slate-900' : 'text-slate-500'
//             }`}>
//               {displayValue || placeholder}
//             </span>
//           </div>
          
//           <span className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
//             {value && allowClear && !disabled && (
//               <div
//                 onClick={handleClear}
//                 className="p-1 hover:bg-slate-200 rounded transition-colors cursor-pointer"
//                 role="button"
//                 tabIndex={0}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault();
//                     handleClear(e);
//                   }
//                 }}
//               >
//                 <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
//               </div>
//             )}
//             {isOpen ? (
//               <ChevronUp className="h-4 w-4 text-slate-400" />
//             ) : (
//               <ChevronDown className="h-4 w-4 text-slate-400" />
//             )}
//           </span>
//         </button>

//         {/* Dropdown Panel - FIXED VISIBILITY ISSUES */}
//         {isOpen && (
//           <div className={`absolute z-[9999] w-full shadow-2xl max-h-96 rounded-lg border border-slate-300 overflow-hidden ${
//             dropdownPosition === 'above' 
//               ? 'bottom-full mb-1' 
//               : 'top-full mt-1'
//           }`}
//           style={{
//             backgroundColor: '#ffffff',
//             backdropFilter: 'none'
//           }}>
//             {/* Search Input - Enhanced visibility */}
//             <div className="p-3 border-b border-slate-200 sticky top-0 z-10"
//                  style={{ backgroundColor: '#ffffff' }}>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder={searchPlaceholder}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-slate-900"
//                   style={{ backgroundColor: '#ffffff' }}
//                 />
//                 {searchTerm && (
//                   <div
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded transition-colors cursor-pointer"
//                     role="button"
//                     tabIndex={0}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' || e.key === ' ') {
//                         e.preventDefault();
//                         setSearchTerm('');
//                       }
//                     }}
//                   >
//                     <X className="h-3 w-3 text-slate-500 hover:text-slate-700" />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Options List - Enhanced visibility */}
//             <div 
//               className="overflow-y-auto"
//               style={{ 
//                 maxHeight,
//                 backgroundColor: '#ffffff'
//               }}
//             >
//               {filteredOptions.length === 0 ? (
//                 <div className="px-4 py-6 text-sm text-slate-600 text-center bg-white">
//                   {searchTerm ? (
//                     <div>
//                       <Search className="h-8 w-8 text-slate-400 mx-auto mb-2" />
//                       <p className="font-medium text-slate-700">No results found for "{searchTerm}"</p>
//                       <p className="text-xs text-slate-500 mt-1">Try a different search term</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <div className="h-8 w-8 bg-slate-300 rounded mx-auto mb-2"></div>
//                       <p className="font-medium text-slate-700">{emptyMessage}</p>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 filteredOptions.map((option, index) => (
//                   <button
//                     key={option.value || index}
//                     type="button"
//                     onClick={() => handleOptionSelect(option)}
//                     className={`w-full px-4 py-3 text-left transition-all duration-150 border-l-4 bg-white hover:bg-blue-50 focus:bg-blue-100 focus:outline-none ${
//                       value === option.value 
//                         ? 'bg-blue-50 text-blue-800 border-blue-500 shadow-sm' 
//                         : 'text-slate-800 border-transparent hover:border-blue-300 hover:shadow-sm'
//                     }`}
//                     style={{ backgroundColor: value === option.value ? '#eff6ff' : '#ffffff' }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className={`font-medium text-sm ${
//                           value === option.value ? 'text-blue-900' : 'text-slate-900'
//                         }`}>
//                           {option.label}
//                         </div>
//                         {option.description && (
//                           <div className={`text-xs mt-1 ${
//                             value === option.value ? 'text-blue-700' : 'text-slate-600'
//                           }`}>
//                             {option.description}
//                           </div>
//                         )}
//                       </div>
//                       {value === option.value && (
//                         <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
//                       )}
//                     </div>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Error Message */}
//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}
//     </div>
//   );
// }; 

// export default SearchableDropdown;
// import React, { useState, useEffect, useRef } from 'react';
// import { Search, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

// // Reusable Searchable Dropdown Component
// const SearchableDropdown = ({
//   options = [],
//   value = '',
//   onChange,
//   placeholder = 'Select an option',
//   searchPlaceholder = 'Search...',
//   label,
//   required = false,
//   disabled = false,
//   error = '',
//   icon: Icon,
//   maxHeight = '200px',
//   allowClear = true,
//   emptyMessage = 'No options available',
//   className = ''
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredOptions, setFilteredOptions] = useState(options);
//   const [dropdownPosition, setDropdownPosition] = useState('below');
//   const dropdownRef = useRef(null);
//   const searchInputRef = useRef(null);
//   const buttonRef = useRef(null);

//   // Calculate dropdown position - Always open above
//   useEffect(() => {
//     if (isOpen) {
//       setDropdownPosition('above');
//     }
//   }, [isOpen]);

//   // Filter options based on search term
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = options.filter(option => 
//         option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         option.value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         option.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredOptions(filtered);
//     } else {
//       setFilteredOptions(options);
//     }
//   }, [searchTerm, options]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//         setSearchTerm('');
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Focus search input when dropdown opens
//   useEffect(() => {
//     if (isOpen && searchInputRef.current) {
//       searchInputRef.current.focus();
//     }
//   }, [isOpen]);

//   const toggleDropdown = () => {
//     if (!disabled) {
//       setIsOpen(!isOpen);
//       setSearchTerm('');
//     }
//   };

//   const handleOptionSelect = (option) => {
//     onChange({
//       target: {
//         name: onChange.name || 'dropdown',
//         value: option.value
//       }
//     });
//     setIsOpen(false);
//     setSearchTerm('');
//   };

//   const handleClear = (e) => {
//     e.stopPropagation();
//     onChange({
//       target: {
//         name: onChange.name || 'dropdown',
//         value: ''
//       }
//     });
//   };

//   const selectedOption = options.find(option => option.value === value);
//   const displayValue = selectedOption ? selectedOption.label : '';

//   return (
//     <div className={`relative ${className}`}>
//       {label && (
//         <label className="block text-sm font-medium text-slate-700 mb-2">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//       )}
      
//       <div className="relative" ref={dropdownRef}>
//         {/* Main Dropdown Button */}
//         <button
//           ref={buttonRef}
//           type="button"
//           onClick={toggleDropdown}
//           disabled={disabled}
//           className={`relative w-full bg-white/60 border rounded-lg shadow-sm pl-3 pr-10 py-3 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
//             error ? 'border-red-300' : 'border-slate-300 hover:border-slate-400'
//           } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
//         >
//           <div className="flex items-center">
//             {Icon && (
//               <Icon className="h-4 w-4 text-slate-400 mr-3 flex-shrink-0" />
//             )}
//             <span className={`block truncate ${
//               displayValue ? 'text-slate-900' : 'text-slate-500'
//             }`}>
//               {displayValue || placeholder}
//             </span>
//           </div>
          
//           <span className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
//             {value && allowClear && !disabled && (
//               <button
//                 type="button"
//                 onClick={handleClear}
//                 className="p-1 hover:bg-slate-200 rounded transition-colors"
//               >
//                 <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
//               </button>
//             )}
//             {isOpen ? (
//               <ChevronUp className="h-4 w-4 text-slate-400" />
//             ) : (
//               <ChevronDown className="h-4 w-4 text-slate-400" />
//             )}
//           </span>
//         </button>

//         {/* Dropdown Panel */}
//         {isOpen && (
//           <div className={`absolute z-50 w-full bg-white shadow-lg max-h-96 rounded-lg border border-slate-200 overflow-hidden ${
//             dropdownPosition === 'above' 
//               ? 'bottom-full mb-1' 
//               : 'top-full mt-1'
//           }`}>
//             {/* Search Input */}
//             <div className="p-3 border-b border-slate-200 bg-white sticky top-0 z-10">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
//                 <input
//                   ref={searchInputRef}
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder={searchPlaceholder}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 />
//                 {searchTerm && (
//                   <button
//                     type="button"
//                     onClick={() => setSearchTerm('')}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-slate-200 rounded transition-colors"
//                   >
//                     <X className="h-3 w-3 text-slate-400 hover:text-slate-600" />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Options List */}
//             <div 
//               className="overflow-y-auto"
//               style={{ maxHeight }}
//             >
//               {filteredOptions.length === 0 ? (
//                 <div className="px-4 py-6 text-sm text-slate-500 text-center">
//                   {searchTerm ? (
//                     <div>
//                       <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
//                       <p>No results found for "{searchTerm}"</p>
//                       <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
//                     </div>
//                   ) : (
//                     <div>
//                       <div className="h-8 w-8 bg-slate-200 rounded mx-auto mb-2"></div>
//                       <p>{emptyMessage}</p>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 filteredOptions.map((option, index) => (
//                   <button
//                     key={option.value || index}
//                     type="button"
//                     onClick={() => handleOptionSelect(option)}
//                     className={`w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-l-4 ${
//                       value === option.value 
//                         ? 'bg-blue-100 text-blue-700 border-blue-500' 
//                         : 'text-slate-900 border-transparent hover:border-blue-200'
//                     }`}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="font-medium text-sm">{option.label}</div>
//                         {option.description && (
//                           <div className="text-xs text-slate-500 mt-1">{option.description}</div>
//                         )}
//                       </div>
//                       {value === option.value && (
//                         <Check className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
//                       )}
//                     </div>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Error Message */}
//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}
//     </div>
//   );
// };
// export default SearchableDropdown