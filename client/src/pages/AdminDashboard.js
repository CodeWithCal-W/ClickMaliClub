import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { apiService } from '../services/api';
import useDeviceDetection from '../hooks/useDeviceDetection';
import MobileAdminHeader from '../components/ui/MobileAdminHeader';
import MobileOptimizedModal from '../components/ui/MobileOptimizedModal';
import MobileOptimizedTable from '../components/ui/MobileOptimizedTable';
import SEODashboard from '../components/seo/SEODashboard';
import RevenueOptimizationDashboard from '../components/revenue/RevenueOptimizationDashboard';
import '../styles/App.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAdminAuth();
  const device = useDeviceDetection();
  
  // State for all data
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Enhanced Analytics States
  const [analytics, setAnalytics] = useState({});
  const [dealPerformance, setDealPerformance] = useState({});
  const [categoryPerformance, setCategoryPerformance] = useState({});
  
  // Modal states
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editType, setEditType] = useState('');
  
  // Mobile specific states
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Logout function
  const handleLogout = () => {
    console.log('Logout button clicked - using context logout...');
    logout(); // Use the context logout function
    console.log('Context logout completed, will redirect via ProtectedAdminRoute...');
    navigate('/admin/login', { replace: true }); // Force navigation with replace
  };

  // Token validation function
  const validateToken = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.log('No token found, redirecting to login');
        handleLogout();
        return false;
      }

      // Test token validity with a simple API call
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/admin/dashboard/stats`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        console.log('Token validation failed, clearing storage and redirecting');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        handleLogout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      handleLogout();
      return false;
    }
  };

  // Get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // Check if token exists
      if (!token) {
        console.error('No admin token found');
        handleLogout();
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Fetch all data in parallel including enhanced analytics
      const [
        dealsRes, 
        categoriesRes, 
        blogRes, 
        subscribersRes, 
        statsRes,
        analyticsRes,
        dealPerformanceRes,
        categoryPerformanceRes
      ] = await Promise.all([
        fetch(`${apiUrl}/admin/dashboard/deals?limit=100`, { headers }), // Get up to 100 deals for admin
        fetch(`${apiUrl}/admin/dashboard/categories`, { headers }),
        fetch(`${apiUrl}/admin/dashboard/blog`, { headers }),
        fetch(`${apiUrl}/admin/dashboard/subscribers`, { headers }),
        fetch(`${apiUrl}/admin/dashboard/stats`, { headers }),
        fetch(`${apiUrl}/analytics/overview`, { headers }),
        fetch(`${apiUrl}/deal-performance/top-deals`, { headers }),
        fetch(`${apiUrl}/category-performance/overview`, { headers })
      ]);

      // Check for authentication errors
      if (dealsRes.status === 401 || categoriesRes.status === 401 || 
          blogRes.status === 401 || subscribersRes.status === 401 || 
          statsRes.status === 401 || analyticsRes.status === 401 ||
          dealPerformanceRes.status === 401 || categoryPerformanceRes.status === 401) {
        console.error('Authentication failed - redirecting to login');
        handleLogout();
        return;
      }

      if (dealsRes.ok) {
        const dealsData = await dealsRes.json();
        setDeals(Array.isArray(dealsData?.data) ? dealsData.data : Array.isArray(dealsData) ? dealsData : []);
      } else {
        setDeals([]);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(Array.isArray(categoriesData?.data) ? categoriesData.data : Array.isArray(categoriesData) ? categoriesData : []);
      } else {
        setCategories([]);
      }

      if (blogRes.ok) {
        const blogData = await blogRes.json();
        setBlogPosts(Array.isArray(blogData?.data) ? blogData.data : Array.isArray(blogData) ? blogData : []);
      } else {
        setBlogPosts([]);
      }

      if (subscribersRes.ok) {
        const subscribersData = await subscribersRes.json();
        setSubscribers(Array.isArray(subscribersData?.data) ? subscribersData.data : Array.isArray(subscribersData) ? subscribersData : []);
      } else {
        setSubscribers([]);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        // Parse the stats correctly from the API response
        if (statsData.success && statsData.data) {
          setStats(statsData.data);
        } else {
          setStats(statsData || {});
        }
      } else {
        setStats({});
      }

      // Process enhanced analytics data
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData.success ? analyticsData.data : {});
      } else {
        setAnalytics({});
      }

      if (dealPerformanceRes.ok) {
        const dealPerfData = await dealPerformanceRes.json();
        setDealPerformance(dealPerfData.success ? dealPerfData.data : {});
      } else {
        setDealPerformance({});
      }

      if (categoryPerformanceRes.ok) {
        const catPerfData = await categoryPerformanceRes.json();
        setCategoryPerformance(catPerfData.success ? catPerfData.data : {});
      } else {
        setCategoryPerformance({});
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Ensure arrays are set even on error
      setDeals([]);
      setCategories([]);
      setBlogPosts([]);
      setSubscribers([]);
      setStats({});
      
      // Check if it's a network error or auth error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.error('Authentication error detected - logging out');
        handleLogout();
      } else {
        alert('Error loading dashboard data. Please refresh the page or try logging in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Generic create function
  const createItem = async (type, data) => {
    try {
      let success = false;
      
      // Use proper API service methods
      switch(type) {
        case 'deals':
          await apiService.admin.createDeal(data);
          success = true;
          break;
        case 'categories':
          await apiService.admin.createCategory(data);
          success = true;
          break;
        case 'blog':
          await apiService.admin.createBlogPost(data);
          success = true;
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      if (success) {
        alert(`${type} created successfully!`);
        fetchDashboardData();
        closeAllModals();
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      alert(`Error creating ${type}. Please try again.`);
    }
  };

  // Generic update function
  const updateItem = async (type, id, data) => {
    try {
      let success = false;
      
      // Use proper API service methods
      switch(type) {
        case 'deals':
          await apiService.admin.updateDeal(id, data);
          success = true;
          break;
        case 'categories':
          await apiService.admin.updateCategory(id, data);
          success = true;
          break;
        case 'blog':
          await apiService.admin.updateBlogPost(id, data);
          success = true;
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      if (success) {
        alert(`${type} updated successfully!`);
        fetchDashboardData();
        closeAllModals();
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      alert(`Error updating ${type}. Please try again.`);
    }
  };

  // Generic delete function
  const deleteItem = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        let success = false;
        
        // Use proper API service methods
        switch(type) {
          case 'deals':
            await apiService.admin.deleteDeal(id);
            success = true;
            break;
          case 'categories':
            await apiService.admin.deleteCategory(id);
            success = true;
            break;
          case 'blog':
            await apiService.admin.deleteBlogPost(id);
            success = true;
            break;
          case 'subscribers':
            await apiService.admin.deleteSubscriber(id);
            success = true;
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }

        if (success) {
          alert(`${type} deleted successfully!`);
          fetchDashboardData();
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        alert(`Error deleting ${type}. Please try again.`);
      }
    }
  };

  // Close all modals
  const closeAllModals = () => {
    setShowAddDealModal(false);
    setShowAddCategoryModal(false);
    setShowAddPostModal(false);
    setShowEditModal(false);
    setEditData(null);
    setEditType('');
  };

  // Open edit modal
  const openEditModal = (type, item) => {
    setEditType(type);
    setEditData(item);
    setShowEditModal(true);
  };

  // Export CSV
  const exportCSV = () => {
    try {
      if (!Array.isArray(subscribers) || subscribers.length === 0) {
        alert('No subscribers data available to export.');
        return;
      }
      
      const csvData = subscribers.map(sub => 
        `${sub.email},${sub.name || ''},${sub.subscribedAt ? new Date(sub.subscribedAt).toISOString().split('T')[0] : ''}`
      ).join('\\n');
      
      const csvContent = 'Email,Name,Subscribed Date\\n' + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting CSV. Please try again.');
    }
  };

  // Gmail Email Functions
  const showGmailCampaignModal = () => {
    const subject = prompt('📧 Enter email subject:', 'ClickMaliClub Newsletter - Latest Deals');
    if (!subject) return;

    const content = prompt('✍️ Enter email content:', 
      `Hi there! 👋

Check out our latest deals:

🔥 Exclusive forex broker bonuses
💰 New crypto exchange offers  
🎯 Sports betting promotions
🏆 Prop firm challenges

Visit ClickMaliClub to see all deals: ${process.env.REACT_APP_CLIENT_URL || 'https://clickmaliclub.com'}

Best regards,
ClickMaliClub Team`
    );
    
    if (!content) return;

    sendGmailCampaign(subject, content);
  };

  const sendGmailCampaign = async (subject, content) => {
    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/newsletter/send-campaign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subject,
          content,
          recipients: 'all' // Send to all active subscribers
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`🚀 Newsletter Sent Successfully!\n\nSent to: ${result.data.sentCount} subscribers\nFailed: ${result.data.failedCount || 0}\n\nYour newsletter has been sent via Gmail SMTP.`);
      } else {
        alert(`❌ Newsletter Failed:\n\n${result.error || result.message}`);
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Error sending newsletter. Please try again.');
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      const isTokenValid = await validateToken();
      if (isTokenValid) {
        fetchDashboardData();
      }
    };
    
    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            {/* Welcome Header */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
                  <p className="text-gray-600 mt-1">Here's what's happening with your website today.</p>
                </div>
                <button
                  onClick={fetchDashboardData}
                  className="bg-[#36b37e] text-white px-4 py-2 rounded-lg hover:bg-[#2a8f66] transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm border`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#36b37e] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#36b37e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>Total Deals</dt>
                      <dd className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{deals.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm border`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#ff6f00] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#ff6f00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>Categories</dt>
                      <dd className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{categories.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm border`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#36b37e] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#36b37e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>Blog Posts</dt>
                      <dd className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{blogPosts.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm border`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#ff6f00] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#ff6f00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>Subscribers</dt>
                      <dd className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{subscribers.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Deals</h3>
                <div className="space-y-3">
                  {Array.isArray(deals) && deals.slice(0, 5).map((deal) => (
                    <div key={deal._id} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{deal.title}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{deal.category?.name || 'No Category'}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        deal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {deal.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Blog Posts</h3>
                <div className="space-y-3">
                  {Array.isArray(blogPosts) && blogPosts.slice(0, 5).map((post) => (
                    <div key={post._id} className={`flex items-center justify-between p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                      <div>
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'seo':
        return <SEODashboard />;

      case 'revenue':
        return <RevenueOptimizationDashboard />;

      case 'deals':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Deals Management</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddDealModal(true)}
                  className="bg-[#36b37e] text-white px-4 py-2 rounded-lg hover:bg-[#2a8f66] transition-colors"
                >
                  Add New Deal
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Title</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Category</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                  {Array.isArray(deals) && deals.map((deal) => (
                    <tr key={deal._id}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {deal.title}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {deal.category?.name || 'No Category'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          deal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {deal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal('deals', deal)}
                          className="text-[#36b37e] hover:text-[#2a8f66] mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('deals', deal._id)}
                          className="text-[#ff6f00] hover:text-[#e55100] font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Categories Management</h2>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="bg-[#36b37e] text-white px-4 py-2 rounded-lg hover:bg-[#2a8f66] transition-colors"
              >
                Add Category
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Name</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Description</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                  {Array.isArray(categories) && categories.map((category) => (
                    <tr key={category._id}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {category.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {category.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal('categories', category)}
                          className="text-[#36b37e] hover:text-[#2a8f66] mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('categories', category._id)}
                          className="text-[#ff6f00] hover:text-[#e55100] font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Blog Posts Management</h2>
              <button
                onClick={() => setShowAddPostModal(true)}
                className="bg-[#36b37e] text-white px-4 py-2 rounded-lg hover:bg-[#2a8f66] transition-colors"
              >
                Add New Post
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Title</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Created</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                  {Array.isArray(blogPosts) && blogPosts.map((post) => (
                    <tr key={post._id}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {post.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditModal('blog', post)}
                          className="text-[#36b37e] hover:text-[#2a8f66] mr-3 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem('blog', post._id)}
                          className="text-[#ff6f00] hover:text-[#e55100] font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'subscribers':
        return (
          <div className="space-y-6">
            {/* Newsletter Overview */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Newsletter Management</h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    Manage subscribers and email campaigns
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={exportCSV}
                    className="bg-[#ff6f00] text-white px-4 py-2 rounded-lg hover:bg-[#e55100] transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#36b37e] bg-opacity-5'} border-l-4 border-[#36b37e]`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Subscribers</p>
                      <p className="text-2xl font-bold text-[#36b37e]">{subscribers.length}</p>
                    </div>
                    <div className="w-10 h-10 bg-[#36b37e] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#36b37e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Active</p>
                      <p className="text-2xl font-bold text-green-600">
                        {subscribers.filter(sub => sub.status === 'subscribed').length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'} border-l-4 border-yellow-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>This Week</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {subscribers.filter(sub => {
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return new Date(sub.subscribedAt) > weekAgo;
                        }).length}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'} border-l-4 border-orange-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Email Service</p>
                      <p className="text-lg font-bold text-orange-600">Gmail Ready</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Actions */}
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} mb-6`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                  📧 Email Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => exportSubscribersCSV()}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </button>
                  
                  <button
                    onClick={() => showGmailCampaignModal()}
                    className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Newsletter
                  </button>
                  
                  <button
                    onClick={() => alert('📊 Email Stats:\n\n• Total Subscribers: ' + subscribers.length + '\n• Active: ' + subscribers.filter(s => s.status === 'subscribed').length + '\n• This Week: ' + subscribers.filter(sub => new Date(sub.subscribedAt) > new Date(Date.now() - 7*24*60*60*1000)).length)}
                    className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Stats
                  </button>
                </div>
              </div>
            </div>

            {/* Subscribers Table */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Subscriber List
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search subscribers..."
                    className={`px-3 py-2 border rounded-lg text-sm ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Email
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Name
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Interests
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Subscribed
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Status
                      </th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${theme === 'dark' ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                    {Array.isArray(subscribers) && subscribers.map((subscriber) => (
                      <tr key={subscriber._id}>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {subscriber.email}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {subscriber.name || 'N/A'}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          <div className="flex flex-wrap gap-1">
                            {subscriber.preferences?.categories?.map((cat, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-[#36b37e] bg-opacity-10 text-[#36b37e] rounded-full">
                                {cat}
                              </span>
                            )) || <span className="text-gray-400">None</span>}
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(subscriber.subscribedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            subscriber.status === 'subscribed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => deleteItem('subscribers', subscriber._id)}
                            className="text-[#ff6f00] hover:text-[#e55100] font-medium"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Real-Time Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#36b37e] bg-opacity-5'} border-l-4 border-[#36b37e]`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Total Clicks</p>
                      <p className={`text-2xl font-bold text-[#36b37e]`}>
                        {stats?.thisMonthClicks || stats?.totalClicks || 0}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        Today: {stats?.todayClicks || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#36b37e] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#36b37e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#ff6f00] bg-opacity-5'} border-l-4 border-[#ff6f00]`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Click-Through Rate</p>
                      <p className={`text-2xl font-bold text-[#ff6f00]`}>
                        {stats?.ctr ? stats.ctr.toFixed(2) : (stats?.totalViews > 0 ? ((stats?.thisMonthClicks / stats?.totalViews) * 100).toFixed(2) : '0.00')}%
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        Views: {stats?.totalViews || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#ff6f00] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#ff6f00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-500`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Conversion Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats?.thisMonthClicks > 0 ? ((stats?.conversions / stats?.thisMonthClicks) * 100).toFixed(2) : '0.00'}%
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        Conversions: {stats?.conversions || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#ff6f00] bg-opacity-5'} border-l-4 border-[#ff6f00]`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Revenue</p>
                      <p className="text-2xl font-bold text-[#ff6f00]">
                        ${stats?.monthlyRevenue ? stats.monthlyRevenue.toFixed(2) : '0.00'}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                        This month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#ff6f00] bg-opacity-10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#ff6f00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Business Growth Features */}
            
            {/* Top Performing Deals */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>🏆 Top Performing Deals</h3>
              {dealPerformance?.topDeals?.length > 0 ? (
                <div className="space-y-3">
                  {dealPerformance.topDeals.slice(0, 5).map((deal, index) => (
                    <div key={deal._id} className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' : 
                          index === 1 ? 'bg-gray-400 text-white' : 
                          index === 2 ? 'bg-orange-500 text-white' : 
                          'bg-blue-500 text-white'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="ml-3">
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {deal.title}
                          </p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {deal.category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#36b37e]">{deal.analytics?.clicks || 0} clicks</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {deal.analytics?.views || 0} views
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No performance data available yet
                </p>
              )}
            </div>

            {/* Category Performance Analysis */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>📊 Category Performance</h3>
              {categoryPerformance?.categories?.length > 0 ? (
                <div className="space-y-4">
                  {categoryPerformance.categories.map((category) => (
                    <div key={category._id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {category.name}
                        </h4>
                        <span className="text-sm text-[#36b37e] font-medium">
                          {category.totalClicks || 0} total clicks
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Views</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {category.totalViews || 0}
                          </p>
                        </div>
                        <div>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>CTR</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {category.totalViews > 0 ? ((category.totalClicks / category.totalViews) * 100).toFixed(1) : '0'}%
                          </p>
                        </div>
                        <div>
                          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Deals</p>
                          <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {category.dealCount || 0}
                          </p>
                        </div>
                      </div>
                      <div className={`mt-3 w-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded-full h-2`}>
                        <div 
                          className="bg-[#36b37e] h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${category.totalViews > 0 ? Math.min(((category.totalClicks / category.totalViews) * 100), 100) : 0}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No category performance data available yet
                </p>
              )}
            </div>

            {/* Revenue Analytics */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>💰 Revenue Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-500`}>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Today's Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${analytics?.revenue?.today || '0.00'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>This Week</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${analytics?.revenue?.thisWeek || '0.00'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-[#ff6f00] bg-opacity-5'} border-l-4 border-[#ff6f00]`}>
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>This Month</p>
                  <p className="text-2xl font-bold text-[#ff6f00]">
                    ${analytics?.revenue?.thisMonth || stats?.monthlyRevenue || '0.00'}
                  </p>
                </div>
              </div>
              
              {/* Revenue Growth */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>Revenue Growth</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      vs Last Month: 
                    </span>
                    <span className={`ml-2 font-medium ${
                      (analytics?.revenue?.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {(analytics?.revenue?.growth || 0) >= 0 ? '+' : ''}{analytics?.revenue?.growth || '0'}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Affiliate Link Management Quick Access */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>🔗 Affiliate Link Management</h3>
                <button
                  onClick={() => alert('🔗 Affiliate Link Management:\n\n• Total Active Links: ' + (Array.isArray(deals) ? deals.length : 0) + '\n• Links Updated This Month: ' + (analytics?.links?.updated || 0) + '\n• Pending Updates: ' + (analytics?.links?.pending || 0))}
                  className="flex items-center justify-center px-4 py-2 bg-[#36b37e] text-white rounded-lg hover:bg-[#309067] transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Manage Links
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {Array.isArray(deals) ? deals.length : 0}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Active Links</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold text-[#36b37e]`}>
                    {analytics?.links?.updated || 0}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Updated This Month</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold text-[#ff6f00]`}>
                    {analytics?.links?.pending || 0}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Pending Updates</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold text-blue-600`}>
                    {analytics?.links?.clicks || stats?.thisMonthClicks || 0}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Clicks</p>
                </div>
              </div>
            </div>

            {/* Content Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Deals Analytics */}
              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Deals Analytics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Deals</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {Array.isArray(deals) ? deals.length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Deals</span>
                    <span className="font-semibold text-green-600">
                      {Array.isArray(deals) ? deals.filter(deal => deal.status === 'active').length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Inactive Deals</span>
                    <span className="font-semibold text-red-600">
                      {Array.isArray(deals) ? deals.filter(deal => deal.status === 'inactive').length : 0}
                    </span>
                  </div>
                  <div className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Rate</span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {Array.isArray(deals) && deals.length > 0 ? 
                          ((deals.filter(deal => deal.status === 'active').length / deals.length) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                      <div 
                        className="bg-[#36b37e] h-2 rounded-full transition-all duration-300" 
                        style={{ 
                          width: `${Array.isArray(deals) && deals.length > 0 ? 
                            (deals.filter(deal => deal.status === 'active').length / deals.length) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Distribution */}
              <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Content Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#36b37e] rounded-full mr-2"></div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Deals</span>
                    </div>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {Array.isArray(deals) ? deals.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#ff6f00] rounded-full mr-2"></div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Categories</span>
                    </div>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {Array.isArray(categories) ? categories.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#36b37e] rounded-full mr-2"></div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Blog Posts</span>
                    </div>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {Array.isArray(blogPosts) ? blogPosts.length : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#ff6f00] rounded-full mr-2"></div>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Subscribers</span>
                    </div>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {Array.isArray(subscribers) ? subscribers.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-sm border p-6`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Activity Timeline</h3>
              <div className="space-y-4">
                {/* Recent Blog Posts Activity */}
                {Array.isArray(blogPosts) && blogPosts.slice(0, 3).map((post, index) => (
                  <div key={post._id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        New blog post: "{post.title}"
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(post.createdAt).toLocaleDateString()} • Status: {post.status}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Recent Deals Activity */}
                {Array.isArray(deals) && deals.slice(0, 2).map((deal, index) => (
                  <div key={deal._id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#36b37e] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Deal updated: "{deal.title}"
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Category: {deal.category?.name || 'Uncategorized'} • Status: {deal.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a section from the navigation</div>;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <MobileAdminHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onToggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
        showSidebar={showMobileSidebar}
        onLogout={handleLogout}
        stats={stats}
      />
      
      {/* Professional Layout with Mobile Responsiveness */}
      <div className="flex">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className={`hidden lg:block w-64 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg h-screen sticky top-0 z-30 border-r overflow-y-auto`}>
          {/* Logo */}
          <div className={`flex items-center justify-center h-16 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#36b37e] to-[#ff6f00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CM</span>
              </div>
              <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ClickMaliClub</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {[
                { key: 'overview', label: 'Dashboard', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
                { key: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { key: 'revenue', label: 'Revenue Optimization', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
                { key: 'seo', label: 'SEO & Content', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                { key: 'deals', label: 'Deals', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
                { key: 'categories', label: 'Categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                { key: 'blog', label: 'Blog Posts', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
                { key: 'subscribers', label: 'Newsletter', icon: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' }
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.key
                      ? 'bg-[#36b37e] text-white shadow-md'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className={`absolute bottom-0 w-64 p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} bg-inherit`}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#36b37e] to-[#ff6f00] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">CW</span>
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cal Mike W</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`mt-3 w-full ${
                theme === 'dark' 
                  ? 'bg-[#ff6f00] hover:bg-[#e65c00] text-white' 
                  : 'bg-[#ff6f00] hover:bg-[#e65c00] text-white'
              } px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content with Mobile Spacing */}
        <div className={`flex-1 ${device.isMobile ? 'pt-32' : ''}`}>
          {/* Desktop Header - Hidden on Mobile */}
          <header className={`hidden lg:block ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-6 py-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} capitalize`}>
                  {activeSection === 'overview' ? 'Dashboard Overview' : `${activeSection} Management`}
                </h1>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                  {activeSection === 'overview' && 'Monitor your website performance and manage content'}
                  {activeSection === 'business-growth' && 'Detailed performance analytics and statistics'}
                  {activeSection === 'deals' && 'Manage affiliate deals and track performance'}
                  {activeSection === 'categories' && 'Organize and maintain category structure'}
                  {activeSection === 'blog' && 'Create and manage blog content'}
                  {activeSection === 'subscribers' && 'Manage newsletter subscribers and communications'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchDashboardData}
                  className="bg-[#36b37e] text-white px-4 py-2 rounded-lg hover:bg-[#2a8f66] transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="bg-[#ff6f00] text-white px-3 py-2 rounded-lg hover:bg-[#e65c00] transition-colors flex items-center text-sm"
                  title="Clear storage and refresh (fixes auth issues)"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Auth
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Deal</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const dealData = {
                title: formData.get('title'),
                description: formData.get('description'),
                shortDescription: formData.get('shortDescription'),
                category: formData.get('category'),
                brand: {
                  name: formData.get('brandName'),
                  website: formData.get('brandWebsite') || '',
                  rating: parseFloat(formData.get('brandRating')) || 0
                },
                offer: {
                  type: formData.get('offerType'),
                  value: formData.get('offerValue') || '',
                  currency: formData.get('currency') || 'USD'
                },
                affiliateLink: formData.get('affiliateLink'),
                images: formData.get('imageUrl') ? [{ url: formData.get('imageUrl'), isPrimary: true }] : [],
                status: 'active'
              };
              createItem('deals', dealData);
            }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                  <input name="title" type="text" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                  <select name="category" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Select Category</option>
                    {Array.isArray(categories) && categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Name *</label>
                  <input name="brandName" type="text" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand Website</label>
                  <input name="brandWebsite" type="url" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Offer Type *</label>
                  <select name="offerType" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                    <option value="">Select Offer Type</option>
                    <option value="percentage">Percentage Discount</option>
                    <option value="fixed">Fixed Amount Off</option>
                    <option value="bonus">Bonus/Gift</option>
                    <option value="cashback">Cashback</option>
                    <option value="free_trial">Free Trial</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Offer Value</label>
                  <input name="offerValue" type="text" placeholder="e.g., 50%, $100, 30 days" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Description *</label>
                  <textarea name="shortDescription" required maxLength="250" placeholder="Brief description (max 250 characters)" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="2"></textarea>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Description *</label>
                  <textarea name="description" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="3"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Affiliate Link *</label>
                  <input name="affiliateLink" type="url" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                  <input name="imageUrl" type="url" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeAllModals} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#36b37e] text-white rounded-md hover:bg-[#2a8f66]">
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Category</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const categoryData = {
                name: formData.get('name'),
                description: formData.get('description'),
                color: formData.get('color'),
                isActive: true
              };
              createItem('categories', categoryData);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input name="name" type="text" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea name="description" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="2"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                  <input name="color" type="color" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeAllModals} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#36b37e] text-white rounded-md hover:bg-[#2a8f66]">
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Post Modal */}
      {showAddPostModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Blog Post</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const postData = {
                title: formData.get('title'),
                content: formData.get('content'),
                excerpt: formData.get('excerpt'),
                category: formData.get('category'),
                status: 'published'
              };
              createItem('blog', postData);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input name="title" type="text" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select name="category" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Select Category</option>
                      {Array.isArray(categories) && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt</label>
                  <textarea name="excerpt" className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="2"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                  <textarea name="content" required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="6"></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeAllModals} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#36b37e] text-white rounded-md hover:bg-[#2a8f66]">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit {editType}</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedData = {};
              for (let [key, value] of formData.entries()) {
                updatedData[key] = value;
              }
              updateItem(editType, editData._id, updatedData);
            }}>
              {editType === 'deals' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input name="title" type="text" defaultValue={editData.title} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select name="category" defaultValue={editData.category?._id} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Select Category</option>
                      {Array.isArray(categories) && categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea name="description" defaultValue={editData.description} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="3"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Affiliate Link</label>
                    <input name="affiliateLink" type="url" defaultValue={editData.affiliateLink} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select name="status" defaultValue={editData.status} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}
              
              {editType === 'categories' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input name="name" type="text" defaultValue={editData.name} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea name="description" defaultValue={editData.description} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="2"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
                    <input name="color" type="color" defaultValue={editData.color} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                </div>
              )}

              {editType === 'blog' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                    <input name="title" type="text" defaultValue={editData.title} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                    <textarea name="content" defaultValue={editData.content} required className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500" rows="6"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select name="status" defaultValue={editData.status} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500">
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={closeAllModals} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#36b37e] text-white rounded-md hover:bg-[#2a8f66]">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
