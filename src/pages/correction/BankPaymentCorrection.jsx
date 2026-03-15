
import React, { useState, useEffect } from 'react';
import { CreditCard, RefreshCw, Edit3, Trash2, CheckCircle, AlertCircle, DollarSign, Banknote } from 'lucide-react';

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

const BankPaymentVoucherCorrection = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [bankPaymentVouchers, setBankPaymentVouchers] = useState([]);
  const [searchFilters, setSearchFilters] = useState({ searchTerm: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '', fromWhom: '', fundType: '', status: '', transactionMode: '' });
  const [selectedIds, setSelectedIds] = useState(new Set());

  const bankPaymentService = createVoucherService('/bank-payments');

  useEffect(() => {
    loadBankPaymentVouchers();
  }, []);

  const loadBankPaymentVouchers = async () => {
    const filters = {};
    const result = await executeApi(bankPaymentService.getAll, filters);
    if (result.success) {
      setBankPaymentVouchers(result.data || []);
    }
  };

  const handleEditVoucher = (voucher) => {
    // Store the voucher data in localStorage for the BankPayment component to pick up
    localStorage.setItem('editingVoucher', JSON.stringify(voucher));
    localStorage.setItem('correctionMode', 'true');
    
    // Navigate using relative path
    window.location.href = '/transaction/bank-payment';
    
    showToast('Redirecting to edit voucher...', 'info');
  };

  const handleDeleteVoucher = async (voucher) => {
    const confirmed = await showConfirmDialog(
      'Delete Voucher', 
      `Are you sure you want to delete voucher "${voucher.bpvNo}"?`,
      'Delete',
      'Cancel'
    );
    
    if (confirmed) {
      const result = await executeApi(bankPaymentService.delete, voucher.id);
      if (result.success) {
        showToast('Voucher deleted successfully!', 'success');
        await loadBankPaymentVouchers();
      } else {
        showToast('Failed to delete voucher!', 'error');
      }
    }
  };

  const filteredVouchers = bankPaymentVouchers.filter(voucher => {
    const { searchTerm, dateFrom, dateTo, amountMin, amountMax, fromWhom, fundType, status } = searchFilters;
    const matchesSearch = !searchTerm ||
      voucher.bpvNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.inFavourOf?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.modeOfTransaction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.bpvDate?.includes(searchTerm);
    const matchesFromWhom = !fromWhom || voucher.inFavourOf?.toLowerCase().includes(fromWhom.toLowerCase());
    const matchesFundType = !fundType || voucher.fundType?.toLowerCase().includes(fundType.toLowerCase());
    const matchesStatus = !status || (status === 'balanced' ? voucher.balanced : !voucher.balanced);
    const matchesDateFrom = !dateFrom || (voucher.bpvDate && voucher.bpvDate >= dateFrom);
    const matchesDateTo = !dateTo || (voucher.bpvDate && voucher.bpvDate <= dateTo);
    const debitTotal = voucher.debitTotal || 0;
    const matchesAmountMin = !amountMin || debitTotal >= parseFloat(amountMin);
    const matchesAmountMax = !amountMax || debitTotal <= parseFloat(amountMax);
    return matchesSearch && matchesFromWhom && matchesFundType && matchesStatus && matchesDateFrom && matchesDateTo && matchesAmountMin && matchesAmountMax;
  });

  const totalPages = Math.ceil(filteredVouchers.length / ITEMS_PER_PAGE);
  const paginatedVouchers = filteredVouchers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectAll = () => {
    if (paginatedVouchers.every(v => selectedIds.has(v.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedVouchers.map(v => v.id)));
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
        const result = await executeApi(bankPaymentService.delete, id);
        if (result.success) count++;
      }
      setSelectedIds(new Set());
      await loadBankPaymentVouchers();
      showToast(`${count} voucher(s) deleted successfully!`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Bank Payment Correction"
        subtitle="Select a voucher to correct"
        icon={RefreshCw}
        totalRecords={bankPaymentVouchers.length}
        showRecords={true}
        setShowRecords={() => {}}
        editingId={null}
        resetForm={() => {}}
        loading={loading}
        gradientFrom="from-red-500"
        gradientTo="to-orange-500"
        countBg="from-red-100"
        countTo="to-orange-100"
        countBorder="border-red-200"
        countText="text-red-800"
      />

      <SearchableRecords
        title="Bank Payment Vouchers"
        totalRecords={filteredVouchers.length}
        searchFilters={searchFilters}
        onFiltersChange={(f) => { setSearchFilters(f); setCurrentPage(1); }}
        loading={loading}
        gradientFrom="from-red-500"
        gradientTo="to-orange-500"
        searchPlaceholder="Search by BPV No, In Favour of, Mode of Transaction, or Date..."
        filterConfig={{ dateRange: true, amountRange: true, fromWhom: true, fundType: true, status: true, transactionMode: false }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={ITEMS_PER_PAGE}
      >
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
        {filteredVouchers.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No bank payment vouchers found."
            actionText="Go to Bank Payments"
            onAction={() => window.location.href = '/bank-payment'}
            searchTerm={searchFilters.searchTerm}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <tr>
                  <th className="px-4 py-4 w-10">
                    <input
                      type="checkbox"
                      checked={paginatedVouchers.length > 0 && paginatedVouchers.every(v => selectedIds.has(v.id))}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">BPV Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Financial Summary</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Entries</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedVouchers.map((voucher, index) => (
                  <tr key={voucher.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(voucher.id)}
                        onChange={() => handleSelectItem(voucher.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">BPV - {voucher.bpvNo}</div>
                        <div className="text-sm text-gray-600">Date: {voucher.bpvDate}</div>
                        <div className="text-sm text-gray-600">Mode: {voucher.modeOfTransaction}</div>
                        {voucher.inFavourOf && (
                          <div className="text-sm text-gray-600">In Favour: {voucher.inFavourOf}</div>
                        )}
                        {voucher.chequeNoRefNo && (
                          <div className="text-sm text-gray-600">Ref: {voucher.chequeNoRefNo}</div>
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
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SearchableRecords>
    </div>
  );
};

export default BankPaymentVoucherCorrection;