
import React, { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign, User, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Pagination from './Pagination';

export const SearchableRecords = ({
  title,
  totalRecords,
  searchFilters,
  onFiltersChange,
  loading,
  children,
  gradientFrom = 'from-purple-500',
  gradientTo = 'to-pink-500',
  showAdvancedSearch = true,
  customFilters = [],
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 20,
  filterConfig = {},
  searchPlaceholder = 'Search records...',
}) => {
  const {
    dateRange = true,
    amountRange = true,
    fromWhom = true,
    fundType = true,
    status = true,
    transactionMode = true,
  } = filterConfig;
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    status: '',
    fromWhom: '',
    fundType: '',
    transactionMode: '',
    ...searchFilters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = Object.keys(localFilters).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setLocalFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'balanced', label: 'Balanced' },
    { value: 'unbalanced', label: 'Unbalanced' }
  ];

  const transactionModeOptions = [
    { value: '', label: 'All Modes' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Cheque / DD', label: 'Cheque / DD' },
    { value: 'Online', label: 'Online Transfer' },
    { value: 'ECS', label: 'ECS' }
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
      <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <span>{title}</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {totalRecords}
            </span>
          </h2>
          
          {showAdvancedSearch && (
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors text-sm"
                  title="Clear all filters"
                >
                  <X className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              )}
              
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg text-white transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced</span>
                {isAdvancedOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Basic Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={localFilters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
            />
            {localFilters.searchTerm && (
              <button
                onClick={() => handleFilterChange('searchTerm', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {isAdvancedOpen && (
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Date Range */}
            {dateRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date From</span>
                </label>
                <input
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {dateRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Date To</span>
                </label>
                <input
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Amount Range */}
            {amountRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Min Amount</span>
                </label>
                <input
                  type="number"
                  placeholder="₹0"
                  value={localFilters.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {amountRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>Max Amount</span>
                </label>
                <input
                  type="number"
                  placeholder="₹999999"
                  value={localFilters.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* From Whom */}
            {fromWhom && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>From Whom</span>
                </label>
                <input
                  type="text"
                  placeholder="Person or entity name"
                  value={localFilters.fromWhom}
                  onChange={(e) => handleFilterChange('fromWhom', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Fund Type */}
            {fundType && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>Fund Type</span>
                </label>
                <input
                  type="text"
                  placeholder="Fund type name"
                  value={localFilters.fundType}
                  onChange={(e) => handleFilterChange('fundType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Status */}
            {status && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={localFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Transaction Mode */}
            {transactionMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Transaction Mode</label>
                <select
                  value={localFilters.transactionMode}
                  onChange={(e) => handleFilterChange('transactionMode', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {transactionModeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Custom Filters */}
            {customFilters.map((filter, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center space-x-1">
                  {filter.icon && <filter.icon className="h-4 w-4" />}
                  <span>{filter.label}</span>
                </label>
                {filter.type === 'select' ? (
                  <select
                    value={localFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type || 'text'}
                    placeholder={filter.placeholder}
                    value={localFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-sm font-medium text-slate-600">Active filters:</span>
                {Object.entries(localFilters)
                  .filter(([key, value]) => value !== '')
                  .map(([key, value]) => (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="ml-1">{value}</span>
                      <button
                        onClick={() => handleFilterChange(key, '')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-slate-600">Loading records...</span>
        </div>
      ) : (
        <div className="p-6">
          {children}
          {totalPages > 1 && onPageChange && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalRecords={totalRecords}
              pageSize={pageSize}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Default export for compatibility
export default SearchableRecords;