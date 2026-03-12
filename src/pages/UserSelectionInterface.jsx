
import React, { useState, useEffect } from 'react';
import { Building2, Wallet, User, CheckCircle, ArrowRight, RefreshCw, LogIn, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { institutionService, fundService, fundAllocationService } from "../services/realServices";
import { useApiService } from "../hooks/useApiService";
import { ErrorDisplay } from '../components/common/ErrorDisplay';
import { useAuth } from '../context/AuthContext';

const UserSelectionInterface = () => {
  const [userAllocations, setUserAllocations] = useState(null);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allInstitutions, setAllInstitutions] = useState([]);
  const [allFunds, setAllFunds] = useState([]);
  const navigate = useNavigate();
  const { executeApi, loading: apiLoading, error, clearError } = useApiService();
  const { user, logout, completeWorkspaceSelection } = useAuth();

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      navigate('/login');
    }
  }, [user]);

  const loadUserData = async () => {
    setLoading(true);
    clearError();

    try {
      // Load all institutions
      const institutionsResult = await executeApi(institutionService.getAll);
      
      // Load all funds
      const fundsResult = await executeApi(fundService.getAll);

      if (institutionsResult.success && fundsResult.success) {
        const allInsts = institutionsResult.data || [];
        const allFnds = fundsResult.data || [];
        
        setAllInstitutions(allInsts);
        setAllFunds(allFnds);

        // Load user allocations from real API
        let userAllocation = null;
        const allocResult = await fundAllocationService.getAll({ userId: user.id, status: 'Active' });
        if (allocResult.success && allocResult.data?.length > 0) {
          userAllocation = allocResult.data[0];
        }

        if (userAllocation) {
          // Filter institutions and funds based on user allocation
          const allocatedInstitutions = allInsts.filter(inst => 
            userAllocation.institutionIds.includes(inst.id) && inst.status === 'Active'
          );
          
          const allocatedFunds = allFnds.filter(fund => 
            userAllocation.fundIds.includes(fund.id) && fund.status === 'Active'
          );

          const allocations = {
            institutions: allocatedInstitutions,
            funds: allocatedFunds,
            permissions: userAllocation.permissions || {
              canCreate: true,
              canEdit: true,
              canDelete: false,
              canView: true
            },
            validFrom: userAllocation.validFrom || new Date().toISOString().split('T')[0],
            validTo: userAllocation.validTo || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
            status: userAllocation.status
          };

          setUserAllocations(allocations);
        } else {
          // No allocation found for user - show empty state
          setUserAllocations({
            institutions: [],
            funds: [],
            permissions: {
              canCreate: false,
              canEdit: false,
              canDelete: false,
              canView: true
            },
            validFrom: '',
            validTo: '',
            status: 'Inactive'
          });
        }
      } else {
        showToast('Failed to load institutions or funds', 'error');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showToast('Error loading data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInstitutionSelect = (institution) => {
    setSelectedInstitution(institution);
    setSelectedFunds([]);
  };

  const handleFundToggle = (fund) => {
    setSelectedFunds(prev => {
      const isSelected = prev.find(f => f.id === fund.id);
      if (isSelected) {
        return prev.filter(f => f.id !== fund.id);
      } else {
        return [...prev, fund];
      }
    });
  };

  const handleProceed = async () => {
    if (!selectedInstitution) {
      showToast('Please select an institution to continue', 'error');
      return;
    }

    if (selectedFunds.length === 0) {
      showToast('Please select at least one fund to continue', 'error');
      return;
    }

    const userSession = {
      user: user,
      selectedInstitution: selectedInstitution,
      selectedFunds: selectedFunds,
      permissions: userAllocations.permissions,
      loginTime: new Date().toISOString()
    };

    await completeWorkspaceSelection(userSession);
    showToast('Session created successfully!', 'success');
  };

  const handleBackToLogin = () => {
    logout();
  };

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const getLocalBodyTypeLabel = (type) => {
    const labels = {
      'municipal_corporation': 'Municipal Corporation',
      'municipality': 'Municipality', 
      'town_panchayat': 'Town Panchayat',
      'district_panchayat': 'District Panchayat',
      'block_panchayat': 'Block Panchayat',
      'village_panchayat': 'Village Panchayat'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading your allocated institutions and funds...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-6">
            Unable to load user information. Please login again.
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    );
  }

  if (!userAllocations || (userAllocations.institutions.length === 0 && userAllocations.funds.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Access Allocated</h2>
          <p className="text-gray-600 mb-2">
            No institutions or funds have been allocated to your account.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please contact your administrator to request access.
          </p>
          <div className="space-y-3">
            <button
              onClick={loadUserData}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 border-2 border-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <ErrorDisplay error={error} onClear={clearError} />

        <div className="text-center mb-8 relative">
          <div className="absolute top-0 left-0">
            <button
              onClick={handleBackToLogin}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </div>
          
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.name || user?.username || 'User'}
          </h1>
          <p className="text-gray-600">Select your working institution and funds to continue</p>
          <div className="inline-flex items-center space-x-2 mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>{user?.role || 'User'}</span>
          </div>
          {user?.email && (
            <p className="text-sm text-gray-500 mt-2">{user.email}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Select Institution
                <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded-full">
                  {userAllocations.institutions.length} available
                </span>
              </h2>
            </div>
            
            <div className="p-6">
              {userAllocations.institutions.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No institutions allocated</p>
                  <p className="text-sm text-slate-400 mt-2">Contact your administrator for access</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userAllocations.institutions.map((institution) => (
                    <div
                      key={institution.id}
                      onClick={() => handleInstitutionSelect(institution)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        selectedInstitution?.id === institution.id
                          ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-[1.02]'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Building2 className={`w-5 h-5 ${
                              selectedInstitution?.id === institution.id ? 'text-purple-600' : 'text-gray-400'
                            }`} />
                            <h3 className="font-semibold text-gray-800">{institution.institutionName}</h3>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">State:</span>
                              <span>{institution.state}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Type:</span>
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {getLocalBodyTypeLabel(institution.localBodyType)}
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedInstitution?.id === institution.id && (
                          <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Wallet className="w-5 h-5 mr-2" />
                Select Funds
                <span className="ml-auto text-sm bg-white/20 px-2 py-1 rounded-full">
                  {selectedFunds.length} of {userAllocations.funds.length} selected
                </span>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> You can select multiple funds to work with during this session.
                  {!selectedInstitution && (
                    <span className="block mt-1 text-blue-600">Please select an institution first.</span>
                  )}
                </p>
              </div>

              {userAllocations.funds.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500">No funds allocated</p>
                  <p className="text-sm text-slate-400 mt-2">Contact your administrator for access</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userAllocations.funds.map((fund) => (
                    <div
                      key={fund.id}
                      onClick={() => selectedInstitution && handleFundToggle(fund)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        !selectedInstitution 
                          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                          : selectedFunds.find(f => f.id === fund.id)
                            ? 'border-green-500 bg-green-50 shadow-lg'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-25 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Wallet className={`w-5 h-5 ${
                              selectedFunds.find(f => f.id === fund.id) ? 'text-green-600' : 'text-gray-400'
                            }`} />
                            <h3 className="font-semibold text-gray-800">{fund.fundName}</h3>
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {fund.createdDate || 'N/A'} | Status: {fund.status || 'Active'}
                          </div>
                        </div>
                        {selectedFunds.find(f => f.id === fund.id) && (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  <span>Institution: {selectedInstitution ? selectedInstitution.institutionName : 'Not selected'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <span>Funds: {selectedFunds.length > 0 ? `${selectedFunds.length} selected` : 'None selected'}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleProceed}
              disabled={!selectedInstitution || selectedFunds.length === 0 || apiLoading}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <LogIn className="w-5 h-5" />
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Session valid from {userAllocations.validFrom || 'N/A'} to {userAllocations.validTo || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserSelectionInterface;