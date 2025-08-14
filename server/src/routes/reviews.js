const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Get all approved reviews
router.get('/', async (req, res) => {
  try {
    const { category, platform } = req.query;
    let filter = { status: 'approved' };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (platform) {
      filter.platform = new RegExp(platform, 'i');
    }

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error while fetching reviews' });
  }
});

// Submit a new review
router.post('/', async (req, res) => {
  try {
    const { platform, category, rating, reviewer, review } = req.body;

    // Validation
    if (!platform || !category || !rating || !reviewer || !review) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (review.length > 1000) {
      return res.status(400).json({ error: 'Review text too long' });
    }

    const newReview = new Review({
      platform,
      category,
      rating: parseFloat(rating),
      reviewer,
      review,
      status: 'pending' // Reviews need approval before showing
    });

    await newReview.save();

    res.status(201).json({ 
      message: 'Review submitted successfully! It will be visible after approval.',
      review: newReview 
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Server error while submitting review' });
  }
});

// Vote on a review (helpful/unhelpful)
router.post('/:reviewId/vote', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { voteType, userId } = req.body; // userId could be IP address or session ID

    if (!['helpful', 'unhelpful'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check if user already voted
    const existingVoteIndex = review.votes.findIndex(vote => vote.userId === userId);
    
    if (existingVoteIndex !== -1) {
      const existingVote = review.votes[existingVoteIndex];
      
      // If clicking the same vote type, remove the vote
      if (existingVote.voteType === voteType) {
        review.votes.splice(existingVoteIndex, 1);
        review[voteType] = Math.max(0, review[voteType] - 1);
      } else {
        // Switching vote type
        review[existingVote.voteType] = Math.max(0, review[existingVote.voteType] - 1);
        review[voteType] += 1;
        review.votes[existingVoteIndex].voteType = voteType;
        review.votes[existingVoteIndex].createdAt = new Date();
      }
    } else {
      // New vote
      review.votes.push({ userId, voteType });
      review[voteType] += 1;
    }

    await review.save();

    res.json({ 
      helpful: review.helpful, 
      unhelpful: review.unhelpful,
      userVote: review.votes.find(vote => vote.userId === userId)?.voteType || null
    });
  } catch (error) {
    console.error('Error voting on review:', error);
    res.status(500).json({ error: 'Server error while voting' });
  }
});

// Get review statistics
router.get('/stats', async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments({ status: 'approved' });
    const averageRating = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const categoryStats = await Review.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
    ]);

    res.json({
      totalReviews,
      averageRating: averageRating[0]?.avgRating || 0,
      categoryStats
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Server error while fetching stats' });
  }
});

module.exports = router;
