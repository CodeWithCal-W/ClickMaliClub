import React, { useState, useEffect } from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import { useApi } from '../../hooks/useApi';

const SEODashboard = () => {
  const device = useDeviceDetection();
  const { callApi } = useApi();
  
  const [seoData, setSeoData] = useState({
    sitemapStats: null,
    recentPosts: [],
    seoScores: {},
    searchEngineStatus: {},
    loading: true
  });

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    try {
      setSeoData(prev => ({ ...prev, loading: true }));
      
      const [sitemapStats, recentPosts, seoAnalytics] = await Promise.all([
        callApi('/api/sitemap/stats').catch(() => ({ data: null })),
        callApi('/api/blog/recent?limit=10').catch(() => ({ data: [] })),
        callApi('/api/admin/dashboard/blog').catch(() => ({ data: [] }))
      ]);

      console.log('SEO Data loaded:', { sitemapStats, recentPosts, seoAnalytics });

      setSeoData(prev => ({
        ...prev,
        sitemapStats: sitemapStats?.data || null,
        recentPosts: recentPosts?.data?.data || recentPosts?.data || [],
        blogStats: seoAnalytics?.data || [],
        loading: false
      }));
    } catch (error) {
      console.error('Error loading SEO data:', error);
      setSeoData(prev => ({ ...prev, loading: false }));
    }
  };

  const generateSitemaps = async () => {
    try {
      setSeoData(prev => ({ ...prev, loading: true }));
      const response = await callApi('/api/seo/generate-sitemap', 'POST');
      
      if (response.data.success) {
        await loadSEOData();
        alert('Sitemaps generated successfully!');
      }
    } catch (error) {
      console.error('Error generating sitemaps:', error);
      alert('Failed to generate sitemaps');
    } finally {
      setSeoData(prev => ({ ...prev, loading: false }));
    }
  };

  const optimizeContent = async (postId, optimizationType) => {
    try {
      const response = await callApi(`/api/seo/optimize-content/${postId}`, 'POST', {
        optimizationType
      });
      
      if (response?.data?.success) {
        await loadSEOData();
        alert(`Content ${optimizationType} applied successfully!`);
      }
    } catch (error) {
      console.error('Error optimizing content:', error);
      alert('Failed to optimize content');
    }
  };

  const generateMetaTags = async (postId) => {
    try {
      const response = await callApi(`/api/seo/generate-meta-tags/${postId}`, 'POST');
      
      if (response?.data?.success) {
        await loadSEOData();
        alert('Meta tags generated successfully!');
      }
    } catch (error) {
      console.error('Error generating meta tags:', error);
      alert('Failed to generate meta tags');
    }
  };

  const analyzeKeywords = async (postId) => {
    try {
      const response = await callApi(`/api/seo/analyze-keywords/${postId}`, 'POST');
      
      if (response?.data?.success) {
        await loadSEOData();
        alert('Keyword analysis completed!');
      }
    } catch (error) {
      console.error('Error analyzing keywords:', error);
      alert('Failed to analyze keywords');
    }
  };

  const pingSearchEngines = async () => {
    try {
      const response = await callApi('/api/seo/notify-search-engines', 'POST');
      
      if (response.data.success) {
        setSeoData(prev => ({
          ...prev,
          searchEngineStatus: response.data.results
        }));
        alert('Search engines notified successfully!');
      }
    } catch (error) {
      console.error('Error pinging search engines:', error);
      alert('Failed to notify search engines');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (seoData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'sitemaps', label: 'Sitemaps', icon: '🗺️' },
    { id: 'content', label: 'Content SEO', icon: '📝' },
    { id: 'performance', label: 'Performance', icon: '🚀' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          SEO Dashboard
        </h1>
        <div className={`flex ${device.isMobile ? 'flex-col space-y-2 mt-4' : 'space-x-3'}`}>
          <button
            onClick={generateSitemaps}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Generate Sitemaps
          </button>
          <button
            onClick={pingSearchEngines}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Ping Search Engines
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span className={device.isMobile ? 'hidden' : 'block'}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <span className="text-xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Pages</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {seoData.sitemapStats?.total || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <span className="text-xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Blog Posts</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {seoData.sitemapStats?.posts || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <span className="text-xl">🏷️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Deals</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {seoData.sitemapStats?.deals || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <span className="text-xl">📂</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {seoData.sitemapStats?.categories || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sitemaps Tab */}
      {activeTab === 'sitemaps' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sitemap Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Main Sitemap</span>
                  <a 
                    href="/sitemap.xml" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Posts Sitemap</span>
                  <a 
                    href="/sitemap-posts.xml" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Deals Sitemap</span>
                  <a 
                    href="/sitemap-deals.xml" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Categories Sitemap</span>
                  <a 
                    href="/sitemap-categories.xml" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Pages Sitemap</span>
                  <a 
                    href="/sitemap-pages.xml" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View
                  </a>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Robots.txt</span>
                  <a 
                    href="/robots.txt" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Search Engine Status */}
          {Object.keys(seoData.searchEngineStatus).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Engine Notification Status
              </h3>
              <div className="space-y-3">
                {seoData.searchEngineStatus.map((result, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{result.url}</span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      result.success 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {result.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content SEO Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Content SEO Scores
            </h3>
            <div className="space-y-4">
              {seoData.loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading blog posts...</p>
                </div>
              ) : seoData.recentPosts && seoData.recentPosts.length > 0 ? (
                seoData.recentPosts.map((post) => (
                  <div key={post._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status: {post.status} | Published: {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getScoreColor(post.seoScore || 0)}`}>
                          {post.seoScore || 0}
                        </div>
                        <div className="text-xs text-gray-500">SEO Score</div>
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBgColor(post.seoScore || 0)}`}
                          style={{ width: `${post.seoScore || 0}%` }}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => generateMetaTags(post._id)}
                          className="px-3 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
                        >
                          Generate Meta
                        </button>
                        <button
                          onClick={() => analyzeKeywords(post._id)}
                          className="px-3 py-1 text-xs bg-secondary-500 text-white rounded hover:bg-secondary-600 transition-colors"
                        >
                          Analyze Keywords
                        </button>
                        <button
                          onClick={() => optimizeContent(post._id, 'content_optimization')}
                          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Optimize Content
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">No blog posts found</p>
                  <p className="text-sm text-gray-500 mt-2">Create some blog posts to see SEO analysis here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO Performance Recommendations
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  📊 Content Analysis
                </h4>
                <p className="text-blue-800 dark:text-blue-400">
                  Implement automated content analysis to identify pages with low SEO scores and suggest improvements.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
                  🔗 Internal Linking
                </h4>
                <p className="text-green-800 dark:text-green-400">
                  Add automated internal linking suggestions to improve page authority distribution.
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                  🚀 Page Speed
                </h4>
                <p className="text-yellow-800 dark:text-yellow-400">
                  Monitor Core Web Vitals and implement performance optimizations for better search rankings.
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
                  📱 Mobile Optimization
                </h4>
                <p className="text-purple-800 dark:text-purple-400">
                  Ensure all pages pass mobile-friendliness tests and implement mobile-first indexing best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SEODashboard;
