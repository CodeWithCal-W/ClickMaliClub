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
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
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
    // Preserve the full error object with response property for status codes
    const preservedError = {
      message: error.response?.data?.message || error.message,
      response: error.response,
      status: error.response?.status
    };
    return Promise.reject(preservedError);
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
  trackView: (id) => api.post(`/deals/${id}/view`),

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

  // Newsletter
  subscribeNewsletter: (data) => api.post('/newsletter/subscribe', data),
  unsubscribeNewsletter: (email) => api.post('/newsletter/unsubscribe', { email }),

  // Admin Authentication
  admin: {
    login: (credentials) => api.post('/admin/login', credentials),
    verifyToken: () => api.get('/admin/verify'),
    logout: () => api.post('/admin/logout'),
    
    // Dashboard CRUD operations
    getDashboardStats: () => api.get('/admin/dashboard/stats'),
    
    // Deals management
    createDeal: (dealData) => api.post('/admin/dashboard/deals', dealData),
    updateDeal: (id, dealData) => api.put(`/admin/dashboard/deals/${id}`, dealData),
    deleteDeal: (id) => api.delete(`/admin/dashboard/deals/${id}`),
    
    // Categories management
    createCategory: (categoryData) => api.post('/admin/dashboard/categories', categoryData),
    updateCategory: (id, categoryData) => api.put(`/admin/dashboard/categories/${id}`, categoryData),
    deleteCategory: (id) => api.delete(`/admin/dashboard/categories/${id}`),
    
    // Blog management
    createBlogPost: (postData) => api.post('/admin/dashboard/blog', postData),
    updateBlogPost: (id, postData) => api.put(`/admin/dashboard/blog/${id}`, postData),
    deleteBlogPost: (id) => api.delete(`/admin/dashboard/blog/${id}`),
    
    // Newsletter subscribers management
    deleteSubscriber: (id) => api.delete(`/admin/dashboard/subscribers/${id}`),
  },
};

export default apiService;
