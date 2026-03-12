import apiClient from './apiClient';

export const authService = {
  // Login - POST /auth/login
  login: async (credentials) => {
    const result = await apiClient.post('/auth/login', credentials);
    if (result.success && result.data?.token) {
      localStorage.setItem('authToken', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }
    return result;
  },

  // Logout - POST /auth/logout
  logout: async () => {
    const result = await apiClient.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return result;
  },

  // Get current user - GET /auth/me
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },

  // Change password - POST /auth/change-password
  changePassword: async (passwordData) => {
    return await apiClient.post('/auth/change-password', passwordData);
  },

  // --- Admin: User Management ---

  // List all users - GET /auth/admin/users
  getUsers: async () => {
    return await apiClient.get('/auth/admin/users');
  },

  // Create user - POST /auth/admin/users
  createUser: async (userData) => {
    return await apiClient.post('/auth/admin/users', userData);
  },

  // Update user - PUT /auth/admin/users/:id
  updateUser: async (userId, userData) => {
    return await apiClient.put(`/auth/admin/users/${userId}`, userData);
  },

  // Delete user - DELETE /auth/admin/users/:id
  deleteUser: async (userId) => {
    return await apiClient.delete(`/auth/admin/users/${userId}`);
  },

  // Reset user password - POST /auth/admin/users/:id/reset-password
  resetPassword: async (userId, newPassword) => {
    return await apiClient.post(`/auth/admin/users/${userId}/reset-password`, { password: newPassword });
  },

  // Select workspace - POST /auth/select-workspace
  selectWorkspace: async (sessionData) => {
    const result = await apiClient.post('/auth/select-workspace', sessionData);
    if (result.success && result.data?.token) {
      localStorage.setItem('authToken', result.data.token);
    }
    return result;
  }
};
