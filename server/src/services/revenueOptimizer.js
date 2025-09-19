const Deal = require('../models/Deal');
const ClickTracking = require('../models/ClickTracking');
const RevenueTracking = require('../models/RevenueTracking');
const Category = require('../models/Category');

class RevenueOptimizer {
  constructor() {
    this.conversionRate = 0.03; // 3% default conversion rate
    this.averageCommission = 50; // $50 average commission
  }

  // Analyze deal performance and suggest optimizations
  async analyzeDealPerformance(timeframe = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeframe);

      // Get deal performance data
      const dealStats = await ClickTracking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$dealId',
            totalClicks: { $sum: 1 },
            uniqueClicks: { $addToSet: '$userId' },
            avgTimeOnPage: { $avg: '$timeOnPage' },
            bounceRate: {
              $avg: {
                $cond: [{ $lt: ['$timeOnPage', 10] }, 1, 0]
              }
            }
          }
        },
        {
          $addFields: {
            uniqueClickCount: { $size: '$uniqueClicks' },
            clickThroughRate: {
              $multiply: [
                { $divide: ['$totalClicks', '$uniqueClickCount'] },
                100
              ]
            }
          }
        },
        { $sort: { totalClicks: -1 } }
      ]);

      // Get revenue data
      const revenueStats = await RevenueTracking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$dealId',
            totalRevenue: { $sum: '$amount' },
            conversionCount: { $sum: 1 },
            avgCommission: { $avg: '$amount' }
          }
        }
      ]);

      // Combine data and calculate performance metrics
      const performanceAnalysis = await this.combinePerformanceData(dealStats, revenueStats);
      
      return {
        success: true,
        timeframe,
        dealCount: performanceAnalysis.length,
        totalRevenue: performanceAnalysis.reduce((sum, deal) => sum + (deal.totalRevenue || 0), 0),
        totalClicks: performanceAnalysis.reduce((sum, deal) => sum + (deal.totalClicks || 0), 0),
        averageConversionRate: this.calculateAverageConversionRate(performanceAnalysis),
        topPerformers: performanceAnalysis.slice(0, 10),
        underperformers: performanceAnalysis.filter(deal => deal.performanceScore < 50),
        optimizationSuggestions: this.generateOptimizationSuggestions(performanceAnalysis)
      };
    } catch (error) {
      console.error('Error analyzing deal performance:', error);
      throw error;
    }
  }

  // Combine click and revenue data
  async combinePerformanceData(dealStats, revenueStats) {
    const revenueMap = new Map(revenueStats.map(r => [r._id?.toString(), r]));
    
    const combinedData = await Promise.all(
      dealStats.map(async (dealStat) => {
        const dealId = dealStat._id?.toString();
        const revenue = revenueMap.get(dealId) || { totalRevenue: 0, conversionCount: 0, avgCommission: 0 };
        
        // Get deal details
        const deal = await Deal.findById(dealId).populate('category', 'name');
        
        if (!deal) return null;

        const conversionRate = dealStat.totalClicks > 0 ? 
          (revenue.conversionCount / dealStat.totalClicks) * 100 : 0;
        
        const revenuePerClick = dealStat.totalClicks > 0 ? 
          revenue.totalRevenue / dealStat.totalClicks : 0;

        // Calculate performance score (0-100)
        const performanceScore = this.calculatePerformanceScore({
          conversionRate,
          revenuePerClick,
          bounceRate: dealStat.bounceRate || 0,
          avgTimeOnPage: dealStat.avgTimeOnPage || 0
        });

        return {
          dealId: dealId,
          dealTitle: deal.title,
          category: deal.category?.name || 'Uncategorized',
          totalClicks: dealStat.totalClicks,
          uniqueClicks: dealStat.uniqueClickCount,
          totalRevenue: revenue.totalRevenue,
          conversionCount: revenue.conversionCount,
          conversionRate,
          revenuePerClick,
          avgCommission: revenue.avgCommission,
          bounceRate: dealStat.bounceRate,
          avgTimeOnPage: dealStat.avgTimeOnPage,
          performanceScore,
          trend: await this.calculateTrend(dealId),
          potentialRevenue: this.estimatePotentialRevenue(dealStat.totalClicks, conversionRate)
        };
      })
    );

    return combinedData.filter(Boolean).sort((a, b) => b.performanceScore - a.performanceScore);
  }

  // Calculate performance score (0-100)
  calculatePerformanceScore({ conversionRate, revenuePerClick, bounceRate, avgTimeOnPage }) {
    let score = 0;
    
    // Conversion rate (40% weight)
    score += Math.min(conversionRate * 10, 40); // Max 40 points
    
    // Revenue per click (30% weight)
    score += Math.min(revenuePerClick * 2, 30); // Max 30 points
    
    // Bounce rate (15% weight) - lower is better
    score += Math.max(15 - (bounceRate * 15), 0); // Max 15 points
    
    // Time on page (15% weight)
    score += Math.min(avgTimeOnPage / 10, 15); // Max 15 points
    
    return Math.round(score);
  }

  // Calculate trend for a deal
  async calculateTrend(dealId, days = 7) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const midDate = new Date();
      midDate.setDate(midDate.getDate() - Math.floor(days / 2));

      const [firstHalf, secondHalf] = await Promise.all([
        ClickTracking.countDocuments({
          dealId,
          createdAt: { $gte: startDate, $lt: midDate }
        }),
        ClickTracking.countDocuments({
          dealId,
          createdAt: { $gte: midDate, $lte: endDate }
        })
      ]);

      if (firstHalf === 0 && secondHalf === 0) return 'stable';
      if (firstHalf === 0) return 'rising';
      
      const trendPercentage = ((secondHalf - firstHalf) / firstHalf) * 100;
      
      if (trendPercentage > 20) return 'rising';
      if (trendPercentage < -20) return 'falling';
      return 'stable';
    } catch (error) {
      console.error('Error calculating trend:', error);
      return 'stable';
    }
  }

  // Estimate potential revenue with optimization
  estimatePotentialRevenue(clicks, currentConversionRate) {
    const optimizedConversionRate = Math.min(currentConversionRate * 1.5, 10); // Cap at 10%
    const potentialConversions = (clicks * optimizedConversionRate) / 100;
    return potentialConversions * this.averageCommission;
  }

  // Generate optimization suggestions
  generateOptimizationSuggestions(performanceData) {
    const suggestions = [];
    
    // Find underperforming deals
    const underperformers = performanceData.filter(deal => deal.performanceScore < 50);
    
    if (underperformers.length > 0) {
      suggestions.push({
        type: 'underperforming_deals',
        priority: 'high',
        title: 'Optimize Underperforming Deals',
        description: `${underperformers.length} deals have performance scores below 50. Consider updating titles, descriptions, or images.`,
        deals: underperformers.slice(0, 5).map(d => ({
          id: d.dealId,
          title: d.dealTitle,
          score: d.performanceScore
        })),
        expectedImpact: 'Medium',
        estimatedRevenueIncrease: underperformers.reduce((sum, deal) => sum + deal.potentialRevenue, 0)
      });
    }

    // High bounce rate deals
    const highBounceDeals = performanceData.filter(deal => deal.bounceRate > 0.7);
    
    if (highBounceDeals.length > 0) {
      suggestions.push({
        type: 'high_bounce_rate',
        priority: 'medium',
        title: 'Reduce Bounce Rate',
        description: `${highBounceDeals.length} deals have bounce rates above 70%. Improve landing page quality and relevance.`,
        deals: highBounceDeals.slice(0, 3),
        expectedImpact: 'High',
        estimatedRevenueIncrease: highBounceDeals.reduce((sum, deal) => sum + (deal.totalClicks * 0.1 * this.averageCommission), 0)
      });
    }

    // Category-based suggestions
    const categoryPerformance = this.analyzeCategoryPerformance(performanceData);
    if (categoryPerformance.suggestions.length > 0) {
      suggestions.push(...categoryPerformance.suggestions);
    }

    // Seasonal optimization
    const seasonalSuggestions = this.getSeasonalOptimizations();
    suggestions.push(...seasonalSuggestions);

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // Analyze category performance
  analyzeCategoryPerformance(performanceData) {
    const categoryStats = {};
    
    performanceData.forEach(deal => {
      if (!categoryStats[deal.category]) {
        categoryStats[deal.category] = {
          deals: 0,
          totalRevenue: 0,
          totalClicks: 0,
          avgPerformanceScore: 0
        };
      }
      
      const cat = categoryStats[deal.category];
      cat.deals++;
      cat.totalRevenue += deal.totalRevenue;
      cat.totalClicks += deal.totalClicks;
      cat.avgPerformanceScore += deal.performanceScore;
    });

    // Calculate averages
    Object.values(categoryStats).forEach(cat => {
      cat.avgPerformanceScore = cat.avgPerformanceScore / cat.deals;
      cat.revenuePerClick = cat.totalClicks > 0 ? cat.totalRevenue / cat.totalClicks : 0;
    });

    const suggestions = [];
    
    // Find underperforming categories
    Object.entries(categoryStats).forEach(([category, stats]) => {
      if (stats.avgPerformanceScore < 40 && stats.deals > 2) {
        suggestions.push({
          type: 'category_optimization',
          priority: 'medium',
          title: `Optimize ${category} Category`,
          description: `${category} category has an average performance score of ${stats.avgPerformanceScore.toFixed(1)}. Consider reviewing deal quality and targeting.`,
          category,
          currentPerformance: stats.avgPerformanceScore,
          dealCount: stats.deals,
          expectedImpact: 'Medium'
        });
      }
    });

    return { categoryStats, suggestions };
  }

  // Get seasonal optimization suggestions
  getSeasonalOptimizations() {
    const now = new Date();
    const month = now.getMonth();
    const suggestions = [];

    // Holiday seasons
    if (month === 10 || month === 11) { // November/December
      suggestions.push({
        type: 'seasonal',
        priority: 'high',
        title: 'Holiday Season Optimization',
        description: 'Black Friday and holiday season approaching. Promote high-discount deals and gift-related offers.',
        expectedImpact: 'High',
        actionItems: [
          'Feature deals with highest discounts',
          'Create holiday-themed landing pages',
          'Increase social media promotion',
          'Add urgency messaging'
        ]
      });
    }

    // New Year
    if (month === 0) { // January
      suggestions.push({
        type: 'seasonal',
        priority: 'medium',
        title: 'New Year Resolution Deals',
        description: 'Promote fitness, education, and self-improvement related deals.',
        expectedImpact: 'Medium',
        actionItems: [
          'Highlight health and fitness deals',
          'Promote educational courses',
          'Feature productivity tools'
        ]
      });
    }

    return suggestions;
  }

  // Calculate average conversion rate
  calculateAverageConversionRate(performanceData) {
    if (performanceData.length === 0) return 0;
    
    const totalConversions = performanceData.reduce((sum, deal) => sum + deal.conversionCount, 0);
    const totalClicks = performanceData.reduce((sum, deal) => sum + deal.totalClicks, 0);
    
    return totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  }

  // Get revenue forecasting
  async getRevenueForecast(months = 3) {
    try {
      const historical = await RevenueTracking.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // Last 90 days
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            totalRevenue: { $sum: '$amount' },
            transactionCount: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      if (historical.length < 2) {
        return {
          forecast: [],
          confidence: 'low',
          message: 'Insufficient historical data for accurate forecasting'
        };
      }

      // Simple linear regression for forecasting
      const monthlyGrowthRate = this.calculateGrowthRate(historical);
      const lastMonthRevenue = historical[historical.length - 1].totalRevenue;
      
      const forecast = [];
      for (let i = 1; i <= months; i++) {
        const projectedRevenue = lastMonthRevenue * Math.pow(1 + monthlyGrowthRate, i);
        forecast.push({
          month: i,
          projectedRevenue: Math.round(projectedRevenue),
          confidence: i <= 2 ? 'high' : 'medium'
        });
      }

      return {
        forecast,
        monthlyGrowthRate: monthlyGrowthRate * 100,
        confidence: 'medium',
        historicalData: historical
      };
    } catch (error) {
      console.error('Error generating revenue forecast:', error);
      throw error;
    }
  }

  // Calculate growth rate from historical data
  calculateGrowthRate(historical) {
    if (historical.length < 2) return 0;
    
    const growthRates = [];
    for (let i = 1; i < historical.length; i++) {
      const current = historical[i].totalRevenue;
      const previous = historical[i - 1].totalRevenue;
      
      if (previous > 0) {
        growthRates.push((current - previous) / previous);
      }
    }

    return growthRates.length > 0 ? 
      growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length : 0;
  }

  // A/B testing suggestions
  async getABTestingSuggestions() {
    const suggestions = [
      {
        element: 'deal_titles',
        test: 'Benefit-focused vs Feature-focused titles',
        expectedImpact: 15,
        description: 'Test whether emphasizing benefits or features in deal titles performs better'
      },
      {
        element: 'call_to_action',
        test: 'Urgency-based vs Value-based CTAs',
        expectedImpact: 12,
        description: 'Compare "Limited Time!" vs "Save $XXX" in call-to-action buttons'
      },
      {
        element: 'deal_images',
        test: 'Product shots vs Lifestyle images',
        expectedImpact: 20,
        description: 'Test product-focused images vs lifestyle/context images'
      },
      {
        element: 'page_layout',
        test: 'Grid vs List view',
        expectedImpact: 8,
        description: 'Compare grid layout vs list layout for deal listings'
      },
      {
        element: 'pricing_display',
        test: 'Discount percentage vs Dollar amount',
        expectedImpact: 18,
        description: 'Test showing "50% off" vs "$25 savings"'
      }
    ];

    return suggestions.sort((a, b) => b.expectedImpact - a.expectedImpact);
  }
}

module.exports = RevenueOptimizer;
