import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  institutionService,
  ledgerService,
  groupService,
  voucherTypeService,
  accountService,
} from '../services/apiServices';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [institutions, setInstitutions] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [instRes, ledgerRes, groupRes, voucherRes, bankRes] = await Promise.allSettled([
      institutionService.getAll(),
      ledgerService.getAll(),
      groupService.getAll(),
      voucherTypeService.getAll(),
      accountService.getByType('Bank'),
    ]);

    if (instRes.status === 'fulfilled' && instRes.value.success)
      setInstitutions(instRes.value.data || []);
    if (ledgerRes.status === 'fulfilled' && ledgerRes.value.success)
      setLedgers(ledgerRes.value.data || []);
    if (groupRes.status === 'fulfilled' && groupRes.value.success)
      setGroups(groupRes.value.data || []);
    if (voucherRes.status === 'fulfilled' && voucherRes.value.success)
      setVoucherTypes(voucherRes.value.data || []);
    if (bankRes.status === 'fulfilled' && bankRes.value.success)
      setBankAccounts(bankRes.value.data || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Institution CRUD
  const addInstitution = async (data) => {
    const res = await institutionService.create(data);
    if (res.success) await fetchAll();
    return res;
  };

  const updateInstitution = async (id, data) => {
    const res = await institutionService.update(id, data);
    if (res.success) await fetchAll();
    return res;
  };

  const deleteInstitution = async (id) => {
    const res = await institutionService.delete(id);
    if (res.success) await fetchAll();
    return res;
  };

  // Other CRUD
  const addLedger = async (data) => {
    const res = await ledgerService.create(data);
    if (res.success) await fetchAll();
    return res;
  };

  const addGroup = async (data) => {
    const res = await groupService.create(data);
    if (res.success) await fetchAll();
    return res;
  };

  const addVoucherType = async (data) => {
    const res = await voucherTypeService.create(data);
    if (res.success) await fetchAll();
    return res;
  };

  const addBankAccount = async (data) => {
    const res = await accountService.create(data);
    if (res.success) await fetchAll();
    return res;
  };

  const value = {
    // Data
    institutions,
    ledgers,
    groups,
    voucherTypes,
    bankAccounts,
    loading,

    // Refresh all data from API
    refresh: fetchAll,

    // Institution operations
    addInstitution,
    updateInstitution,
    deleteInstitution,

    // Other operations
    addLedger,
    addGroup,
    addVoucherType,
    addBankAccount,

    // Counts
    getCounts: () => ({
      totalInstitutions: institutions.length,
      totalLedgers: ledgers.length,
      totalGroups: groups.length,
      totalVoucherTypes: voucherTypes.length,
      totalBankAccounts: bankAccounts.length,
    }),
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
