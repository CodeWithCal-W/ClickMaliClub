const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');

// Get all published guides
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { status: 'published' };
    
    if (category && category !== 'all') {
      filter.category = new RegExp(category, 'i');
    }

    const guides = await Guide.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .select('-content.sections'); // Don't include full content in list view

    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Server error while fetching guides' });
  }
});

// Get a specific guide by slug
router.get('/:slug', async (req, res) => {
  try {
    const guide = await Guide.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    });

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    // Increment view count
    guide.views += 1;
    await guide.save();

    res.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({ error: 'Server error while fetching guide' });
  }
});

// Search guides
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchRegex = new RegExp(query, 'i');

    const guides = await Guide.find({
      status: 'published',
      $or: [
        { title: searchRegex },
        { excerpt: searchRegex },
        { 'content.topics': searchRegex },
        { tags: searchRegex }
      ]
    })
    .sort({ featured: -1, createdAt: -1 })
    .select('-content.sections')
    .limit(20);

    res.json(guides);
  } catch (error) {
    console.error('Error searching guides:', error);
    res.status(500).json({ error: 'Server error while searching guides' });
  }
});

// Get guide categories with counts
router.get('/categories/stats', async (req, res) => {
  try {
    const categoryStats = await Guide.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: 'Server error while fetching category stats' });
  }
});

module.exports = router;
