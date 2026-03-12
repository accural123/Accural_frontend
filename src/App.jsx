import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login'; // Eagerly load login to have it display fast

// Lazy load application routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/admin/Admin'));

// Master components
const InstitutionCreation = lazy(() => import('./pages/master/InstitutionCreation'));
const LedgerCreation = lazy(() => import('./pages/admin/LedgerCreation'));
const GroupCreation = lazy(() => import('./pages/master/GroupCreation'));
const VoucherTypeCreation = lazy(() => import('./pages/master/VoucherTypeCreation'));
const OpeningBalance = lazy(() => import('./pages/master/OpeningBalance'));
const AutoGJV = lazy(() => import('./pages/master/AutoGJV'));
const AdvanceDeposits = lazy(() => import('./pages/master/AdvanceDeposits'));
const MDRDetails = lazy(() => import('./pages/master/MDRDetails'));
const PayableDetails = lazy(() => import('./pages/master/PayableDetails'));
const YearwiseBalance = lazy(() => import('./pages/master/YearwiseBalance'));

// Transaction components
const DailyCollection = lazy(() => import('./pages/transaction/DailyCollection'));
const BankReceipt = lazy(() => import('./pages/transaction/BankReceipt'));
const BankPayment = lazy(() => import('./pages/transaction/BankPayment'));
const JournalVoucher = lazy(() => import('./pages/transaction/JournalVoucher'));
const InterBankTransfer = lazy(() => import('./pages/transaction/InterBankTransfer'));

// Correction components
const CorrectionBankReceipt = lazy(() => import('./pages/correction/BankReceiptCorrection'));
const CorrectionBankPayment = lazy(() => import('./pages/correction/BankPaymentCorrection'));
const CorrectionJournalVoucher = lazy(() => import('./pages/correction/JournalVoucherCorrection'));
const CorrectionInterBankTransfer = lazy(() => import('./pages/correction/InterBankTransferCorrection'));

// Reconciliation components
const Reconciliation = lazy(() => import('./pages/reconciliation/Reconciliation'));
const AddReconciliation = lazy(() => import('./pages/reconciliation/AddReconciliation'));
const PreviousReconciliation = lazy(() => import('./pages/reconciliation/PreviousReconciliation'));

// Reports components
const Reports = lazy(() => import('./pages/reports/Reports'));
const DatewiseReports = lazy(() => import('./pages/reports/DatewiseReports'));
const MonthwiseReports = lazy(() => import('./pages/reports/MonthwiseReports'));
const YearwiseReports = lazy(() => import('./pages/reports/YearwiseReports'));

// Other components
const Statements = lazy(() => import('./pages/statements/Statements'));
const Registers = lazy(() => import('./pages/registers/Registers'));
const GSTReturns = lazy(() => import('./pages/gst/GSTReturns'));
const ContactUs = lazy(() => import('./pages/contact/ContactUs'));
const FundCreation = lazy(() => import('./pages/admin/FundCreation'));
const UserSelectionInterface = lazy(() => import('./pages/UserSelectionInterface'));
const InvestmentDetails = lazy(() => import('./pages/transaction/InvestmentDetails'));
const LoanDetails = lazy(() => import('./pages/transaction/LoanDetails'));
const SFCGrantDetails = lazy(() => import('./pages/transaction/SFCGrantDetails'));
const MasterLedgerCreation = lazy(() => import('./pages/master/MasterLedgerCreation'));
const FundInstitutionAllocation = lazy(() => import('./pages/admin/FundInstitutionAllocation'));
const EmployeeCreation = lazy(() => import('./pages/master/EmployeeCreation'));
const AdvanceRegister = lazy(() => import('./pages/master/AdvanceRegister'));
const DepositRegister = lazy(() => import('./pages/master/DepositRegister'));

// Protected Route component
const ProtectedRoute = ({ children, requiredRole = null, allowedRoles = null }) => {
  const { isAuthenticated, user, hasRole, hasAnyRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check specific role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  // Check multiple allowed roles
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout wrapper for protected routes
const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

// Main App component
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Login Route - Only accessible when not authenticated */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        } 
      />

<Route 
  path="/select-workspace" 
  element={
    <ProtectedRoute>
      <UserSelectionInterface />
    </ProtectedRoute>
  } 
/>
      {/* Dashboard Route */}
      <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      
      {/* Admin Routes - Only for Administrators */}
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute requiredRole="Administrator">
            <ProtectedLayout>
              <Admin />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/allocation" 
        element={
          <ProtectedRoute requiredRole="Administrator">
            <ProtectedLayout>
              < FundInstitutionAllocation/>
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/fundcreation" 
        element={
          <ProtectedRoute requiredRole="Administrator">
            <ProtectedLayout>
              <FundCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Master Routes - Accessible by Admin and Accountant */}
      <Route 
        path="/admin/institution" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <InstitutionCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/ledger" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <LedgerCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/group" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <GroupCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/voucher-type" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <VoucherTypeCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/master/ledger" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <MasterLedgerCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
       <Route 
        path="/master/employee" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <EmployeeCreation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/opening-balance" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <OpeningBalance />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/auto-gjv" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <AutoGJV />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/advance-register" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <AdvanceRegister />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/deposit-register" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <DepositRegister />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/mdr-details" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <MDRDetails />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/payable-details" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <PayableDetails />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/yearwise-balance" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <YearwiseBalance />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Transaction Routes - Accessible by all authenticated users */}
      <Route 
        path="/transaction/daily-collection" 
        element={
          <ProtectedLayout>
            <DailyCollection />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/transaction/bank-receipt" 
        element={
          <ProtectedLayout>
            <BankReceipt />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/transaction/bank-payment" 
        element={
          <ProtectedLayout>
            <BankPayment />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/transaction/journal-voucher" 
        element={
          <ProtectedLayout>
            <JournalVoucher />
          </ProtectedLayout>
        } 
      />
      <Route 
        path="/transaction/inter-bank-transfer" 
        element={
          <ProtectedLayout>
            <InterBankTransfer />
          </ProtectedLayout>
        } 
      />
           <Route 
        path="/master/investment-details" 
        element={
          <ProtectedLayout>
            <InvestmentDetails />
          </ProtectedLayout>
        } 
      />
           <Route 
        path="/master/loan-details" 
        element={
          <ProtectedLayout>
            <LoanDetails />
          </ProtectedLayout>
        } 
      />
           <Route 
        path="/master/sfcgrant-details" 
        element={
          <ProtectedLayout>
            <SFCGrantDetails />
          </ProtectedLayout>
        } 
      />
      
      {/* Correction Routes - Accessible by Admin and Accountant */}
      <Route 
        path="/correction/bank-receipt" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <CorrectionBankReceipt />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/correction/bank-payment" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <CorrectionBankPayment />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/correction/journal-voucher" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <CorrectionJournalVoucher />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/correction/inter-bank-transfer" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <CorrectionInterBankTransfer />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Reconciliation Routes - Accessible by Admin and Accountant */}
      <Route 
        path="/reconciliation/entries" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <Reconciliation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reconciliation/add" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <AddReconciliation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/master/previous" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <PreviousReconciliation />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Reports Routes - Accessible by Admin and Accountant */}
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <Reports />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/datewise" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <DatewiseReports />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/monthwise" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <MonthwiseReports />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/reports/yearwise" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <YearwiseReports />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Statements Route - Accessible by Admin and Accountant */}
      <Route 
        path="/statements" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <Statements />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Registers Route - Accessible by Admin and Accountant */}
      <Route 
        path="/registers" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <Registers />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* GST Returns Route - Accessible by Admin and Accountant */}
      <Route 
        path="/gst-returns" 
        element={
          <ProtectedRoute allowedRoles={['Administrator', 'Accountant']}>
            <ProtectedLayout>
              <GSTReturns />
            </ProtectedLayout>
          </ProtectedRoute>
        } 
      />
      
      {/* Contact Us Route - Accessible by all authenticated users */}
      <Route 
        path="/contact" 
        element={
          <ProtectedLayout>
            <ContactUs />
          </ProtectedLayout>
        } 
      />
      
      {/* Catch all route - Redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;