
import { useState, useCallback, useRef } from 'react';

const parseErrorMessage = (message) => {
  if (!message) return 'An unexpected error occurred';
  const m = String(message);

  if (m.includes('duplicate key') || m.includes('unique constraint'))
    return 'A record with this information already exists.';
  if (m.includes('foreign key constraint'))
    return 'This record is linked to other data and cannot be deleted.';
  if (m.includes('Could not find') && m.includes('column'))
    return 'Database configuration error. Please contact support.';
  if (m.includes('not null violation'))
    return 'Required information is missing.';
  if (m.includes('JWT') || m.includes('token expired'))
    return 'Session expired. Please login again.';
  if (m.includes('permission denied'))
    return 'You do not have permission to perform this action.';

  // Extract from Python dict-style: {'message': "..."}
  const dictMatch = m.match(/'message':\s*["']([^"']+)["']/);
  if (dictMatch) return 'Operation failed. Please try again.';

  if (m.length > 120 && (m.includes('{') || m.includes('Error:')))
    return 'Operation failed. Please try again.';

  return m;
};

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
        console.error('API Error:', { message: result.message, status: result.status, timestamp: new Date().toISOString() });
        const friendly = parseErrorMessage(result.message);
        setError(friendly);
        setData(null);
        return { ...result, message: friendly };
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
      console.error('API Exception:', { error: errorMessage, stack: err.stack, timestamp: new Date().toISOString() });
      const friendly = parseErrorMessage(errorMessage);
      setError(friendly);
      setData(null);
      return { success: false, data: null, message: friendly };
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