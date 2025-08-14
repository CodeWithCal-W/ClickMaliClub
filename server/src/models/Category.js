const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: 500
  },
  icon: {
    type: String, // Icon name or URL
    default: 'FiTag'
  },
  color: {
    type: String,
    default: '#36b37e'
  },
  image: {
    type: String, // Banner image URL
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoMeta: {
    title: String,
    description: String,
    keywords: [String]
  },
  dealCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

module.exports = mongoose.model('Category', categorySchema);
