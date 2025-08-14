const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['subscribed', 'unsubscribed', 'bounced'],
    default: 'subscribed'
  },
  preferences: {
    categories: [{
      type: String,
      enum: ['forex', 'crypto', 'betting', 'saas', 'hosting', 'other']
    }],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  source: {
    type: String,
    enum: ['website', 'popup', 'footer', 'blog', 'deal_page', 'manual'],
    default: 'website'
  },
  ipAddress: String,
  userAgent: String,
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: Date,
  confirmationToken: String,
  isConfirmed: {
    type: Boolean,
    default: false
  },
  confirmedAt: Date,
  lastEmailSent: Date,
  emailsSent: {
    type: Number,
    default: 0
  },
  emailsOpened: {
    type: Number,
    default: 0
  },
  emailsClicked: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ status: 1 });
newsletterSubscriberSchema.index({ subscribedAt: -1 });
newsletterSubscriberSchema.index({ isConfirmed: 1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
