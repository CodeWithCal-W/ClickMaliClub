const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const Category = require('../models/Category');
const ClickTracking = require('../models/ClickTracking');
const { getOptimizedDeals } = require('../services/optimizedQueries');
const { clearCache } = require('../middleware/performance');

// @route   GET /api/deals
// @desc    Get all active deals
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10, page = 1, featured } = req.query;
    
    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(Math.max(1, parseInt(limit)), 50); // Max 50 items per page for public
    
    // Use optimized query service
    const result = await getOptimizedDeals({
      category,
      limit: limitNum,
      page: pageNum,
      featured: featured === 'true',
      fields: ['title', 'slug', 'description', 'shortDescription', 'brand', 'offer', 'affiliateLink', 'tags', 'isFeatured', 'priority', 'createdAt', 'analytics']
    });

    // Check if requested page exists
    if (pageNum > result.pages && result.total > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${pageNum} does not exist. Maximum page is ${result.pages}`,
        total: result.total,
        maxPages: result.pages
      });
    }

    res.json({
      success: true,
      count: result.deals.length,
      total: result.total,
      page: pageNum,
      pages: result.pages,
      data: result.deals
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/deals/:id
// @desc    Get single deal and track view
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findOne({ 
      _id: req.params.id, 
      status: 'active' 
    })
    .populate('category', 'name slug color')
    .select('-__v');

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    // Track view in analytics
    if (!deal.analytics) {
      deal.analytics = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
    }
    deal.analytics.views = (deal.analytics.views || 0) + 1;
    await deal.save();

    res.json({
      success: true,
      data: deal
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deal'
    });
  }
});

// @route   POST /api/deals/:id/view
// @desc    Track deal view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    // Increment view count in analytics
    if (!deal.analytics) {
      deal.analytics = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
    }
    deal.analytics.views = (deal.analytics.views || 0) + 1;
    await deal.save();
    
    res.json({
      success: true,
      message: 'View tracked successfully',
      views: deal.analytics.views
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking view'
    });
  }
});

// @route   POST /api/deals/:id/click
// @desc    Track deal click and return affiliate URL
// @access  Public
router.post('/:id/click', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found'
      });
    }

    // Increment click count in analytics
    if (!deal.analytics) {
      deal.analytics = { views: 0, clicks: 0, conversions: 0, revenue: 0 };
    }
    deal.analytics.clicks = (deal.analytics.clicks || 0) + 1;
    await deal.save();

    // Create a detailed ClickTracking record for analytics
    const clickRecord = new ClickTracking({
      dealId: deal._id,
      ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      source: 'website',
      device: req.get('User-Agent')?.includes('Mobile') ? 'mobile' : 'desktop',
      clickedAt: new Date()
    });
    await clickRecord.save();
    
    res.json({
      success: true,
      message: 'Click tracked successfully',
      affiliateUrl: deal.affiliateLink, // Should be affiliateLink not affiliateUrl
      clicks: deal.analytics.clicks
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while tracking click'
    });
  }
});

module.exports = router;
