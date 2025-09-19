const express = require('express');
const router = express.Router();
const RevenueOptimizer = require('../services/revenueOptimizer');
const RevenueTracking = require('../models/RevenueTracking');
const ClickTracking = require('../models/ClickTracking');
const Deal = require('../models/Deal');

const revenueOptimizer = new RevenueOptimizer();

// @route   GET /api/revenue/analytics
// @desc    Get comprehensive revenue analytics
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
  try {
    const { timeframe = 30 } = req.query;
    
    const analysis = await revenueOptimizer.analyzeDealPerformance(parseInt(timeframe));
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/revenue/optimization-suggestions
// @desc    Get AI-powered optimization suggestions
// @access  Private (Admin)
router.get('/optimization-suggestions', async (req, res) => {
  try {
    const { timeframe = 30 } = req.query;
    
    const analysis = await revenueOptimizer.analyzeDealPerformance(parseInt(timeframe));
    
    res.json({
      success: true,
      data: {
        suggestions: analysis.optimizationSuggestions,
        summary: {
          totalSuggestions: analysis.optimizationSuggestions.length,
          highPriority: analysis.optimizationSuggestions.filter(s => s.priority === 'high').length,
          estimatedRevenueIncrease: analysis.optimizationSuggestions.reduce(
            (sum, s) => sum + (s.estimatedRevenueIncrease || 0), 0
          )
        }
      }
    });
  } catch (error) {
    console.error('Error getting optimization suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get optimization suggestions'
    });
  }
});

// @route   GET /api/revenue/forecast
// @desc    Get revenue forecasting
// @access  Private (Admin)
router.get('/forecast', async (req, res) => {
  try {
    const { months = 3 } = req.query;
    
    const forecast = await revenueOptimizer.getRevenueForecast(parseInt(months));
    
    res.json({
      success: true,
      data: forecast
    });
  } catch (error) {
    console.error('Error getting revenue forecast:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue forecast'
    });
  }
});

// @route   GET /api/revenue/ab-testing-suggestions
// @desc    Get A/B testing suggestions for optimization
// @access  Private (Admin)
router.get('/ab-testing-suggestions', async (req, res) => {
  try {
    const suggestions = await revenueOptimizer.getABTestingSuggestions();
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error getting A/B testing suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get A/B testing suggestions'
    });
  }
});

// @route   POST /api/revenue/track-conversion
// @desc    Track a conversion for revenue optimization
// @access  Public
router.post('/track-conversion', async (req, res) => {
  try {
    const { dealId, amount, userId, source, metadata = {} } = req.body;
    
    if (!dealId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Deal ID and amount are required'
      });
    }

    // Verify deal exists
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    // Create revenue tracking record
    const revenueRecord = new RevenueTracking({
      dealId,
      amount: parseFloat(amount),
      userId: userId || null,
      source: source || 'direct',
      metadata,
      createdAt: new Date()
    });

    await revenueRecord.save();

    // Update deal revenue stats
    await Deal.findByIdAndUpdate(dealId, {
      $inc: { 
        'analytics.totalRevenue': parseFloat(amount),
        'analytics.conversionCount': 1
      }
    });

    res.json({
      success: true,
      message: 'Conversion tracked successfully',
      data: {
        conversionId: revenueRecord._id,
        amount: parseFloat(amount),
        dealTitle: deal.title
      }
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track conversion'
    });
  }
});

// @route   GET /api/revenue/dashboard-stats
// @desc    Get key revenue stats for dashboard
// @access  Private (Admin)
router.get('/dashboard-stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Get revenue stats
    const [monthlyRevenue, weeklyRevenue, dailyRevenue, totalRevenue] = await Promise.all([
      RevenueTracking.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      RevenueTracking.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      RevenueTracking.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      RevenueTracking.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ])
    ]);

    // Get click stats
    const [monthlyClicks, weeklyClicks, dailyClicks, totalClicks] = await Promise.all([
      ClickTracking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      ClickTracking.countDocuments({ createdAt: { $gte: startOfWeek } }),
      ClickTracking.countDocuments({ createdAt: { $gte: startOfDay } }),
      ClickTracking.countDocuments({})
    ]);

    // Calculate conversion rates
    const monthlyConversionRate = monthlyClicks > 0 ? 
      ((monthlyRevenue[0]?.count || 0) / monthlyClicks) * 100 : 0;
    const weeklyConversionRate = weeklyClicks > 0 ? 
      ((weeklyRevenue[0]?.count || 0) / weeklyClicks) * 100 : 0;
    const dailyConversionRate = dailyClicks > 0 ? 
      ((dailyRevenue[0]?.count || 0) / dailyClicks) * 100 : 0;

    // Top performing deals this month
    const topDeals = await RevenueTracking.aggregate([
      { $match: { createdAt: { $gte: startOfMonth } } },
      {
        $group: {
          _id: '$dealId',
          revenue: { $sum: '$amount' },
          conversions: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'deals',
          localField: '_id',
          foreignField: '_id',
          as: 'deal'
        }
      },
      { $unwind: '$deal' }
    ]);

    res.json({
      success: true,
      data: {
        revenue: {
          today: dailyRevenue[0]?.total || 0,
          week: weeklyRevenue[0]?.total || 0,
          month: monthlyRevenue[0]?.total || 0,
          total: totalRevenue[0]?.total || 0
        },
        conversions: {
          today: dailyRevenue[0]?.count || 0,
          week: weeklyRevenue[0]?.count || 0,
          month: monthlyRevenue[0]?.count || 0,
          total: totalRevenue[0]?.count || 0
        },
        clicks: {
          today: dailyClicks,
          week: weeklyClicks,
          month: monthlyClicks,
          total: totalClicks
        },
        conversionRates: {
          today: dailyConversionRate,
          week: weeklyConversionRate,
          month: monthlyConversionRate,
          overall: totalClicks > 0 ? ((totalRevenue[0]?.count || 0) / totalClicks) * 100 : 0
        },
        topDeals: topDeals.map(deal => ({
          id: deal._id,
          title: deal.deal.title,
          revenue: deal.revenue,
          conversions: deal.conversions,
          averageCommission: deal.revenue / deal.conversions
        })),
        metrics: {
          revenuePerClick: totalClicks > 0 ? (totalRevenue[0]?.total || 0) / totalClicks : 0,
          averageCommission: (totalRevenue[0]?.count || 0) > 0 ? 
            (totalRevenue[0]?.total || 0) / (totalRevenue[0]?.count || 0) : 0
        }
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats'
    });
  }
});

// @route   GET /api/revenue/trends
// @desc    Get revenue trends over time
// @access  Private (Admin)
router.get('/trends', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate, groupBy;
    const now = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const trends = await RevenueTracking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$amount' },
          conversions: { $sum: 1 },
          avgCommission: { $avg: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        period,
        trends,
        summary: {
          totalRevenue: trends.reduce((sum, t) => sum + t.revenue, 0),
          totalConversions: trends.reduce((sum, t) => sum + t.conversions, 0),
          averageDaily: trends.length > 0 ? 
            trends.reduce((sum, t) => sum + t.revenue, 0) / trends.length : 0
        }
      }
    });
  } catch (error) {
    console.error('Error getting revenue trends:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue trends'
    });
  }
});

// @route   POST /api/revenue/optimize-deal
// @desc    Apply optimization to a specific deal
// @access  Private (Admin)
router.post('/optimize-deal/:dealId', async (req, res) => {
  try {
    const { dealId } = req.params;
    const { optimizationType, newTitle, newDescription, newImage } = req.body;

    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    const updates = {};
    
    switch (optimizationType) {
      case 'title_optimization':
        if (newTitle) updates.title = newTitle;
        break;
      case 'description_optimization':
        if (newDescription) updates.description = newDescription;
        break;
      case 'image_optimization':
        if (newImage) updates.image = newImage;
        break;
      case 'category_optimization':
        // Auto-optimize based on performance data
        updates.featured = true;
        updates.priority = 'high';
        break;
    }

    if (Object.keys(updates).length > 0) {
      updates.lastOptimized = new Date();
      await Deal.findByIdAndUpdate(dealId, updates);
    }

    res.json({
      success: true,
      message: 'Deal optimization applied successfully',
      data: {
        dealId,
        optimizationType,
        updatesApplied: Object.keys(updates)
      }
    });
  } catch (error) {
    console.error('Error optimizing deal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize deal'
    });
  }
});

// @route   POST /api/revenue-optimization/start-ab-test
// @desc    Start a new A/B test
// @access  Private (Admin)
router.post('/start-ab-test', async (req, res) => {
  try {
    const { test, description, element, expectedImpact, dealId } = req.body;

    // Create A/B test configuration
    const abTestConfig = {
      testName: test,
      description,
      targetElement: element,
      expectedImpact,
      dealId,
      status: 'active',
      startDate: new Date(),
      variants: [
        { name: 'control', traffic: 50 },
        { name: 'variant', traffic: 50 }
      ],
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0
      }
    };

    // In a real implementation, you'd save this to an ABTest model
    // For now, we'll simulate success
    console.log('A/B Test Started:', abTestConfig);

    res.json({
      success: true,
      message: 'A/B test started successfully',
      data: {
        testId: `test_${Date.now()}`,
        config: abTestConfig
      }
    });
  } catch (error) {
    console.error('Error starting A/B test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start A/B test'
    });
  }
});

module.exports = router;
