import { useState } from 'react';

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunc(...args);
      // Check if the service returned an internal error object
      if (result && result.error) {
        setError(result.error);
        return null;
      }
      return result;
    } catch (err) {
      setError(err.message || "Unexpected error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};