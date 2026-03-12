
import apiClient from './apiClient';

export const employeeService = {
  // Get all employees
  getAll: async (params = {}) => {
    return await apiClient.get('/employees', params);
  },

  // Get employee by ID
  getById: async (id) => {
    return await apiClient.get(`/employees/${id}`);
  },

  // Create new employee
  create: async (employeeData) => {
    return await apiClient.post('/employees', employeeData);
  },

  // Update employee
  update: async (id, employeeData) => {
    return await apiClient.put(`/employees/${id}`, employeeData);
  },

  // Delete employee
  delete: async (id) => {
    return await apiClient.delete(`/employees/${id}`);
  },

  // Search employees
  search: async (searchTerm, filters = {}) => {
    const params = { search: searchTerm, ...filters };
    return await apiClient.get('/employees/search', params);
  },

  // Get employees by section
  getBySection: async (section) => {
    return await apiClient.get(`/employees/section/${section}`);
  },

  // Get employees by fund type
  getByFundType: async (fundId) => {
    return await apiClient.get(`/employees/fund/${fundId}`);
  },

  // Validate employee ID uniqueness
  validateEmpId: async (empId, excludeId = null) => {
    const params = { empId };
    if (excludeId) params.excludeId = excludeId;
    return await apiClient.get('/employees/validate/empId', params);
  },

  // Get basic statistics
  getStatistics: async () => {
    return await apiClient.get('/employees/statistics');
  }
};