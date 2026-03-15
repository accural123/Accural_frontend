
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw, Edit3, Trash2, CheckCircle, AlertCircle, DollarSign, Banknote, FileText, Building } from 'lucide-react';

// Import hooks
import { useToast } from '../../hooks/useToast';
import { useApiService } from '../../hooks/useApiService';
import { useAuth } from '../../context/AuthContext';

// Import components
import { ToastContainer } from '../../components/common/ToastContainer';
import { Header } from '../../components/common/Header';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { EmptyState } from '../../components/common/EmptyState';
import SearchableRecords from '../../components/common/SearchableRecords';

// Import utilities
import { showConfirmDialog } from '../../utils/confirmDialog';
import { createVoucherService } from '../../services/createVoucherService';

const ITEMS_PER_PAGE = 20;

const InterBankTransferCorrection = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();

  const [currentPage, setCurrentPage] = useState(1);
  const [interBankTransfers, setInterBankTransfers] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', modeOfTransaction: '', status: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '' });
  const [selectedIds, setSelectedIds] = useState(new Set());

  const interBankTransferService = createVoucherService('/inter-bank-transfers');

  useEffect(() => {
    loadInterBankTransfers();
  }, []);

  const loadInterBankTransfers = async () => {
    const filters = {};
    const result = await executeApi(interBankTransferService.getAll, filters);
    if (result.success) {
      setInterBankTransfers(result.data || []);
    }
  };

  const handleEditTransfer = (transfer) => {
    // Store the transfer data in localStorage for the InterBankTransfer component to pick up
    localStorage.setItem('editingVoucher', JSON.stringify(transfer));
    localStorage.setItem('correctionMode', 'true');
    
    // Navigate using relative path
    window.location.href = '/transaction/inter-bank-transfer';
    
    showToast('Redirecting to edit transfer...', 'info');
  };

  const handleDeleteTransfer = async (transfer) => {
    const confirmed = await showConfirmDialog(
      'Delete Transfer', 
      `Are you sure you want to delete transfer "${transfer.ibtNo}"?`,
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      const result = await executeApi(interBankTransferService.delete, transfer.id);
      if (result.success) {
        showToast('Transfer deleted successfully!', 'success');
        await loadInterBankTransfers();
      } else {
        showToast('Failed to delete transfer!', 'error');
      }
    }
  };

  const getTransactionModeDisplay = (modeOfTransaction) => {
    const modes = {
      'Cheque / DD': { label: 'Cheque/DD', color: 'bg-blue-100 text-blue-800', icon: 'Receipt' },
      'NEFT': { label: 'NEFT', color: 'bg-green-100 text-green-800', icon: 'Globe' },
      'RTGS': { label: 'RTGS', color: 'bg-orange-100 text-orange-800', icon: 'Zap' },
      'IMPS': { label: 'IMPS', color: 'bg-purple-100 text-purple-800', icon: 'CreditCard' },
      'UPI': { label: 'UPI', color: 'bg-pink-100 text-pink-800', icon: 'Smartphone' }
    };
    
    return modes[modeOfTransaction] || { label: modeOfTransaction, color: 'bg-gray-100 text-gray-800', icon: 'FileText' };
  };

  const filteredTransfers = interBankTransfers.filter(transfer => {
    const { searchTerm, modeOfTransaction, status, dateFrom, dateTo, amountMin, amountMax } = searchFilters;
    const matchesSearch = !searchTerm ||
      transfer.ibtNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.transferNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.modeOfTransaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.ibtDate?.includes(searchTerm) ||
      transfer.chequeNoRefNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.narration?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = !modeOfTransaction || transfer.modeOfTransaction?.toLowerCase().includes(modeOfTransaction.toLowerCase());
    const matchesStatus = !status || (status === 'balanced' ? transfer.balanced : !transfer.balanced);
    const matchesDateFrom = !dateFrom || (transfer.ibtDate && transfer.ibtDate >= dateFrom);
    const matchesDateTo = !dateTo || (transfer.ibtDate && transfer.ibtDate <= dateTo);
    const debitTotal = transfer.debitTotal || 0;
    const matchesAmountMin = !amountMin || debitTotal >= parseFloat(amountMin);
    const matchesAmountMax = !amountMax || debitTotal <= parseFloat(amountMax);
    return matchesSearch && matchesMode && matchesStatus && matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
  });

  const totalPages = Math.ceil(filteredTransfers.length / ITEMS_PER_PAGE);
  const paginatedTransfers = filteredTransfers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    if (paginatedTransfers.every(v => selectedIds.has(v.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedTransfers.map(v => v.id)));
    }
  };

  const handleSelectItem = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    const confirmed = await showConfirmDialog(
      'Delete Selected',
      `Are you sure you want to delete ${selectedIds.size} selected voucher(s)? This action cannot be undone.`,
      'Delete All',
      'Cancel'
    );
    if (confirmed) {
      let count = 0;
      for (const id of selectedIds) {
        const result = await executeApi(interBankTransferService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadInterBankTransfers();
      showToast(`${count} voucher(s) deleted successfully!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Inter Bank Transfer Correction"
        subtitle="Select a transfer to correct"
        icon={RefreshCw}
        totalRecords={interBankTransfers.length}
        showRecords={true}
        setShowRecords={() => {}}
        editingId={null}
        resetForm={() => {}}
        loading={loading}
        gradientFrom="from-green-500"
        gradientTo="to-blue-500"
        countBg="from-green-100"
        countTo="to-blue-100"
        countBorder="border-green-200"
        countText="text-green-800"
      />

      <SearchableRecords
        title="Inter Bank Transfers"
        totalRecords={filteredTransfers.length}
        searchFilters={searchFilters}
        onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
        loading={loading}
        gradientFrom="from-green-500"
        gradientTo="to-blue-500"
        searchPlaceholder="Search by IBT No, Mode, Date, Reference, or Narration..."
        filterConfig={{ dateRange: true, amountRange: true, fromWhom: false, fundType: false, status: true, transactionMode: false }}
        customFilters={[
          { key: 'modeOfTransaction', label: 'Mode of Transaction', type: 'select', options: [
            { value: 'Cheque / DD', label: 'Cheque / DD' },
            { value: 'NEFT', label: 'NEFT' },
            { value: 'RTGS', label: 'RTGS' },
            { value: 'IMPS', label: 'IMPS' },
            { value: 'UPI', label: 'UPI' },
          ]}
        ]}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={ITEMS_PER_PAGE}
      >
        {/* Transfers Table */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <span className="text-sm font-medium text-red-700">
              {selectedIds.size} voucher(s) selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg bg-white"
              >
                Clear
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected ({selectedIds.size})</span>
              </button>
            </div>
          </div>
        )}
        {filteredTransfers.length === 0 ? (
          <EmptyState
            icon={ArrowRightLeft}
            title="No inter bank transfers found."
            actionText="Go to Inter Bank Transfers"
            onAction={() => window.location.href = '/inter-bank-transfer'}
            searchTerm={searchFilters.searchTerm}
          />
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={paginatedTransfers.length > 0 && paginatedTransfers.every(v => selectedIds.has(v.id))}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Transfer Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Transaction Information</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Financial Summary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Entries</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTransfers.map((transfer, index) => {
                const transactionMode = getTransactionModeDisplay(transfer.modeOfTransaction);
                
                return (
                  <tr key={transfer.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(transfer.id)}
                        onChange={() => handleSelectItem(transfer.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900">
                          IBT - {transfer.ibtNo}
                        </div>
                        {transfer.transferNumber && (
                          <div className="text-sm text-gray-600">
                            Transfer: {transfer.transferNumber}
                          </div>
                        )}
                        <div className="text-sm text-gray-600">
                          Date: {transfer.ibtDate}
                        </div>
                        {transfer.narration && (
                          <div className="text-sm text-gray-600 truncate max-w-xs" title={transfer.narration}>
                            {transfer.narration}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${transactionMode.color}`}>
                            {transactionMode.label}
                          </span>
                        </div>
                        {transfer.chequeNoRefNo && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Ref:</span>
                            <div className="text-gray-600">{transfer.chequeNoRefNo}</div>
                          </div>
                        )}
                        {transfer.chequeDate && (
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Ref Date:</span>
                            <div className="text-gray-600">{transfer.chequeDate}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-red-600 font-medium">
                            Dr: ₹{transfer.debitTotal?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-green-600 font-medium">
                            Cr: ₹{transfer.creditTotal?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {Math.abs((transfer.debitTotal || 0) - (transfer.creditTotal || 0)) > 0.01 && (
                          <div className="text-sm text-orange-600 font-medium">
                            Diff: ₹{Math.abs((transfer.debitTotal || 0) - (transfer.creditTotal || 0)).toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {transfer.debitEntries && transfer.debitEntries.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <DollarSign className="h-4 w-4 text-red-500" />
                            <span className="text-red-600 font-medium">{transfer.debitEntries.length} From</span>
                          </div>
                        )}
                        {transfer.creditEntries && transfer.creditEntries.length > 0 && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Banknote className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 font-medium">{transfer.creditEntries.length} To</span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Total: {(transfer.entryCount || 0)} entries
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {transfer.balanced ? (
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
                          onClick={() => handleEditTransfer(transfer)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          title="Correct this transfer"
                        >
                          <Edit3 className="h-4 w-4" />
                          <span>Correct</span>
                        </button>
                        <button
                          onClick={() => handleDeleteTransfer(transfer)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                          title="Delete this transfer"
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
      </SearchableRecords>
    </div>
  );
};

export default InterBankTransferCorrection;