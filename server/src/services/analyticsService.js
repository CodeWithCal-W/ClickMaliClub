const Deal = require('../models/Deal');
const Category = require('../models/Category');
const ClickTracking = require('../models/ClickTracking');
const RevenueTracking = require('../models/RevenueTracking');

/**
 * Advanced Analytics Service for Business Growth
 */

class AnalyticsService {
  
  /**
   * Get comprehensive dashboard analytics
   */
  static async getDashboardAnalytics(period = 'month') {
    const now = new Date();
    let startDate, endDate, previousStartDate, previousEndDate;
    
    // Calculate date ranges based on period
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 1);
        previousEndDate = startDate;
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        endDate = new Date();
        previousStartDate = new Date(startDate);
        previousStartDate.setDate(previousStartDate.getDate() - 7);
        previousEndDate = startDate;
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
        previousEndDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
    }

    // Execute parallel queries for better performance
    const [
      currentRevenue,
      previousRevenue,
      clickAnalytics,
      dealPerformance,
      categoryPerformance,
      conversionFunnel
    ] = await Promise.all([
      RevenueTracking.getDashboardStats(period),
      this.getRevenueForPeriod(previousStartDate, previousEndDate),
      this.getClickAnalytics(startDate, endDate),
      this.getDealPerformance(startDate, endDate),
      this.getCategoryPerformance(startDate, endDate),
      this.getConversionFunnel(startDate, endDate)
    ]);

    return {
      period,
      dateRange: { startDate, endDate },
      revenue: {
        current: currentRevenue.revenue[0] || { total: 0, count: 0, average: 0 },
        previous: previousRevenue || { total: 0, count: 0, average: 0 },
        growth: this.calculateGrowth(
          currentRevenue.revenue[0]?.total || 0,
          previousRevenue?.total || 0
        ),
        bySource: currentRevenue.bySource || [],
        trends: currentRevenue.trends || []
      },
      clicks: clickAnalytics,
      deals: dealPerformance,
      categories: categoryPerformance,
      funnel: conversionFunnel
    };
  }

  /**
   * Get click analytics with CTR calculations
   */
  static async getClickAnalytics(startDate, endDate) {
    const clickStats = await ClickTracking.aggregate([
      {
        $match: {
          clickedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $facet: {
          total: [
            { $count: 'count' }
          ],
          byDeal: [
            {
              $group: {
                _id: '$dealId',
                clicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$ipAddress' }
              }
            },
            {
              $addFields: {
                uniqueClicks: { $size: '$uniqueUsers' }
              }
            },
            {
              $lookup: {
                from: 'deals',
                localField: '_id',
                foreignField: '_id',
                as: 'deal'
              }
            },
            {
              $unwind: '$deal'
            },
            {
              $project: {
                dealTitle: '$deal.title',
                dealSlug: '$deal.slug',
                clicks: 1,
                uniqueClicks: 1,
                views: '$deal.analytics.views'
              }
            },
            {
              $addFields: {
                ctr: {
                  $cond: [
                    { $gt: ['$views', 0] },
                    { $multiply: [{ $divide: ['$clicks', '$views'] }, 100] },
                    0
                  ]
                }
              }
            },
            { $sort: { clicks: -1 } },
            { $limit: 10 }
          ],
          bySource: [
            {
              $group: {
                _id: '$source',
                clicks: { $sum: 1 }
              }
            },
            { $sort: { clicks: -1 } }
          ],
          hourlyDistribution: [
            {
              $group: {
                _id: { $hour: '$clickedAt' },
                clicks: { $sum: 1 }
              }
            },
            { $sort: { '_id': 1 } }
          ]
        }
      }
    ]);

    return clickStats[0] || {
      total: [{ count: 0 }],
      byDeal: [],
      bySource: [],
      hourlyDistribution: []
    };
  }

  /**
   * Get deal performance metrics
   */
  static async getDealPerformance(startDate, endDate, limit = 20) {
    return Deal.aggregate([
      {
        $match: {
          status: 'active',
          createdAt: { $lte: endDate }
        }
      },
      {
        $lookup: {
          from: 'clicktrackings',
          localField: '_id',
          foreignField: 'dealId',
          as: 'clicks',
          pipeline: [
            {
              $match: {
                clickedAt: { $gte: startDate, $lte: endDate }
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'revenuetrackings',
          localField: '_id',
          foreignField: 'metadata.dealId',
          as: 'revenue',
          pipeline: [
            {
              $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                status: { $in: ['confirmed', 'paid'] }
              }
            }
          ]
        }
      },
      {
        $addFields: {
          clickCount: { $size: '$clicks' },
          conversionCount: { $size: '$revenue' },
          totalRevenue: { $sum: '$revenue.amount' },
          ctr: {
            $cond: [
              { $gt: ['$analytics.views', 0] },
              { $multiply: [{ $divide: [{ $size: '$clicks' }, '$analytics.views'] }, 100] },
              0
            ]
          },
          conversionRate: {
            $cond: [
              { $gt: [{ $size: '$clicks' }, 0] },
              { $multiply: [{ $divide: [{ $size: '$revenue' }, { $size: '$clicks' }] }, 100] },
              0
            ]
          }
        }
      },
      {
        $project: {
          title: 1,
          slug: 1,
          brand: 1,
          views: '$analytics.views',
          clicks: '$clickCount',
          conversions: '$conversionCount',
          revenue: '$totalRevenue',
          ctr: { $round: ['$ctr', 2] },
          conversionRate: { $round: ['$conversionRate', 2] },
          isFeatured: 1,
          createdAt: 1
        }
      },
      { $sort: { revenue: -1, clicks: -1 } },
      { $limit: limit }
    ]);
  }

  /**
   * Get category performance analysis
   */
  static async getCategoryPerformance(startDate, endDate) {
    return Category.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $lookup: {
          from: 'deals',
          localField: '_id',
          foreignField: 'category',
          as: 'deals',
          pipeline: [
            { $match: { status: 'active' } }
          ]
        }
      },
      {
        $lookup: {
          from: 'clicktrackings',
          let: { categoryDeals: '$deals._id' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$dealId', '$$categoryDeals'] },
                clickedAt: { $gte: startDate, $lte: endDate }
              }
            }
          ],
          as: 'clicks'
        }
      },
      {
        $lookup: {
          from: 'revenuetrackings',
          let: { categoryDeals: '$deals._id' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$metadata.dealId', '$$categoryDeals'] },
                createdAt: { $gte: startDate, $lte: endDate },
                status: { $in: ['confirmed', 'paid'] }
              }
            }
          ],
          as: 'revenue'
        }
      },
      {
        $addFields: {
          dealCount: { $size: '$deals' },
          totalViews: { $sum: '$deals.analytics.views' },
          totalClicks: { $size: '$clicks' },
          totalRevenue: { $sum: '$revenue.amount' },
          conversionCount: { $size: '$revenue' }
        }
      },
      {
        $addFields: {
          ctr: {
            $cond: [
              { $gt: ['$totalViews', 0] },
              { $multiply: [{ $divide: ['$totalClicks', '$totalViews'] }, 100] },
              0
            ]
          },
          conversionRate: {
            $cond: [
              { $gt: ['$totalClicks', 0] },
              { $multiply: [{ $divide: ['$conversionCount', '$totalClicks'] }, 100] },
              0
            ]
          },
          avgRevenuePerDeal: {
            $cond: [
              { $gt: ['$dealCount', 0] },
              { $divide: ['$totalRevenue', '$dealCount'] },
              0
            ]
          }
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          color: 1,
          dealCount: 1,
          views: '$totalViews',
          clicks: '$totalClicks',
          revenue: '$totalRevenue',
          conversions: '$conversionCount',
          ctr: { $round: ['$ctr', 2] },
          conversionRate: { $round: ['$conversionRate', 2] },
          avgRevenuePerDeal: { $round: ['$avgRevenuePerDeal', 2] }
        }
      },
      { $sort: { revenue: -1 } }
    ]);
  }

  /**
   * Get conversion funnel analysis
   */
  static async getConversionFunnel(startDate, endDate) {
    const [views, clicks, conversions] = await Promise.all([
      Deal.aggregate([
        {
          $match: {
            status: 'active',
            updatedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$analytics.views' }
          }
        }
      ]),
      ClickTracking.countDocuments({
        clickedAt: { $gte: startDate, $lte: endDate }
      }),
      RevenueTracking.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'paid'] }
      })
    ]);

    const totalViews = views[0]?.totalViews || 0;
    const totalClicks = clicks || 0;
    const totalConversions = conversions || 0;

    return {
      views: totalViews,
      clicks: totalClicks,
      conversions: totalConversions,
      ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : 0,
      conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0,
      overallConversionRate: totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(2) : 0
    };
  }

  /**
   * Helper method to get revenue for a specific period
   */
  static async getRevenueForPeriod(startDate, endDate) {
    const result = await RevenueTracking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['confirmed', 'paid'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      }
    ]);

    return result[0] || { total: 0, count: 0, average: 0 };
  }

  /**
   * Calculate growth percentage
   */
  static calculateGrowth(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  /**
   * Get affiliate link performance
   */
  static async getAffiliateLinksPerformance(limit = 50) {
    return Deal.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $lookup: {
          from: 'clicktrackings',
          localField: '_id',
          foreignField: 'dealId',
          as: 'clicks'
        }
      },
      {
        $lookup: {
          from: 'revenuetrackings',
          localField: '_id',
          foreignField: 'metadata.dealId',
          as: 'revenue'
        }
      },
      {
        $addFields: {
          clickCount: { $size: '$clicks' },
          revenueCount: {
            $size: {
              $filter: {
                input: '$revenue',
                cond: { $in: ['$$this.status', ['confirmed', 'paid']] }
              }
            }
          },
          totalRevenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: '$revenue',
                    cond: { $in: ['$$this.status', ['confirmed', 'paid']] }
                  }
                },
                as: 'rev',
                in: '$$rev.amount'
              }
            }
          }
        }
      },
      {
        $project: {
          title: 1,
          slug: 1,
          affiliateLink: 1,
          trackingCode: 1,
          brand: 1,
          views: '$analytics.views',
          clicks: '$clickCount',
          conversions: '$revenueCount',
          revenue: '$totalRevenue',
          ctr: {
            $cond: [
              { $gt: ['$analytics.views', 0] },
              { $multiply: [{ $divide: ['$clickCount', '$analytics.views'] }, 100] },
              0
            ]
          },
          conversionRate: {
            $cond: [
              { $gt: ['$clickCount', 0] },
              { $multiply: [{ $divide: ['$revenueCount', '$clickCount'] }, 100] },
              0
            ]
          },
          avgRevenue: {
            $cond: [
              { $gt: ['$revenueCount', 0] },
              { $divide: ['$totalRevenue', '$revenueCount'] },
              0
            ]
          }
        }
      },
      { $sort: { revenue: -1, clicks: -1 } },
      { $limit: limit }
    ]);
  }
}

module.exports = AnalyticsService;
