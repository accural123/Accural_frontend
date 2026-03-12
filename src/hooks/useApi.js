import { useState, useEffect } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...params);
      
      if (result.success) {
        setData(result.data);
        return result;
      } else {
        setError(result.message);
        return result;
      }
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dependencies.length === 0) return;
    execute();
  }, dependencies);

  return { data, loading, error, execute };
};
