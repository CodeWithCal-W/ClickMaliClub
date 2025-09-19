// API Configuration Utility
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  
  // Helper function to build full API URLs
  buildUrl: (endpoint) => {
    const baseUrl = API_CONFIG.BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${baseUrl}/${cleanEndpoint}`;
  },
  
  // Helper function for authenticated fetch requests
  fetch: async (endpoint, options = {}) => {
    const url = API_CONFIG.buildUrl(endpoint);
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }
    
    const config = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};

export default API_CONFIG;