const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog post title is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'Blog post content is required']
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  featuredImage: {
    url: String,
    alt: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  affiliateLinks: [{
    dealId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Deal'
    },
    anchorText: String,
    position: String // Where in the content the link appears
  }],
  seoMeta: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  // Enhanced SEO fields
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  seoKeywords: [String],
  seoScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  seoChecks: [{
    type: {
      type: String,
      enum: ['success', 'warning', 'error', 'info']
    },
    message: String
  }],
  priority: {
    type: Number,
    default: 0.7,
    min: 0,
    max: 1
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    readTime: Number // in minutes
  },
  isSticky: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ author: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
