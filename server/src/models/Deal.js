const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deal title is required'],
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Deal description is required'],
    maxlength: 1000
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 250
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  brand: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    logo: String,
    website: String,
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  offer: {
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'bonus', 'cashback', 'free_trial', 'other'],
      required: true
    },
    value: String, // e.g., "50%", "$100", "30 days free"
    originalPrice: Number,
    discountedPrice: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  affiliateLink: {
    type: String,
    required: [true, 'Affiliate link is required'],
    trim: true
  },
  trackingCode: {
    type: String,
    trim: true
  },
  commission: {
    type: Number, // Commission percentage or amount
    min: 0
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  tags: [String],
  features: [{
    name: String,
    description: String,
    isHighlight: {
      type: Boolean,
      default: false
    }
  }],
  availability: {
    startDate: Date,
    endDate: Date,
    isLimited: {
      type: Boolean,
      default: false
    },
    remainingCount: Number
  },
  targetAudience: {
    countries: [String], // ISO country codes
    minAge: Number,
    maxAge: Number,
    interests: [String]
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    ctr: {
      type: Number,
      default: 0
    }, // Click-through rate
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  seoMeta: {
    title: String,
    description: String,
    keywords: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'pending'],
    default: 'active'
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  priority: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
dealSchema.index({ slug: 1 });
dealSchema.index({ category: 1 });
dealSchema.index({ status: 1 });
dealSchema.index({ isFeatured: 1 });
dealSchema.index({ 'availability.endDate': 1 });
dealSchema.index({ priority: -1 });
dealSchema.index({ createdAt: -1 });

// Virtual for click-through rate calculation
dealSchema.virtual('clickThroughRate').get(function() {
  return this.analytics.views > 0 ? (this.analytics.clicks / this.analytics.views * 100).toFixed(2) : 0;
});

module.exports = mongoose.model('Deal', dealSchema);
