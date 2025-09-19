const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const simpleEmailService = require('../services/simpleEmailService');
const adminAuth = require('../middleware/adminAuth');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    console.log('📮 Newsletter subscription request received:', req.body);
    const { email, fullName, interests, frequency } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email provided:', email);
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required'
      });
    }

    console.log('✅ Email validation passed:', email);
    
    // Use simple email service (only pass email for now)
    const result = await simpleEmailService.addSubscriber(email);
    
    console.log('📊 Subscription result:', result);
    res.status(result.success ? 200 : 400).json(result);
    
  } catch (error) {
    console.error('💥 Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const result = await simpleEmailService.removeSubscriber(email);
    res.status(result.success ? 200 : 400).json(result);

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/newsletter/subscribers
// @desc    Get all newsletter subscribers (Admin only)
// @access  Private/Admin
router.get('/subscribers', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'subscribed' } = req.query;
    
    const subscribers = await NewsletterSubscriber.find({ status })
      .sort({ subscribedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await NewsletterSubscriber.countDocuments({ status });

    res.json({
      success: true,
      data: {
        subscribers,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/newsletter/broadcast
// @desc    Send broadcast email to all subscribers (Admin only)
// @access  Private/Admin
router.post('/broadcast', adminAuth, async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Subject and content are required'
      });
    }

    const result = await simpleEmailService.sendBroadcast(subject, content);
    res.json(result);

  } catch (error) {
    console.error('Broadcast email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics (Admin only)
// @access  Private/Admin
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await simpleEmailService.getSubscriberStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get newsletter stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/newsletter/test
// @desc    Test email service connection (Admin only)
// @access  Private/Admin
router.get('/test', adminAuth, async (req, res) => {
  try {
    const result = await simpleEmailService.testConnection();
    res.json(result);
  } catch (error) {
    console.error('Test email service error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
