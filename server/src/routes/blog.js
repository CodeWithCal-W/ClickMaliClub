const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const Category = require('../models/Category');

// @route   GET /api/blog
// @desc    Get all published blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, category } = req.query;
    
    let query = { status: 'published' };
    
    if (category) {
      query.category = category;
    }

    const posts = await BlogPost.find(query)
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ isSticky: -1, publishedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-content') // Exclude full content for list view
      .select('-__v');

    const total = await BlogPost.countDocuments(query);

    res.json({
      success: true,
      count: posts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blog posts'
    });
  }
});

// @route   GET /api/blog/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      slug: req.params.slug, 
      status: 'published'
    })
    .populate('author', 'name email')
    .select('-__v');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    post.views = (post.views || 0) + 1;
    await post.save();

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching blog post'
    });
  }
});

module.exports = router;
