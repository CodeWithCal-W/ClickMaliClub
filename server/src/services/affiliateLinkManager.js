const Deal = require('../models/Deal');

/**
 * Affiliate Link Management Service
 * Provides tools for managing and updating affiliate links across all deals
 */

class AffiliateLinkManager {
  
  /**
   * Get all deals with their affiliate links for management
   */
  static async getAllAffiliateLinks(options = {}) {
    const { search, category, status = 'active', limit = 50, page = 1 } = options;
    
    let query = { status };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'brand.name': { $regex: search, $options: 'i' } },
        { trackingCode: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add category filter
    if (category) {
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ slug: category }).lean();
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    const skip = (page - 1) * limit;
    
    const [deals, total] = await Promise.all([
      Deal.find(query)
        .populate('category', 'name slug color')
        .select('title slug brand affiliateLink trackingCode commission status isFeatured createdAt updatedAt analytics')
        .sort({ updatedAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      
      Deal.countDocuments(query)
    ]);
    
    return {
      deals,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  }
  
  /**
   * Update affiliate link for a specific deal
   */
  static async updateAffiliateLink(dealId, linkData, adminId) {
    const { affiliateLink, trackingCode, commission, notes } = linkData;
    
    const deal = await Deal.findById(dealId);
    if (!deal) {
      throw new Error('Deal not found');
    }
    
    // Store previous link for audit trail
    const previousLink = deal.affiliateLink;
    const previousTrackingCode = deal.trackingCode;
    
    // Update deal with new affiliate link data
    const updates = {
      updatedBy: adminId,
      updatedAt: new Date()
    };
    
    if (affiliateLink !== undefined) {
      updates.affiliateLink = affiliateLink;
    }
    
    if (trackingCode !== undefined) {
      updates.trackingCode = trackingCode;
    }
    
    if (commission !== undefined) {
      updates.commission = commission;
    }
    
    // Add audit trail to metadata
    if (!deal.metadata) {
      deal.metadata = {};
    }
    
    if (!deal.metadata.linkHistory) {
      deal.metadata.linkHistory = [];
    }
    
    deal.metadata.linkHistory.push({
      previousLink,
      previousTrackingCode,
      newLink: affiliateLink,
      newTrackingCode: trackingCode,
      updatedBy: adminId,
      updatedAt: new Date(),
      notes: notes || ''
    });
    
    updates.metadata = deal.metadata;
    
    const updatedDeal = await Deal.findByIdAndUpdate(
      dealId,
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'name slug color');
    
    return updatedDeal;
  }
  
  /**
   * Bulk update affiliate links based on criteria
   */
  static async bulkUpdateAffiliateLinks(criteria, updates, adminId) {
    const { category, brand, oldDomain, newDomain } = criteria;
    const { affiliateLink, trackingCode, commission } = updates;
    
    let query = { status: 'active' };
    
    // Build query based on criteria
    if (category) {
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ slug: category }).lean();
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    if (brand) {
      query['brand.name'] = { $regex: brand, $options: 'i' };
    }
    
    if (oldDomain && newDomain) {
      query.affiliateLink = { $regex: oldDomain, $options: 'i' };
    }
    
    // Find matching deals
    const dealsToUpdate = await Deal.find(query).select('_id title affiliateLink trackingCode').lean();
    
    if (dealsToUpdate.length === 0) {
      return { updated: 0, deals: [] };
    }
    
    const bulkOps = dealsToUpdate.map(deal => {
      const updateDoc = {
        updatedBy: adminId,
        updatedAt: new Date()
      };
      
      // Handle domain replacement
      if (oldDomain && newDomain && deal.affiliateLink) {
        updateDoc.affiliateLink = deal.affiliateLink.replace(
          new RegExp(oldDomain, 'gi'),
          newDomain
        );
      } else if (affiliateLink) {
        updateDoc.affiliateLink = affiliateLink;
      }
      
      if (trackingCode) {
        updateDoc.trackingCode = trackingCode;
      }
      
      if (commission !== undefined) {
        updateDoc.commission = commission;
      }
      
      return {
        updateOne: {
          filter: { _id: deal._id },
          update: { $set: updateDoc }
        }
      };
    });
    
    const result = await Deal.bulkWrite(bulkOps);
    
    return {
      updated: result.modifiedCount,
      deals: dealsToUpdate
    };
  }
  
  /**
   * Test affiliate link validity
   */
  static async testAffiliateLink(url) {
    try {
      // Basic URL validation
      const urlObj = new URL(url);
      
      // Check if URL is accessible (you might want to implement actual HTTP checking)
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      
      return {
        isValid,
        url: urlObj.href,
        domain: urlObj.hostname,
        protocol: urlObj.protocol,
        path: urlObj.pathname,
        queryParams: Object.fromEntries(urlObj.searchParams)
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get affiliate link analytics
   */
  static async getAffiliateLinkAnalytics(dealId, period = 'month') {
    const deal = await Deal.findById(dealId)
      .populate('category', 'name slug color')
      .lean();
    
    if (!deal) {
      throw new Error('Deal not found');
    }
    
    // Calculate date range
    const now = new Date();
    let startDate, endDate;
    
    switch (period) {
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
    
    // Get click and revenue data
    const ClickTracking = require('../models/ClickTracking');
    const RevenueTracking = require('../models/RevenueTracking');
    
    const [clicks, revenue] = await Promise.all([
      ClickTracking.find({
        dealId: dealId,
        clickedAt: { $gte: startDate, $lte: endDate }
      }).lean(),
      
      RevenueTracking.find({
        'metadata.dealId': dealId,
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'paid'] }
      }).lean()
    ]);
    
    return {
      deal: {
        id: deal._id,
        title: deal.title,
        slug: deal.slug,
        affiliateLink: deal.affiliateLink,
        trackingCode: deal.trackingCode,
        category: deal.category
      },
      period,
      dateRange: { startDate, endDate },
      analytics: {
        views: deal.analytics.views || 0,
        clicks: clicks.length,
        conversions: revenue.length,
        revenue: revenue.reduce((sum, r) => sum + r.amount, 0),
        ctr: deal.analytics.views > 0 ? ((clicks.length / deal.analytics.views) * 100).toFixed(2) : 0,
        conversionRate: clicks.length > 0 ? ((revenue.length / clicks.length) * 100).toFixed(2) : 0,
        avgRevenuePerConversion: revenue.length > 0 ? (revenue.reduce((sum, r) => sum + r.amount, 0) / revenue.length).toFixed(2) : 0
      },
      clickHistory: clicks.map(click => ({
        date: click.clickedAt,
        source: click.source,
        device: click.device,
        location: click.location
      })),
      revenueHistory: revenue.map(rev => ({
        date: rev.createdAt,
        amount: rev.amount,
        status: rev.status,
        source: rev.source
      }))
    };
  }
  
  /**
   * Get link change history for audit
   */
  static async getLinkHistory(dealId) {
    const deal = await Deal.findById(dealId)
      .select('title slug metadata')
      .lean();
    
    if (!deal) {
      throw new Error('Deal not found');
    }
    
    return {
      dealTitle: deal.title,
      dealSlug: deal.slug,
      linkHistory: deal.metadata?.linkHistory || []
    };
  }
  
  /**
   * Generate affiliate link report
   */
  static async generateLinkReport(options = {}) {
    const { category, brand, status = 'active' } = options;
    
    let query = { status };
    
    if (category) {
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ slug: category }).lean();
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    
    if (brand) {
      query['brand.name'] = { $regex: brand, $options: 'i' };
    }
    
    const deals = await Deal.find(query)
      .populate('category', 'name slug')
      .select('title slug brand affiliateLink trackingCode commission analytics createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .lean();
    
    // Calculate summary statistics
    const summary = {
      totalDeals: deals.length,
      dealsWithLinks: deals.filter(d => d.affiliateLink).length,
      dealsWithTracking: deals.filter(d => d.trackingCode).length,
      averageCommission: deals.filter(d => d.commission).reduce((sum, d) => sum + d.commission, 0) / deals.filter(d => d.commission).length || 0,
      totalViews: deals.reduce((sum, d) => sum + (d.analytics?.views || 0), 0),
      totalClicks: deals.reduce((sum, d) => sum + (d.analytics?.clicks || 0), 0)
    };
    
    return {
      summary,
      deals: deals.map(deal => ({
        id: deal._id,
        title: deal.title,
        slug: deal.slug,
        brand: deal.brand?.name || '',
        category: deal.category?.name || '',
        affiliateLink: deal.affiliateLink || '',
        trackingCode: deal.trackingCode || '',
        commission: deal.commission || 0,
        views: deal.analytics?.views || 0,
        clicks: deal.analytics?.clicks || 0,
        ctr: deal.analytics?.views > 0 ? ((deal.analytics?.clicks || 0) / deal.analytics.views * 100).toFixed(2) : 0,
        lastUpdated: deal.updatedAt,
        hasLink: !!deal.affiliateLink,
        hasTracking: !!deal.trackingCode
      }))
    };
  }
}

module.exports = AffiliateLinkManager;
