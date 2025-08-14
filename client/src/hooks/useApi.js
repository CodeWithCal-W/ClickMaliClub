import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

// Generic data fetching hook
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err);
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => fetchData() };
};

// Specific hooks for different data types
export const useCategories = () => {
  return useApi(() => apiService.getCategories());
};

export const useDeals = (params = {}) => {
  return useApi(() => apiService.getDeals(params), [JSON.stringify(params)]);
};

export const useDeal = (id) => {
  return useApi(() => apiService.getDeal(id), [id]);
};

export const useBlogPosts = (params = {}) => {
  return useApi(() => apiService.getBlogPosts(params), [JSON.stringify(params)]);
};

export const useBlogPost = (slug) => {
  return useApi(() => apiService.getBlogPost(slug), [slug]);
};

export const useCategory = (slug) => {
  return useApi(() => apiService.getCategory(slug), [slug]);
};
