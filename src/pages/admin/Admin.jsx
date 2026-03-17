import React, { useState, useEffect } from 'react';
import SearchableDropdown from '../../components/common/SearchableDropdown';// Import your dropdown component
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
import { authService } from '../../services/authService';
import { useToast } from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/ToastContainer';
import { KeyRound, Shield, UserX, UserCheck, Trash2, Edit, RefreshCw } from 'lucide-react';
import SearchableRecords from '../../components/common/SearchableRecords';
import Pagination from '../../components/common/Pagination';
const Admin = () => {
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const { toasts, showToast, removeToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    searchTerm: '',
    role: '',
    userStatus: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: '',
    password: ''
  });

  // Role options for the dropdown
  const roleOptions = [
    { 
      value: 'Administrator', 
      label: 'Administrator', 
      description: 'Full system access and user management' 
    },
    { 
      value: 'Accountant', 
      label: 'Accountant', 
      description: 'Financial data access and reporting' 
    },
    { 
      value: 'Data Entry Clerk', 
      label: 'Data Entry Clerk', 
      description: 'Data input and basic operations' 
    },
    { 
      value: 'Read Only', 
      label: 'Read Only', 
      description: 'View-only access to reports and data' 
    }
  ];

  // Helper to parse API errors
  const getErrorMessage = (response) => {
    if (!response || !response.message) return 'An unknown error occurred';
    
    // If message is a string that looks like a dictionary/object
    if (typeof response.message === 'string' && response.message.includes('{')) {
      try {
        // Handle cases where the message is "Some Prefix: {'inner': 'message'}"
        const jsonPart = response.message.split(': ').pop();
        const parsed = JSON.parse(jsonPart.replace(/'/g, '"').replace(/None/g, 'null'));
        return parsed.message || response.message;
      } catch (e) {
        return response.message;
      }
    }
    
    return response.message;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authService.getUsers();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        showToast(getErrorMessage(response), 'error');
      }
    } catch (error) {
      showToast('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteUser = (userId) => {
  //   if (window.confirm('Are you sure you want to delete this user?')) {
  //     setUsers(users.filter(user => user.id !== userId));
  //   }
  // };
  const handleDeleteUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    const confirmed = await showConfirmDialog({
      title: 'Delete User',
      message: `Are you sure you want to delete user "${user?.name || 'this user'}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'error'
    });

    if (confirmed) {
      try {
        const response = await authService.deleteUser(userId);
        if (response.success) {
          setUsers(users.filter(user => user.id !== userId));
          showToast('User deleted successfully', 'success');
        } else {
          showToast(getErrorMessage(response), 'error');
        }
      } catch (error) {
        showToast('An error occurred while deleting the user', 'error');
      }
    }
  };

  const handleToggleUserStatus = async (userId) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newIsActive = user.status === 'Active' ? false : true;
    try {
      await authService.updateUser(userId, { is_active: newIsActive });
      setUsers(users.map(u =>
        u.id === userId
          ? { ...u, status: newIsActive ? 'Active' : 'Inactive', lastStatusChange: new Date().toLocaleString() }
          : u
      ));
    } catch (err) {
      showToast('Failed to update user status', 'error');
    }
  };

  const handleBulkActivate = () => {
    if (selectedUsers.length === 0) {
      showToast('Please select users first', 'warning');
      return;
    }
    
    setUsers(users.map(user => 
      selectedUsers.includes(user.id) 
        ? { ...user, status: 'Active', lastStatusChange: new Date().toLocaleString() }
        : user
    ));
    
    setSelectedUsers([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      role: e.target.value
    }));
  };

  const handleSubmitUser = async () => {
    // Basic validation
    if (!formData.name || !formData.username || !formData.email || !formData.role || (!editingUser && !formData.password)) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      if (editingUser) {
        // Update existing user
        const response = await authService.updateUser(editingUser.id, formData);
        if (response.success) {
          setUsers(users.map(user => 
            user.id === editingUser.id 
              ? { ...user, ...formData, lastStatusChange: new Date().toLocaleString() }
              : user
          ));
          showToast('User updated successfully', 'success');
          closeUserModal();
        } else {
          showToast(getErrorMessage(response), 'error');
        }
      } else {
        // Add new user
        const response = await authService.createUser(formData);
        if (response.success) {
          // Refresh users list to get the latest data from server
          fetchUsers();
          showToast('User created successfully', 'success');
          closeUserModal();
        } else {
          showToast(getErrorMessage(response), 'error');
        }
      }
    } catch (error) {
      showToast('An error occurred while saving the user', 'error');
    }
  };

  const openUserModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        password: '' // Don't pre-fill password for editing
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', username: '', email: '', role: '', password: '' });
    }
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
    setFormData({ name: '', username: '', email: '', role: '', password: '' });
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      showToast('Please enter a new password', 'warning');
      return;
    }

    try {
      const response = await authService.resetPassword(resetUser.id, newPassword);
      if (response.success) {
        showToast('Password reset successfully', 'success');
        setShowResetModal(false);
        setResetUser(null);
        setNewPassword('');
      } else {
        showToast(getErrorMessage(response), 'error');
      }
    } catch (error) {
      showToast('An error occurred while resetting the password', 'error');
    }
  };

  const openResetModal = (user) => {
    setResetUser(user);
    setNewPassword('');
    setShowResetModal(true);
  };

  const handleBulkDeactivate = () => {
    if (selectedUsers.length === 0) {
      showToast('Please select users first', 'warning');
      return;
    }

    setUsers(users.map(user =>
      selectedUsers.includes(user.id)
        ? { ...user, status: 'Inactive', lastStatusChange: new Date().toLocaleString() }
        : user
    ));

    setSelectedUsers([]);
  };

  const handleBulkDeleteUsers = async () => {
    if (selectedUsers.length === 0) return;
    const confirmed = await showConfirmDialog({
      title: 'Delete Selected Users',
      message: `Are you sure you want to delete ${selectedUsers.length} selected user(s)? This action cannot be undone.`,
      confirmText: 'Delete All',
      cancelText: 'Cancel',
      type: 'error'
    });
    if (confirmed) {
      let count = 0;
      for (const userId of selectedUsers) {
        try {
          const response = await authService.deleteUser(userId);
          if (response.success) count++;
        } catch {}
      }
      setSelectedUsers([]);
      fetchUsers();
      showToast(`${count} user(s) deleted successfully!`, 'success');
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const selectedIds = new Set(selectedUsers);

  const handleSelectAllUsers = () => {
    const allSelected = paginatedUsers.every(u => selectedIds.has(u.id));
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !paginatedUsers.map(u => u.id).includes(id)));
    } else {
      setSelectedUsers(prev => [...new Set([...prev, ...paginatedUsers.map(u => u.id)])]);
    }
  };

  const filteredUsers = users.filter(user => {
    const f = searchFilters;
    const searchMatch = !f.searchTerm ||
      user.name?.toLowerCase().includes(f.searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(f.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(f.searchTerm.toLowerCase());
    const roleMatch = !f.role || user.role === f.role;
    const statusMatch = !f.userStatus || user.status === f.userStatus;
    return searchMatch && roleMatch && statusMatch;
  });

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <div className="text-sm text-gray-600">
          System Administrator Access
        </div>
      </div>

      {/* User Management Content */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {selectedUsers.length > 0 && (
              <>
                <button
                  onClick={handleBulkActivate}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  Activate Selected ({selectedUsers.length})
                </button>
                <button
                  onClick={handleBulkDeactivate}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-md text-sm"
                >
                  Deactivate Selected ({selectedUsers.length})
                </button>
                <button
                  onClick={handleBulkDeleteUsers}
                  className="flex items-center space-x-1 bg-red-700 hover:bg-red-800 text-white px-3 py-2 rounded-md text-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Selected ({selectedUsers.length})</span>
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => openUserModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            + Add New User
          </button>
        </div>

        <SearchableRecords
          title="System Users"
          totalRecords={filteredUsers.length}
          searchFilters={searchFilters}
          onFiltersChange={(filters) => { setSearchFilters(filters); setCurrentPage(1); }}
          loading={false}
          gradientFrom="from-blue-600"
          gradientTo="to-indigo-600"
          searchPlaceholder="Search by name, username, or email..."
          filterConfig={{ dateRange: false, amountRange: false, fromWhom: false, fundType: false, status: false, transactionMode: false }}
          customFilters={[
            {
              key: 'role',
              label: 'Role',
              type: 'select',
              options: [
                { value: '', label: 'All Roles' },
                { value: 'Administrator', label: 'Administrator' },
                { value: 'Accountant', label: 'Accountant' },
                { value: 'Data Entry Clerk', label: 'Data Entry Clerk' },
                { value: 'Read Only', label: 'Read Only' },
              ],
            },
            {
              key: 'userStatus',
              label: 'Status',
              type: 'select',
              options: [
                { value: '', label: 'All Status' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ],
            },
          ]}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.has(u.id))}
                      onChange={handleSelectAllUsers}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.username}</div>
                        <div className="text-xs text-gray-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'Administrator' ? 'bg-red-100 text-red-800' :
                        user.role === 'Accountant' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Data Entry Clerk' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-all duration-200 ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300'
                        }`}
                        title={`Click to ${user.status === 'Active' ? 'deactivate' : 'activate'} user`}
                      >
                        {user.status === 'Active' ? '✓ Active' : '✗ Inactive'}
                      </button>
                      {user.lastStatusChange && (
                        <div className="text-xs text-gray-400 mt-1">
                          Changed: {user.lastStatusChange}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openUserModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openResetModal(user)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Reset Password"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">No users found matching your filters.</div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={PAGE_SIZE} totalItems={filteredUsers.length} />
            </div>
          )}
        </SearchableRecords>
      </div>
<ConfirmDialog
  isOpen={dialogState.isOpen}
  onClose={closeDialog}
  onConfirm={dialogState.onConfirm}
  title={dialogState.title}
  message={dialogState.message}
  confirmText={dialogState.confirmText}
  cancelText={dialogState.cancelText}
  type={dialogState.type}
  loading={dialogState.loading}
/>
      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <SearchableDropdown
                  label="Role"
                  options={roleOptions}
                  value={formData.role}
                  onChange={handleRoleChange}
                  placeholder="Select a role"
                  searchPlaceholder="Search roles..."
                  required={true}
                  allowClear={true}
                  emptyMessage="No roles available"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(Leave blank to keep current)' : <span className="text-red-500">*</span>}
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={editingUser ? "Enter new password" : "Enter password"}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={closeUserModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-2xl animate-in zoom-in duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Enter a new password for <span className="font-semibold text-gray-700">{resetUser?.name}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 px-1">
                  New Password
                </label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
                  placeholder="••••••••"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <button 
                onClick={() => {
                  setShowResetModal(false);
                  setResetUser(null);
                  setNewPassword('');
                }}
                className="flex-1 px-4 py-3 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleResetPassword}
                className="flex-1 px-4 py-3 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 shadow-lg shadow-amber-600/20 transition-all text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Admin;