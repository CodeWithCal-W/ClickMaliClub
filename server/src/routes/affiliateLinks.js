const express = require('express');
const router = express.Router();
const AffiliateLinkManager = require('../services/affiliateLinkManager');
const adminAuth = require('../middleware/adminAuth');

// @route   GET /api/affiliate-links
// @desc    Get all affiliate links for management
// @access  Private (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { search, category, status, limit = 50, page = 1 } = req.query;
    
    const result = await AffiliateLinkManager.getAllAffiliateLinks({
      search,
      category,
      status,
      limit: parseInt(limit),
      page: parseInt(page)
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching affiliate links'
    });
  }
});

// @route   PUT /api/affiliate-links/:id
// @desc    Update affiliate link for a specific deal
// @access  Private (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { affiliateLink, trackingCode, commission, notes } = req.body;
    
    // Validate affiliate link format if provided
    if (affiliateLink) {
      const linkTest = await AffiliateLinkManager.testAffiliateLink(affiliateLink);
      if (!linkTest.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid affiliate link format',
          error: linkTest.error
        });
      }
    }
    
    const updatedDeal = await AffiliateLinkManager.updateAffiliateLink(
      req.params.id,
      { affiliateLink, trackingCode, commission, notes },
      req.admin.id
    );
    
    res.json({
      success: true,
      message: 'Affiliate link updated successfully',
      data: updatedDeal
    });
  } catch (error) {
    console.error('Error updating affiliate link:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating affiliate link'
    });
  }
});

// @route   POST /api/affiliate-links/bulk-update
// @desc    Bulk update affiliate links
// @access  Private (Admin only)
router.post('/bulk-update', adminAuth, async (req, res) => {
  try {
    const { criteria, updates } = req.body;
    
    // Validate required fields
    if (!criteria || !updates) {
      return res.status(400).json({
        success: false,
        message: 'Criteria and updates are required'
      });
    }
    
    // Validate affiliate link if provided
    if (updates.affiliateLink) {
      const linkTest = await AffiliateLinkManager.testAffiliateLink(updates.affiliateLink);
      if (!linkTest.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid affiliate link format',
          error: linkTest.error
        });
      }
    }
    
    const result = await AffiliateLinkManager.bulkUpdateAffiliateLinks(
      criteria,
      updates,
      req.admin.id
    );
    
    res.json({
      success: true,
      message: `Successfully updated ${result.updated} affiliate links`,
      data: {
        updatedCount: result.updated,
        affectedDeals: result.deals.length
      }
    });
  } catch (error) {
    console.error('Error bulk updating affiliate links:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while bulk updating affiliate links'
    });
  }
});

// @route   POST /api/affiliate-links/test
// @desc    Test affiliate link validity
// @access  Private (Admin only)
router.post('/test', adminAuth, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }
    
    const result = await AffiliateLinkManager.testAffiliateLink(url);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error testing affiliate link:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while testing affiliate link'
    });
  }
});

// @route   GET /api/affiliate-links/:id/analytics
// @desc    Get analytics for a specific affiliate link
// @access  Private (Admin only)
router.get('/:id/analytics', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    const analytics = await AffiliateLinkManager.getAffiliateLinkAnalytics(
      req.params.id,
      period
    );
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching affiliate link analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/affiliate-links/:id/history
// @desc    Get change history for an affiliate link
// @access  Private (Admin only)
router.get('/:id/history', adminAuth, async (req, res) => {
  try {
    const history = await AffiliateLinkManager.getLinkHistory(req.params.id);
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching link history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching link history'
    });
  }
});

// @route   GET /api/affiliate-links/report
// @desc    Generate affiliate link report
// @access  Private (Admin only)
router.get('/report', adminAuth, async (req, res) => {
  try {
    const { category, brand, status } = req.query;
    
    const report = await AffiliateLinkManager.generateLinkReport({
      category,
      brand,
      status
    });
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error generating affiliate link report:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating report'
    });
  }
});

// @route   POST /api/affiliate-links/validate-batch
// @desc    Validate multiple affiliate links
// @access  Private (Admin only)
router.post('/validate-batch', adminAuth, async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URLs array is required'
      });
    }
    
    const results = await Promise.all(
      urls.map(async (url) => {
        const result = await AffiliateLinkManager.testAffiliateLink(url);
        return {
          url,
          ...result
        };
      })
    );
    
    const summary = {
      total: results.length,
      valid: results.filter(r => r.isValid).length,
      invalid: results.filter(r => !r.isValid).length
    };
    
    res.json({
      success: true,
      data: {
        summary,
        results
      }
    });
  } catch (error) {
    console.error('Error validating affiliate links:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while validating links'
    });
  }
});

module.exports = router;
