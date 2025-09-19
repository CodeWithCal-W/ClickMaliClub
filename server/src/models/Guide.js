const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200
  },
  category: {
    type: String,
    required: true,
    enum: ['Forex Trading', 'Crypto Exchange', 'Betting Sites', 'SaaS Tools', 'Web Hosting', 'Online Education', 'Prop Firms', 'Business Resources & Outsourcing']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  readTime: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    default: 'ClickMaliClub Team'
  },
  content: {
    topics: [{
      type: String,
      required: true
    }],
    introduction: String,
    sections: [{
      title: {
        type: String,
        required: true
      },
      content: {
        type: String,
        required: true
      }
    }],
    conclusion: String
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for efficient querying
guideSchema.index({ category: 1, status: 1 });
guideSchema.index({ slug: 1 });
guideSchema.index({ featured: -1, createdAt: -1 });

// Pre-save middleware to generate slug
guideSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

module.exports = mongoose.model('Guide', guideSchema);
