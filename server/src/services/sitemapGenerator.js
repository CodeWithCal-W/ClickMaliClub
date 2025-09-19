const fs = require('fs').promises;
const path = require('path');

class SitemapGenerator {
  constructor() {
    this.baseUrl = process.env.SITE_URL || 'https://clickmaliclub.com';
    this.sitemaps = [];
  }

  // Generate main sitemap index
  generateSitemapIndex() {
    const sitemaps = [
      'sitemap-posts.xml',
      'sitemap-deals.xml', 
      'sitemap-categories.xml',
      'sitemap-pages.xml'
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemaps.forEach(sitemap => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.baseUrl}/${sitemap}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  }

  // Generate blog posts sitemap
  async generatePostsSitemap() {
    try {
      const BlogPost = require('../models/BlogPost');
      const posts = await BlogPost.find({ status: 'published' })
        .select('slug updatedAt createdAt priority')
        .sort({ createdAt: -1 });

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      posts.forEach(post => {
        xml += '  <url>\n';
        xml += `    <loc>${this.baseUrl}/blog/${post.slug}</loc>\n`;
        xml += `    <lastmod>${(post.updatedAt || post.createdAt).toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += `    <priority>${post.priority || 0.7}</priority>\n`;
        xml += '  </url>\n';
      });

      xml += '</urlset>';
      return xml;
    } catch (error) {
      console.error('Error generating posts sitemap:', error);
      return this.generateEmptySitemap();
    }
  }

  // Generate deals sitemap
  async generateDealsSitemap() {
    try {
      const Deal = require('../models/Deal');
      const deals = await Deal.find({ status: 'active' })
        .select('slug updatedAt createdAt priority')
        .sort({ createdAt: -1 });

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      deals.forEach(deal => {
        xml += '  <url>\n';
        xml += `    <loc>${this.baseUrl}/deals/${deal.slug}</loc>\n`;
        xml += `    <lastmod>${(deal.updatedAt || deal.createdAt).toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>daily</changefreq>\n';
        xml += `    <priority>${deal.priority || 0.8}</priority>\n`;
        xml += '  </url>\n';
      });

      xml += '</urlset>';
      return xml;
    } catch (error) {
      console.error('Error generating deals sitemap:', error);
      return this.generateEmptySitemap();
    }
  }

  // Generate categories sitemap
  async generateCategoriesSitemap() {
    try {
      const Category = require('../models/Category');
      const categories = await Category.find({ isActive: true })
        .select('slug updatedAt createdAt priority')
        .sort({ name: 1 });

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      categories.forEach(category => {
        xml += '  <url>\n';
        xml += `    <loc>${this.baseUrl}/categories/${category.slug}</loc>\n`;
        xml += `    <lastmod>${(category.updatedAt || category.createdAt).toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += `    <priority>${category.priority || 0.6}</priority>\n`;
        xml += '  </url>\n';
      });

      xml += '</urlset>';
      return xml;
    } catch (error) {
      console.error('Error generating categories sitemap:', error);
      return this.generateEmptySitemap();
    }
  }

  // Generate static pages sitemap
  generatePagesSitemap() {
    const pages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.5 },
      { url: '/contact', changefreq: 'monthly', priority: 0.5 },
      { url: '/blog', changefreq: 'daily', priority: 0.8 },
      { url: '/deals', changefreq: 'daily', priority: 0.9 },
      { url: '/categories', changefreq: 'weekly', priority: 0.7 },
      { url: '/reviews', changefreq: 'weekly', priority: 0.6 },
      { url: '/guides', changefreq: 'weekly', priority: 0.6 },
      { url: '/privacy-policy', changefreq: 'yearly', priority: 0.3 },
      { url: '/terms-of-service', changefreq: 'yearly', priority: 0.3 },
      { url: '/disclaimer', changefreq: 'yearly', priority: 0.3 },
      { url: '/faq', changefreq: 'monthly', priority: 0.4 }
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    pages.forEach(page => {
      xml += '  <url>\n';
      xml += `    <loc>${this.baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  // Generate empty sitemap for error cases
  generateEmptySitemap() {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    xml += '</urlset>';
    return xml;
  }

  // Generate robots.txt
  generateRobotsTxt() {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Disallow search and form pages
Disallow: /search?
Disallow: /*?*

# Allow important directories
Allow: /assets/
Allow: /images/
Allow: /css/
Allow: /js/

# Crawl delay (optional)
Crawl-delay: 1

# Popular search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`;
    return robotsTxt;
  }

  // Save sitemap to file
  async saveSitemap(filename, content) {
    try {
      const publicPath = path.join(__dirname, '../../../client/public');
      
      // Ensure directory exists
      try {
        await fs.access(publicPath);
      } catch {
        // Directory doesn't exist, create it
        await fs.mkdir(publicPath, { recursive: true });
      }
      
      const filePath = path.join(publicPath, filename);
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✅ Generated ${filename}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${filename}:`, error);
      return false;
    }
  }

  // Generate all sitemaps
  async generateAllSitemaps() {
    console.log('🔄 Starting sitemap generation...');
    
    try {
      // Generate individual sitemaps
      const [postsSitemap, dealsSitemap, categoriesSitemap, pagesSitemap] = await Promise.all([
        this.generatePostsSitemap(),
        this.generateDealsSitemap(),
        this.generateCategoriesSitemap(),
        Promise.resolve(this.generatePagesSitemap())
      ]);

      // Save individual sitemaps
      await Promise.all([
        this.saveSitemap('sitemap-posts.xml', postsSitemap),
        this.saveSitemap('sitemap-deals.xml', dealsSitemap),
        this.saveSitemap('sitemap-categories.xml', categoriesSitemap),
        this.saveSitemap('sitemap-pages.xml', pagesSitemap)
      ]);

      // Generate and save main sitemap index
      const sitemapIndex = this.generateSitemapIndex();
      await this.saveSitemap('sitemap.xml', sitemapIndex);

      // Generate and save robots.txt
      const robotsTxt = this.generateRobotsTxt();
      await this.saveSitemap('robots.txt', robotsTxt);

      console.log('✅ All sitemaps generated successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error generating sitemaps:', error);
      return false;
    }
  }

  // Schedule automatic generation
  scheduleGeneration() {
    // Generate sitemaps every hour
    setInterval(async () => {
      console.log('🔄 Scheduled sitemap generation...');
      await this.generateAllSitemaps();
    }, 60 * 60 * 1000); // 1 hour

    // Initial generation
    this.generateAllSitemaps();
  }
}

module.exports = SitemapGenerator;
