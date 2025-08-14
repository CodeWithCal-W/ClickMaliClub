import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

// API Methods
export const apiService = {
  // Categories
  getCategories: () => api.get('/categories'),
  getCategory: (slug) => api.get(`/categories/${slug}`),

  // Deals
  getDeals: (params = {}) => api.get('/deals', { params }),
  getDeal: (id) => api.get(`/deals/${id}`),
  trackClick: (id) => api.post(`/deals/${id}/click`),

  // Blog
  getBlogPosts: (params = {}) => api.get('/blog', { params }),
  getBlogPost: (slug) => api.get(`/blog/${slug}`),

  // Reviews
  getReviews: (params = {}) => api.get('/reviews', { params }),
  submitReview: (reviewData) => api.post('/reviews', reviewData),
  voteOnReview: (reviewId, voteData) => api.post(`/reviews/${reviewId}/vote`, voteData),
  getReviewStats: () => api.get('/reviews/stats'),

  // Guides
  getGuides: (params = {}) => api.get('/guides', { params }),
  getGuide: (slug) => api.get(`/guides/${slug}`),
  searchGuides: (query) => api.get(`/guides/search/${query}`),
  getGuideCategories: () => api.get('/guides/categories/stats'),

  // Stats (we'll add these later)
  getStats: () => api.get('/stats'),
};

export default apiService;
