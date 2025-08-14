const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Forex Trading', 'Crypto Exchange', 'Betting Sites', 'SaaS Tools', 'Web Hosting', 'Other']
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewer: {
    type: String,
    required: true,
    trim: true
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  verified: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  unhelpful: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  votes: [{
    userId: String, // Could be IP address or user ID if you implement user auth
    voteType: {
      type: String,
      enum: ['helpful', 'unhelpful']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient querying
reviewSchema.index({ platform: 1, category: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
