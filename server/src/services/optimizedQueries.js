const Deal = require('../models/Deal');
const Category = require('../models/Category');
const BlogPost = require('../models/BlogPost');

/**
 * Optimized database queries with proper indexing and aggregation
 */

// Optimized deal queries with lean() and proper projections
const getOptimizedDeals = async (options = {}) => {
  const {
    category,
    status = 'active',
    limit = 10,
    page = 1,
    featured = false,
    fields = null
  } = options;

  const skip = (page - 1) * limit;
  let query = { status };

  // Add category filter if provided
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category, isActive: true }).lean();
    if (categoryDoc) {
      query.category = categoryDoc._id;
    } else {
      return { deals: [], total: 0, pages: 0 };
    }
  }

  // Add featured filter
  if (featured) {
    query.isFeatured = true;
  }

  // Get total count efficiently
  const total = await Deal.countDocuments(query);
  
  // Build projection for better performance
  const projection = fields ? fields.join(' ') : '-__v';

  // Execute optimized query
  const deals = await Deal.find(query)
    .populate('category', 'name slug color') // Only populate needed fields
    .select(projection)
    .sort({ isFeatured: -1, priority: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean(); // Use lean() for better performance

  return {
    deals,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  };
};

// Optimized category queries with deal counts
const getOptimizedCategories = async () => {
  // Use aggregation pipeline for better performance
  const categories = await Category.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: 'deals',
        localField: '_id',
        foreignField: 'category',
        as: 'deals',
        pipeline: [
          { $match: { status: 'active' } },
          { $project: { _id: 1 } } // Only project _id for counting
        ]
      }
    },
    {
      $addFields: {
        dealCount: { $size: '$deals' }
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        description: 1,
        icon: 1,
        color: 1,
        sortOrder: 1,
        dealCount: 1
      }
    },
    { $sort: { sortOrder: 1, name: 1 } }
  ]);

  return categories;
};

// Optimized blog post queries
const getOptimizedBlogPosts = async (options = {}) => {
  const {
    category,
    status = 'published',
    limit = 10,
    page = 1,
    featured = false
  } = options;

  const skip = (page - 1) * limit;
  let query = { status };

  if (category) {
    const categoryDoc = await Category.findOne({ slug: category, isActive: true }).lean();
    if (categoryDoc) {
      query.category = categoryDoc._id;
    }
  }

  if (featured) {
    query.isSticky = true;
  }

  const [posts, total] = await Promise.all([
    BlogPost.find(query)
      .populate('category', 'name slug color')
      .populate('author', 'username email')
      .select('-content -__v') // Exclude heavy content field for listings
      .sort({ isSticky: -1, publishedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
    
    BlogPost.countDocuments(query)
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  };
};

// Optimized search across multiple collections
const searchOptimized = async (searchTerm, options = {}) => {
  const { limit = 20 } = options;
  
  // Create text search query
  const searchQuery = {
    $text: { $search: searchTerm },
    status: 'active'
  };

  // Parallel searches with projections
  const [deals, blogPosts] = await Promise.all([
    Deal.find(searchQuery)
      .populate('category', 'name slug color')
      .select('title slug description shortDescription brand offer tags')
      .sort({ score: { $meta: 'textScore' } })
      .limit(Math.floor(limit / 2))
      .lean(),
    
    BlogPost.find({
      $text: { $search: searchTerm },
      status: 'published'
    })
      .populate('category', 'name slug color')
      .select('title slug excerpt tags publishedAt')
      .sort({ score: { $meta: 'textScore' } })
      .limit(Math.floor(limit / 2))
      .lean()
  ]);

  return {
    deals,
    blogPosts,
    total: deals.length + blogPosts.length
  };
};

// Batch analytics update for better performance
const batchUpdateAnalytics = async (updates) => {
  const dealUpdates = updates.filter(update => update.type === 'deal');
  
  if (dealUpdates.length === 0) return;

  // Group updates by dealId for efficiency
  const groupedUpdates = dealUpdates.reduce((acc, update) => {
    if (!acc[update.dealId]) {
      acc[update.dealId] = { views: 0, clicks: 0 };
    }
    acc[update.dealId][update.action] += 1;
    return acc;
  }, {});

  // Execute batch updates
  const bulkOps = Object.entries(groupedUpdates).map(([dealId, increments]) => ({
    updateOne: {
      filter: { _id: dealId },
      update: {
        $inc: {
          'analytics.views': increments.views || 0,
          'analytics.clicks': increments.clicks || 0
        }
      }
    }
  }));

  if (bulkOps.length > 0) {
    await Deal.bulkWrite(bulkOps);
    console.log(`📊 Batch updated analytics for ${bulkOps.length} deals`);
  }
};

// Get dashboard stats with optimized queries
const getDashboardStats = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Use parallel aggregations for better performance
  const [
    dealStats,
    categoryStats,
    blogStats,
    recentActivity
  ] = await Promise.all([
    Deal.aggregate([
      {
        $facet: {
          total: [{ $match: { status: 'active' } }, { $count: 'count' }],
          featured: [{ $match: { status: 'active', isFeatured: true } }, { $count: 'count' }],
          totalViews: [
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$analytics.views' } } }
          ],
          totalClicks: [
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$analytics.clicks' } } }
          ]
        }
      }
    ]),
    
    Category.countDocuments({ isActive: true }),
    
    BlogPost.aggregate([
      {
        $facet: {
          total: [{ $match: { status: 'published' } }, { $count: 'count' }],
          thisMonth: [
            { $match: { status: 'published', publishedAt: { $gte: startOfMonth } } },
            { $count: 'count' }
          ]
        }
      }
    ]),
    
    Deal.find({ status: 'active' })
      .populate('category', 'name slug color')
      .select('title slug createdAt analytics')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
  ]);

  return {
    deals: {
      total: dealStats[0].total[0]?.count || 0,
      featured: dealStats[0].featured[0]?.count || 0,
      totalViews: dealStats[0].totalViews[0]?.total || 0,
      totalClicks: dealStats[0].totalClicks[0]?.total || 0
    },
    categories: categoryStats,
    blog: {
      total: blogStats[0].total[0]?.count || 0,
      thisMonth: blogStats[0].thisMonth[0]?.count || 0
    },
    recentActivity
  };
};

module.exports = {
  getOptimizedDeals,
  getOptimizedCategories,
  getOptimizedBlogPosts,
  searchOptimized,
  batchUpdateAnalytics,
  getDashboardStats
};
