const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email, name, preferences = {} } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required'
      });
    }

    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'subscribed') {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed to our newsletter'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.status = 'subscribed';
        existingSubscriber.subscribedAt = new Date();
        existingSubscriber.preferences = { ...existingSubscriber.preferences, ...preferences };
        existingSubscriber.isConfirmed = true;
        existingSubscriber.confirmedAt = new Date();
        await existingSubscriber.save();

        return res.json({
          success: true,
          message: 'Successfully reactivated your newsletter subscription!'
        });
      }
    }

    // Create new subscriber
    const subscriber = new NewsletterSubscriber({
      email,
      name,
      source: 'website',
      status: 'subscribed',
      preferences: {
        categories: preferences.categories || ['forex', 'crypto'],
        frequency: preferences.frequency || 'weekly'
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      subscribedAt: new Date(),
      isConfirmed: true,
      confirmedAt: new Date()
    });

    await subscriber.save();

    // Send welcome email
    try {
      const welcomeEmailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Welcome to ClickMaliClub Newsletter! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #36b37e 0%, #ff6f00 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to ClickMaliClub!</h1>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #333; margin-top: 0;">Hi ${name || 'there'}! 👋</h2>
              
              <p style="color: #666; line-height: 1.6; font-size: 16px;">
                Thank you for subscribing to the ClickMaliClub newsletter! You're now part of our exclusive community that gets access to:
              </p>
              
              <ul style="color: #666; line-height: 1.8; margin: 20px 0;">
                <li>🎯 <strong>Exclusive deals</strong> and bonuses before anyone else</li>
                <li>📈 <strong>Trading insights</strong> and market analysis</li>
                <li>💡 <strong>Expert tips</strong> on forex, crypto, and betting</li>
                <li>🔥 <strong>Hot deals alerts</strong> with limited-time offers</li>
              </ul>
              
              <p style="color: #666; line-height: 1.6; font-size: 16px;">
                We'll send you valuable content based on your interests: <strong>${preferences.categories?.join(', ') || 'forex, crypto'}</strong>
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" 
                   style="background: linear-gradient(135deg, #36b37e 0%, #ff6f00 100%); 
                          color: white; 
                          padding: 15px 30px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          font-weight: bold;
                          display: inline-block;">
                  Explore Latest Deals
                </a>
              </div>
              
              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                You can update your preferences or unsubscribe at any time.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(welcomeEmailOptions);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the subscription if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter! Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while subscribing to newsletter'
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
        message: 'Email address is required'
      });
    }

    const subscriber = await NewsletterSubscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter list'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unsubscribing from newsletter'
    });
  }
});

// @route   GET /api/newsletter/stats
// @desc    Get newsletter statistics (admin only)
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    const totalSubscribers = await NewsletterSubscriber.countDocuments({ status: 'subscribed' });
    const totalUnsubscribed = await NewsletterSubscriber.countDocuments({ status: 'unsubscribed' });
    const recentSubscribers = await NewsletterSubscriber.countDocuments({
      status: 'subscribed',
      subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Category preferences stats
    const categoryStats = await NewsletterSubscriber.aggregate([
      { $match: { status: 'subscribed' } },
      { $unwind: '$preferences.categories' },
      { $group: { _id: '$preferences.categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalSubscribers,
        totalUnsubscribed,
        recentSubscribers,
        categoryPreferences: categoryStats
      }
    });

  } catch (error) {
    console.error('Error getting newsletter stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting newsletter statistics'
    });
  }
});

// @route   POST /api/newsletter/send-campaign
// @desc    Send newsletter campaign (admin only)
// @access  Private
router.post('/send-campaign', async (req, res) => {
  try {
    const { subject, content, categories = [], targetAudience = 'all' } = req.body;

    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Subject and content are required'
      });
    }

    // Build query for subscribers
    let query = { status: 'subscribed' };
    
    if (targetAudience === 'category' && categories.length > 0) {
      query['preferences.categories'] = { $in: categories };
    }

    const subscribers = await NewsletterSubscriber.find(query);

    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active subscribers found for the selected criteria'
      });
    }

    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 50;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          const personalizedContent = content
            .replace(/\{name\}/g, subscriber.name || 'Friend')
            .replace(/\{email\}/g, subscriber.email);

          const emailOptions = {
            from: process.env.EMAIL_FROM,
            to: subscriber.email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #36b37e 0%, #ff6f00 100%); padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">ClickMaliClub</h1>
                </div>
                
                <div style="padding: 30px; background: #f9f9f9;">
                  ${personalizedContent}
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="color: #999; font-size: 12px;">
                      You received this email because you subscribed to ClickMaliClub newsletter.
                      <br>
                      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/unsubscribe?email=${subscriber.email}" 
                         style="color: #666;">Unsubscribe</a>
                    </p>
                  </div>
                </div>
              </div>
            `
          };

          await transporter.sendMail(emailOptions);
          
          // Update last email sent timestamp
          subscriber.lastEmailSent = new Date();
          await subscriber.save();
          
          sentCount++;
        } catch (emailError) {
          console.error(`Failed to send email to ${subscriber.email}:`, emailError);
          failedCount++;
        }
      });

      await Promise.all(emailPromises);
      
      // Add delay between batches to be respectful to email service
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    res.json({
      success: true,
      message: `Campaign sent successfully! Sent: ${sentCount}, Failed: ${failedCount}`,
      data: {
        totalSubscribers: subscribers.length,
        sentCount,
        failedCount
      }
    });

  } catch (error) {
    console.error('Error sending newsletter campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending newsletter campaign'
    });
  }
});

module.exports = router;
