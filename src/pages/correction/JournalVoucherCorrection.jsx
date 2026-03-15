
import React, { useState, useEffect } from 'react';
import { BookOpen, RefreshCw, Edit3, Trash2, CheckCircle, AlertCircle, DollarSign, Banknote, FileText, Building } from 'lucide-react';

// Import hooks
import { useToast } from '../../hooks/useToast';
import { useApiService } from '../../hooks/useApiService';
import { useAuth } from '../../context/AuthContext';

// Import components
import { ToastContainer } from '../../components/common/ToastContainer';
import { Header } from '../../components/common/Header';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { EmptyState } from '../../components/common/EmptyState';

// Import utilities
import { showConfirmDialog } from '../../utils/confirmDialog';
import { createVoucherService } from '../../services/createVoucherService';
import Pagination from '../../components/common/Pagination';

const ITEMS_PER_PAGE = 20;

const JournalVoucherCorrection = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [journalVouchers, setJournalVouchers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const journalVoucherService = createVoucherService('/journal-vouchers');

  useEffect(() => {
    loadJournalVouchers();
  }, []);

  const loadJournalVouchers = async () => {
    const filters = {};
    const result = await executeApi(journalVoucherService.getAll, filters);
    if (result.success) {
      setJournalVouchers(result.data || []);
    }
  };

  const handleEditVoucher = (voucher) => {
    // Store the voucher data in localStorage for the Journal component to pick up
    localStorage.setItem('editingVoucher', JSON.stringify(voucher));
    localStorage.setItem('correctionMode', 'true');
    
    // Navigate using relative path
    window.location.href = '/transaction/journal-voucher';
    
    showToast('Redirecting to edit voucher...', 'info');
  };

  const handleDeleteVoucher = async (voucher) => {
    const confirmed = await showConfirmDialog(
      'Delete Voucher', 
      `Are you sure you want to delete voucher "${voucher.journalNo}"?`,
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      const result = await executeApi(journalVoucherService.delete, voucher.id);
      if (result.success) {
        showToast('Voucher deleted successfully!', 'success');
        await loadJournalVouchers();
      } else {
        showToast('Failed to delete voucher!', 'error');
      }
    }
  };

  const getTransactionTypeDisplay = (natureOfTransaction) => {
    const types = {
      'EJV': { label: 'EJV', color: 'bg-red-100 text-red-800', description: 'Expenditure' },
      'PJV': { label: 'PJV', color: 'bg-blue-100 text-blue-800', description: 'Purchase' },
      'CJV': { label: 'CJV', color: 'bg-green-100 text-green-800', description: 'Contra' },
      'FAJV': { label: 'FAJV', color: 'bg-purple-100 text-purple-800', description: 'Fixed Asset' },
      'GJV': { label: 'GJV', color: 'bg-gray-100 text-gray-800', description: 'General' }
    };
    
    return types[natureOfTransaction] || { label: natureOfTransaction, color: 'bg-gray-100 text-gray-800', description: 'Unknown' };
  };

  const filteredVouchers = journalVouchers.filter(voucher =>
    voucher.journalNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.voucherNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.natureOfTransaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.journalDate?.includes(searchTerm) ||
    voucher.nameOfTheScheme?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.nameOfTheWork?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.narration?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Journal Voucher Correction"
        subtitle="Select a voucher to correct"
        icon={RefreshCw}
        totalRecords={journalVouchers.length}
        showRecords={true}
        setShowRecords={() => {}}
        editingId={null}
        resetForm={() => {}}
        loading={loading}
        gradientFrom="from-purple-500"
        gradientTo="to-indigo-500"
        countBg="from-purple-100"
        countTo="to-indigo-100"
        countBorder="border-purple-200"
        countText="text-purple-800"
      />

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <input
          type="text"
          placeholder="Search by Journal No, Nature, Date, Scheme, Work, or Narration..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Vouchers Table */}
      {filteredVouchers.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No journal vouchers found."
          actionText="Go to Journal Vouchers"
          onAction={() => window.location.href = '/journal-voucher'}
          searchTerm={searchTerm}
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Journal Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Project Information</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Financial Summary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Entries</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedVouchers.map((voucher, index) => {
                const transactionType = getTransactionTypeDisplay(voucher.natureOfTransaction);
                
                return (
                  <tr key={voucher.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900">
                          Journal - {voucher.journalNo}
                        </div>
                        {voucher.voucherNumber && (
                          <div className="text-sm text-gray-600">
                            Voucher: {voucher.voucherNumber}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Date: {voucher.journalDate}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${transactionType.color}`}>
                            {transactionType.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {transactionType.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {voucher.nameOfTheScheme && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Scheme:</span>
                            <div className="text-gray-600">{voucher.nameOfTheScheme}</div>
                          </div>
                        )}
                        {voucher.nameOfTheWork && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Work:</span>
                            <div className="text-gray-600">{voucher.nameOfTheWork}</div>
                          </div>
                        )}
                        {voucher.estimateValue && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Est. Value:</span>
                            <div className="text-gray-600">₹{parseFloat(voucher.estimateValue).toLocaleString('en-IN')}</div>
                          </div>
                        )}
                        {voucher.narration && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Narration:</span>
                            <div className="text-gray-600 truncate max-w-xs" title={voucher.narration}>
                              {voucher.narration}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-red-600 font-medium">
                            Dr: ₹{voucher.debitTotal?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            Cr: ₹{voucher.creditTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {Math.abs((voucher.debitTotal || 0) - (voucher.creditTotal || 0)) > 0.01 && (
                          <div className="text-sm text-orange-600 font-medium">
                            Diff: ₹{Math.abs((voucher.debitTotal || 0) - (voucher.creditTotal || 0)).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {voucher.debitEntries && voucher.debitEntries.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-red-500" />
                            <span className="text-red-600 font-medium">{voucher.debitEntries.length} Debit</span>
                          </div>
                        )}
                        {voucher.creditEntries && voucher.creditEntries.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Banknote className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 font-medium">{voucher.creditEntries.length} Credit</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Total: {(voucher.entryCount || 0)} entries
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {voucher.balanced ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium text-green-600">Balanced</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-sm font-medium text-red-600">Unbalanced</span>
                          </>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleEditVoucher(voucher)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          title="Correct this voucher"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Correct</span>
                        </button>
                        <button
                          onClick={() => handleDeleteVoucher(voucher)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                          title="Delete this voucher"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {filteredVouchers.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {paginatedVouchers.length} of {filteredVouchers.length} vouchers
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default JournalVoucherCorrection;