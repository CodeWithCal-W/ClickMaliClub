import React, { useState, useEffect } from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import { useApi } from '../../hooks/useApi';

const RevenueOptimizationDashboard = () => {
  const device = useDeviceDetection();
  const { callApi } = useApi();
  
  const [revenueData, setRevenueData] = useState({
    analytics: null,
    suggestions: { summary: { totalSuggestions: 0, highPriority: 0, potentialImpact: 0 }, suggestions: [] },
    forecast: null,
    dashboardStats: null,
    abTestingSuggestions: [],
    loading: true
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState(30);

  useEffect(() => {
    loadRevenueData();
  }, [timeframe]);

  const loadRevenueData = async () => {
    try {
      setRevenueData(prev => ({ ...prev, loading: true }));
      
      const [analytics, suggestions, forecast, dashboardStats, abTesting] = await Promise.all([
        callApi(`/api/revenue-optimization/analytics?period=${timeframe}`).catch(() => ({ data: null })),
        callApi(`/api/revenue-optimization/optimization-suggestions?period=${timeframe}`).catch(() => ({ data: null })),
        callApi('/api/revenue-optimization/forecast?months=3').catch(() => ({ data: null })),
        callApi('/api/revenue-optimization/dashboard-stats').catch(() => ({ data: null })),
        callApi('/api/revenue-optimization/ab-testing-suggestions').catch(() => ({ data: [] }))
      ]);

      setRevenueData({
        analytics: analytics?.data || null,
        suggestions: suggestions?.data || { summary: { totalSuggestions: 0, highPriority: 0, potentialImpact: 0 }, suggestions: [] },
        forecast: forecast?.data || null,
        dashboardStats: dashboardStats?.data || null,
        abTestingSuggestions: abTesting?.data || [],
        loading: false
      });
    } catch (error) {
      console.error('Error loading revenue data:', error);
      setRevenueData({
        analytics: null,
        suggestions: { summary: { totalSuggestions: 0, highPriority: 0, potentialImpact: 0 }, suggestions: [] },
        forecast: null,
        dashboardStats: null,
        abTestingSuggestions: [],
        loading: false
      });
    }
  };

  const startABTest = async (testConfig) => {
    try {
      const response = await callApi('/api/revenue-optimization/start-ab-test', 'POST', testConfig);
      
      if (response?.data?.success) {
        alert(`A/B test "${testConfig.test}" started successfully!`);
        loadRevenueData();
      }
    } catch (error) {
      console.error('Error starting A/B test:', error);
      alert('Failed to start A/B test');
    }
  };

  const applyOptimization = async (dealId, optimizationType, data = {}) => {
    try {
      const response = await callApi(`/api/revenue-optimization/optimize-deal/${dealId}`, 'POST', {
        optimizationType,
        ...data
      });
      
      if (response?.data?.success) {
        alert('Optimization applied successfully!');
        loadRevenueData();
      }
    } catch (error) {
      console.error('Error applying optimization:', error);
      alert('Failed to apply optimization');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  if (revenueData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'optimization', label: 'Optimization', icon: '🎯' },
    { id: 'forecast', label: 'Forecast', icon: '🔮' },
    { id: 'testing', label: 'A/B Testing', icon: '🧪' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            💰 Revenue Optimization
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered insights to maximize your affiliate revenue
          </p>
        </div>
        <div className={`flex ${device.isMobile ? 'flex-col space-y-2 mt-4' : 'items-center space-x-3'}`}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <button
            onClick={loadRevenueData}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
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

      {/* Loading State */}
      {revenueData.loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading revenue data...</p>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && !revenueData.loading && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <span className="text-xl">💵</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(revenueData.dashboardStats?.revenue?.month || 0)}
                  </p>
                  <p className="text-xs text-green-600">
                    +{formatCurrency(revenueData.dashboardStats?.revenue?.week || 0)} this week
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <span className="text-xl">🎯</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatPercentage(revenueData.dashboardStats?.conversionRates?.month || 0)}
                  </p>
                  <p className="text-xs text-primary-600">
                    {formatPercentage(revenueData.dashboardStats?.conversionRates?.week || 0)} this week
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-900 rounded-lg">
                  <span className="text-xl">📈</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Revenue Per Click</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(revenueData.dashboardStats?.metrics?.revenuePerClick || 0)}
                  </p>
                  <p className="text-xs text-secondary-600">
                    Avg commission: {formatCurrency(revenueData.dashboardStats?.metrics?.averageCommission || 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <span className="text-xl">🔥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(revenueData.dashboardStats?.revenue?.today || 0)}
                  </p>
                  <p className="text-xs text-orange-600">
                    {revenueData.dashboardStats?.conversions?.today || 0} conversions today
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Deals */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏆 Top Performing Deals This Month
            </h3>
            <div className="space-y-3">
              {(revenueData.dashboardStats?.topDeals || []).map((deal, index) => (
                <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' : 
                      index === 1 ? 'bg-gray-400 text-white' : 
                      index === 2 ? 'bg-orange-500 text-white' : 
                      'bg-blue-500 text-white'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{deal.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {deal.conversions} conversions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(deal.revenue)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Avg: {formatCurrency(deal.averageCommission)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && !revenueData.loading && (
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Performance Analysis ({timeframe} days)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(revenueData.analytics?.totalRevenue || 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary-600">
                  {(revenueData.analytics?.totalClicks || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {formatPercentage(revenueData.analytics?.averageConversionRate || 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Conversion Rate</p>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Top Performing Deals
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Deal</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Score</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600 dark:text-gray-400">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {(revenueData.analytics?.topPerformers || []).slice(0, 10).map((deal) => (
                    <tr key={deal.dealId} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{deal.dealTitle}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{deal.category}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          deal.performanceScore >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          deal.performanceScore >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {deal.performanceScore}/100
                        </span>
                      </td>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(deal.totalRevenue)}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {formatPercentage(deal.conversionRate)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          deal.trend === 'rising' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                          deal.trend === 'falling' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {deal.trend === 'rising' ? '📈' : deal.trend === 'falling' ? '📉' : '➡️'} {deal.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Underperformers */}
          {(revenueData.analytics?.underperformers || []).length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⚠️ Deals Needing Attention
              </h3>
              <div className="space-y-3">
                {(revenueData.analytics?.underperformers || []).slice(0, 5).map((deal) => (
                  <div key={deal.dealId} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{deal.dealTitle}</p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Score: {deal.performanceScore}/100 • Bounce Rate: {formatPercentage(deal.bounceRate * 100)}
                      </p>
                    </div>
                    <button
                      onClick={() => applyOptimization(deal.dealId, 'category_optimization')}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Optimize
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimization Tab */}
      {activeTab === 'optimization' && !revenueData.loading && (
        <div className="space-y-6">
          {/* Optimization Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 Optimization Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {revenueData.suggestions?.summary?.totalSuggestions || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Suggestions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {revenueData.suggestions?.summary?.highPriority || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(revenueData.suggestions?.summary?.estimatedRevenueIncrease || 0)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Potential Revenue</p>
              </div>
            </div>
          </div>

          {/* Optimization Suggestions */}
          <div className="space-y-4">
            {(revenueData.suggestions?.suggestions || []).map((suggestion, index) => (
              <div key={index} className={`p-6 rounded-lg border ${
                suggestion.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                suggestion.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
                      }`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Impact: {suggestion.expectedImpact}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {suggestion.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {suggestion.description}
                    </p>
                    
                    {suggestion.estimatedRevenueIncrease && (
                      <p className="text-sm font-medium text-primary-600">
                        Potential Revenue Increase: {formatCurrency(suggestion.estimatedRevenueIncrease)}
                      </p>
                    )}

                    {suggestion.deals && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Affected Deals:
                        </p>
                        <div className="space-y-1">
                          {suggestion.deals.slice(0, 3).map((deal, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {deal.title || deal.dealTitle}
                              </span>
                              {deal.score && (
                                <span className="text-gray-500">
                                  Score: {deal.score}/100
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {suggestion.actionItems && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Action Items:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {suggestion.actionItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={() => {
                        if (suggestion.deals && suggestion.deals[0]) {
                          applyOptimization(suggestion.deals[0].id || suggestion.deals[0].dealId, suggestion.type);
                        }
                      }}
                      className={`px-4 py-2 text-white rounded-lg transition-colors ${
                        suggestion.priority === 'high' ? 'bg-red-600 hover:bg-red-700' :
                        suggestion.priority === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700' :
                        'bg-primary-600 hover:bg-primary-700'
                      }`}
                    >
                      Apply Fix
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forecast Tab */}
      {activeTab === 'forecast' && !revenueData.loading && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🔮 Revenue Forecast (Next 3 Months)
            </h3>
            
            {revenueData.forecast?.confidence === 'low' ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  {revenueData.forecast?.message || 'No forecast data available'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(revenueData.forecast?.forecast || []).map((month) => (
                    <div key={month.month} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Month {month.month}</p>
                      <p className="text-2xl font-bold text-primary-600">
                        {formatCurrency(month.projectedRevenue)}
                      </p>
                      <p className={`text-xs ${
                        month.confidence === 'high' ? 'text-primary-600' : 'text-secondary-600'
                      }`}>
                        {month.confidence} confidence
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
                  <p className="font-medium text-primary-900 dark:text-primary-300 mb-2">
                    📈 Growth Insights
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    Monthly growth rate: {formatPercentage(revenueData.forecast?.monthlyGrowthRate || 0)}
                  </p>
                  <p className="text-blue-800 dark:text-blue-400">
                    Projected 3-month total: {formatCurrency(
                      (revenueData.forecast?.forecast || []).reduce((sum, month) => sum + month.projectedRevenue, 0)
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* A/B Testing Tab */}
      {activeTab === 'testing' && !revenueData.loading && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🧪 A/B Testing Opportunities
            </h3>
            <div className="space-y-4">
              {(revenueData.abTestingSuggestions || []).map((test, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {test.test}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {test.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-primary-600 font-medium">
                          Expected Impact: +{test.expectedImpact}%
                        </span>
                        <span className="text-gray-500">
                          Element: {test.element.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => startABTest(test)}
                        className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                      >
                        Start Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueOptimizationDashboard;
