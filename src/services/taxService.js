import apiClient from './apiClient';

export const taxService = {
  // GST Returns
  getGSTReturns: async (params = {}) => {
    return await apiClient.get('/tax/gst-returns', params);
  },

  fileGSTReturn: async (returnData) => {
    return await apiClient.post('/tax/gst-returns', returnData);
  },

  // IT Returns
  getITReturns: async (params = {}) => {
    return await apiClient.get('/tax/it-returns', params);
  },

  fileITReturn: async (returnData) => {
    return await apiClient.post('/tax/it-returns', returnData);
  },

  // LWF Payment
  getLWFPayments: async (params = {}) => {
    return await apiClient.get('/tax/lwf-payments', params);
  },

  makeLWFPayment: async (paymentData) => {
    return await apiClient.post('/tax/lwf-payments', paymentData);
  }
};

// 12. Custom Hook for API Services (src/hooks/useApiService.js)
// import { useState, useCallback } from 'react';

// export const useApiService = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const executeApi = useCallback(async (apiCall, ...params) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const result = await apiCall(...params);
      
//       if (!result.success) {
//         setError(result.message);
//       }
      
//       return result;
//     } catch (err) {
//       const errorMessage = err.message || 'An unexpected error occurred';
//       setError(errorMessage);
//       return {
//         success: false,
//         data: null,
//         message: errorMessage
//       };
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   return { executeApi, loading, error, clearError, setError };
// };