const express = require('express');
const router = express.Router();
const SitemapGenerator = require('../services/sitemapGenerator');
const path = require('path');
const fs = require('fs').promises;

const sitemapGenerator = new SitemapGenerator();

// Serve main sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemapPath = path.join(__dirname, '../../../client/public/sitemap.xml');
    
    // Check if sitemap exists and is recent (less than 1 hour old)
    try {
      const stats = await fs.stat(sitemapPath);
      const isRecent = (Date.now() - stats.mtime.getTime()) < 60 * 60 * 1000; // 1 hour
      
      if (!isRecent) {
        // Generate new sitemap if old
        await sitemapGenerator.generateAllSitemaps();
      }
    } catch (error) {
      // File doesn't exist, generate it
      await sitemapGenerator.generateAllSitemaps();
    }

    // Serve the sitemap
    const sitemap = await fs.readFile(sitemapPath, 'utf8');
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving sitemap:', error);
    
    // Generate and serve on-the-fly as fallback
    try {
      const sitemap = sitemapGenerator.generateSitemapIndex();
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (fallbackError) {
      console.error('Fallback sitemap generation failed:', fallbackError);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Serve individual sitemaps
router.get('/sitemap-:type.xml', async (req, res) => {
  const { type } = req.params;
  
  try {
    const sitemapPath = path.join(__dirname, `../../../client/public/sitemap-${type}.xml`);
    
    // Check if sitemap exists and is recent
    try {
      const stats = await fs.stat(sitemapPath);
      const isRecent = (Date.now() - stats.mtime.getTime()) < 60 * 60 * 1000; // 1 hour
      
      if (!isRecent) {
        await sitemapGenerator.generateAllSitemaps();
      }
    } catch (error) {
      await sitemapGenerator.generateAllSitemaps();
    }

    const sitemap = await fs.readFile(sitemapPath, 'utf8');
    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error(`Error serving sitemap-${type}:`, error);
    
    // Generate specific sitemap on-the-fly
    try {
      let sitemap;
      switch (type) {
        case 'posts':
          sitemap = await sitemapGenerator.generatePostsSitemap();
          break;
        case 'deals':
          sitemap = await sitemapGenerator.generateDealsSitemap();
          break;
        case 'categories':
          sitemap = await sitemapGenerator.generateCategoriesSitemap();
          break;
        case 'pages':
          sitemap = sitemapGenerator.generatePagesSitemap();
          break;
        default:
          return res.status(404).send('Sitemap not found');
      }
      
      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (fallbackError) {
      console.error(`Fallback generation failed for sitemap-${type}:`, fallbackError);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Serve robots.txt
router.get('/robots.txt', async (req, res) => {
  try {
    const robotsPath = path.join(__dirname, '../../../client/public/robots.txt');
    
    try {
      const robots = await fs.readFile(robotsPath, 'utf8');
      res.set('Content-Type', 'text/plain');
      res.send(robots);
    } catch (error) {
      // Generate robots.txt on-the-fly
      const robots = sitemapGenerator.generateRobotsTxt();
      res.set('Content-Type', 'text/plain');
      res.send(robots);
    }
  } catch (error) {
    console.error('Error serving robots.txt:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Manual sitemap generation endpoint (admin only)
router.post('/generate', async (req, res) => {
  try {
    // Note: In production, add admin authentication middleware here
    const success = await sitemapGenerator.generateAllSitemaps();
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Sitemaps generated successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate sitemaps' 
      });
    }
  } catch (error) {
    console.error('Error in manual sitemap generation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Get sitemap statistics
router.get('/stats', async (req, res) => {
  try {
    const BlogPost = require('../models/BlogPost');
    const Deal = require('../models/Deal');
    const Category = require('../models/Category');

    const [postsCount, dealsCount, categoriesCount] = await Promise.all([
      BlogPost.countDocuments({ status: 'published' }),
      Deal.countDocuments({ status: 'active' }),
      Category.countDocuments({ isActive: true })
    ]);

    const stats = {
      posts: postsCount,
      deals: dealsCount,
      categories: categoriesCount,
      staticPages: 12, // Number of static pages
      total: postsCount + dealsCount + categoriesCount + 12,
      lastGenerated: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Error getting sitemap stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get sitemap statistics' 
    });
  }
});

// Ping search engines about sitemap updates
router.post('/ping', async (req, res) => {
  try {
    const siteUrl = process.env.SITE_URL || 'https://clickmaliclub.com';
    const sitemapUrl = `${siteUrl}/sitemap.xml`;
    
    const pingUrls = [
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    ];

    const pingResults = await Promise.allSettled(
      pingUrls.map(async (url) => {
        const response = await fetch(url);
        return {
          url: url.includes('google') ? 'Google' : 'Bing',
          status: response.status,
          success: response.ok
        };
      })
    );

    const results = pingResults.map(result => 
      result.status === 'fulfilled' ? result.value : { 
        error: result.reason.message 
      }
    );

    res.json({
      success: true,
      message: 'Search engines pinged about sitemap update',
      results: results
    });
  } catch (error) {
    console.error('Error pinging search engines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to ping search engines',
      error: error.message
    });
  }
});

// Serve robots.txt
router.get('/robots.txt', (req, res) => {
  const robotsContent = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${process.env.SITE_URL || 'https://clickmaliclub.com'}/sitemap.xml
Sitemap: ${process.env.SITE_URL || 'https://clickmaliclub.com'}/sitemap-posts.xml
Sitemap: ${process.env.SITE_URL || 'https://clickmaliclub.com'}/sitemap-deals.xml
Sitemap: ${process.env.SITE_URL || 'https://clickmaliclub.com'}/sitemap-categories.xml
Sitemap: ${process.env.SITE_URL || 'https://clickmaliclub.com'}/sitemap-pages.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important files
Allow: /sitemap*.xml
Allow: /robots.txt`;

  res.set('Content-Type', 'text/plain');
  res.send(robotsContent);
});

module.exports = router;
