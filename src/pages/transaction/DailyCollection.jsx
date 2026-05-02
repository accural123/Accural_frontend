import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator, Calendar, AlertCircle, CheckCircle, Plus, Save, RefreshCw, Eye,
  FileText, Search, Receipt, Trash2, Edit3, CreditCard, Banknote, DollarSign,
  IndianRupee, User, MessageSquare, Wallet, ChevronDown, ChevronUp
} from 'lucide-react';

import { useToast } from '../../hooks/useToast';
import { useApiService } from '../../hooks/useApiService';
import { fundService, accountService } from '../../services/apiServices';
import { useAuth } from '../../context/AuthContext';

import { ToastContainer } from '../../components/common/ToastContainer';
import { FormField } from '../../components/common/FormField';
import { BalanceStatus } from '../../components/common/BalanceStatus';
import { Header } from '../../components/common/Header';
import { ErrorDisplay } from '../../components/common/ErrorDisplay';
import { SubmitButton } from '../../components/common/SubmitButton';
import { EmptyState } from '../../components/common/EmptyState';
import SearchableDropdown from '../../components/common/SearchableDropdown';
import SearchableRecords from '../../components/common/SearchableRecords';
import { ResetButton } from '../../components/common/ResetButton';
import { ConfirmDialog, useConfirmDialog } from '../../components/common/Popup';
import { createVoucherService } from '../../services/createVoucherService';

const ITEMS_PER_PAGE = 20;

const today = new Date().toISOString().split('T')[0];
const emptyEntry = { ledgerCode: '', ledgerName: '', amount: '' };
const emptyChallan = { challanNo: '', fundType: '', fromWhom: '', purpose: '', debitEntries: [], creditEntries: [] };

const calcTotal = (entries = []) =>
  entries.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

const formatAmountInput = (value) => {
  const numeric = value.replace(/,/g, '');
  if (!/^\d*\.?\d*$/.test(numeric)) return null;
  if (!numeric || isNaN(numeric)) return value;
  const parts = numeric.split('.');
  parts[0] = parseInt(parts[0] || '0').toLocaleString('en-IN');
  return parts.length > 1 ? parts[0] + '.' + parts[1] : parts[0];
};

const DailyCollection = () => {
  const { toasts, showToast, removeToast } = useToast();
  const { executeApi, loading, error, clearError } = useApiService();
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { getWorkspaceSelection } = useAuth();

  const dailyCollectionService = createVoucherService('/daily-collections');

  // ── Session-level fields ──
  const [collectionDate, setCollectionDate] = useState(today);

  // ── Current challan being built ──
  const [currentChallan, setCurrentChallan] = useState(emptyChallan);
  const [currentDebitEntry, setCurrentDebitEntry] = useState(emptyEntry);
  const [currentCreditEntry, setCurrentCreditEntry] = useState(emptyEntry);
  const [editingDebitIndex, setEditingDebitIndex] = useState(null);
  const [editingCreditIndex, setEditingCreditIndex] = useState(null);

  // ── Pending challans list ──
  const [pendingChallans, setPendingChallans] = useState([]);
  const [editingChallanIndex, setEditingChallanIndex] = useState(null);
  const [expandedChallan, setExpandedChallan] = useState(null);

  // ── DB edit ──
  const [editingId, setEditingId] = useState(null);

  // ── Records list ──
  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecords, setSavedRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);
  const [availableFunds, setAvailableFunds] = useState([]);
  const [allLedgers, setAllLedgers] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '', status: '', fromWhom: '', fundType: ''
  });

  useEffect(() => {
    loadSavedRecords();
    loadAvailableFunds();
    loadLedgers();
    const editingVoucherData = localStorage.getItem('editingVoucher');
    const correctionMode = localStorage.getItem('correctionMode');
    if (editingVoucherData && correctionMode === 'true') {
      handleEditRecord(JSON.parse(editingVoucherData));
      localStorage.removeItem('editingVoucher');
      localStorage.removeItem('correctionMode');
      showToast('Record loaded for correction', 'success');
    }
  }, []);

  const loadLedgers = async () => {
    const result = await executeApi(accountService.getAll);
    if (result.success) setAllLedgers((result.data || []).map(l => ({ code: l.ledgerCode, name: l.ledgerName })));
  };

  const loadAvailableFunds = async () => {
    try {
      const result = await executeApi(fundService.getAll);
      setAvailableFunds(result.success ? (result.data || []) : []);
    } catch { setAvailableFunds([]); }
  };

  const loadSavedRecords = async () => {
    const result = await executeApi(dailyCollectionService.getAll);
    if (result.success) setSavedRecords(result.data || []);
  };

  const fundOptions = useMemo(() => availableFunds.map(f => ({
    value: f.fundName, label: f.fundName, description: `Created: ${f.createdDate}`
  })), [availableFunds]);

  const ledgerOptions = useMemo(() => allLedgers.map(l => ({
    value: l.code, label: `${l.code} - ${l.name}`, description: l.name
  })), [allLedgers]);

  // ── Entry handlers ──
  const handleDebitEntryChange = (field, value) => setCurrentDebitEntry(p => ({ ...p, [field]: value }));
  const handleCreditEntryChange = (field, value) => setCurrentCreditEntry(p => ({ ...p, [field]: value }));

  const handleAddDebitEntry = () => {
    if (!currentDebitEntry.ledgerCode) { showToast('Ledger Code is required', 'error'); return; }
    const amt = parseFloat((currentDebitEntry.amount || '').replace(/,/g, ''));
    if (!amt || amt <= 0) { showToast('Amount must be greater than 0', 'error'); return; }

    if (editingDebitIndex !== null) {
      setCurrentChallan(prev => {
        const entries = [...prev.debitEntries];
        entries[editingDebitIndex] = { ...entries[editingDebitIndex], ledgerCode: currentDebitEntry.ledgerCode, ledgerName: currentDebitEntry.ledgerName, amount: amt };
        return { ...prev, debitEntries: entries };
      });
      setEditingDebitIndex(null);
      showToast('Debit entry updated', 'success');
    } else {
      setCurrentChallan(prev => ({
        ...prev,
        debitEntries: [...prev.debitEntries, { id: Date.now(), ledgerCode: currentDebitEntry.ledgerCode, ledgerName: currentDebitEntry.ledgerName, amount: amt }]
      }));
      showToast('Debit entry added', 'success');
    }
    setCurrentDebitEntry(emptyEntry);
  };

  const handleAddCreditEntry = () => {
    if (!currentCreditEntry.ledgerCode) { showToast('Ledger Code is required', 'error'); return; }
    const amt = parseFloat((currentCreditEntry.amount || '').replace(/,/g, ''));
    if (!amt || amt <= 0) { showToast('Amount must be greater than 0', 'error'); return; }

    if (editingCreditIndex !== null) {
      setCurrentChallan(prev => {
        const entries = [...prev.creditEntries];
        entries[editingCreditIndex] = { ...entries[editingCreditIndex], ledgerCode: currentCreditEntry.ledgerCode, ledgerName: currentCreditEntry.ledgerName, amount: amt };
        return { ...prev, creditEntries: entries };
      });
      setEditingCreditIndex(null);
      showToast('Credit entry updated', 'success');
    } else {
      setCurrentChallan(prev => ({
        ...prev,
        creditEntries: [...prev.creditEntries, { id: Date.now(), ledgerCode: currentCreditEntry.ledgerCode, ledgerName: currentCreditEntry.ledgerName, amount: amt }]
      }));
      showToast('Credit entry added', 'success');
    }
    setCurrentCreditEntry(emptyEntry);
  };

  // ── Challan handlers ──
  const challanDebitTotal = calcTotal(currentChallan.debitEntries);
  const challanCreditTotal = calcTotal(currentChallan.creditEntries);
  const challanBalanced = Math.abs(challanDebitTotal - challanCreditTotal) < 0.01;

  const handleAddChallan = () => {
    if (!currentChallan.fundType) { showToast('Fund Type is required for each challan', 'error'); return; }
    if (currentChallan.debitEntries.length === 0 && currentChallan.creditEntries.length === 0) {
      showToast('Add at least one debit or credit entry to the challan', 'error'); return;
    }

    if (editingChallanIndex !== null) {
      setPendingChallans(prev => {
        const list = [...prev];
        list[editingChallanIndex] = { ...currentChallan };
        return list;
      });
      setEditingChallanIndex(null);
      showToast('Challan updated successfully', 'success');
    } else {
      setPendingChallans(prev => [...prev, { ...currentChallan, id: Date.now() }]);
      showToast('Challan added to collection', 'success');
    }
    setCurrentChallan(emptyChallan);
    setCurrentDebitEntry(emptyEntry);
    setCurrentCreditEntry(emptyEntry);
    setEditingDebitIndex(null);
    setEditingCreditIndex(null);
  };

  const handleEditChallan = (challan, index) => {
    setCurrentChallan({ ...challan });
    setEditingChallanIndex(index);
    setCurrentDebitEntry(emptyEntry);
    setCurrentCreditEntry(emptyEntry);
    setEditingDebitIndex(null);
    setEditingCreditIndex(null);
    window.scrollTo(0, 0);
  };

  const handleDeleteChallan = async (index) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Challan',
      message: 'Are you sure you want to remove this challan from the collection?',
      confirmText: 'Delete', cancelText: 'Cancel', type: 'error'
    });
    if (confirmed) {
      setPendingChallans(prev => prev.filter((_, i) => i !== index));
      showToast('Challan removed', 'success');
    }
  };

  // ── Save collection ──
  const overallDebitTotal = pendingChallans.reduce((sum, c) => sum + calcTotal(c.debitEntries), 0);
  const overallCreditTotal = pendingChallans.reduce((sum, c) => sum + calcTotal(c.creditEntries), 0);
  const overallBalanced = Math.abs(overallDebitTotal - overallCreditTotal) < 0.01;

  const handleSubmit = async () => {
    if (pendingChallans.length === 0) { showToast('Add at least one challan before saving', 'error'); return; }
    if (!collectionDate) { showToast('Collection Date is required', 'error'); return; }

    if (!overallBalanced) {
      showToast(`Overall collection is unbalanced. Difference: ₹${Math.abs(overallDebitTotal - overallCreditTotal).toFixed(2)}. Please add matching entries across challans.`, 'error');
      return;
    }

    const submitData = {
      collectionDate,
      challans: pendingChallans.map(c => ({
        ...c,
        debitTotal: calcTotal(c.debitEntries),
        creditTotal: calcTotal(c.creditEntries),
      })),
      debitTotal: overallDebitTotal,
      creditTotal: overallCreditTotal,
      balanced: overallBalanced,
      challanCount: pendingChallans.length,
      entryCount: pendingChallans.reduce((s, c) => s + c.debitEntries.length + c.creditEntries.length, 0),
      challanNo: pendingChallans.map(c => c.challanNo).filter(Boolean).join(', '),
      fromWhom: pendingChallans.map(c => c.fromWhom).filter(Boolean).join(', '),
      fundType: [...new Set(pendingChallans.map(c => c.fundType).filter(Boolean))].join(', ')
    };

    let result;
    if (editingId) {
      result = await executeApi(dailyCollectionService.update, editingId, submitData);
    } else {
      result = await executeApi(dailyCollectionService.create, submitData);
    }

    if (result.success) {
      showToast(editingId ? 'Daily Collection updated successfully!' : 'Daily Collection saved successfully!', 'success');
      resetAll();
      await loadSavedRecords();
    } else {
      showToast(result.message || 'Operation failed!', 'error');
    }
  };

  const handleEditRecord = (record) => {
    setCollectionDate(record.collectionDate || today);
    if (record.challans && record.challans.length > 0) {
      setPendingChallans(record.challans.map(c => ({
        ...c,
        debitEntries: (c.debitEntries || []).map(e => ({ ...e, amount: parseFloat(e.amount || 0) })),
        creditEntries: (c.creditEntries || []).map(e => ({ ...e, amount: parseFloat(e.amount || 0) }))
      })));
    } else {
      // backward compat: old single-challan format
      setPendingChallans([{
        id: Date.now(),
        challanNo: record.challanNo || '',
        fundType: record.fundType || '',
        fromWhom: record.fromWhom || '',
        purpose: record.purpose || '',
        debitEntries: (record.debitEntries || []).map(e => ({ ...e, amount: parseFloat(e.amount || 0) })),
        creditEntries: (record.creditEntries || []).map(e => ({ ...e, amount: parseFloat(e.amount || 0) }))
      }]);
    }
    setEditingId(record.id);
    setShowRecords(false);
    clearError();
    window.scrollTo(0, 0);
  };

  const handleDeleteRecord = async (record) => {
    const confirmed = await showConfirmDialog({
      title: 'Delete Collection Record',
      message: `Delete the collection record for ${record.collectionDate}?`,
      confirmText: 'Delete', cancelText: 'Cancel', type: 'error'
    });
    if (confirmed) {
      const result = await executeApi(dailyCollectionService.delete, record.id);
      if (result.success) { showToast('Record deleted!', 'success'); await loadSavedRecords(); }
      else showToast('Failed to delete record!', 'error');
    }
  };

  const resetAll = () => {
    setCollectionDate(today);
    setCurrentChallan(emptyChallan);
    setCurrentDebitEntry(emptyEntry);
    setCurrentCreditEntry(emptyEntry);
    setEditingDebitIndex(null);
    setEditingCreditIndex(null);
    setPendingChallans([]);
    setEditingChallanIndex(null);
    setEditingId(null);
    setShowRecords(false);
  };

  const handleAdvancedFilters = (filters) => { setSearchFilters(filters); setCurrentPage(1); };

  const filteredRecords = useMemo(() => savedRecords.filter(record => {
    const s = searchFilters;
    const searchMatch = !s.searchTerm ||
      record.collectionDate?.includes(s.searchTerm) ||
      record.fromWhom?.toLowerCase().includes(s.searchTerm.toLowerCase()) ||
      record.fundType?.toLowerCase().includes(s.searchTerm.toLowerCase()) ||
      record.challanNo?.toLowerCase().includes(s.searchTerm.toLowerCase());
    const dateFromMatch = !s.dateFrom || record.collectionDate >= s.dateFrom;
    const dateToMatch = !s.dateTo || record.collectionDate <= s.dateTo;
    const amountMinMatch = !s.amountMin || record.debitTotal >= parseFloat(s.amountMin);
    const amountMaxMatch = !s.amountMax || record.debitTotal <= parseFloat(s.amountMax);
    const fromWhomMatch = !s.fromWhom || record.fromWhom?.toLowerCase().includes(s.fromWhom.toLowerCase());
    const fundTypeMatch = !s.fundType || record.fundType?.toLowerCase().includes(s.fundType.toLowerCase());
    const statusMatch = !s.status || (s.status === 'balanced' && record.balanced) || (s.status === 'unbalanced' && !record.balanced);
    return searchMatch && dateFromMatch && dateToMatch && amountMinMatch && amountMaxMatch && fromWhomMatch && fundTypeMatch && statusMatch;
  }), [savedRecords, searchFilters]);

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Amount input handler ──
  const makeAmountHandler = (setter) => (e) => {
    const formatted = formatAmountInput(e.target.value);
    if (formatted !== null) setter(p => ({ ...p, amount: formatted }));
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ErrorDisplay error={error} onClear={clearError} />

      <Header
        title="Daily Collection"
        subtitle="Manage daily collection details and money receipts"
        icon={Receipt}
        totalRecords={savedRecords.length}
        showRecords={showRecords}
        setShowRecords={setShowRecords}
        editingId={editingId}
        resetForm={resetAll}
        loading={loading}
        gradientFrom="from-blue-500"
        gradientTo="to-green-500"
        countBg="from-blue-100"
        countTo="to-green-100"
        countBorder="border-blue-200"
        countText="text-blue-800"
      />

      {/* ── Saved records list ── */}
      {showRecords && (
        <SearchableRecords
          title="Saved Daily Collection Records"
          totalRecords={filteredRecords.length}
          searchFilters={searchFilters}
          onFiltersChange={handleAdvancedFilters}
          loading={loading}
          gradientFrom="from-blue-500"
          gradientTo="to-green-500"
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={ITEMS_PER_PAGE}
        >
          {filteredRecords.length === 0 ? (
            <EmptyState icon={Receipt} title="No daily collection records found." actionText="Create your first collection record" onAction={() => setShowRecords(false)} searchTerm={searchFilters.searchTerm} />
          ) : (
            <div className="space-y-4">
              {paginatedRecords.map((record) => (
                <div key={record.id} className="bg-gradient-to-r from-white to-gray-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Daily Collection — {record.collectionDate}</h3>
                        <p className="text-sm text-gray-600">{record.challanCount || 1} Challan(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-red-600">Dr: ₹{record.debitTotal?.toLocaleString('en-IN')}</span>
                          <span className="text-green-600">Cr: ₹{record.creditTotal?.toLocaleString('en-IN')}</span>
                          {record.balanced ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{record.entryCount} entries</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => handleEditRecord(record)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit"><Edit3 className="h-4 w-4" /></button>
                        <button onClick={() => handleDeleteRecord(record)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </div>

                  {/* Challans breakdown */}
                  {(record.challans || []).map((challan, ci) => (
                    <div key={ci} className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">#{challan.challanNo || `C${ci + 1}`}</span>
                          {challan.fundType && <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{challan.fundType}</span>}
                          {challan.fromWhom && <span className="text-sm text-gray-700">From: <strong>{challan.fromWhom}</strong></span>}
                          {challan.purpose && <span className="text-sm text-gray-500">| {challan.purpose}</span>}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-red-600">Dr: ₹{calcTotal(challan.debitEntries).toLocaleString('en-IN')}</span>
                          <span className="text-green-600">Cr: ₹{calcTotal(challan.creditEntries).toLocaleString('en-IN')}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Backward compat: old format without challans array */}
                  {!record.challans && record.purpose && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700"><span className="font-medium">Purpose: </span>{record.purpose}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </SearchableRecords>
      )}

      {/* ── Create / Edit form ── */}
      {!showRecords && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {editingId ? 'Edit Daily Collection' : 'Create New Daily Collection'}
            </h2>
          </div>

          <div className="p-6 space-y-6">

            {/* ── Session-level: Collection Date ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Collection Date" type="date" required icon={Calendar}
                value={collectionDate}
                onChange={e => setCollectionDate(e.target.value)}
              />
            </div>

            {/* ── Add / Edit challan form ── */}
            <div className="border border-blue-200 rounded-xl overflow-hidden">
              <div className="bg-blue-50 px-5 py-3 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-semibold text-blue-800">
                  {editingChallanIndex !== null ? `Edit Challan #${editingChallanIndex + 1}` : 'Add New Challan'}
                </h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Challan meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    label="Challan No" placeholder="Enter challan number" icon={Receipt}
                    value={currentChallan.challanNo}
                    onChange={e => setCurrentChallan(p => ({ ...p, challanNo: e.target.value }))}
                  />
                  <SearchableDropdown
                    options={fundOptions} label="Fund Type" placeholder="Select fund type"
                    searchPlaceholder="Search funds..." required icon={Wallet}
                    emptyMessage="No funds available."
                    value={currentChallan.fundType}
                    onChange={e => setCurrentChallan(p => ({ ...p, fundType: e.target.value }))}
                  />
                  <FormField
                    label="From Whom" placeholder="Name of the person/entity" icon={User}
                    value={currentChallan.fromWhom}
                    onChange={e => setCurrentChallan(p => ({ ...p, fromWhom: e.target.value }))}
                  />
                  <FormField
                    label="Purpose of Receipt" placeholder="Additional details or remarks" icon={MessageSquare}
                    value={currentChallan.purpose}
                    onChange={e => setCurrentChallan(p => ({ ...p, purpose: e.target.value }))}
                  />
                </div>

                {/* Debit + Credit entry forms side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Debit Entry */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {editingDebitIndex !== null ? 'Edit Debit Entry' : 'Add Debit Entry'}
                    </h4>
                    <div className="space-y-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <SearchableDropdown
                        options={ledgerOptions} label="Ledger Code" placeholder="Select ledger code"
                        searchPlaceholder="Search ledgers..." required
                        value={currentDebitEntry.ledgerCode}
                        onChange={e => {
                          const l = allLedgers.find(x => x.code === e.target.value);
                          setCurrentDebitEntry(p => ({ ...p, ledgerCode: e.target.value, ledgerName: l ? l.name : '' }));
                        }}
                      />
                      <FormField label="Ledger Head" value={currentDebitEntry.ledgerName} disabled placeholder="Auto-filled" className="bg-gray-100" />
                      <FormField
                        label="Amount (₹)" name="amount" placeholder="0.00" required
                        value={currentDebitEntry.amount}
                        onChange={makeAmountHandler(setCurrentDebitEntry)}
                      />
                      <div className="flex gap-2">
                        {editingDebitIndex !== null && (
                          <button type="button" onClick={() => { setCurrentDebitEntry(emptyEntry); setEditingDebitIndex(null); }}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Cancel
                          </button>
                        )}
                        <button type="button" onClick={handleAddDebitEntry}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                          {editingDebitIndex !== null ? <><Save className="h-4 w-4" /> Update</> : <><Plus className="h-4 w-4" /> Add Debit</>}
                        </button>
                      </div>
                    </div>

                    {currentChallan.debitEntries.length > 0 && (
                      <div className="mt-3 overflow-x-auto rounded-lg border border-red-200">
                        <table className="w-full text-sm">
                          <thead className="bg-red-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-600 uppercase">Code</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-red-600 uppercase">Head</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-red-600 uppercase">Amount</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-red-600 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-red-100">
                            {currentChallan.debitEntries.map((entry, idx) => (
                              <tr key={entry.id} className="hover:bg-red-50">
                                <td className="px-3 py-2">{entry.ledgerCode}</td>
                                <td className="px-3 py-2 text-slate-600">{entry.ledgerName}</td>
                                <td className="px-3 py-2 text-right font-medium">₹{parseFloat(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-center gap-1">
                                    <button onClick={() => { setCurrentDebitEntry({ ledgerCode: entry.ledgerCode, ledgerName: entry.ledgerName, amount: entry.amount.toString() }); setEditingDebitIndex(idx); }}
                                      className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Edit"><Edit3 className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => setCurrentChallan(p => ({ ...p, debitEntries: p.debitEntries.filter(e => e.id !== entry.id) }))}
                                      className="text-red-600 hover:bg-red-50 p-1 rounded" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-red-50">
                            <tr>
                              <td colSpan={2} className="px-3 py-2 text-xs font-bold text-red-700">Debit Total</td>
                              <td className="px-3 py-2 text-right text-sm font-bold text-red-700">₹{challanDebitTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Credit Entry */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      {editingCreditIndex !== null ? 'Edit Credit Entry' : 'Add Credit Entry'}
                    </h4>
                    <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <SearchableDropdown
                        options={ledgerOptions} label="Ledger Code" placeholder="Select ledger code"
                        searchPlaceholder="Search ledgers..." required
                        value={currentCreditEntry.ledgerCode}
                        onChange={e => {
                          const l = allLedgers.find(x => x.code === e.target.value);
                          setCurrentCreditEntry(p => ({ ...p, ledgerCode: e.target.value, ledgerName: l ? l.name : '' }));
                        }}
                      />
                      <FormField label="Ledger Head" value={currentCreditEntry.ledgerName} disabled placeholder="Auto-filled" className="bg-gray-100" />
                      <FormField
                        label="Amount (₹)" name="amount" placeholder="0.00" required
                        value={currentCreditEntry.amount}
                        onChange={makeAmountHandler(setCurrentCreditEntry)}
                      />
                      <div className="flex gap-2">
                        {editingCreditIndex !== null && (
                          <button type="button" onClick={() => { setCurrentCreditEntry(emptyEntry); setEditingCreditIndex(null); }}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Cancel
                          </button>
                        )}
                        <button type="button" onClick={handleAddCreditEntry}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                          {editingCreditIndex !== null ? <><Save className="h-4 w-4" /> Update</> : <><Plus className="h-4 w-4" /> Add Credit</>}
                        </button>
                      </div>
                    </div>

                    {currentChallan.creditEntries.length > 0 && (
                      <div className="mt-3 overflow-x-auto rounded-lg border border-green-200">
                        <table className="w-full text-sm">
                          <thead className="bg-green-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-green-600 uppercase">Code</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-green-600 uppercase">Head</th>
                              <th className="px-3 py-2 text-right text-xs font-medium text-green-600 uppercase">Amount</th>
                              <th className="px-3 py-2 text-center text-xs font-medium text-green-600 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-green-100">
                            {currentChallan.creditEntries.map((entry, idx) => (
                              <tr key={entry.id} className="hover:bg-green-50">
                                <td className="px-3 py-2">{entry.ledgerCode}</td>
                                <td className="px-3 py-2 text-slate-600">{entry.ledgerName}</td>
                                <td className="px-3 py-2 text-right font-medium">₹{parseFloat(entry.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center justify-center gap-1">
                                    <button onClick={() => { setCurrentCreditEntry({ ledgerCode: entry.ledgerCode, ledgerName: entry.ledgerName, amount: entry.amount.toString() }); setEditingCreditIndex(idx); }}
                                      className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Edit"><Edit3 className="h-3.5 w-3.5" /></button>
                                    <button onClick={() => setCurrentChallan(p => ({ ...p, creditEntries: p.creditEntries.filter(e => e.id !== entry.id) }))}
                                      className="text-red-600 hover:bg-red-50 p-1 rounded" title="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-green-50">
                            <tr>
                              <td colSpan={2} className="px-3 py-2 text-xs font-bold text-green-700">Credit Total</td>
                              <td className="px-3 py-2 text-right text-sm font-bold text-green-700">₹{challanCreditTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Challan balance status */}
                {(currentChallan.debitEntries.length > 0 || currentChallan.creditEntries.length > 0) && (
                  <BalanceStatus debitTotal={challanDebitTotal} creditTotal={challanCreditTotal} />
                )}

                {/* Add / Update challan button */}
                <div className="flex gap-3 pt-2">
                  {editingChallanIndex !== null && (
                    <button type="button"
                      onClick={() => { setCurrentChallan(emptyChallan); setCurrentDebitEntry(emptyEntry); setCurrentCreditEntry(emptyEntry); setEditingChallanIndex(null); }}
                      className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                      Cancel Edit
                    </button>
                  )}
                  <button type="button" onClick={handleAddChallan}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    {editingChallanIndex !== null ? <><Save className="h-4 w-4" /> Update Challan</> : <><Plus className="h-4 w-4" /> Add Challan to Collection</>}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Pending challans list ── */}
            {pendingChallans.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-slate-600" />
                    <h3 className="text-base font-semibold text-slate-800">
                      Pending Challans ({pendingChallans.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-red-600 font-medium">Total Dr: ₹{overallDebitTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    <span className="text-green-600 font-medium">Total Cr: ₹{overallCreditTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    {overallBalanced
                      ? <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle className="h-4 w-4" /> Balanced</span>
                      : <span className="flex items-center gap-1 text-red-600 font-semibold"><AlertCircle className="h-4 w-4" /> Unbalanced</span>}
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {pendingChallans.map((challan, index) => {
                    const dr = calcTotal(challan.debitEntries);
                    const cr = calcTotal(challan.creditEntries);
                    const bal = Math.abs(dr - cr) < 0.01;
                    const isExpanded = expandedChallan === index;
                    return (
                      <div key={challan.id || index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="shrink-0 text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                              {challan.challanNo || `#${index + 1}`}
                            </span>
                            {challan.fundType && (
                              <span className="shrink-0 text-xs font-medium bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{challan.fundType}</span>
                            )}
                            {challan.fromWhom && (
                              <span className="text-sm text-slate-700 truncate">
                                <span className="text-slate-500">From:</span> <strong>{challan.fromWhom}</strong>
                              </span>
                            )}
                            {challan.purpose && (
                              <span className="text-sm text-slate-500 truncate hidden md:block">| {challan.purpose}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 ml-4 shrink-0">
                            <span className="text-xs text-red-600">Dr: ₹{dr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            <span className="text-xs text-green-600">Cr: ₹{cr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            {bal
                              ? <CheckCircle className="h-4 w-4 text-green-500" />
                              : <AlertCircle className="h-4 w-4 text-red-500" title={`Difference: ₹${Math.abs(dr - cr).toFixed(2)}`} />}
                            <button onClick={() => setExpandedChallan(isExpanded ? null : index)}
                              className="p-1 text-slate-500 hover:bg-slate-100 rounded transition-colors" title="Toggle entries">
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>
                            <button onClick={() => handleEditChallan(challan, index)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit challan">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteChallan(index)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete challan">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded entries */}
                        {isExpanded && (
                          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">Debit Entries ({challan.debitEntries.length})</p>
                              <div className="rounded-lg border border-red-100 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead className="bg-red-50">
                                    <tr>
                                      <th className="px-3 py-1.5 text-left text-red-500">Code</th>
                                      <th className="px-3 py-1.5 text-left text-red-500">Head</th>
                                      <th className="px-3 py-1.5 text-right text-red-500">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-red-50">
                                    {challan.debitEntries.map((e, i) => (
                                      <tr key={i}>
                                        <td className="px-3 py-1.5">{e.ledgerCode}</td>
                                        <td className="px-3 py-1.5 text-slate-500">{e.ledgerName}</td>
                                        <td className="px-3 py-1.5 text-right font-medium text-red-700">₹{parseFloat(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Credit Entries ({challan.creditEntries.length})</p>
                              <div className="rounded-lg border border-green-100 overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead className="bg-green-50">
                                    <tr>
                                      <th className="px-3 py-1.5 text-left text-green-500">Code</th>
                                      <th className="px-3 py-1.5 text-left text-green-500">Head</th>
                                      <th className="px-3 py-1.5 text-right text-green-500">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-green-50">
                                    {challan.creditEntries.map((e, i) => (
                                      <tr key={i}>
                                        <td className="px-3 py-1.5">{e.ledgerCode}</td>
                                        <td className="px-3 py-1.5 text-slate-500">{e.ledgerName}</td>
                                        <td className="px-3 py-1.5 text-right font-medium text-green-700">₹{parseFloat(e.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Overall balance + Save ── */}
            {pendingChallans.length > 0 && (
              <BalanceStatus debitTotal={overallDebitTotal} creditTotal={overallCreditTotal} />
            )}

            <div className="flex justify-center gap-4 pt-2">
              <ResetButton onClick={resetAll} loading={loading} />
              <SubmitButton
                loading={loading} onClick={handleSubmit} editingId={editingId}
                text="Collection" gradientFrom="from-blue-500" gradientTo="to-green-500"
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={dialogState.isOpen} onClose={closeDialog} onConfirm={dialogState.onConfirm}
        title={dialogState.title} message={dialogState.message} confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText} type={dialogState.type} loading={dialogState.loading}
        hideConfirm={dialogState.hideConfirm}
      />
    </div>
  );
};

export default DailyCollection;
