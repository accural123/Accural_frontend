import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

const SearchableLedgerSelect = ({ 
  value = '', 
  onChange, 
  ledgers = [], 
  placeholder = "Search and select ledger...",
  name,
  className = "",
  required = false,
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLedgers, setFilteredLedgers] = useState(ledgers || []);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter ledgers based on search term
  useEffect(() => {
    const safeLedgers = ledgers || [];
    if (!searchTerm) {
      setFilteredLedgers(safeLedgers);
    } else {
      const filtered = safeLedgers.filter(ledger =>
        (ledger.code && ledger.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ledger.name && ledger.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredLedgers(filtered);
    }
  }, [searchTerm]); // Remove ledgers from dependency array

  // Separate effect to handle ledgers changes
  useEffect(() => {
    setFilteredLedgers(ledgers || []);
    setSearchTerm(''); // Reset search when ledgers change
  }, [ledgers?.length]); // Only depend on length to avoid infinite loops

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (ledger) => {
    // Call onChange with the event-like structure your existing code expects
    const syntheticEvent = {
      target: {
        name: name,
        value: ledger.code
      }
    };
    onChange(syntheticEvent);
    
    // Also trigger change for the corresponding name field if it exists
    if (name && name.includes('Code')) {
      const nameField = name.replace('Code', 'Name');
      const nameEvent = {
        target: {
          name: nameField,
          value: ledger.name
        }
      };
      onChange(nameEvent);
    }
    
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    const syntheticEvent = {
      target: {
        name: name,
        value: ''
      }
    };
    onChange(syntheticEvent);
    
    // Also clear the corresponding name field
    if (name && name.includes('Code')) {
      const nameField = name.replace('Code', 'Name');
      const nameEvent = {
        target: {
          name: nameField,
          value: ''
        }
      };
      onChange(nameEvent);
    }
    
    setSearchTerm('');
  };

  const selectedLedger = (ledgers || []).find(ledger => ledger && ledger.code === value);
  const displayText = selectedLedger ? `${selectedLedger.code} - ${selectedLedger.name}` : '';

  // Early return if no onChange function provided
  if (!onChange) {
    console.warn('SearchableLedgerSelect: onChange prop is required');
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`
          w-full px-3 py-2 border rounded-lg bg-white cursor-pointer
          transition-colors duration-200 flex items-center justify-between
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}
          ${required && !value ? 'border-red-300' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-1">
          <Search className="h-4 w-4 text-gray-400 mr-2" />
          <span className={`truncate ${displayText ? 'text-gray-900' : 'text-gray-500'}`}>
            {displayText || placeholder}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
          <ChevronDown 
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search ledgers..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Ledger Options */}
          <div className="max-h-60 overflow-y-auto">
            {filteredLedgers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? `No ledgers found matching "${searchTerm}"` : 'No ledgers available'}
              </div>
            ) : (
              filteredLedgers.map((ledger) => {
                if (!ledger || !ledger.code) return null;
                return (
                  <div
                    key={ledger.code}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors duration-150
                      hover:bg-blue-50 border-b border-gray-100 last:border-b-0
                      ${selectedLedger?.code === ledger.code ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                    `}
                    onClick={() => handleSelect(ledger)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{ledger.code}</div>
                        <div className="text-sm text-gray-600 mt-1">{ledger.name || 'No name'}</div>
                      </div>
                      {selectedLedger?.code === ledger.code && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableLedgerSelect;