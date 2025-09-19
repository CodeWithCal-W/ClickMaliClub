const express = require('express');
const router = express.Router();
const CategoryPerformanceAnalyzer = require('../services/categoryPerformanceAnalyzer');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/category-performance/overview
// @desc    Get performance overview for all categories
// @access  Private (Admin only)
router.get('/overview', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const overview = await CategoryPerformanceAnalyzer.getCategoryPerformanceOverview(period);
    
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching category performance overview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category performance overview'
    });
  }
});

// @route   GET /api/category-performance/:id
// @desc    Get detailed performance metrics for a specific category
// @access  Private (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const metrics = await CategoryPerformanceAnalyzer.getCategoryDetailedMetrics(
      req.params.id,
      period
    );
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching category detailed metrics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching category metrics'
    });
  }
});

// @route   GET /api/category-performance/:id/top-deals
// @desc    Get top performing deals in a category
// @access  Private (Admin only)
router.get('/:id/top-deals', adminAuth, async (req, res) => {
  try {
    const { period = 'month', limit = 10 } = req.query;
    const { startDate, endDate } = CategoryPerformanceAnalyzer.getDateRanges(period);
    
    const topDeals = await CategoryPerformanceAnalyzer.getCategoryTopDeals(
      req.params.id,
      startDate,
      endDate,
      parseInt(limit)
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        topDeals
      }
    });
  } catch (error) {
    console.error('Error fetching category top deals:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching top deals'
    });
  }
});

// @route   GET /api/category-performance/:id/trends
// @desc    Get traffic trends for a category
// @access  Private (Admin only)
router.get('/:id/trends', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = CategoryPerformanceAnalyzer.getDateRanges(period);
    
    // Get deals in category
    const Deal = require('../models/Deal');
    const deals = await Deal.find({ category: req.params.id }).lean();
    const dealIds = deals.map(deal => deal._id.toString());
    
    const trends = await CategoryPerformanceAnalyzer.getCategoryTrafficTrends(
      dealIds,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        trends
      }
    });
  } catch (error) {
    console.error('Error fetching category trends:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching category trends'
    });
  }
});

// @route   GET /api/category-performance/:id/devices
// @desc    Get device breakdown for a category
// @access  Private (Admin only)
router.get('/:id/devices', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = CategoryPerformanceAnalyzer.getDateRanges(period);
    
    // Get deals in category
    const Deal = require('../models/Deal');
    const deals = await Deal.find({ category: req.params.id }).lean();
    const dealIds = deals.map(deal => deal._id.toString());
    
    const deviceBreakdown = await CategoryPerformanceAnalyzer.getCategoryDeviceBreakdown(
      dealIds,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        deviceBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching category device breakdown:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching device breakdown'
    });
  }
});

// @route   GET /api/category-performance/:id/hourly
// @desc    Get hourly distribution for a category
// @access  Private (Admin only)
router.get('/:id/hourly', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = CategoryPerformanceAnalyzer.getDateRanges(period);
    
    // Get deals in category
    const Deal = require('../models/Deal');
    const deals = await Deal.find({ category: req.params.id }).lean();
    const dealIds = deals.map(deal => deal._id.toString());
    
    const hourlyDistribution = await CategoryPerformanceAnalyzer.getCategoryHourlyDistribution(
      dealIds,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        hourlyDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching category hourly distribution:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching hourly distribution'
    });
  }
});

// @route   GET /api/category-performance/:id/funnel
// @desc    Get conversion funnel for a category
// @access  Private (Admin only)
router.get('/:id/funnel', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = CategoryPerformanceAnalyzer.getDateRanges(period);
    
    // Get deals in category
    const Deal = require('../models/Deal');
    const deals = await Deal.find({ category: req.params.id }).lean();
    const dealIds = deals.map(deal => deal._id.toString());
    
    const conversionFunnel = await CategoryPerformanceAnalyzer.getCategoryConversionFunnel(
      dealIds,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        conversionFunnel
      }
    });
  } catch (error) {
    console.error('Error fetching category conversion funnel:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching conversion funnel'
    });
  }
});

// @route   POST /api/category-performance/compare
// @desc    Compare performance between multiple categories
// @access  Private (Admin only)
router.post('/compare', adminAuth, async (req, res) => {
  try {
    const { categoryIds, period = 'month' } = req.body;
    
    if (!Array.isArray(categoryIds) || categoryIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'At least 2 category IDs are required for comparison'
      });
    }
    
    const comparison = await CategoryPerformanceAnalyzer.getCategoryComparison(
      categoryIds,
      period
    );
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while comparing categories'
    });
  }
});

// @route   GET /api/category-performance/rankings/:metric
// @desc    Get category rankings by specific metric
// @access  Private (Admin only)
router.get('/rankings/:metric', adminAuth, async (req, res) => {
  try {
    const { metric } = req.params;
    const { period = 'month', limit = 10 } = req.query;
    
    if (!['revenue', 'clicks', 'conversions', 'conversion-rate', 'revenue-per-click'].includes(metric)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid metric. Allowed values: revenue, clicks, conversions, conversion-rate, revenue-per-click'
      });
    }
    
    const overview = await CategoryPerformanceAnalyzer.getCategoryPerformanceOverview(period);
    
    // Sort categories by the requested metric
    let sortedCategories;
    switch (metric) {
      case 'revenue':
        sortedCategories = overview.categories.sort((a, b) => 
          b.currentMetrics.totalRevenue - a.currentMetrics.totalRevenue
        );
        break;
      case 'clicks':
        sortedCategories = overview.categories.sort((a, b) => 
          b.currentMetrics.totalClicks - a.currentMetrics.totalClicks
        );
        break;
      case 'conversions':
        sortedCategories = overview.categories.sort((a, b) => 
          b.currentMetrics.totalConversions - a.currentMetrics.totalConversions
        );
        break;
      case 'conversion-rate':
        sortedCategories = overview.categories.sort((a, b) => 
          parseFloat(b.currentMetrics.conversionRate || 0) - parseFloat(a.currentMetrics.conversionRate || 0)
        );
        break;
      case 'revenue-per-click':
        sortedCategories = overview.categories.sort((a, b) => 
          parseFloat(b.currentMetrics.revenuePerClick || 0) - parseFloat(a.currentMetrics.revenuePerClick || 0)
        );
        break;
      default:
        sortedCategories = overview.categories;
    }
    
    res.json({
      success: true,
      data: {
        period: overview.period,
        metric,
        categories: sortedCategories.slice(0, parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching category rankings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category rankings'
    });
  }
});

// @route   GET /api/category-performance/:id/insights
// @desc    Get performance insights and recommendations for a category
// @access  Private (Admin only)
router.get('/:id/insights', adminAuth, async (req, res) => {
  try {
    const metrics = await CategoryPerformanceAnalyzer.getCategoryDetailedMetrics(
      req.params.id,
      'month'
    );
    
    const insights = [];
    
    // Generate insights based on metrics
    const current = metrics.metrics.current;
    const changes = metrics.metrics.changes;
    
    // Performance insights
    if (parseFloat(current.performance.conversionRate) < 1) {
      insights.push({
        type: 'warning',
        title: 'Low Conversion Rate',
        message: `Category conversion rate is ${current.performance.conversionRate}%, which is below the recommended 1%`,
        recommendation: 'Review deal quality and affiliate links in this category'
      });
    }
    
    if (changes.revenue.total < -10) {
      insights.push({
        type: 'alert',
        title: 'Revenue Declining',
        message: `Revenue has decreased by ${Math.abs(changes.revenue.total).toFixed(1)}% compared to previous period`,
        recommendation: 'Investigate underperforming deals and consider promotional campaigns'
      });
    }
    
    if (changes.clicks.total > 20) {
      insights.push({
        type: 'success',
        title: 'Traffic Growing',
        message: `Traffic has increased by ${changes.clicks.total.toFixed(1)}% compared to previous period`,
        recommendation: 'Consider optimizing conversion funnel to maximize revenue from increased traffic'
      });
    }
    
    // Device insights
    const mobilePercentage = (current.clicks.mobile / current.clicks.total) * 100;
    if (mobilePercentage > 70) {
      insights.push({
        type: 'info',
        title: 'Mobile-Heavy Traffic',
        message: `${mobilePercentage.toFixed(1)}% of traffic is from mobile devices`,
        recommendation: 'Ensure all deals in this category are mobile-optimized'
      });
    }
    
    res.json({
      success: true,
      data: {
        category: metrics.category,
        insights
      }
    });
  } catch (error) {
    console.error('Error fetching category insights:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching category insights'
    });
  }
});

module.exports = router;
