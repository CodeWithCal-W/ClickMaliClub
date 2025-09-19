const Deal = require('../models/Deal');
const ClickTracking = require('../models/ClickTracking');
const RevenueTracking = require('../models/RevenueTracking');

class DealPerformanceTracker {
  /**
   * Get comprehensive performance metrics for a specific deal
   */
  static async getDealPerformanceMetrics(dealId, period = 'month') {
    try {
      const dateRanges = this.getDateRanges(period);
      const { startDate, endDate, previousStartDate, previousEndDate } = dateRanges;

      // Get deal information
      const deal = await Deal.findById(dealId)
        .populate('category', 'name')
        .lean();

      if (!deal) {
        throw new Error('Deal not found');
      }

      // Current period metrics
      const currentMetrics = await this.calculateDealMetrics(dealId, startDate, endDate);
      
      // Previous period metrics for comparison
      const previousMetrics = await this.calculateDealMetrics(dealId, previousStartDate, previousEndDate);

      // Calculate percentage changes
      const changes = this.calculateChanges(currentMetrics, previousMetrics);

      // Get detailed analytics
      const clickTrends = await this.getDealClickTrends(dealId, startDate, endDate);
      const conversionFunnel = await this.getDealConversionFunnel(dealId, startDate, endDate);
      const hourlyDistribution = await this.getDealHourlyDistribution(dealId, startDate, endDate);
      const sourceAnalysis = await this.getDealSourceAnalysis(dealId, startDate, endDate);

      return {
        deal: {
          id: deal._id,
          title: deal.title,
          brand: deal.brand,
          category: deal.category?.name || 'Uncategorized',
          status: deal.status,
          createdAt: deal.createdAt
        },
        period: {
          current: { startDate, endDate },
          previous: { startDate: previousStartDate, endDate: previousEndDate }
        },
        metrics: {
          current: currentMetrics,
          previous: previousMetrics,
          changes
        },
        analytics: {
          clickTrends,
          conversionFunnel,
          hourlyDistribution,
          sourceAnalysis
        }
      };
    } catch (error) {
      console.error('Error getting deal performance metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate core metrics for a deal in a given period
   */
  static async calculateDealMetrics(dealId, startDate, endDate) {
    try {
      // Aggregation pipeline for comprehensive metrics
      const [clickMetrics] = await ClickTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userFingerprint' },
            mobileClicks: {
              $sum: { $cond: [{ $eq: ['$deviceType', 'mobile'] }, 1, 0] }
            },
            desktopClicks: {
              $sum: { $cond: [{ $eq: ['$deviceType', 'desktop'] }, 1, 0] }
            },
            organicClicks: {
              $sum: { $cond: [{ $eq: ['$source', 'organic'] }, 1, 0] }
            },
            socialClicks: {
              $sum: { $cond: [{ $eq: ['$source', 'social'] }, 1, 0] }
            },
            directClicks: {
              $sum: { $cond: [{ $eq: ['$source', 'direct'] }, 1, 0] }
            }
          }
        },
        {
          $project: {
            totalClicks: 1,
            uniqueUsers: { $size: '$uniqueUsers' },
            mobileClicks: 1,
            desktopClicks: 1,
            organicClicks: 1,
            socialClicks: 1,
            directClicks: 1,
            mobilePercentage: {
              $cond: [
                { $gt: ['$totalClicks', 0] },
                { $multiply: [{ $divide: ['$mobileClicks', '$totalClicks'] }, 100] },
                0
              ]
            }
          }
        }
      ]);

      // Revenue metrics
      const [revenueMetrics] = await RevenueTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$revenue' },
            totalCommission: { $sum: '$commission' },
            conversions: { $sum: '$conversions' },
            avgOrderValue: { $avg: '$averageOrderValue' }
          }
        }
      ]);

      const metrics = {
        clicks: {
          total: clickMetrics?.totalClicks || 0,
          unique: clickMetrics?.uniqueUsers || 0,
          mobile: clickMetrics?.mobileClicks || 0,
          desktop: clickMetrics?.desktopClicks || 0,
          mobilePercentage: clickMetrics?.mobilePercentage || 0
        },
        traffic: {
          organic: clickMetrics?.organicClicks || 0,
          social: clickMetrics?.socialClicks || 0,
          direct: clickMetrics?.directClicks || 0
        },
        revenue: {
          total: revenueMetrics?.totalRevenue || 0,
          commission: revenueMetrics?.totalCommission || 0,
          conversions: revenueMetrics?.conversions || 0,
          avgOrderValue: revenueMetrics?.avgOrderValue || 0
        }
      };

      // Calculate derived metrics
      metrics.performance = {
        ctr: metrics.clicks.total > 0 ? 
          ((metrics.revenue.conversions / metrics.clicks.total) * 100).toFixed(2) : 0,
        conversionRate: metrics.clicks.total > 0 ? 
          ((metrics.revenue.conversions / metrics.clicks.total) * 100).toFixed(2) : 0,
        revenuePerClick: metrics.clicks.total > 0 ? 
          (metrics.revenue.total / metrics.clicks.total).toFixed(2) : 0,
        commissionPerClick: metrics.clicks.total > 0 ? 
          (metrics.revenue.commission / metrics.clicks.total).toFixed(2) : 0
      };

      return metrics;
    } catch (error) {
      console.error('Error calculating deal metrics:', error);
      throw error;
    }
  }

  /**
   * Get click trends over time for a deal
   */
  static async getDealClickTrends(dealId, startDate, endDate) {
    try {
      const trends = await ClickTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }
            },
            clicks: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userFingerprint' }
          }
        },
        {
          $project: {
            date: '$_id.date',
            clicks: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { date: 1 } }
      ]);

      return trends.map(trend => ({
        date: trend.date,
        clicks: trend.clicks,
        uniqueUsers: trend.uniqueUsers
      }));
    } catch (error) {
      console.error('Error getting deal click trends:', error);
      return [];
    }
  }

  /**
   * Get conversion funnel analysis for a deal
   */
  static async getDealConversionFunnel(dealId, startDate, endDate) {
    try {
      const [clicks] = await ClickTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            totalClicks: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userFingerprint' }
          }
        },
        {
          $project: {
            totalClicks: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        }
      ]);

      const [revenue] = await RevenueTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            conversions: { $sum: '$conversions' }
          }
        }
      ]);

      const totalClicks = clicks?.totalClicks || 0;
      const uniqueUsers = clicks?.uniqueUsers || 0;
      const conversions = revenue?.conversions || 0;

      return {
        stages: [
          {
            stage: 'Impressions',
            count: totalClicks,
            percentage: 100,
            dropoff: 0
          },
          {
            stage: 'Clicks',
            count: totalClicks,
            percentage: 100,
            dropoff: 0
          },
          {
            stage: 'Unique Visitors',
            count: uniqueUsers,
            percentage: totalClicks > 0 ? ((uniqueUsers / totalClicks) * 100).toFixed(1) : 0,
            dropoff: totalClicks > 0 ? (((totalClicks - uniqueUsers) / totalClicks) * 100).toFixed(1) : 0
          },
          {
            stage: 'Conversions',
            count: conversions,
            percentage: totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(1) : 0,
            dropoff: totalClicks > 0 ? (((totalClicks - conversions) / totalClicks) * 100).toFixed(1) : 0
          }
        ]
      };
    } catch (error) {
      console.error('Error getting deal conversion funnel:', error);
      return { stages: [] };
    }
  }

  /**
   * Get hourly click distribution for a deal
   */
  static async getDealHourlyDistribution(dealId, startDate, endDate) {
    try {
      const hourlyData = await ClickTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: { hour: { $hour: '$timestamp' } },
            clicks: { $sum: 1 }
          }
        },
        { $sort: { '_id.hour': 1 } }
      ]);

      // Create array for all 24 hours
      const distribution = Array.from({ length: 24 }, (_, index) => ({
        hour: index,
        clicks: 0
      }));

      // Fill in actual data
      hourlyData.forEach(data => {
        distribution[data._id.hour].clicks = data.clicks;
      });

      return distribution;
    } catch (error) {
      console.error('Error getting deal hourly distribution:', error);
      return [];
    }
  }

  /**
   * Get traffic source analysis for a deal
   */
  static async getDealSourceAnalysis(dealId, startDate, endDate) {
    try {
      const sourceData = await ClickTracking.aggregate([
        {
          $match: {
            dealId: dealId,
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              source: '$source',
              deviceType: '$deviceType'
            },
            clicks: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userFingerprint' }
          }
        },
        {
          $group: {
            _id: '$_id.source',
            totalClicks: { $sum: '$clicks' },
            totalUniqueUsers: { $sum: { $size: '$uniqueUsers' } },
            devices: {
              $push: {
                type: '$_id.deviceType',
                clicks: '$clicks'
              }
            }
          }
        },
        { $sort: { totalClicks: -1 } }
      ]);

      return sourceData.map(source => ({
        source: source._id || 'unknown',
        clicks: source.totalClicks,
        uniqueUsers: source.totalUniqueUsers,
        devices: source.devices
      }));
    } catch (error) {
      console.error('Error getting deal source analysis:', error);
      return [];
    }
  }

  /**
   * Get top performing deals with performance metrics
   */
  static async getTopPerformingDeals(limit = 10, period = 'month') {
    try {
      const { startDate, endDate } = this.getDateRanges(period);

      const topDeals = await Deal.aggregate([
        {
          $lookup: {
            from: 'clicktrackings',
            let: { dealId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$dealId', '$$dealId'] },
                  timestamp: { $gte: startDate, $lte: endDate }
                }
              }
            ],
            as: 'clicks'
          }
        },
        {
          $lookup: {
            from: 'revenuetrackings',
            let: { dealId: { $toString: '$_id' } },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$dealId', '$$dealId'] },
                  date: { $gte: startDate, $lte: endDate }
                }
              }
            ],
            as: 'revenue'
          }
        },
        {
          $addFields: {
            totalClicks: { $size: '$clicks' },
            totalRevenue: { $sum: '$revenue.revenue' },
            totalConversions: { $sum: '$revenue.conversions' }
          }
        },
        {
          $match: {
            totalClicks: { $gt: 0 }
          }
        },
        {
          $addFields: {
            conversionRate: {
              $cond: [
                { $gt: ['$totalClicks', 0] },
                { $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] },
                0
              ]
            },
            revenuePerClick: {
              $cond: [
                { $gt: ['$totalClicks', 0] },
                { $divide: ['$totalRevenue', '$totalClicks'] },
                0
              ]
            }
          }
        },
        {
          $sort: { totalRevenue: -1 }
        },
        {
          $limit: limit
        },
        {
          $project: {
            title: 1,
            brand: 1,
            category: 1,
            totalClicks: 1,
            totalRevenue: 1,
            totalConversions: 1,
            conversionRate: { $round: ['$conversionRate', 2] },
            revenuePerClick: { $round: ['$revenuePerClick', 2] }
          }
        }
      ]);

      return topDeals;
    } catch (error) {
      console.error('Error getting top performing deals:', error);
      return [];
    }
  }

  /**
   * Get performance recommendations for a deal
   */
  static async getDealRecommendations(dealId) {
    try {
      const deal = await Deal.findById(dealId).lean();
      if (!deal) {
        throw new Error('Deal not found');
      }

      const metrics = await this.getDealPerformanceMetrics(dealId, 'month');
      const recommendations = [];

      // Low CTR recommendation
      if (parseFloat(metrics.metrics.current.performance.ctr) < 2) {
        recommendations.push({
          type: 'ctr_improvement',
          priority: 'high',
          title: 'Improve Click-Through Rate',
          description: 'Your CTR is below 2%. Consider updating the deal title, description, or featured image.',
          actions: [
            'Update deal title to be more compelling',
            'Add urgency or scarcity indicators',
            'Improve deal description',
            'Update featured image'
          ]
        });
      }

      // Low conversion rate recommendation
      if (parseFloat(metrics.metrics.current.performance.conversionRate) < 1) {
        recommendations.push({
          type: 'conversion_improvement',
          priority: 'high',
          title: 'Boost Conversion Rate',
          description: 'Your conversion rate is below 1%. The affiliate link or landing page may need optimization.',
          actions: [
            'Test affiliate link functionality',
            'Review landing page quality',
            'Check deal accuracy and availability',
            'Consider updating commission structure'
          ]
        });
      }

      // Mobile optimization recommendation
      if (metrics.metrics.current.clicks.mobilePercentage > 60 && 
          parseFloat(metrics.metrics.current.performance.conversionRate) < 2) {
        recommendations.push({
          type: 'mobile_optimization',
          priority: 'medium',
          title: 'Optimize for Mobile',
          description: 'Most of your traffic is mobile. Ensure the deal page and affiliate link work well on mobile devices.',
          actions: [
            'Test mobile user experience',
            'Optimize images for mobile loading',
            'Ensure affiliate link is mobile-friendly',
            'Consider mobile-specific call-to-actions'
          ]
        });
      }

      // Traffic source diversification
      const organicPercentage = (metrics.metrics.current.traffic.organic / 
        metrics.metrics.current.clicks.total) * 100;
      if (organicPercentage < 30) {
        recommendations.push({
          type: 'traffic_diversification',
          priority: 'medium',
          title: 'Diversify Traffic Sources',
          description: 'Your organic traffic is low. Focus on SEO and content marketing.',
          actions: [
            'Optimize deal page for SEO',
            'Create content around the deal',
            'Share on social media platforms',
            'Consider email marketing'
          ]
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting deal recommendations:', error);
      return [];
    }
  }

  /**
   * Calculate percentage changes between periods
   */
  static calculateChanges(current, previous) {
    const calculateChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      clicks: {
        total: calculateChange(current.clicks.total, previous.clicks.total),
        unique: calculateChange(current.clicks.unique, previous.clicks.unique)
      },
      revenue: {
        total: calculateChange(current.revenue.total, previous.revenue.total),
        conversions: calculateChange(current.revenue.conversions, previous.revenue.conversions)
      },
      performance: {
        ctr: calculateChange(
          parseFloat(current.performance.ctr), 
          parseFloat(previous.performance.ctr)
        ),
        conversionRate: calculateChange(
          parseFloat(current.performance.conversionRate), 
          parseFloat(previous.performance.conversionRate)
        )
      }
    };
  }

  /**
   * Get date ranges for different periods
   */
  static getDateRanges(period) {
    const now = new Date();
    let startDate, endDate, previousStartDate, previousEndDate;

    switch (period) {
      case 'week':
        endDate = new Date(now);
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        endDate = new Date(now);
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        endDate = new Date(now);
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(startDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        endDate = new Date(now);
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousEndDate = new Date(startDate);
        previousStartDate = new Date(startDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return { startDate, endDate, previousStartDate, previousEndDate };
  }
}

module.exports = DealPerformanceTracker;
