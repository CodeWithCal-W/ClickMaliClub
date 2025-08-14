const mongoose = require('mongoose');

const clickTrackingSchema = new mongoose.Schema({
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: String,
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  referrer: String,
  source: {
    type: String,
    enum: ['website', 'email', 'social', 'direct', 'search'],
    default: 'website'
  },
  device: {
    type: String,
    enum: ['desktop', 'mobile', 'tablet'],
    default: 'desktop'
  },
  browser: String,
  os: String,
  country: String,
  city: String,
  isConversion: {
    type: Boolean,
    default: false
  },
  conversionValue: Number,
  commissionEarned: Number,
  clickedAt: {
    type: Date,
    default: Date.now
  },
  convertedAt: Date
}, {
  timestamps: true
});

// Indexes for analytics
clickTrackingSchema.index({ dealId: 1 });
clickTrackingSchema.index({ userId: 1 });
clickTrackingSchema.index({ clickedAt: -1 });
clickTrackingSchema.index({ isConversion: 1 });
clickTrackingSchema.index({ source: 1 });

module.exports = mongoose.model('ClickTracking', clickTrackingSchema);
