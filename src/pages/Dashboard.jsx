
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Settings, BarChart3, FileText, Shield, TrendingUp, Database, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { institutionService, fundService, dailyCollectionService } from '../services/apiServices';
import { authService } from '../services/authService';
import { transactionService } from '../services/transactionService';

const Dashboard = () => {
  const { user: currentUser, getWorkspaceSelection } = useAuth();
  const userSession = getWorkspaceSelection();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser) return;

      if (currentUser.role === 'Administrator') {
        const [usersRes, instRes, fundsRes] = await Promise.allSettled([
          authService.getUsers(),
          institutionService.getAll(),
          fundService.getAll(),
        ]);
        setStats({
          totalUsers: usersRes.status === 'fulfilled' && usersRes.value.success ? (usersRes.value.data || []).length : 0,
          activeInstitutions: instRes.status === 'fulfilled' && instRes.value.success ? (instRes.value.data || []).length : 0,
          totalFunds: fundsRes.status === 'fulfilled' && fundsRes.value.success ? (fundsRes.value.data || []).length : 0,
        });
      } else {
        const [dcRes, brRes, bpRes, jvRes, ibtRes] = await Promise.allSettled([
          dailyCollectionService.getAll(),
          transactionService.getBankReceipts(),
          transactionService.getBankPayments(),
          transactionService.getJournalVouchers(),
          transactionService.getInterBankTransfers(),
        ]);
        setStats({
          dailyCollectionCount: dcRes.status === 'fulfilled' && dcRes.value.success ? (dcRes.value.data || []).length : 0,
          bankReceiptCount: brRes.status === 'fulfilled' && brRes.value.success ? (brRes.value.data || []).length : 0,
          bankPaymentCount: bpRes.status === 'fulfilled' && bpRes.value.success ? (bpRes.value.data || []).length : 0,
          journalVoucherCount: jvRes.status === 'fulfilled' && jvRes.value.success ? (jvRes.value.data || []).length : 0,
          interBankTransferCount: ibtRes.status === 'fulfilled' && ibtRes.value.success ? (ibtRes.value.data || []).length : 0,
          availableFunds: userSession?.selectedFunds?.length || 0,
          currentInstitution: userSession?.selectedInstitution?.institutionName || 'Not Selected',
        });
      }
      setLoading(false);
    };

    loadStats();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (currentUser?.role === 'Administrator') {
    return (
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Administrator Dashboard</h1>
                <p className="text-slate-600">System Overview & Management - {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600">Welcome, {currentUser?.name}</div>
              <div className="text-xs text-slate-500 mt-1">Super Admin Access</div>
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
                <p className="text-blue-200 text-xs mt-1">System wide</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Institutions</p>
                <p className="text-3xl font-bold">{stats.activeInstitutions}</p>
                <p className="text-green-200 text-xs mt-1">Registered</p>
              </div>
              <Building2 className="h-8 w-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Funds</p>
                <p className="text-3xl font-bold">{stats.totalFunds}</p>
                <p className="text-purple-200 text-xs mt-1">Available</p>
              </div>
              <Database className="h-8 w-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Admin Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User & Access Management */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-white">User & Access Management</h2>
            </div>
            <div className="p-6 space-y-4">
              <Link to="/admin/users" className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">Manage Users</p>
                    <p className="text-sm text-slate-600">Create, edit, and manage user accounts</p>
                  </div>
                </div>
                <span className="text-blue-600 font-medium">→</span>
              </Link>

              <Link to="/admin/allocation" className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Settings className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-800">Fund & Institution Allocation</p>
                    <p className="text-sm text-slate-600">Assign resources to users</p>
                  </div>
                </div>
                <span className="text-green-600 font-medium">→</span>
              </Link>
            </div>
          </div>

          {/* System & Master Data */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-white">System & Master Data</h2>
            </div>
            <div className="p-6 space-y-4">
              <Link to="/admin/institution" className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-800">Institution Management</p>
                    <p className="text-sm text-slate-600">Manage organizational units</p>
                  </div>
                </div>
                <span className="text-purple-600 font-medium">→</span>
              </Link>

              <Link to="/admin/fundcreation" className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Database className="h-6 w-6 text-emerald-600" />
                  <div>
                    <p className="font-medium text-slate-800">Fund Management</p>
                    <p className="text-sm text-slate-600">Create and manage funds</p>
                  </div>
                </div>
                <span className="text-emerald-600 font-medium">→</span>
              </Link>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">System Status</p>
                    <p className="text-sm text-slate-600">All systems operational</p>
                  </div>
                </div>
                <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  return (
    <div className="space-y-6">
      {/* User Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Financial Dashboard</h1>
              <p className="text-slate-600">Your workspace - {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Welcome, {currentUser?.name}</div>
            <div className="text-xs text-slate-500 mt-1">{currentUser?.role}</div>
            <div className="mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                currentUser?.role === 'Accountant' ? 'bg-blue-100 text-blue-800' :
                currentUser?.role === 'Data Entry Clerk' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Workspace */}
      {userSession?.selectedInstitution && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-indigo-200" />
              <div>
                <h3 className="text-lg font-semibold">Current Institution</h3>
                <p className="text-indigo-100">{userSession.selectedInstitution.institutionName}</p>
                <p className="text-xs text-indigo-200 mt-1">{userSession.selectedInstitution.state}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-indigo-100 text-sm">Available Funds</p>
              <p className="text-2xl font-bold">{stats.availableFunds}</p>
            </div>
          </div>
        </div>
      )}

      {/* Available Funds */}
      {userSession?.selectedFunds && userSession.selectedFunds.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4 rounded-t-2xl">
            <h2 className="text-xl font-semibold text-white">Your Allocated Funds</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userSession.selectedFunds.map((fund, index) => (
                <div key={fund.id} className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{fund.fundName}</p>
                      <p className="text-xs text-slate-600">{fund.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Shortcuts with Counts */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-white">Transaction Management</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/transaction/daily-collection" className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                {/* <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">{stats.dailyCollectionCount || 0}</div>
                  <p className="text-xs text-slate-500">Records</p>
                </div> */}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Daily Collection (MR)</h3>
              <p className="text-sm text-slate-600">Record daily money receipts</p>
            </Link>

            <Link to="/transaction/bank-receipt" className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                {/* <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">{stats.bankReceiptCount || 0}</div>
                  <p className="text-xs text-slate-500">Vouchers</p>
                </div> */}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Bank Receipt (BRV)</h3>
              <p className="text-sm text-slate-600">Create bank receipt vouchers</p>
            </Link>

            <Link to="/transaction/bank-payment" className="group bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-sm border border-red-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                {/* <div className="text-right">
                  <div className="text-3xl font-bold text-red-600">{stats.bankPaymentCount || 0}</div>
                  <p className="text-xs text-slate-500">Vouchers</p>
                </div> */}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Bank Payment (BPV)</h3>
              <p className="text-sm text-slate-600">Create bank payment vouchers</p>
            </Link>

            <Link to="/transaction/journal-voucher" className="group bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                {/* <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{stats.journalVoucherCount || 0}</div>
                  <p className="text-xs text-slate-500">Vouchers</p>
                </div> */}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Journal Voucher (JV)</h3>
              <p className="text-sm text-slate-600">Create journal entries</p>
            </Link>

            <Link to="/transaction/inter-bank-transfer" className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                {/* <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{stats.interBankTransferCount || 0}</div>
                  <p className="text-xs text-slate-500">Transfers</p>
                </div> */}
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Inter Bank Transfer (IBT)</h3>
              <p className="text-sm text-slate-600">Transfer between banks</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;