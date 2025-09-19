const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const Category = require('../models/Category');
const SitemapGenerator = require('../services/sitemapGenerator');

const sitemapGenerator = new SitemapGenerator();

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

// @route   GET /api/blog/recent
// @desc    Get recent blog posts for admin
// @access  Private (Admin)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const posts = await BlogPost.find()
      .populate('author', 'name email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('title slug status createdAt seoScore seoTitle seoDescription featuredImage')
      .select('-__v');

    res.json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent blog posts'
    });
  }
});

// @route   POST /api/blog
// @desc    Create new blog post with SEO features
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      seoTitle,
      seoDescription,
      seoKeywords,
      slug,
      category,
      tags = [],
      author = 'ClickMaliClub Team',
      status = 'draft',
      publishedAt,
      seoScore = 0,
      seoChecks = []
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug: finalSlug });
    if (existingPost) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // Find category if provided
    let categoryId = null;
    if (category) {
      const categoryDoc = await Category.findOne({ 
        $or: [{ name: category }, { slug: category }] 
      });
      if (categoryDoc) {
        categoryId = categoryDoc._id;
      }
    }

    const blogPost = new BlogPost({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featuredImage,
      seoTitle: seoTitle || `${title} | ClickMaliClub`,
      seoDescription: seoDescription || excerpt || content.substring(0, 160),
      seoKeywords: Array.isArray(seoKeywords) ? seoKeywords : 
                   typeof seoKeywords === 'string' ? seoKeywords.split(',').map(k => k.trim()) : [],
      slug: finalSlug,
      category: categoryId,
      tags,
      author,
      status,
      publishedAt: status === 'published' ? (publishedAt || new Date()) : null,
      seoScore,
      seoChecks,
      views: 0
    });

    await blogPost.save();

    // Generate sitemap update if published
    if (status === 'published') {
      try {
        await sitemapGenerator.generateAllSitemaps();
      } catch (sitemapError) {
        console.warn('Failed to update sitemap:', sitemapError);
      }
    }

    const populatedPost = await BlogPost.findById(blogPost._id)
      .populate('category', 'name slug')
      .select('-__v');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: populatedPost
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update blog post with SEO features
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const updates = req.body;

    // Find the existing post
    const existingPost = await BlogPost.findById(postId);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Handle slug updates
    if (updates.slug && updates.slug !== existingPost.slug) {
      const existingSlug = await BlogPost.findOne({ 
        slug: updates.slug, 
        _id: { $ne: postId } 
      });
      if (existingSlug) {
        updates.slug = `${updates.slug}-${Date.now()}`;
      }
    }

    // Handle category
    if (updates.category) {
      const categoryDoc = await Category.findOne({ 
        $or: [{ name: updates.category }, { slug: updates.category }] 
      });
      if (categoryDoc) {
        updates.category = categoryDoc._id;
      } else {
        delete updates.category;
      }
    }

    // Handle publishing
    if (updates.status === 'published' && existingPost.status !== 'published') {
      updates.publishedAt = updates.publishedAt || new Date();
    }

    // Update the post
    const updatedPost = await BlogPost.findByIdAndUpdate(
      postId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    // Generate sitemap update if published
    if (updates.status === 'published') {
      try {
        await sitemapGenerator.generateAllSitemaps();
      } catch (sitemapError) {
        console.warn('Failed to update sitemap:', sitemapError);
      }
    }

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating blog post',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete blog post
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    // Update sitemap
    try {
      await sitemapGenerator.generateAllSitemaps();
    } catch (sitemapError) {
      console.warn('Failed to update sitemap:', sitemapError);
    }

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting blog post'
    });
  }
});

// @route   GET /api/blog/seo/analysis/:id
// @desc    Get SEO analysis for a blog post
// @access  Private (Admin)
router.get('/seo/analysis/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Perform SEO analysis
    const analysis = {
      score: 0,
      checks: [],
      recommendations: []
    };

    // Title analysis
    if (post.title && post.title.length >= 30 && post.title.length <= 60) {
      analysis.score += 15;
      analysis.checks.push({ type: 'success', message: 'Title length is optimal (30-60 characters)' });
    } else {
      analysis.checks.push({ type: 'warning', message: 'Title should be 30-60 characters' });
      analysis.recommendations.push('Optimize title length for better search visibility');
    }

    // Meta description analysis
    if (post.seoDescription && post.seoDescription.length >= 120 && post.seoDescription.length <= 160) {
      analysis.score += 15;
      analysis.checks.push({ type: 'success', message: 'Meta description length is optimal' });
    } else {
      analysis.checks.push({ type: 'warning', message: 'Meta description should be 120-160 characters' });
      analysis.recommendations.push('Write a compelling meta description');
    }

    // Content analysis
    if (post.content && post.content.length >= 300) {
      analysis.score += 10;
      analysis.checks.push({ type: 'success', message: 'Content length is good' });
    } else {
      analysis.checks.push({ type: 'warning', message: 'Content should be at least 300 characters' });
      analysis.recommendations.push('Expand content for better SEO value');
    }

    // Keywords analysis
    if (post.seoKeywords && post.seoKeywords.length >= 3) {
      analysis.score += 10;
      analysis.checks.push({ type: 'success', message: 'Good keyword coverage' });
    } else {
      analysis.checks.push({ type: 'warning', message: 'Add at least 3 relevant keywords' });
      analysis.recommendations.push('Research and add relevant keywords');
    }

    // Featured image
    if (post.featuredImage) {
      analysis.score += 10;
      analysis.checks.push({ type: 'success', message: 'Featured image is set' });
    } else {
      analysis.checks.push({ type: 'warning', message: 'Add a featured image' });
      analysis.recommendations.push('Add an engaging featured image');
    }

    // Slug analysis
    if (post.slug && post.slug.length <= 50) {
      analysis.score += 10;
      analysis.checks.push({ type: 'success', message: 'URL slug is SEO-friendly' });
    } else {
      analysis.checks.push({ type: 'warning', message: 'Optimize URL slug' });
      analysis.recommendations.push('Create a shorter, more descriptive URL slug');
    }

    // Update post with new SEO score
    await BlogPost.findByIdAndUpdate(req.params.id, {
      seoScore: analysis.score,
      seoChecks: analysis.checks
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing blog post SEO:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing SEO'
    });
  }
});

module.exports = router;
