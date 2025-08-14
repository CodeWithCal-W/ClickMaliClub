const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');
const Category = require('../models/Category');

// @route   GET /api/deals
// @desc    Get all active deals
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    
    let query = { status: 'active' };
    
    // Filter by category if provided
    if (category) {
      // First find the category by slug to get its ObjectId
      const categoryDoc = await Category.findOne({ slug: category, isActive: true });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        // If category not found, return empty results
        return res.json({
          success: true,
          count: 0,
          total: 0,
          page: parseInt(page),
          pages: 0,
          data: []
        });
      }
    }

    const deals = await Deal.find(query)
      .populate('category', 'name slug color')
      .sort({ isFeatured: -1, priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-__v');

    const total = await Deal.countDocuments(query);

    res.json({
      success: true,
      count: deals.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: deals
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching deals'
    });
  }
});

// @route   GET /api/deals/:id
// @desc    Get single deal
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

    // You could also create a detailed ClickTracking record for analytics
    // const clickRecord = new ClickTracking({
    //   deal: deal._id,
    //   userAgent: req.get('User-Agent'),
    //   ip: req.ip,
    //   timestamp: new Date()
    // });
    // await clickRecord.save();
    
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
