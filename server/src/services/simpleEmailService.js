const nodemailer = require('nodemailer');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

class SimpleEmailService {
  constructor() {
    // Use Gmail SMTP (free) - user can use their own Gmail account
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
      }
    });
  }

  async addSubscriber(email) {
    try {
      console.log('📧 Newsletter subscription attempt for:', email);
      
      // Check if subscriber already exists
      const existingSubscriber = await NewsletterSubscriber.findOne({ email });
      if (existingSubscriber) {
        console.log('❌ Email already subscribed:', email);
        return { success: false, message: 'Email already subscribed' };
      }

      // Add to local database
      const subscriber = new NewsletterSubscriber({
        email,
        subscribedAt: new Date(),
        status: 'subscribed'
      });
      
      await subscriber.save();
      console.log('✅ Subscriber saved to database:', email);

      // Try to send welcome email, but don't fail subscription if email fails
      try {
        await this.sendWelcomeEmail(email);
        console.log('✅ Welcome email sent successfully');
      } catch (emailError) {
        console.log('⚠️ Welcome email not sent (email service not configured):', emailError.message);
      }

      console.log('✅ Newsletter subscription successful for:', email);
      return { success: true, message: 'Successfully subscribed!' };
    } catch (error) {
      console.error('❌ Error adding subscriber:', error);
      return { success: false, message: 'Failed to subscribe' };
    }
  }

  async sendWelcomeEmail(email) {
    const mailOptions = {
      from: process.env.GMAIL_USER || 'noreply@clickmaliclub.com',
      to: email,
      subject: 'Welcome to ClickMali Club! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to ClickMali Club!</h2>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>You'll now receive:</p>
          <ul>
            <li>🔥 Hottest deals and discounts</li>
            <li>💰 Exclusive money-saving tips</li>
            <li>📱 Latest product reviews</li>
            <li>🛍️ Shopping guides</li>
          </ul>
          <p>Happy shopping!</p>
          <p><strong>The ClickMali Club Team</strong></p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', email);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendBroadcast(subject, content, recipients = null) {
    try {
      // Get all active subscribers if no specific recipients
      if (!recipients) {
        const subscribers = await NewsletterSubscriber.find({ status: 'subscribed' });
        recipients = subscribers.map(sub => sub.email);
      }

      const results = [];
      
      for (const email of recipients) {
        const mailOptions = {
          from: process.env.GMAIL_USER || 'noreply@clickmaliclub.com',
          to: email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">ClickMali Club</h2>
              ${content}
              <hr style="margin: 20px 0;">
              <p style="font-size: 12px; color: #666;">
                You received this email because you subscribed to ClickMali Club newsletter.
                <br>
                <a href="#" style="color: #666;">Unsubscribe</a>
              </p>
            </div>
          `
        };

        try {
          await this.transporter.sendMail(mailOptions);
          results.push({ email, status: 'sent' });
        } catch (error) {
          results.push({ email, status: 'failed', error: error.message });
        }
      }

      return { success: true, results };
    } catch (error) {
      console.error('Error sending broadcast:', error);
      return { success: false, error: error.message };
    }
  }

  async getSubscriberStats() {
    try {
      const total = await NewsletterSubscriber.countDocuments();
      const active = await NewsletterSubscriber.countDocuments({ status: 'subscribed' });
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = await NewsletterSubscriber.countDocuments({ 
        subscribedAt: { $gte: today } 
      });

      return {
        total,
        active,
        todayCount,
        unsubscribed: total - active
      };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { total: 0, active: 0, todayCount: 0, unsubscribed: 0 };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service connected successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async removeSubscriber(email) {
    try {
      await NewsletterSubscriber.findOneAndUpdate(
        { email },
        { status: 'unsubscribed' }
      );
      return { success: true, message: 'Successfully unsubscribed' };
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return { success: false, message: 'Failed to unsubscribe' };
    }
  }
}

module.exports = new SimpleEmailService();
