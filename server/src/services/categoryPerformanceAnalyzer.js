const Category = require('../models/Category');
const Deal = require('../models/Deal');
const ClickTracking = require('../models/ClickTracking');
const RevenueTracking = require('../models/RevenueTracking');

class CategoryPerformanceAnalyzer {
  /**
   * Get comprehensive performance metrics for all categories
   */
  static async getCategoryPerformanceOverview(period = 'month') {
    try {
      const { startDate, endDate, previousStartDate, previousEndDate } = this.getDateRanges(period);

      // Get all categories with performance data
      const categories = await Category.aggregate([
        {
          $lookup: {
            from: 'deals',
            localField: '_id',
            foreignField: 'category',
            as: 'deals'
          }
        },
        {
          $addFields: {
            dealIds: {
              $map: {
                input: '$deals',
                as: 'deal',
                in: { $toString: '$$deal._id' }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'clicktrackings',
            let: { dealIds: '$dealIds' },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$dealId', '$$dealIds'] },
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
            let: { dealIds: '$dealIds' },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$dealId', '$$dealIds'] },
                  date: { $gte: startDate, $lte: endDate }
                }
              }
            ],
            as: 'revenue'
          }
        },
        {
          $addFields: {
            currentMetrics: {
              totalDeals: { $size: '$deals' },
              activeDeals: {
                $size: {
                  $filter: {
                    input: '$deals',
                    as: 'deal',
                    cond: { $eq: ['$$deal.status', 'active'] }
                  }
                }
              },
              totalClicks: { $size: '$clicks' },
              uniqueUsers: {
                $size: {
                  $setUnion: ['$clicks.userFingerprint', []]
                }
              },
              totalRevenue: { $sum: '$revenue.revenue' },
              totalCommission: { $sum: '$revenue.commission' },
              totalConversions: { $sum: '$revenue.conversions' }
            }
          }
        },
        {
          $addFields: {
            'currentMetrics.conversionRate': {
              $cond: [
                { $gt: ['$currentMetrics.totalClicks', 0] },
                {
                  $multiply: [
                    { $divide: ['$currentMetrics.totalConversions', '$currentMetrics.totalClicks'] },
                    100
                  ]
                },
                0
              ]
            },
            'currentMetrics.revenuePerClick': {
              $cond: [
                { $gt: ['$currentMetrics.totalClicks', 0] },
                { $divide: ['$currentMetrics.totalRevenue', '$currentMetrics.totalClicks'] },
                0
              ]
            },
            'currentMetrics.avgRevenuePerDeal': {
              $cond: [
                { $gt: ['$currentMetrics.totalDeals', 0] },
                { $divide: ['$currentMetrics.totalRevenue', '$currentMetrics.totalDeals'] },
                0
              ]
            }
          }
        },
        {
          $project: {
            name: 1,
            description: 1,
            slug: 1,
            featured: 1,
            currentMetrics: 1
          }
        },
        {
          $sort: { 'currentMetrics.totalRevenue': -1 }
        }
      ]);

      // Get previous period data for comparison
      const categoriesWithComparison = await Promise.all(
        categories.map(async (category) => {
          const previousMetrics = await this.getCategoryPreviousPeriodMetrics(
            category._id,
            previousStartDate,
            previousEndDate
          );

          const changes = this.calculateCategoryChanges(category.currentMetrics, previousMetrics);

          return {
            ...category,
            previousMetrics,
            changes
          };
        })
      );

      return {
        period: { startDate, endDate },
        categories: categoriesWithComparison
      };
    } catch (error) {
      console.error('Error getting category performance overview:', error);
      throw error;
    }
  }

  /**
   * Get detailed performance metrics for a specific category
   */
  static async getCategoryDetailedMetrics(categoryId, period = 'month') {
    try {
      const { startDate, endDate, previousStartDate, previousEndDate } = this.getDateRanges(period);

      // Get category information
      const category = await Category.findById(categoryId).lean();
      if (!category) {
        throw new Error('Category not found');
      }

      // Get deals in this category
      const deals = await Deal.find({ category: categoryId }).lean();
      const dealIds = deals.map(deal => deal._id.toString());

      // Current period metrics
      const currentMetrics = await this.calculateCategoryMetrics(dealIds, startDate, endDate);
      
      // Previous period metrics
      const previousMetrics = await this.calculateCategoryMetrics(dealIds, previousStartDate, previousEndDate);

      // Calculate changes
      const changes = this.calculateCategoryChanges(currentMetrics, previousMetrics);

      // Get detailed analytics
      const topDeals = await this.getCategoryTopDeals(categoryId, startDate, endDate);
      const trafficTrends = await this.getCategoryTrafficTrends(dealIds, startDate, endDate);
      const deviceBreakdown = await this.getCategoryDeviceBreakdown(dealIds, startDate, endDate);
      const hourlyDistribution = await this.getCategoryHourlyDistribution(dealIds, startDate, endDate);
      const conversionFunnel = await this.getCategoryConversionFunnel(dealIds, startDate, endDate);

      return {
        category: {
          id: category._id,
          name: category.name,
          description: category.description,
          slug: category.slug,
          featured: category.featured
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
          topDeals,
          trafficTrends,
          deviceBreakdown,
          hourlyDistribution,
          conversionFunnel
        }
      };
    } catch (error) {
      console.error('Error getting category detailed metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate comprehensive metrics for a category
   */
  static async calculateCategoryMetrics(dealIds, startDate, endDate) {
    try {
      // Click metrics
      const [clickMetrics] = await ClickTracking.aggregate([
        {
          $match: {
            dealId: { $in: dealIds },
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
            directClicks: 1
          }
        }
      ]);

      // Revenue metrics
      const [revenueMetrics] = await RevenueTracking.aggregate([
        {
          $match: {
            dealId: { $in: dealIds },
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

      // Deal metrics
      const totalDeals = dealIds.length;
      const activeDeals = await Deal.countDocuments({
        _id: { $in: dealIds.map(id => id) },
        status: 'active'
      });

      const metrics = {
        deals: {
          total: totalDeals,
          active: activeDeals
        },
        clicks: {
          total: clickMetrics?.totalClicks || 0,
          unique: clickMetrics?.uniqueUsers || 0,
          mobile: clickMetrics?.mobileClicks || 0,
          desktop: clickMetrics?.desktopClicks || 0
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
        conversionRate: metrics.clicks.total > 0 ? 
          ((metrics.revenue.conversions / metrics.clicks.total) * 100).toFixed(2) : 0,
        revenuePerClick: metrics.clicks.total > 0 ? 
          (metrics.revenue.total / metrics.clicks.total).toFixed(2) : 0,
        commissionPerClick: metrics.clicks.total > 0 ? 
          (metrics.revenue.commission / metrics.clicks.total).toFixed(2) : 0,
        avgRevenuePerDeal: totalDeals > 0 ? 
          (metrics.revenue.total / totalDeals).toFixed(2) : 0,
        clicksPerDeal: totalDeals > 0 ? 
          (metrics.clicks.total / totalDeals).toFixed(2) : 0
      };

      return metrics;
    } catch (error) {
      console.error('Error calculating category metrics:', error);
      throw error;
    }
  }

  /**
   * Get previous period metrics for comparison
   */
  static async getCategoryPreviousPeriodMetrics(categoryId, startDate, endDate) {
    try {
      const deals = await Deal.find({ category: categoryId }).lean();
      const dealIds = deals.map(deal => deal._id.toString());
      
      return await this.calculateCategoryMetrics(dealIds, startDate, endDate);
    } catch (error) {
      console.error('Error getting previous period metrics:', error);
      return {
        deals: { total: 0, active: 0 },
        clicks: { total: 0, unique: 0, mobile: 0, desktop: 0 },
        traffic: { organic: 0, social: 0, direct: 0 },
        revenue: { total: 0, commission: 0, conversions: 0, avgOrderValue: 0 },
        performance: { conversionRate: 0, revenuePerClick: 0, commissionPerClick: 0, avgRevenuePerDeal: 0, clicksPerDeal: 0 }
      };
    }
  }

  /**
   * Get top performing deals in a category
   */
  static async getCategoryTopDeals(categoryId, startDate, endDate, limit = 5) {
    try {
      const topDeals = await Deal.aggregate([
        {
          $match: { category: categoryId }
        },
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
          $addFields: {
            conversionRate: {
              $cond: [
                { $gt: ['$totalClicks', 0] },
                { $multiply: [{ $divide: ['$totalConversions', '$totalClicks'] }, 100] },
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
            totalClicks: 1,
            totalRevenue: 1,
            totalConversions: 1,
            conversionRate: { $round: ['$conversionRate', 2] }
          }
        }
      ]);

      return topDeals;
    } catch (error) {
      console.error('Error getting category top deals:', error);
      return [];
    }
  }

  /**
   * Get traffic trends for a category over time
   */
  static async getCategoryTrafficTrends(dealIds, startDate, endDate) {
    try {
      const trends = await ClickTracking.aggregate([
        {
          $match: {
            dealId: { $in: dealIds },
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

      return trends;
    } catch (error) {
      console.error('Error getting category traffic trends:', error);
      return [];
    }
  }

  /**
   * Get device breakdown for a category
   */
  static async getCategoryDeviceBreakdown(dealIds, startDate, endDate) {
    try {
      const breakdown = await ClickTracking.aggregate([
        {
          $match: {
            dealId: { $in: dealIds },
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: '$deviceType',
            clicks: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userFingerprint' }
          }
        },
        {
          $project: {
            deviceType: '$_id',
            clicks: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        },
        { $sort: { clicks: -1 } }
      ]);

      return breakdown;
    } catch (error) {
      console.error('Error getting category device breakdown:', error);
      return [];
    }
  }

  /**
   * Get hourly distribution for a category
   */
  static async getCategoryHourlyDistribution(dealIds, startDate, endDate) {
    try {
      const hourlyData = await ClickTracking.aggregate([
        {
          $match: {
            dealId: { $in: dealIds },
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
      console.error('Error getting category hourly distribution:', error);
      return [];
    }
  }

  /**
   * Get conversion funnel for a category
   */
  static async getCategoryConversionFunnel(dealIds, startDate, endDate) {
    try {
      const [clicks] = await ClickTracking.aggregate([
        {
          $match: {
            dealId: { $in: dealIds },
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
            dealId: { $in: dealIds },
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
            stage: 'Total Clicks',
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
      console.error('Error getting category conversion funnel:', error);
      return { stages: [] };
    }
  }

  /**
   * Get category comparison analysis
   */
  static async getCategoryComparison(categoryIds, period = 'month') {
    try {
      const { startDate, endDate } = this.getDateRanges(period);

      const comparisons = await Promise.all(
        categoryIds.map(async (categoryId) => {
          const category = await Category.findById(categoryId).lean();
          const deals = await Deal.find({ category: categoryId }).lean();
          const dealIds = deals.map(deal => deal._id.toString());
          const metrics = await this.calculateCategoryMetrics(dealIds, startDate, endDate);

          return {
            category: {
              id: category._id,
              name: category.name
            },
            metrics
          };
        })
      );

      // Rank categories by different metrics
      const rankings = {
        byRevenue: [...comparisons].sort((a, b) => b.metrics.revenue.total - a.metrics.revenue.total),
        byClicks: [...comparisons].sort((a, b) => b.metrics.clicks.total - a.metrics.clicks.total),
        byConversionRate: [...comparisons].sort((a, b) => 
          parseFloat(b.metrics.performance.conversionRate) - parseFloat(a.metrics.performance.conversionRate)
        ),
        byRevenuePerClick: [...comparisons].sort((a, b) => 
          parseFloat(b.metrics.performance.revenuePerClick) - parseFloat(a.metrics.performance.revenuePerClick)
        )
      };

      return {
        period: { startDate, endDate },
        comparisons,
        rankings
      };
    } catch (error) {
      console.error('Error performing category comparison:', error);
      throw error;
    }
  }

  /**
   * Calculate percentage changes between periods
   */
  static calculateCategoryChanges(current, previous) {
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
        conversionRate: calculateChange(
          parseFloat(current.performance.conversionRate), 
          parseFloat(previous.performance.conversionRate)
        ),
        revenuePerClick: calculateChange(
          parseFloat(current.performance.revenuePerClick), 
          parseFloat(previous.performance.revenuePerClick)
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

module.exports = CategoryPerformanceAnalyzer;
