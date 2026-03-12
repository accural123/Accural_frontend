
import { useState, useCallback, useRef } from 'react';

export const useApiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [data, setData] = useState(null);
  const [data, setData] = useState([]);
  const abortControllerRef = useRef(null);

  const executeApi = useCallback(async (apiCall, ...params) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall(...params);
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return {
          success: false,
          data: null,
          message: 'Request cancelled'
        };
      }
      
      if (!result.success) {
        setError(result.message);
        setData(null);
        
        // Log for debugging in accounting context
        console.error('API Error:', {
          message: result.message,
          status: result.status,
          timestamp: new Date().toISOString()
        });
        
        return result;
      }
      
      setData(result.data);
      setError(null);
      return result;
      
    } catch (err) {
      // Don't set error if request was aborted
      if (err.name === 'AbortError') {
        return {
          success: false,
          data: null,
          message: 'Request cancelled'
        };
      }

      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      setData(null);
      
      // Critical logging for accounting operations
      console.error('API Exception:', {
        error: errorMessage,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setError(null);
    setData(null);
    setLoading(false);
  }, []);

  return { 
    executeApi, 
    loading, 
    error, 
    data,
    clearError, 
    clearData,
    reset,
    setError,
    setData // Allow manual data updates if needed
  };
};