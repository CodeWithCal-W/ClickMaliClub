const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Category = require('./models/Category');
const Deal = require('./models/Deal');
const BlogPost = require('./models/BlogPost');
const NewsletterSubscriber = require('./models/NewsletterSubscriber');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clickmaliclub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    
    const categories = [
      {
        name: 'Forex Trading',
        slug: 'forex',
        description: 'Best forex brokers and trading platforms for currency exchange',
        icon: 'FiTrendingUp',
        color: '#36b37e',
        seoMeta: {
          title: 'Best Forex Brokers 2025 - Compare Trading Platforms',
          description: 'Discover top-rated forex brokers with competitive spreads, excellent customer service, and advanced trading tools.',
          keywords: ['forex', 'trading', 'brokers', 'currency', 'exchange']
        },
        sortOrder: 1
      },
      {
        name: 'Crypto Exchange',
        slug: 'crypto',
        description: 'Top cryptocurrency exchanges and trading platforms',
        icon: 'FiBitcoin',
        color: '#ff6f00',
        seoMeta: {
          title: 'Best Crypto Exchanges 2025 - Secure Bitcoin Trading',
          description: 'Find the most secure and reliable cryptocurrency exchanges for Bitcoin, Ethereum, and altcoins.',
          keywords: ['crypto', 'bitcoin', 'ethereum', 'exchange', 'trading']
        },
        sortOrder: 2
      },
      {
        name: 'Betting Sites',
        slug: 'betting',
        description: 'Licensed sportsbooks and online betting platforms',
        icon: 'FiTarget',
        color: '#36b37e',
        seoMeta: {
          title: 'Best Betting Sites 2025 - Top Sportsbooks Online',
          description: 'Compare the best online betting sites with great odds, bonuses, and secure payment methods.',
          keywords: ['betting', 'sportsbook', 'odds', 'gambling', 'sports']
        },
        sortOrder: 3
      },
      {
        name: 'SaaS Tools',
        slug: 'saas',
        description: 'Software as a Service tools for business and productivity',
        icon: 'FiTool',
        color: '#ff6f00',
        seoMeta: {
          title: 'Best SaaS Tools 2025 - Business Software Solutions',
          description: 'Discover top SaaS tools and software solutions to boost your business productivity and efficiency.',
          keywords: ['saas', 'software', 'tools', 'business', 'productivity']
        },
        sortOrder: 4
      },
      {
        name: 'Web Hosting',
        slug: 'hosting',
        description: 'Reliable web hosting providers and domain registration',
        icon: 'FiServer',
        color: '#36b37e',
        seoMeta: {
          title: 'Best Web Hosting 2025 - Reliable Hosting Providers',
          description: 'Find the best web hosting services with excellent uptime, fast loading speeds, and 24/7 support.',
          keywords: ['hosting', 'web hosting', 'domains', 'servers', 'website']
        },
        sortOrder: 5
      },
      {
        name: 'Online Education',
        slug: 'education',
        description: 'Online courses, certifications, and learning platforms',
        icon: 'FiBook',
        color: '#ff6f00',
        seoMeta: {
          title: 'Best Online Courses 2025 - Learn New Skills',
          description: 'Discover top online learning platforms and courses to advance your career and learn new skills.',
          keywords: ['education', 'courses', 'learning', 'certification', 'skills']
        },
        sortOrder: 6
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

const seedUsers = async () => {
  try {
    await User.deleteMany({});
    
    const hashedPassword = await bcrypt.hash('admin123456', 12);
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@clickmaliclub.com',
        password: hashedPassword,
        role: 'admin',
        isSubscribed: true,
        subscriptionDate: new Date(),
        preferences: {
          categories: ['forex', 'crypto', 'betting', 'saas', 'hosting'],
          emailNotifications: true,
          marketingEmails: true
        }
      },
      {
        name: 'Test User',
        email: 'test@clickmaliclub.com',
        password: hashedPassword,
        role: 'user',
        isSubscribed: true,
        subscriptionDate: new Date(),
        preferences: {
          categories: ['forex', 'crypto'],
          emailNotifications: true,
          marketingEmails: true
        }
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedDeals = async (categories, users) => {
  try {
    await Deal.deleteMany({});
    
    const adminUser = users.find(user => user.role === 'admin');
    const forexCategory = categories.find(cat => cat.slug === 'forex');
    const cryptoCategory = categories.find(cat => cat.slug === 'crypto');
    const bettingCategory = categories.find(cat => cat.slug === 'betting');
    
    const deals = [
      // FOREX DEALS - Ordered as requested: Deriv → HFM → Headway → Exness
      {
        title: 'Deriv - Synthetic Indices & Weekend Trading',
        slug: 'deriv-synthetic-indices-weekend-trading',
        description: 'Trade with Deriv and access different financial instruments including synthetic indices like Boom, Crash, and Volatility Indices. Trade even on weekends!',
        shortDescription: 'Trade synthetic indices, Boom & Crash, and Volatility Indices on weekends',
        category: forexCategory._id,
        brand: {
          name: 'Deriv',
          logo: 'https://example.com/deriv-logo.png',
          website: 'https://deriv.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Weekend Trading Available',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://track.deriv.com/_owDgkpeMfV5BMfcXPt5VjGNd7ZgqdRLk/1/',
        trackingCode: 'DERIV_SYNTHETIC_INDICES',
        commission: 250,
        tags: ['forex', 'synthetic indices', 'boom crash', 'volatility', 'weekend trading'],
        features: [
          { name: 'Synthetic Indices', description: 'Trade Boom, Crash, and Volatility Indices', isHighlight: true },
          { name: 'Weekend Trading', description: 'Trade synthetic instruments even on weekends', isHighlight: true },
          { name: 'Multiple Instruments', description: 'Access to various financial instruments', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 10,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Deriv Synthetic Indices - Trade Boom & Crash on Weekends',
          description: 'Trade synthetic indices including Boom, Crash, and Volatility Indices with Deriv. Weekend trading available.',
          keywords: ['Deriv', 'synthetic indices', 'boom crash', 'volatility indices', 'weekend trading']
        }
      },
      {
        title: 'HF Markets (HFM) - Premium Trading Experience',
        slug: 'hf-markets-hfm-premium-trading',
        description: 'Join HF Markets (HFM) for a premium forex trading experience with competitive spreads, advanced tools, and excellent customer support.',
        shortDescription: 'Premium forex trading experience with HF Markets (HFM)',
        category: forexCategory._id,
        brand: {
          name: 'HF Markets (HFM)',
          logo: 'https://example.com/hfm-logo.png',
          website: 'https://hfm.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Premium Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://www.hfm.com/ke/en/?refid=30468358',
        trackingCode: 'HFM_PREMIUM_TRADING',
        commission: 280,
        tags: ['forex', 'premium trading', 'competitive spreads', 'advanced tools'],
        features: [
          { name: 'Competitive Spreads', description: 'Get some of the tightest spreads in the market', isHighlight: true },
          { name: 'Advanced Tools', description: 'Professional trading tools and analysis', isHighlight: true },
          { name: 'Excellent Support', description: '24/7 customer support in multiple languages', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 9,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'HF Markets (HFM) - Premium Forex Trading Platform',
          description: 'Experience premium forex trading with HF Markets. Competitive spreads, advanced tools, and excellent support.',
          keywords: ['HF Markets', 'HFM', 'forex', 'premium trading', 'competitive spreads']
        }
      },
      {
        title: 'Headway - $111 Welcome Bonus',
        slug: 'headway-111-welcome-bonus',
        description: 'Start trading with Headway and get a $111 welcome/no deposit bonus for new clients. Terms and Conditions apply.',
        shortDescription: 'Get $111 welcome bonus to start trading with Headway',
        category: forexCategory._id,
        brand: {
          name: 'Headway',
          logo: 'https://example.com/headway-logo.png',
          website: 'https://headway.com',
          rating: 4.7
        },
        offer: {
          type: 'bonus',
          value: '$111 Welcome Bonus',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://headway.partners/user/signup?hwp=0e7f14',
        trackingCode: 'HEADWAY_WELCOME_111',
        commission: 300,
        tags: ['forex', 'welcome bonus', 'no deposit', 'trading'],
        features: [
          { name: '$111 Welcome Bonus', description: 'Get $111 bonus for new clients (T&Cs apply)', isHighlight: true },
          { name: 'Regulated Broker', description: 'Licensed and regulated forex broker', isHighlight: true },
          { name: 'Advanced Platform', description: 'Professional trading platform', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: true
        },
        status: 'active',
        isFeatured: true,
        priority: 8,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Headway $111 Welcome Bonus - Start Trading Today',
          description: 'Get $111 welcome bonus with Headway forex broker. No deposit required for new clients.',
          keywords: ['Headway', 'forex', 'welcome bonus', 'trading', '$111 bonus']
        }
      },
      {
        title: 'Exness - Unlimited Leverage & Zero Spread',
        slug: 'exness-unlimited-leverage-zero-spread',
        description: 'Trade with Exness and enjoy unlimited leverage, zero spreads on major pairs, and instant withdrawals. One of the fastest-growing forex brokers globally.',
        shortDescription: 'Unlimited leverage, zero spreads, and instant withdrawals with Exness',
        category: forexCategory._id,
        brand: {
          name: 'Exness',
          logo: 'https://example.com/exness-logo.png',
          website: 'https://exness.com',
          rating: 4.9
        },
        offer: {
          type: 'other',
          value: 'Unlimited Leverage & Zero Spread',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://one.exnesstrack.org/a/c_hj608i3517',
        trackingCode: 'EXNESS_UNLIMITED_LEVERAGE',
        commission: 320,
        tags: ['forex', 'unlimited leverage', 'zero spread', 'instant withdrawals'],
        features: [
          { name: 'Unlimited Leverage', description: 'Trade with unlimited leverage on major pairs', isHighlight: true },
          { name: 'Zero Spreads', description: 'Zero spreads available on major currency pairs', isHighlight: true },
          { name: 'Instant Withdrawals', description: 'Get your profits instantly with fast withdrawals', isHighlight: true }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 7,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Exness Forex Broker - Unlimited Leverage & Zero Spreads',
          description: 'Trade with Exness and enjoy unlimited leverage, zero spreads on major pairs, and instant withdrawals.',
          keywords: ['Exness', 'forex', 'unlimited leverage', 'zero spread', 'instant withdrawals']
        }
      },
      
      // CRYPTO DEALS
      {
        title: 'Binance - Earn Trending Tokens BMT & INIT',
        slug: 'binance-earn-trending-tokens-bmt-init',
        description: 'Join Binance through our referral link and earn trending tokens like BMT & INIT. World\'s largest cryptocurrency exchange with 350+ cryptocurrencies.',
        shortDescription: 'Earn trending tokens BMT & INIT when you join Binance',
        category: cryptoCategory._id,
        brand: {
          name: 'Binance',
          logo: 'https://example.com/binance-logo.png',
          website: 'https://binance.com',
          rating: 4.9
        },
        offer: {
          type: 'other',
          value: 'Trending Tokens BMT & INIT',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://www.binance.com/referral/earn-together/refer-in-hotsummer/claim?hl=en&ref=GRO_20338_DQH2I&utm_source=default',
        trackingCode: 'BINANCE_BMT_INIT_TOKENS',
        commission: 40,
        tags: ['crypto', 'binance', 'trending tokens', 'BMT', 'INIT', 'referral'],
        features: [
          { name: 'Trending Tokens', description: 'Earn BMT & INIT tokens through referral program', isHighlight: true },
          { name: 'Largest Exchange', description: 'World\'s biggest cryptocurrency exchange', isHighlight: true },
          { name: '350+ Cryptocurrencies', description: 'Trade hundreds of digital assets', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 6,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Binance Referral - Earn BMT & INIT Trending Tokens',
          description: 'Join Binance and earn trending tokens BMT & INIT. World\'s largest crypto exchange with 350+ cryptocurrencies.',
          keywords: ['Binance', 'crypto', 'trending tokens', 'BMT', 'INIT', 'referral program']
        }
      },
      {
        title: 'OKX - Premium Crypto Exchange',
        slug: 'okx-premium-crypto-exchange',
        description: 'Trade on OKX, a premium cryptocurrency exchange offering advanced trading features, competitive fees, and a wide range of digital assets.',
        shortDescription: 'Premium crypto trading experience with OKX exchange',
        category: cryptoCategory._id,
        brand: {
          name: 'OKX',
          logo: 'https://example.com/okx-logo.png',
          website: 'https://okx.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Premium Exchange',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://okx.com/join/35307633',
        trackingCode: 'OKX_PREMIUM_EXCHANGE',
        commission: 35,
        tags: ['crypto', 'okx', 'premium exchange', 'advanced trading', 'competitive fees'],
        features: [
          { name: 'Advanced Trading', description: 'Professional trading tools and features', isHighlight: true },
          { name: 'Competitive Fees', description: 'Low trading fees for all users', isHighlight: true },
          { name: 'Wide Asset Range', description: 'Trade hundreds of cryptocurrencies', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 5,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'OKX Premium Crypto Exchange - Advanced Trading Platform',
          description: 'Trade cryptocurrencies on OKX premium exchange. Advanced features, competitive fees, and wide asset selection.',
          keywords: ['OKX', 'crypto exchange', 'premium trading', 'competitive fees', 'advanced features']
        }
      }
    ];

    const createdDeals = await Deal.insertMany(deals);
    console.log(`✅ Created ${createdDeals.length} deals`);
    return createdDeals;
  } catch (error) {
    console.error('❌ Error seeding deals:', error);
  }
};

const seedBlogPosts = async (categories, users) => {
  try {
    await BlogPost.deleteMany({});
    
    const adminUser = users.find(user => user.role === 'admin');
    const forexCategory = categories.find(cat => cat.slug === 'forex');
    const cryptoCategory = categories.find(cat => cat.slug === 'crypto');
    const bettingCategory = categories.find(cat => cat.slug === 'betting');
    const saasCategory = categories.find(cat => cat.slug === 'saas');
    const hostingCategory = categories.find(cat => cat.slug === 'hosting');
    
    const blogPosts = [
      {
        title: 'Best Forex Brokers 2025: Complete Guide for Beginners',
        slug: 'best-forex-brokers-2025-complete-guide',
        content: `
          <h2>Introduction to Forex Trading</h2>
          <p>Foreign exchange (Forex) trading is the largest financial market in the world, with over $6 trillion traded daily. If you're looking to start your trading journey, choosing the right broker is crucial for your success.</p>
          
          <h2>Top Forex Brokers for 2025</h2>
          <p>After extensive research and testing, we've compiled a list of the most reliable and profitable forex brokers for this year. These brokers offer competitive spreads, excellent customer service, and robust trading platforms.</p>
          
          <h3>1. Deriv - Best for Synthetic Indices & Weekend Trading</h3>
          <p>Deriv stands out with its unique synthetic indices including Boom, Crash, and Volatility Indices. Trade even on weekends with their synthetic instruments. Perfect for traders who want 24/7 market access and unique trading opportunities.</p>
          
          <h3>2. HF Markets (HFM) - Premium Trading Experience</h3>
          <p>HF Markets offers a premium forex trading experience with competitive spreads, advanced trading tools, and excellent customer support. Their professional-grade platform is perfect for serious traders.</p>
          
          <h3>3. Headway - $111 Welcome Bonus</h3>
          <p>Headway provides an attractive $111 welcome bonus for new clients (Terms and Conditions apply). This regulated broker offers an advanced trading platform perfect for beginners and experienced traders alike.</p>
          
          <h3>4. Exness - Unlimited Leverage & Zero Spreads</h3>
          <p>Exness leads the market with unlimited leverage on major pairs, zero spreads, and instant withdrawals. One of the fastest-growing forex brokers globally, perfect for traders who demand the best conditions.</p>
          
          <h2>How to Choose a Forex Broker</h2>
          <ul>
            <li>Regulation and licensing</li>
            <li>Trading platforms and tools</li>
            <li>Spreads and commissions</li>
            <li>Customer support quality</li>
            <li>Deposit and withdrawal methods</li>
            <li>Special features (like synthetic indices or weekend trading)</li>
          </ul>
          
          <h2>Start Trading Today</h2>
          <p>Ready to begin your forex trading journey? Check out our recommended brokers above and take advantage of their welcome bonuses and promotional offers. Each broker offers unique advantages tailored to different trading styles.</p>
        `,
        excerpt: 'Discover the best forex brokers for 2025 including Deriv, HFM, Headway, and Exness. Compare spreads, bonuses, and features to find the perfect broker for your trading needs.',
        author: adminUser._id,
        category: forexCategory._id,
        tags: ['forex', 'brokers', 'trading', 'beginners', 'guide'],
        status: 'published',
        isSticky: true,
        publishedAt: new Date(),
        analytics: {
          readTime: 8,
          views: 0
        },
        seoMeta: {
          title: 'Best Forex Brokers 2025: Complete Beginner\'s Guide & Reviews',
          description: 'Find the best forex brokers for 2025: Deriv, HFM, Headway, and Exness. Compare spreads, bonuses, regulation, and trading platforms. Start trading with trusted brokers today.',
          keywords: ['forex brokers', 'best forex brokers 2025', 'forex trading', 'currency trading', 'trading platforms']
        },
        socialSharing: {
          facebookShares: 0,
          twitterShares: 0,
          linkedinShares: 0
        }
      },
      {
        title: 'Cryptocurrency Trading Guide: Top Exchanges and Security Tips',
        slug: 'cryptocurrency-trading-guide-top-exchanges-security',
        content: `
          <h2>Getting Started with Cryptocurrency Trading</h2>
          <p>Cryptocurrency trading has become one of the most popular investment methods in recent years. With proper knowledge and the right exchange, you can potentially profit from the volatile crypto market.</p>
          
          <h2>Best Cryptocurrency Exchanges 2025</h2>
          <p>Choosing a secure and reliable cryptocurrency exchange is essential for successful trading. Here are our top recommendations:</p>
          
          <h3>1. Binance - World's Largest Exchange</h3>
          <p>Binance offers the highest trading volume and supports over 350 cryptocurrencies. With our exclusive referral link, you can earn trending tokens like BMT & INIT. As the world's largest crypto exchange, Binance provides unmatched liquidity and trading opportunities.</p>
          
          <h3>2. OKX - Premium Crypto Exchange</h3>
          <p>OKX provides a premium cryptocurrency trading experience with advanced trading features, competitive fees, and a wide range of digital assets. Perfect for both beginners and professional traders seeking sophisticated tools.</p>
          
          <h2>Security Best Practices</h2>
          <ul>
            <li>Use two-factor authentication (2FA)</li>
            <li>Never share your private keys</li>
            <li>Use hardware wallets for long-term storage</li>
            <li>Verify withdrawal addresses carefully</li>
            <li>Keep software updated</li>
            <li>Only use reputable exchanges like Binance and OKX</li>
          </ul>
          
          <h2>Trading Strategies for Beginners</h2>
          <p>Start with dollar-cost averaging (DCA) and only invest what you can afford to lose. Research projects thoroughly before investing and diversify your portfolio across different cryptocurrencies. Both Binance and OKX offer educational resources to help you get started.</p>
          
          <h2>Why Choose Our Recommended Exchanges</h2>
          <p>Our recommended exchanges - Binance and OKX - are among the most trusted and secure platforms in the cryptocurrency space. They offer competitive fees, advanced security measures, and excellent customer support to ensure your trading experience is both profitable and secure.</p>
        `,
        excerpt: 'Learn cryptocurrency trading with our comprehensive guide. Discover Binance and OKX exchanges, security practices, and beginner strategies for crypto trading success.',
        author: adminUser._id,
        category: cryptoCategory._id,
        tags: ['cryptocurrency', 'bitcoin', 'trading', 'exchanges', 'security'],
        status: 'published',
        isSticky: true,
        publishedAt: new Date(),
        analytics: {
          readTime: 10,
          views: 0
        },
        seoMeta: {
          title: 'Cryptocurrency Trading Guide 2025: Best Exchanges & Security Tips',
          description: 'Master cryptocurrency trading with our complete guide. Learn about Binance and OKX exchanges, security tips, and trading strategies for beginners.',
          keywords: ['cryptocurrency trading', 'crypto exchanges', 'bitcoin trading', 'blockchain', 'digital currency']
        },
        socialSharing: {
          facebookShares: 0,
          twitterShares: 0,
          linkedinShares: 0
        }
      },
      {
        title: 'Online Sports Betting Guide: Tips, Strategies & Best Sites',
        slug: 'online-sports-betting-guide-tips-strategies-best-sites',
        content: `
          <h2>Introduction to Sports Betting</h2>
          <p>Sports betting has evolved from traditional bookmakers to sophisticated online platforms offering live betting, streaming, and competitive odds. This guide will help you navigate the world of online sports betting responsibly.</p>
          
          <h2>Top Sports Betting Sites 2025</h2>
          <p>We've reviewed dozens of sportsbooks to bring you the most reliable and profitable betting platforms:</p>
          
          <h3>1. Bet365 - Best Overall Sportsbook</h3>
          <p>Bet365 offers extensive sports coverage, live streaming, and competitive odds. New customers can claim up to €100 in bet credits with our exclusive link.</p>
          
          <h3>2. William Hill - Best for Horse Racing</h3>
          <p>With decades of experience, William Hill provides excellent horse racing odds and promotions, plus a wide range of other sports markets.</p>
          
          <h2>Betting Strategies</h2>
          <ul>
            <li>Bankroll management is crucial</li>
            <li>Research teams and players thoroughly</li>
            <li>Look for value bets, not just favorites</li>
            <li>Keep detailed records of your bets</li>
            <li>Never chase losses with bigger bets</li>
          </ul>
          
          <h2>Understanding Odds</h2>
          <p>Learn how to read decimal, fractional, and American odds. Understanding implied probability will help you identify value bets and make more informed decisions.</p>
          
          <h2>Responsible Gambling</h2>
          <p>Always gamble responsibly. Set limits, take breaks, and never bet money you can't afford to lose. If you feel you have a gambling problem, seek help immediately.</p>
        `,
        excerpt: 'Master online sports betting with our comprehensive guide. Learn strategies, find the best betting sites, and discover tips for responsible gambling.',
        author: adminUser._id,
        category: bettingCategory._id,
        tags: ['sports betting', 'sportsbook', 'betting tips', 'odds', 'gambling'],
        status: 'published',
        isSticky: false,
        publishedAt: new Date(),
        analytics: {
          readTime: 12,
          views: 0
        },
        seoMeta: {
          title: 'Sports Betting Guide 2025: Best Sites, Tips & Strategies',
          description: 'Complete sports betting guide with the best sportsbooks, betting strategies, and tips for successful wagering. Bet responsibly with expert advice.',
          keywords: ['sports betting', 'online betting', 'sportsbook', 'betting tips', 'gambling guide']
        },
        socialSharing: {
          facebookShares: 0,
          twitterShares: 0,
          linkedinShares: 0
        }
      },
      {
        title: 'Best SaaS Tools for Small Business Growth in 2025',
        slug: 'best-saas-tools-small-business-growth-2025',
        content: `
          <h2>Transform Your Business with SaaS Tools</h2>
          <p>Software as a Service (SaaS) tools have revolutionized how small businesses operate, offering enterprise-level functionality at affordable prices. Here are the essential tools every growing business needs.</p>
          
          <h2>Essential SaaS Categories</h2>
          
          <h3>Customer Relationship Management (CRM)</h3>
          <p>HubSpot CRM offers a free tier with powerful features including contact management, deal tracking, and email marketing. Perfect for startups and small businesses.</p>
          
          <h3>Project Management</h3>
          <p>Asana and Trello provide excellent project management capabilities with team collaboration features, task tracking, and deadline management.</p>
          
          <h3>Communication & Collaboration</h3>
          <p>Slack revolutionizes team communication with channels, file sharing, and integration with hundreds of other tools. Microsoft Teams is another excellent option for businesses already using Office 365.</p>
          
          <h3>Financial Management</h3>
          <p>QuickBooks Online and Xero make accounting simple with automated bookkeeping, invoice generation, and financial reporting.</p>
          
          <h2>Marketing Automation</h2>
          <p>Mailchimp and ConvertKit help automate email marketing campaigns, segment audiences, and track conversion rates to maximize your marketing ROI.</p>
          
          <h2>Choosing the Right Tools</h2>
          <ul>
            <li>Assess your specific business needs</li>
            <li>Consider integration capabilities</li>
            <li>Evaluate pricing and scalability</li>
            <li>Test free trials before committing</li>
            <li>Check customer support quality</li>
          </ul>
        `,
        excerpt: 'Discover the best SaaS tools to accelerate your small business growth. From CRM to project management, find the software solutions that drive success.',
        author: adminUser._id,
        category: saasCategory._id,
        tags: ['saas', 'business tools', 'productivity', 'software', 'small business'],
        status: 'published',
        isSticky: false,
        publishedAt: new Date(),
        analytics: {
          readTime: 7,
          views: 0
        },
        seoMeta: {
          title: 'Best SaaS Tools 2025: Essential Software for Small Business Growth',
          description: 'Discover the top SaaS tools every small business needs. Compare CRM, project management, and productivity software to boost your business efficiency.',
          keywords: ['saas tools', 'business software', 'small business tools', 'productivity software', 'business automation']
        },
        socialSharing: {
          facebookShares: 0,
          twitterShares: 0,
          linkedinShares: 0
        }
      },
      {
        title: 'Web Hosting Guide: How to Choose the Best Hosting Provider',
        slug: 'web-hosting-guide-choose-best-hosting-provider',
        content: `
          <h2>Understanding Web Hosting</h2>
          <p>Web hosting is the foundation of your online presence. Choosing the right hosting provider affects your website's performance, security, and user experience. This guide will help you make an informed decision.</p>
          
          <h2>Types of Web Hosting</h2>
          
          <h3>Shared Hosting</h3>
          <p>Perfect for beginners and small websites. Multiple websites share server resources, making it cost-effective but with limited performance.</p>
          
          <h3>VPS Hosting</h3>
          <p>Virtual Private Servers offer dedicated resources within a shared environment. Better performance than shared hosting with more control.</p>
          
          <h3>Dedicated Hosting</h3>
          <p>An entire server dedicated to your website. Maximum performance and control but requires technical expertise and higher costs.</p>
          
          <h3>Cloud Hosting</h3>
          <p>Scalable hosting using multiple servers. Excellent reliability and performance with pay-as-you-use pricing models.</p>
          
          <h2>Top Hosting Providers 2025</h2>
          
          <h3>1. Bluehost - Best for WordPress</h3>
          <p>Officially recommended by WordPress.org, Bluehost offers excellent WordPress hosting with one-click installation and 24/7 support.</p>
          
          <h3>2. SiteGround - Best Customer Support</h3>
          <p>Known for exceptional customer service and fast loading speeds. Great for small to medium businesses.</p>
          
          <h3>3. DigitalOcean - Best for Developers</h3>
          <p>Cloud hosting platform with developer-friendly features and transparent pricing. Perfect for scalable applications.</p>
          
          <h2>Key Features to Consider</h2>
          <ul>
            <li>Uptime guarantee (99.9% or higher)</li>
            <li>Fast loading speeds (under 3 seconds)</li>
            <li>SSL certificates included</li>
            <li>Regular backups</li>
            <li>24/7 customer support</li>
            <li>Scalability options</li>
          </ul>
          
          <h2>Making Your Decision</h2>
          <p>Consider your website's traffic, technical requirements, and budget. Most providers offer money-back guarantees, so you can test their services risk-free.</p>
        `,
        excerpt: 'Choose the perfect web hosting provider with our comprehensive guide. Compare hosting types, features, and top providers to find the best solution for your website.',
        author: adminUser._id,
        category: hostingCategory._id,
        tags: ['web hosting', 'hosting providers', 'website', 'servers', 'performance'],
        status: 'published',
        isSticky: false,
        publishedAt: new Date(),
        analytics: {
          readTime: 9,
          views: 0
        },
        seoMeta: {
          title: 'Web Hosting Guide 2025: How to Choose the Best Hosting Provider',
          description: 'Find the perfect web hosting provider with our expert guide. Compare hosting types, features, and top providers for optimal website performance.',
          keywords: ['web hosting', 'hosting providers', 'website hosting', 'server hosting', 'cloud hosting']
        },
        socialSharing: {
          facebookShares: 0,
          twitterShares: 0,
          linkedinShares: 0
        }
      }
    ];

    const createdBlogPosts = await BlogPost.insertMany(blogPosts);
    console.log(`✅ Created ${createdBlogPosts.length} blog posts`);
    return createdBlogPosts;
  } catch (error) {
    console.error('❌ Error seeding blog posts:', error);
  }
};

const seedNewsletterSubscribers = async () => {
  try {
    await NewsletterSubscriber.deleteMany({});
    
    const subscribers = [
      {
        email: 'subscriber1@example.com',
        name: 'John Smith',
        source: 'website',
        status: 'subscribed',
        preferences: {
          categories: ['forex', 'crypto'],
          frequency: 'weekly'
        },
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        subscribedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        lastEmailSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        isConfirmed: true,
        confirmedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        email: 'trader.mike@example.com',
        name: 'Mike Johnson',
        source: 'blog',
        status: 'subscribed',
        preferences: {
          categories: ['forex', 'betting'],
          frequency: 'daily'
        },
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        subscribedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        lastEmailSent: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isConfirmed: true,
        confirmedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        email: 'crypto.sarah@example.com',
        name: 'Sarah Williams',
        source: 'deal_page',
        status: 'subscribed',
        preferences: {
          categories: ['crypto', 'saas'],
          frequency: 'weekly'
        },
        ipAddress: '192.168.1.3',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        subscribedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastEmailSent: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isConfirmed: true,
        confirmedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      }
    ];

    const createdSubscribers = await NewsletterSubscriber.insertMany(subscribers);
    console.log(`✅ Created ${createdSubscribers.length} newsletter subscribers`);
    return createdSubscribers;
  } catch (error) {
    console.error('❌ Error seeding newsletter subscribers:', error);
  }
};

const seedDatabase = async () => {
  await connectDB();
  
  console.log('🌱 Starting database seeding...');
  
  const categories = await seedCategories();
  const users = await seedUsers();
  const deals = await seedDeals(categories, users);
  const blogPosts = await seedBlogPosts(categories, users);
  const newsletterSubscribers = await seedNewsletterSubscribers();
  
  console.log('✅ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`Categories: ${categories?.length || 0}`);
  console.log(`Users: ${users?.length || 0}`);
  console.log(`Deals: ${deals?.length || 0}`);
  console.log(`Blog Posts: ${blogPosts?.length || 0}`);
  console.log(`Newsletter Subscribers: ${newsletterSubscribers?.length || 0}`);
  
  console.log('\n🔐 Admin Login:');
  console.log('Email: admin@clickmaliclub.com');
  console.log('Password: admin123456');
  
  console.log('\n📧 Email Configuration:');
  console.log('Business Email: clickmaliclub@gmail.com');
  console.log('Newsletter subscribers ready for email campaigns');
  
  process.exit(0);
};

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
