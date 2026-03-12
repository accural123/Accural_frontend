// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Automatically attach Global Workspace Context
    try {
      const userSessionStr = localStorage.getItem('userSession');
      if (userSessionStr) {
        const sessionData = JSON.parse(userSessionStr);
        
        // Attach Institution ID
        if (sessionData?.selectedInstitution?.id) {
          config.headers['X-Institution-Id'] = sessionData.selectedInstitution.id;
        }
        
        // Attach Fund IDs (converts array of objects to a comma-separated string like "1,2,3")
        if (sessionData?.selectedFunds?.length) {
          config.headers['X-Fund-Ids'] = sessionData.selectedFunds.map(f => f.id).join(',');
        }
      }
    } catch (error) {
      console.warn('Failed to parse user session for headers:', error);
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      if (import.meta.env.DEV) console.log(`API ${options.method || 'GET'}: ${url}`);
      
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        const error = {
          status: response.status,
          message: data.message || `HTTP error! status: ${response.status}`,
          data: data
        };
        throw error;
      }
      
      // console.log(`API Response:`, data);
      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success'
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Handle different error types
      let errorMessage = 'Network error occurred';
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        localStorage.removeItem('authToken');
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You don\'t have permission.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: null,
        message: errorMessage,
        status: error.status
      };
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

const apiClient = new ApiClient();
export default apiClient;