const express = require('express');
const router = express.Router();
const DealPerformanceTracker = require('../services/dealPerformanceTracker');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/deal-performance/:id
// @desc    Get comprehensive performance metrics for a specific deal
// @access  Private (Admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const performance = await DealPerformanceTracker.getDealPerformanceMetrics(
      req.params.id,
      period
    );
    
    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Error fetching deal performance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching deal performance'
    });
  }
});

// @route   GET /api/deal-performance/:id/recommendations
// @desc    Get performance recommendations for a specific deal
// @access  Private (Admin only)
router.get('/:id/recommendations', adminAuth, async (req, res) => {
  try {
    const recommendations = await DealPerformanceTracker.getDealRecommendations(
      req.params.id
    );
    
    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error('Error fetching deal recommendations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching recommendations'
    });
  }
});

// @route   GET /api/deal-performance/top/performing
// @desc    Get top performing deals
// @access  Private (Admin only)
router.get('/top/performing', adminAuth, async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    
    const topDeals = await DealPerformanceTracker.getTopPerformingDeals(
      parseInt(limit),
      period
    );
    
    res.json({
      success: true,
      data: topDeals
    });
  } catch (error) {
    console.error('Error fetching top performing deals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top performing deals'
    });
  }
});

// @route   GET /api/deal-performance/:id/trends
// @desc    Get click trends for a specific deal
// @access  Private (Admin only)
router.get('/:id/trends', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = DealPerformanceTracker.getDateRanges(period);
    
    const trends = await DealPerformanceTracker.getDealClickTrends(
      req.params.id,
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
    console.error('Error fetching deal trends:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching deal trends'
    });
  }
});

// @route   GET /api/deal-performance/:id/funnel
// @desc    Get conversion funnel analysis for a specific deal
// @access  Private (Admin only)
router.get('/:id/funnel', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = DealPerformanceTracker.getDateRanges(period);
    
    const funnel = await DealPerformanceTracker.getDealConversionFunnel(
      req.params.id,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        funnel
      }
    });
  } catch (error) {
    console.error('Error fetching deal conversion funnel:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching conversion funnel'
    });
  }
});

// @route   GET /api/deal-performance/:id/hourly
// @desc    Get hourly click distribution for a specific deal
// @access  Private (Admin only)
router.get('/:id/hourly', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = DealPerformanceTracker.getDateRanges(period);
    
    const distribution = await DealPerformanceTracker.getDealHourlyDistribution(
      req.params.id,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        distribution
      }
    });
  } catch (error) {
    console.error('Error fetching hourly distribution:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching hourly distribution'
    });
  }
});

// @route   GET /api/deal-performance/:id/sources
// @desc    Get traffic source analysis for a specific deal
// @access  Private (Admin only)
router.get('/:id/sources', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const { startDate, endDate } = DealPerformanceTracker.getDateRanges(period);
    
    const sources = await DealPerformanceTracker.getDealSourceAnalysis(
      req.params.id,
      startDate,
      endDate
    );
    
    res.json({
      success: true,
      data: {
        period: { startDate, endDate },
        sources
      }
    });
  } catch (error) {
    console.error('Error fetching source analysis:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching source analysis'
    });
  }
});

// @route   POST /api/deal-performance/bulk-analysis
// @desc    Get performance analysis for multiple deals
// @access  Private (Admin only)
router.post('/bulk-analysis', adminAuth, async (req, res) => {
  try {
    const { dealIds, period = 'month' } = req.body;
    
    if (!Array.isArray(dealIds) || dealIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Deal IDs array is required'
      });
    }
    
    const analyses = await Promise.all(
      dealIds.map(async (dealId) => {
        try {
          return await DealPerformanceTracker.getDealPerformanceMetrics(dealId, period);
        } catch (error) {
          return {
            dealId,
            error: error.message
          };
        }
      })
    );
    
    res.json({
      success: true,
      data: analyses
    });
  } catch (error) {
    console.error('Error performing bulk analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while performing bulk analysis'
    });
  }
});

// @route   GET /api/deal-performance/comparison/:id1/:id2
// @desc    Compare performance between two deals
// @access  Private (Admin only)
router.get('/comparison/:id1/:id2', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const [deal1Performance, deal2Performance] = await Promise.all([
      DealPerformanceTracker.getDealPerformanceMetrics(req.params.id1, period),
      DealPerformanceTracker.getDealPerformanceMetrics(req.params.id2, period)
    ]);
    
    // Calculate comparison metrics
    const comparison = {
      deal1: deal1Performance,
      deal2: deal2Performance,
      winner: {
        clicks: deal1Performance.metrics.current.clicks.total > deal2Performance.metrics.current.clicks.total ? 'deal1' : 'deal2',
        revenue: deal1Performance.metrics.current.revenue.total > deal2Performance.metrics.current.revenue.total ? 'deal1' : 'deal2',
        conversionRate: parseFloat(deal1Performance.metrics.current.performance.conversionRate) > parseFloat(deal2Performance.metrics.current.performance.conversionRate) ? 'deal1' : 'deal2',
        ctr: parseFloat(deal1Performance.metrics.current.performance.ctr) > parseFloat(deal2Performance.metrics.current.performance.ctr) ? 'deal1' : 'deal2'
      }
    };
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing deal performance:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while comparing deals'
    });
  }
});

module.exports = router;
