// context/AppContext.jsx
import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Initial state for application data
const initialAppState = {
  institutions: [],
  ledgers: [],
  groups: [],
  voucherTypes: [],
  transactions: [],
  openingBalance: [],
  financialYear: '2024-25',
  settings: {
    institutionName: 'Municipal Corporation',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'en-IN'
  }
};

// Action types
const APP_ACTIONS = {
  SET_INSTITUTIONS: 'SET_INSTITUTIONS',
  ADD_INSTITUTION: 'ADD_INSTITUTION',
  SET_LEDGERS: 'SET_LEDGERS',
  ADD_LEDGER: 'ADD_LEDGER',
  SET_GROUPS: 'SET_GROUPS',
  ADD_GROUP: 'ADD_GROUP',
  SET_VOUCHER_TYPES: 'SET_VOUCHER_TYPES',
  ADD_VOUCHER_TYPE: 'ADD_VOUCHER_TYPE',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  SET_OPENING_BALANCE: 'SET_OPENING_BALANCE',
  UPDATE_OPENING_BALANCE: 'UPDATE_OPENING_BALANCE',
  SET_FINANCIAL_YEAR: 'SET_FINANCIAL_YEAR',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
};

// App reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_INSTITUTIONS:
      return { ...state, institutions: action.payload };
    case APP_ACTIONS.ADD_INSTITUTION:
      return { ...state, institutions: [...state.institutions, action.payload] };
    
    case APP_ACTIONS.SET_LEDGERS:
      return { ...state, ledgers: action.payload };
    case APP_ACTIONS.ADD_LEDGER:
      return { ...state, ledgers: [...state.ledgers, action.payload] };
    
    case APP_ACTIONS.SET_GROUPS:
      return { ...state, groups: action.payload };
    case APP_ACTIONS.ADD_GROUP:
      return { ...state, groups: [...state.groups, action.payload] };
    
    case APP_ACTIONS.SET_VOUCHER_TYPES:
      return { ...state, voucherTypes: action.payload };
    case APP_ACTIONS.ADD_VOUCHER_TYPE:
      return { ...state, voucherTypes: [...state.voucherTypes, action.payload] };
    
    case APP_ACTIONS.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };
    case APP_ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case APP_ACTIONS.SET_OPENING_BALANCE:
      return { ...state, openingBalance: action.payload };
    case APP_ACTIONS.UPDATE_OPENING_BALANCE:
      return { ...state, openingBalance: action.payload };
    
    case APP_ACTIONS.SET_FINANCIAL_YEAR:
      return { ...state, financialYear: action.payload };
    
    case APP_ACTIONS.UPDATE_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload } };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// App provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // Helper functions
  const addInstitution = useCallback((institution) => {
    const newInstitution = {
      ...institution,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: APP_ACTIONS.ADD_INSTITUTION, payload: newInstitution });
    return newInstitution;
  }, []);

  const addLedger = useCallback((ledger) => {
    const newLedger = {
      ...ledger,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: APP_ACTIONS.ADD_LEDGER, payload: newLedger });
    return newLedger;
  }, []);

  const addGroup = useCallback((group) => {
    const newGroup = {
      ...group,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: APP_ACTIONS.ADD_GROUP, payload: newGroup });
    return newGroup;
  }, []);

  const addVoucherType = useCallback((voucherType) => {
    const newVoucherType = {
      ...voucherType,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: APP_ACTIONS.ADD_VOUCHER_TYPE, payload: newVoucherType });
    return newVoucherType;
  }, []);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    dispatch({ type: APP_ACTIONS.ADD_TRANSACTION, payload: newTransaction });
    return newTransaction;
  }, []);

  const updateOpeningBalance = useCallback((entries) => {
    dispatch({ type: APP_ACTIONS.UPDATE_OPENING_BALANCE, payload: entries });
  }, []);

  const setFinancialYear = useCallback((year) => {
    dispatch({ type: APP_ACTIONS.SET_FINANCIAL_YEAR, payload: year });
  }, []);

  const updateSettings = useCallback((newSettings) => {
    dispatch({ type: APP_ACTIONS.UPDATE_SETTINGS, payload: newSettings });
  }, []);

  // Context value
  const value = useMemo(() => ({
    ...state,
    addInstitution,
    addLedger,
    addGroup,
    addVoucherType,
    addTransaction,
    updateOpeningBalance,
    setFinancialYear,
    updateSettings
  }), [state, addInstitution, addLedger, addGroup, addVoucherType, addTransaction, updateOpeningBalance, setFinancialYear, updateSettings]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export { APP_ACTIONS };