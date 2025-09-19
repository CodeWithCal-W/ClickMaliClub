const mongoose = require('mongoose');

const revenueTrackingSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['adsense', 'amazon_affiliate', 'direct_affiliate', 'sponsored_post', 'premium_subscription', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  description: {
    type: String,
    required: true
  },
  merchantName: String,
  clickId: String,
  orderId: String,
  commissionRate: Number,
  orderValue: Number,
  conversionDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'cancelled'],
    default: 'pending'
  },
  metadata: {
    productName: String,
    categoryId: mongoose.Schema.Types.ObjectId,
    dealId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    affiliateNetwork: String,
    campaignId: String
  }
}, {
  timestamps: true
});

// Indexes for performance
revenueTrackingSchema.index({ source: 1, createdAt: -1 });
revenueTrackingSchema.index({ status: 1, conversionDate: -1 });
revenueTrackingSchema.index({ merchantName: 1, createdAt: -1 });

// Virtual for monthly revenue
revenueTrackingSchema.virtual('monthlyRevenue').get(function() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  end.setDate(0);
  end.setHours(23, 59, 59, 999);
  
  return this.model('RevenueTracking').aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: { $in: ['confirmed', 'paid'] }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
});

// Static method to get revenue analytics
revenueTrackingSchema.statics.getAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ['confirmed', 'paid'] }
      }
    },
    {
      $group: {
        _id: {
          source: '$source',
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 },
        avgCommission: { $avg: '$amount' }
      }
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 }
    }
  ]);
};

// Enhanced analytics methods
revenueTrackingSchema.statics.getDashboardStats = async function(period = 'month') {
  const now = new Date();
  let startDate, endDate;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
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

  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $facet: {
        revenue: [
          {
            $match: { status: { $in: ['confirmed', 'paid'] } }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
              count: { $sum: 1 },
              average: { $avg: '$amount' }
            }
          }
        ],
        bySource: [
          {
            $match: { status: { $in: ['confirmed', 'paid'] } }
          },
          {
            $group: {
              _id: '$source',
              revenue: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { revenue: -1 } }
        ],
        trends: [
          {
            $match: { status: { $in: ['confirmed', 'paid'] } }
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: '$createdAt' },
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' }
              },
              revenue: { $sum: '$amount' },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]
      }
    }
  ]);

  return stats[0] || { revenue: [], bySource: [], trends: [] };
};

// Method to get top performing deals
revenueTrackingSchema.statics.getTopDeals = async function(limit = 10, period = 'month') {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return this.aggregate([
    {
      $match: {
        'metadata.dealId': { $exists: true },
        createdAt: { $gte: startDate },
        status: { $in: ['confirmed', 'paid'] }
      }
    },
    {
      $group: {
        _id: '$metadata.dealId',
        totalRevenue: { $sum: '$amount' },
        conversionCount: { $sum: 1 },
        averageValue: { $avg: '$amount' }
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
        totalRevenue: 1,
        conversionCount: 1,
        averageValue: 1
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('RevenueTracking', revenueTrackingSchema);
