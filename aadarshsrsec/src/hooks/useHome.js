import { useState, useEffect } from 'react';
import { getPageData } from '../services/content.service';

export const useHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        // Fetch 'home' page data using the service we created earlier
        const { data: pageData, error: pageError } = await getPageData('home');
        
        if (pageError) {
          console.error("Error loading home data:", pageError);
          setError(pageError);
        } else {
          setData(pageData);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return { data, loading, error };
};