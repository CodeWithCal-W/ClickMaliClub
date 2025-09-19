const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Deal = require('../models/Deal');
const { getOptimizedCategories } = require('../services/optimizedQueries');

// @route   GET /api/categories
// @desc    Get all active categories with deal counts (optimized)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Use optimized aggregation query
    const categories = await getOptimizedCategories();

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @route   GET /api/categories/:slug
// @desc    Get single category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
});

module.exports = router;
