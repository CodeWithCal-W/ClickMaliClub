const express = require('express');
const router = express.Router();
const AnalyticsService = require('../services/analyticsService');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/analytics/dashboard
// @desc    Get comprehensive dashboard analytics
// @access  Private (Admin only)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Validate period parameter
    const validPeriods = ['today', 'week', 'month', 'year'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid period. Must be one of: today, week, month, year'
      });
    }

    const analytics = await AnalyticsService.getDashboardAnalytics(period);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/analytics/deals
// @desc    Get deal performance analytics
// @access  Private (Admin only)
router.get('/deals', adminAuth, async (req, res) => {
  try {
    const { period = 'month', limit = 20 } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const deals = await AnalyticsService.getDealPerformance(startDate, endDate, parseInt(limit));
    
    res.json({
      success: true,
      period,
      dateRange: { startDate, endDate },
      count: deals.length,
      data: deals
    });
  } catch (error) {
    console.error('Error fetching deal analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deal analytics'
    });
  }
});

// @route   GET /api/analytics/categories
// @desc    Get category performance analytics
// @access  Private (Admin only)
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const categories = await AnalyticsService.getCategoryPerformance(startDate, endDate);
    
    res.json({
      success: true,
      period,
      dateRange: { startDate, endDate },
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching category analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category analytics'
    });
  }
});

// @route   GET /api/analytics/affiliate-links
// @desc    Get affiliate link performance
// @access  Private (Admin only)
router.get('/affiliate-links', adminAuth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const links = await AnalyticsService.getAffiliateLinksPerformance(parseInt(limit));
    
    res.json({
      success: true,
      count: links.length,
      data: links
    });
  } catch (error) {
    console.error('Error fetching affiliate link analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching affiliate link analytics'
    });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Private (Admin only)
router.get('/revenue', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const RevenueTracking = require('../models/RevenueTracking');
    const stats = await RevenueTracking.getDashboardStats(period);
    
    res.json({
      success: true,
      period,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching revenue analytics'
    });
  }
});

// @route   GET /api/analytics/conversion-funnel
// @desc    Get conversion funnel analytics
// @access  Private (Admin only)
router.get('/conversion-funnel', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const funnel = await AnalyticsService.getConversionFunnel(startDate, endDate);
    
    res.json({
      success: true,
      period,
      dateRange: { startDate, endDate },
      data: funnel
    });
  } catch (error) {
    console.error('Error fetching conversion funnel:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching conversion funnel'
    });
  }
});

// @route   POST /api/analytics/revenue
// @desc    Record a new revenue entry
// @access  Private (Admin only)
router.post('/revenue', adminAuth, async (req, res) => {
  try {
    const RevenueTracking = require('../models/RevenueTracking');
    
    const revenueData = {
      ...req.body,
      'metadata.recordedBy': req.admin.id
    };
    
    const revenue = new RevenueTracking(revenueData);
    await revenue.save();
    
    res.status(201).json({
      success: true,
      message: 'Revenue entry created successfully',
      data: revenue
    });
  } catch (error) {
    console.error('Error creating revenue entry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating revenue entry',
      error: error.message
    });
  }
});

// @route   PUT /api/analytics/revenue/:id
// @desc    Update revenue entry status
// @access  Private (Admin only)
router.put('/revenue/:id', adminAuth, async (req, res) => {
  try {
    const RevenueTracking = require('../models/RevenueTracking');
    
    const revenue = await RevenueTracking.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        'metadata.updatedBy': req.admin.id,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!revenue) {
      return res.status(404).json({
        success: false,
        message: 'Revenue entry not found'
      });
    }

    res.json({
      success: true,
      message: 'Revenue entry updated successfully',
      data: revenue
    });
  } catch (error) {
    console.error('Error updating revenue entry:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating revenue entry'
    });
  }
});

module.exports = router;
