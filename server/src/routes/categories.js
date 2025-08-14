const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Deal = require('../models/Deal');

// @route   GET /api/categories
// @desc    Get all active categories with deal counts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .select('-__v');

    // Get deal counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const dealCount = await Deal.countDocuments({ 
          category: category._id, 
          status: 'active' 
        });
        
        return {
          ...category.toObject(),
          dealCount
        };
      })
    );

    res.json({
      success: true,
      count: categoriesWithCounts.length,
      data: categoriesWithCounts
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
