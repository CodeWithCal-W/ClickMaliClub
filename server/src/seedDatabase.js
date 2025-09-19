const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Admin = require('./models/Admin');
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
      },
      {
        name: 'Prop Firms',
        slug: 'prop-firms',
        description: 'Proprietary trading firms offering funded trading accounts',
        icon: 'FiTrendingUp',
        color: '#36b37e',
        seoMeta: {
          title: 'Best Prop Trading Firms 2025 - Funded Trading Accounts',
          description: 'Discover the top proprietary trading firms offering funded accounts for forex, stocks, and futures trading.',
          keywords: ['prop firms', 'funded trading', 'proprietary trading', 'trading capital', 'FTMO']
        },
        sortOrder: 7
      },
      {
        name: 'Business Resources & Outsourcing',
        slug: 'business-resources',
        description: 'Business tools, outsourcing platforms, and professional services',
        icon: 'FiBriefcase',
        color: '#ff6f00',
        seoMeta: {
          title: 'Best Business Resources 2025 - Outsourcing & Professional Services',
          description: 'Find top business resources, outsourcing platforms, and professional services to grow your business efficiently.',
          keywords: ['business resources', 'outsourcing', 'professional services', 'business tools', 'freelance']
        },
        sortOrder: 8
      }
    ];

    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

const seedDeals = async (categories) => {
  try {
    await Deal.deleteMany({});
    
    // Use existing admin account from Admin model
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      console.log('⚠️ No admin user found. Please set up admin accounts first.');
      return [];
    }
    
    const adminUser = existingAdmin;
    const forexCategory = categories.find(cat => cat.slug === 'forex');
    const cryptoCategory = categories.find(cat => cat.slug === 'crypto');
    const bettingCategory = categories.find(cat => cat.slug === 'betting');
    const propFirmsCategory = categories.find(cat => cat.slug === 'prop-firms');
    const saasCategory = categories.find(cat => cat.slug === 'saas');
    const hostingCategory = categories.find(cat => cat.slug === 'hosting');
    const businessResourcesCategory = categories.find(cat => cat.slug === 'business-resources');
    const educationCategory = categories.find(cat => cat.slug === 'education');
    
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
          logo: 'https://static.deriv.com/logo/deriv-logo-red.svg',
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
          logo: 'https://www.hfm.com/svg/hfm-logo.svg',
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

      // ADDITIONAL FOREX DEALS
      {
        title: 'FXPro - Award-Winning Forex Broker',
        slug: 'fxpro-award-winning-forex-broker',
        description: 'Trade with FXPro, a multi-award-winning forex broker offering competitive spreads, advanced trading platforms, and excellent customer service.',
        shortDescription: 'Award-winning forex broker with competitive spreads and advanced platforms',
        category: forexCategory._id,
        brand: {
          name: 'FXPro',
          logo: 'https://example.com/fxpro-logo.png',
          website: 'https://fxpro.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Professional Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://direct-fxpro.com/en/partner/2mZxaJHQJ',
        trackingCode: 'FXPRO_PROFESSIONAL_TRADING',
        commission: 300,
        tags: ['forex', 'fxpro', 'award-winning', 'competitive spreads', 'advanced platforms'],
        features: [
          { name: 'Award-Winning', description: 'Multi-award-winning forex broker with excellent reputation', isHighlight: true },
          { name: 'Competitive Spreads', description: 'Tight spreads on major currency pairs', isHighlight: true },
          { name: 'Advanced Platforms', description: 'MT4, MT5, and proprietary trading platforms', isHighlight: false }
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
          title: 'FXPro Forex Broker - Award-Winning Trading Platform',
          description: 'Trade with FXPro, award-winning forex broker offering competitive spreads and advanced platforms.',
          keywords: ['FXPro', 'forex', 'award-winning', 'trading platform', 'competitive spreads']
        }
      },
      {
        title: 'PrimeXBT - Multi-Asset Trading Platform',
        slug: 'primexbt-multi-asset-trading-platform',
        description: 'Trade forex, crypto, commodities, and indices on PrimeXBT. Enjoy leveraged trading with professional tools and competitive fees.',
        shortDescription: 'Multi-asset trading platform for forex, crypto, commodities, and indices',
        category: forexCategory._id,
        brand: {
          name: 'PrimeXBT',
          logo: 'https://example.com/primexbt-logo.png',
          website: 'https://primexbt.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Multi-Asset Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://go.primexbt.direct/visit/?bta=44704&brand=primexbt',
        trackingCode: 'PRIMEXBT_MULTI_ASSET',
        commission: 350,
        tags: ['forex', 'crypto', 'primexbt', 'multi-asset', 'leveraged trading'],
        features: [
          { name: 'Multi-Asset Trading', description: 'Trade forex, crypto, commodities, and indices in one platform', isHighlight: true },
          { name: 'Leveraged Trading', description: 'Professional leverage options for experienced traders', isHighlight: true },
          { name: 'Professional Tools', description: 'Advanced charting and risk management tools', isHighlight: false }
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
          title: 'PrimeXBT - Multi-Asset Trading Platform for Forex & Crypto',
          description: 'Trade forex, crypto, commodities, and indices on PrimeXBT with professional tools and leverage.',
          keywords: ['PrimeXBT', 'multi-asset', 'forex', 'crypto', 'leveraged trading']
        }
      },
      {
        title: 'RoboForex - Innovative Trading Solutions',
        slug: 'roboforex-innovative-trading-solutions',
        description: 'Experience innovative trading with RoboForex. Enjoy competitive spreads, advanced analytics, and a wide range of trading instruments.',
        shortDescription: 'Innovative trading solutions with competitive spreads and advanced analytics',
        category: forexCategory._id,
        brand: {
          name: 'RoboForex',
          logo: 'https://example.com/roboforex-logo.png',
          website: 'https://roboforex.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Innovative Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://my.roboforex.com/en/?a=gpwmq',
        trackingCode: 'ROBOFOREX_INNOVATIVE',
        commission: 280,
        tags: ['forex', 'roboforex', 'innovative', 'analytics', 'competitive spreads'],
        features: [
          { name: 'Innovative Solutions', description: 'Cutting-edge trading technology and tools', isHighlight: true },
          { name: 'Advanced Analytics', description: 'Professional market analysis and insights', isHighlight: true },
          { name: 'Wide Instrument Range', description: 'Extensive selection of trading instruments', isHighlight: false }
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
          title: 'RoboForex - Innovative Forex Trading Solutions',
          description: 'Experience innovative trading with RoboForex. Competitive spreads and advanced analytics.',
          keywords: ['RoboForex', 'forex', 'innovative', 'trading solutions', 'analytics']
        }
      },
      {
        title: 'GetProfit (ExpertOption) - Binary Options Trading',
        slug: 'getprofit-expertoption-binary-options',
        description: 'Start binary options trading with GetProfit (ExpertOption). User-friendly platform with educational resources and competitive returns.',
        shortDescription: 'Binary options trading platform with educational resources',
        category: forexCategory._id,
        brand: {
          name: 'GetProfit (ExpertOption)',
          logo: 'https://example.com/expertoption-logo.png',
          website: 'https://expertoption.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Binary Options Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://r.expertoption-track.com/?prefid=1014964001',
        trackingCode: 'EXPERTOPTION_BINARY',
        commission: 250,
        tags: ['binary options', 'expertoption', 'getprofit', 'educational', 'returns'],
        features: [
          { name: 'Binary Options', description: 'Simple and profitable binary options trading', isHighlight: true },
          { name: 'Educational Resources', description: 'Comprehensive learning materials for beginners', isHighlight: true },
          { name: 'User-Friendly Platform', description: 'Easy-to-use trading interface', isHighlight: false }
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
          title: 'GetProfit ExpertOption - Binary Options Trading Platform',
          description: 'Start binary options trading with GetProfit (ExpertOption). Educational resources and competitive returns.',
          keywords: ['ExpertOption', 'GetProfit', 'binary options', 'trading platform', 'education']
        }
      },

      // PROP FIRMS DEALS
      {
        title: 'FTMO - Funded Trading Accounts',
        slug: 'ftmo-funded-trading-accounts',
        description: 'Join FTMO and get access to funded trading accounts up to $400,000. Prove your trading skills and trade with their capital while keeping up to 90% of profits.',
        shortDescription: 'Get funded trading accounts up to $400,000 with FTMO',
        category: propFirmsCategory._id,
        brand: {
          name: 'FTMO',
          logo: 'https://example.com/ftmo-logo.png',
          website: 'https://ftmo.com',
          rating: 4.9
        },
        offer: {
          type: 'other',
          value: 'Up to $400,000 Funding',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://trader.ftmo.com/?affiliates=LCgByrOcCQWmQjiPzkSZ',
        trackingCode: 'FTMO_FUNDED_ACCOUNTS',
        commission: 400,
        tags: ['prop firm', 'funded account', 'trading capital', 'profit sharing', 'evaluation'],
        features: [
          { name: 'Up to $400K Funding', description: 'Access funded trading accounts up to $400,000', isHighlight: true },
          { name: '90% Profit Share', description: 'Keep up to 90% of your trading profits', isHighlight: true },
          { name: 'No Risk to Personal Capital', description: 'Trade with FTMO capital, not your own money', isHighlight: true }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 8,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'FTMO Funded Trading Accounts - Up to $400K Capital',
          description: 'Get funded trading accounts up to $400,000 with FTMO. Keep up to 90% of profits. No risk to personal capital.',
          keywords: ['FTMO', 'prop firm', 'funded account', 'trading capital', 'profit sharing']
        }
      },
      {
        title: 'FundedNext - Next Generation Prop Trading',
        slug: 'fundednext-next-generation-prop-trading',
        description: 'Join FundedNext for innovative prop trading with flexible evaluation programs. Get funded accounts up to $200,000 with competitive profit splits.',
        shortDescription: 'Innovative prop trading with flexible evaluation programs',
        category: propFirmsCategory._id,
        brand: {
          name: 'FundedNext',
          logo: 'https://example.com/fundednext-logo.png',
          website: 'https://fundednext.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Up to $200,000 Funding',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://fundednext.com/affiliate-pending',
        trackingCode: 'FUNDEDNEXT_PROP_TRADING',
        commission: 350,
        tags: ['prop firm', 'funded account', 'flexible evaluation', 'profit sharing', 'next generation'],
        features: [
          { name: 'Flexible Evaluation', description: 'Multiple evaluation programs to suit your style', isHighlight: true },
          { name: 'Up to $200K Funding', description: 'Access funded accounts up to $200,000', isHighlight: true },
          { name: 'Competitive Splits', description: 'Attractive profit sharing arrangements', isHighlight: false }
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
          title: 'FundedNext Prop Trading - Next Generation Funded Accounts',
          description: 'Join FundedNext for innovative prop trading with flexible evaluation programs up to $200,000.',
          keywords: ['FundedNext', 'prop firm', 'funded account', 'flexible evaluation', 'profit sharing']
        }
      },
      {
        title: 'FundingPips - Professional Forex Funding',
        slug: 'fundingpips-professional-forex-funding',
        description: 'Get professional forex funding with FundingPips. Reliable prop firm offering funded accounts with transparent evaluation process.',
        shortDescription: 'Professional forex funding with transparent evaluation',
        category: propFirmsCategory._id,
        brand: {
          name: 'FundingPips',
          logo: 'https://example.com/fundingpips-logo.png',
          website: 'https://fundingpips.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Professional Funding',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://fundingpips.com/affiliate-pending',
        trackingCode: 'FUNDINGPIPS_FOREX_FUNDING',
        commission: 300,
        tags: ['prop firm', 'forex funding', 'professional', 'transparent evaluation', 'reliable'],
        features: [
          { name: 'Transparent Process', description: 'Clear and transparent evaluation criteria', isHighlight: true },
          { name: 'Professional Support', description: 'Dedicated support for funded traders', isHighlight: true },
          { name: 'Forex Specialist', description: 'Specialized in forex trading funding', isHighlight: false }
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
          title: 'FundingPips Forex Funding - Professional Prop Trading',
          description: 'Get professional forex funding with FundingPips. Transparent evaluation and reliable funding.',
          keywords: ['FundingPips', 'forex funding', 'prop firm', 'professional', 'transparent evaluation']
        }
      },
      {
        title: 'Alpha Capital - Elite Trading Capital',
        slug: 'alpha-capital-elite-trading-capital',
        description: 'Access elite trading capital with Alpha Capital. Premium prop firm offering substantial funding for skilled traders with excellent conditions.',
        shortDescription: 'Elite trading capital for skilled professional traders',
        category: propFirmsCategory._id,
        brand: {
          name: 'Alpha Capital',
          logo: 'https://example.com/alphacapital-logo.png',
          website: 'https://alpha-capital.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Elite Trading Capital',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://alpha-capital.com/affiliate-pending',
        trackingCode: 'ALPHACAPITAL_ELITE_TRADING',
        commission: 400,
        tags: ['prop firm', 'elite capital', 'premium', 'skilled traders', 'excellent conditions'],
        features: [
          { name: 'Elite Capital Access', description: 'Premium funding for elite traders', isHighlight: true },
          { name: 'Excellent Conditions', description: 'Superior trading conditions and terms', isHighlight: true },
          { name: 'Premium Support', description: 'White-glove support for funded traders', isHighlight: false }
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
          title: 'Alpha Capital Elite Trading - Premium Prop Firm Funding',
          description: 'Access elite trading capital with Alpha Capital. Premium prop firm with excellent conditions.',
          keywords: ['Alpha Capital', 'elite trading', 'premium prop firm', 'skilled traders', 'excellent conditions']
        }
      },
      {
        title: 'The5ers - Scaling Trading Program',
        slug: 'the5ers-scaling-trading-program',
        description: 'Join The5ers unique scaling program where your account grows as you profit. Innovative approach to prop trading with unlimited scaling potential.',
        shortDescription: 'Unique scaling program with unlimited growth potential',
        category: propFirmsCategory._id,
        brand: {
          name: 'The5ers',
          logo: 'https://example.com/the5ers-logo.png',
          website: 'https://the5ers.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Scaling Program',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://the5ers.com/affiliate-pending',
        trackingCode: 'THE5ERS_SCALING_PROGRAM',
        commission: 250,
        tags: ['prop firm', 'scaling program', 'unlimited growth', 'innovative approach', 'account growth'],
        features: [
          { name: 'Unlimited Scaling', description: 'Your account scales as you make profits', isHighlight: true },
          { name: 'Innovative Approach', description: 'Unique trading program structure', isHighlight: true },
          { name: 'Growth Potential', description: 'No limit to account size growth', isHighlight: false }
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
          title: 'The5ers Scaling Trading Program - Unlimited Growth Potential',
          description: 'Join The5ers unique scaling program. Your trading account grows as you profit with unlimited potential.',
          keywords: ['The5ers', 'scaling program', 'unlimited growth', 'prop firm', 'account growth']
        }
      },
      {
        title: 'Funding Traders - Reliable Prop Funding',
        slug: 'funding-traders-reliable-prop-funding',
        description: 'Get reliable prop funding with Funding Traders. Established prop firm with proven track record and trader-friendly conditions.',
        shortDescription: 'Reliable prop funding with proven track record',
        category: propFirmsCategory._id,
        brand: {
          name: 'Funding Traders',
          logo: 'https://example.com/fundingtraders-logo.png',
          website: 'https://fundingtraders.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Reliable Funding',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://fundingtraders.com/affiliate-pending',
        trackingCode: 'FUNDINGTRADERS_RELIABLE_FUNDING',
        commission: 300,
        tags: ['prop firm', 'reliable funding', 'established', 'proven track record', 'trader friendly'],
        features: [
          { name: 'Proven Track Record', description: 'Established firm with reliable payouts', isHighlight: true },
          { name: 'Trader-Friendly', description: 'Conditions designed with traders in mind', isHighlight: true },
          { name: 'Reliable Support', description: 'Consistent and dependable customer support', isHighlight: false }
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
          title: 'Funding Traders - Reliable Prop Firm with Proven Track Record',
          description: 'Get reliable prop funding with Funding Traders. Established firm with trader-friendly conditions.',
          keywords: ['Funding Traders', 'reliable funding', 'prop firm', 'proven track record', 'trader friendly']
        }
      },
      {
        title: 'Goat Funded Traders - Premier Trading Capital',
        slug: 'goat-funded-traders-premier-trading-capital',
        description: 'Access premier trading capital with Goat Funded Traders. Modern prop firm offering competitive evaluation programs and excellent trader benefits.',
        shortDescription: 'Premier trading capital with competitive evaluation programs',
        category: propFirmsCategory._id,
        brand: {
          name: 'Goat Funded Traders',
          logo: 'https://example.com/goatfunded-logo.png',
          website: 'https://goatfundedtraders.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Premier Capital',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://goatfundedtraders.com/affiliate-pending',
        trackingCode: 'GOATFUNDED_PREMIER_CAPITAL',
        commission: 350,
        tags: ['prop firm', 'premier capital', 'modern', 'competitive evaluation', 'trader benefits'],
        features: [
          { name: 'Competitive Evaluation', description: 'Fair and competitive evaluation process', isHighlight: true },
          { name: 'Trader Benefits', description: 'Excellent benefits for funded traders', isHighlight: true },
          { name: 'Modern Platform', description: 'State-of-the-art trading platform and tools', isHighlight: false }
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
          title: 'Goat Funded Traders - Premier Prop Trading Capital',
          description: 'Access premier trading capital with Goat Funded Traders. Competitive evaluation and excellent benefits.',
          keywords: ['Goat Funded Traders', 'premier capital', 'prop firm', 'competitive evaluation', 'trader benefits']
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
      },
      {
        title: 'Kraken - Secure Cryptocurrency Exchange',
        slug: 'kraken-secure-cryptocurrency-exchange',
        description: 'Trade on Kraken, one of the most secure and trusted cryptocurrency exchanges. Advanced security features, professional trading tools, and wide crypto selection.',
        shortDescription: 'Secure and trusted crypto exchange with advanced security',
        category: cryptoCategory._id,
        brand: {
          name: 'Kraken',
          logo: 'https://example.com/kraken-logo.png',
          website: 'https://kraken.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Secure Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://kraken.com/affiliate-pending', // Will be updated with your affiliate link
        trackingCode: 'KRAKEN_SECURE_EXCHANGE',
        commission: 40,
        tags: ['crypto', 'kraken', 'secure exchange', 'advanced security', 'professional trading'],
        features: [
          { name: 'Advanced Security', description: 'Industry-leading security measures and cold storage', isHighlight: true },
          { name: 'Professional Tools', description: 'Advanced trading interface and API', isHighlight: true },
          { name: 'Trusted Platform', description: 'One of the longest-running crypto exchanges', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Kraken Crypto Exchange - Secure & Trusted Trading Platform',
          description: 'Trade cryptocurrencies on Kraken, a secure and trusted exchange with advanced security features.',
          keywords: ['Kraken', 'crypto exchange', 'secure trading', 'advanced security', 'trusted platform']
        }
      },
      {
        title: 'KuCoin - Advanced Crypto Trading Platform',
        slug: 'kucoin-advanced-crypto-trading-platform',
        description: 'Discover KuCoin, an advanced cryptocurrency trading platform with hundreds of altcoins, futures trading, and innovative DeFi features.',
        shortDescription: 'Advanced crypto platform with hundreds of altcoins and DeFi features',
        category: cryptoCategory._id,
        brand: {
          name: 'KuCoin',
          logo: 'https://example.com/kucoin-logo.png',
          website: 'https://kucoin.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Advanced Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://kucoin.com/affiliate-pending', // Will be updated with your affiliate link
        trackingCode: 'KUCOIN_ADVANCED_TRADING',
        commission: 35,
        tags: ['crypto', 'kucoin', 'altcoins', 'futures trading', 'defi features'],
        features: [
          { name: 'Hundreds of Altcoins', description: 'Trade rare and emerging cryptocurrencies', isHighlight: true },
          { name: 'Futures Trading', description: 'Advanced derivatives and margin trading', isHighlight: true },
          { name: 'DeFi Integration', description: 'Access to DeFi pools and yield farming', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'KuCoin Crypto Exchange - Advanced Trading & Altcoins',
          description: 'Trade hundreds of altcoins on KuCoin with advanced features, futures trading, and DeFi integration.',
          keywords: ['KuCoin', 'crypto exchange', 'altcoins', 'futures trading', 'DeFi features']
        }
      },
      {
        title: 'Bybit - Professional Derivatives Trading',
        slug: 'bybit-professional-derivatives-trading',
        description: 'Trade crypto derivatives on Bybit with up to 100x leverage. Professional trading platform for futures, perpetuals, and options trading.',
        shortDescription: 'Professional crypto derivatives trading with up to 100x leverage',
        category: cryptoCategory._id,
        brand: {
          name: 'Bybit',
          logo: 'https://example.com/bybit-logo.png',
          website: 'https://bybit.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Professional Derivatives',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://bybit.com/affiliate-pending', // Will be updated with your affiliate link
        trackingCode: 'BYBIT_DERIVATIVES_TRADING',
        commission: 45,
        tags: ['crypto', 'bybit', 'derivatives', 'futures', 'high leverage', 'professional'],
        features: [
          { name: 'Up to 100x Leverage', description: 'Trade with high leverage on crypto derivatives', isHighlight: true },
          { name: 'Professional Platform', description: 'Advanced trading interface and tools', isHighlight: true },
          { name: 'Multiple Products', description: 'Futures, perpetuals, and options trading', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Bybit Crypto Derivatives Trading - Up to 100x Leverage',
          description: 'Trade crypto derivatives on Bybit with up to 100x leverage. Professional platform for futures and perpetuals.',
          keywords: ['Bybit', 'crypto derivatives', 'high leverage', 'futures trading', 'professional platform']
        }
      },
      {
        title: 'Bitget - Copy Trading & Spot Exchange',
        slug: 'bitget-copy-trading-spot-exchange',
        description: 'Join Bitget for innovative copy trading features and spot trading. Follow successful traders and automate your crypto trading strategy.',
        shortDescription: 'Innovative copy trading platform with automated trading strategies',
        category: cryptoCategory._id,
        brand: {
          name: 'Bitget',
          logo: 'https://example.com/bitget-logo.png',
          website: 'https://bitget.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Copy Trading',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://bitget.com/affiliate-pending', // Will be updated with your affiliate link
        trackingCode: 'BITGET_COPY_TRADING',
        commission: 30,
        tags: ['crypto', 'bitget', 'copy trading', 'automated trading', 'spot exchange'],
        features: [
          { name: 'Copy Trading', description: 'Follow and copy successful crypto traders', isHighlight: true },
          { name: 'Automated Strategies', description: 'Set up automated trading strategies', isHighlight: true },
          { name: 'Social Trading', description: 'Community-driven trading platform', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Bitget Copy Trading Platform - Automated Crypto Strategies',
          description: 'Trade cryptocurrencies on Bitget with innovative copy trading and automated strategies.',
          keywords: ['Bitget', 'copy trading', 'automated trading', 'crypto strategies', 'social trading']
        }
      },
      {
        title: 'MEXC - Global Cryptocurrency Exchange',
        slug: 'mexc-global-cryptocurrency-exchange',
        description: 'Trade on MEXC, a global cryptocurrency exchange with low fees, high liquidity, and access to new token listings before other exchanges.',
        shortDescription: 'Global crypto exchange with early access to new token listings',
        category: cryptoCategory._id,
        brand: {
          name: 'MEXC',
          logo: 'https://example.com/mexc-logo.png',
          website: 'https://mexc.com',
          rating: 4.4
        },
        offer: {
          type: 'other',
          value: 'Global Exchange',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://mexc.com/affiliate-pending', // Will be updated with your affiliate link
        trackingCode: 'MEXC_GLOBAL_EXCHANGE',
        commission: 25,
        tags: ['crypto', 'mexc', 'global exchange', 'new listings', 'low fees'],
        features: [
          { name: 'Early Token Access', description: 'Get access to new token listings first', isHighlight: true },
          { name: 'Low Trading Fees', description: 'Competitive trading fees for all users', isHighlight: true },
          { name: 'High Liquidity', description: 'Deep liquidity pools for smooth trading', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'MEXC Global Crypto Exchange - Early Token Access & Low Fees',
          description: 'Trade cryptocurrencies on MEXC with early access to new listings and competitive fees.',
          keywords: ['MEXC', 'crypto exchange', 'new token listings', 'low fees', 'global platform']
        }
      },

      // BUSINESS RESOURCES & OUTSOURCING DEALS
      {
        title: 'Fiverr - World\'s Largest Freelance Services Marketplace',
        slug: 'fiverr-freelance-services-marketplace',
        description: 'Find freelance services for your business on Fiverr. From logo design to digital marketing, get professional services starting at $5.',
        shortDescription: 'Access thousands of freelance services starting at $5',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Fiverr',
          logo: 'https://example.com/fiverr-logo.png',
          website: 'https://fiverr.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Professional Services',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://ablink.affiliates.fiverr.com/ls/click?upn=u001.TWJuC2VN4aam7dFLwSK6BKLOQRlV85CGMb1w2E5g1q6TAxU3PW1PAu-2FmiA9gihIc-2BbESStkELfObbkXQ1e52Xhn6AP-2FkPPuJRzMu0tWr91s-3DQD13_bPs8dMw-2BH1dSEJ6W4lMnHLaZASn99eSnqeZ4ywR-2FgNJYWZilsL8loOHWL15tCOqD1XbebDyMpU0jhTNfSLcJCNaHGtz5PqEg1Eumln0uI3z-2BnhMnLdi24yykuiP4SvqVTgXk1S1o6fxaTGWwyaEKCQdUHhSWPIknXHYrIjkfqveqRMnC4bay73qv0wsPKcuDE2CFKpajWCpQqKKkh-2BflPoahZ1Jju3Ad3oCuZBsWoYh4VG5PJqK-2FUL1fcvtuVE6bMrwuTlNrPIZN98MaFqDy7I3dWtbCZv4icoUJC71vQhrl9Mwiz0n45WUs8MeEUDZP-2BzgeP4vP4XRrmH9GvX3uOY4YQW4AltXSob9bMJcV8ts8C48ccf2Z4flfYI-2F8R0N79KSzWnM5wYwefAwbPe2cfSeVPESlNLImlPKiivC5HtKHOvWXfwLo7Fac36mUmoNu-2Fi2pTMD5sJep0p9rWeWIgIDYl2o-2FOpuHQyuWrzR3IMUSX6cMh-2FoUvyS7m1kaZkVucOFro5uzXSb9qzSSNTY0vYLVl1GBo4GUlnogW8HeOWzih6NbQchZbrmVAnD9YtdbtFY9-2BSV4YkJMLoY6BQgA0OyQnTLHMeL16zMMSfVcfiWUuXBPmO48pfg3iUi3CwxnpVgBlAHtX66reoNhsrE04u-2BloA0-2FhTdR7tAvr-2FSsxmm-2Ba9FgfkVKhSbCvNToCQ3KwUCsIFfDOAow1CxnIyFfmPInHhdpeODUAi1COhNLjFE-3D',
        trackingCode: 'FIVERR_FREELANCE_SERVICES',
        commission: 150,
        tags: ['fiverr', 'freelance', 'services', 'design', 'marketing', 'business'],
        features: [
          { name: 'Global Talent Pool', description: 'Access millions of freelancers from around the world', isHighlight: true },
          { name: 'Affordable Pricing', description: 'Professional services starting at just $5', isHighlight: true },
          { name: 'Secure Payments', description: 'Safe and secure payment processing', isHighlight: false }
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
          title: 'Fiverr - World\'s Largest Freelance Services Marketplace',
          description: 'Find professional freelance services on Fiverr. Logo design, digital marketing, programming, and more starting at $5.',
          keywords: ['Fiverr', 'freelance', 'services', 'marketplace', 'design', 'marketing', 'business']
        }
      },
      {
        title: 'Upwork - Top Freelancing Platform for Businesses',
        slug: 'upwork-top-freelancing-platform-businesses',
        description: 'Hire top freelancers and agencies on Upwork. Access skilled professionals for web development, design, writing, marketing, and more.',
        shortDescription: 'Connect with top freelancers and agencies worldwide',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Upwork',
          logo: 'https://example.com/upwork-logo.png',
          website: 'https://upwork.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Freelance Services',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://upwork.com/affiliate-pending',
        trackingCode: 'UPWORK_FREELANCE_PLATFORM',
        commission: 100,
        tags: ['upwork', 'freelance', 'remote work', 'agencies', 'skilled professionals'],
        features: [
          { name: 'Vetted Talent', description: 'Access to pre-screened freelancers and agencies', isHighlight: true },
          { name: 'Secure Platform', description: 'Protected payments and work tracking', isHighlight: true },
          { name: 'Global Reach', description: 'Connect with talent from around the world', isHighlight: false }
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
          title: 'Upwork - Top Freelancing Platform for Businesses',
          description: 'Hire skilled freelancers and agencies on Upwork. Web development, design, writing, marketing, and more.',
          keywords: ['Upwork', 'freelance', 'remote work', 'agencies', 'skilled professionals']
        }
      },
      {
        title: 'Freelancer.com - Hire Freelancers Online',
        slug: 'freelancer-com-hire-freelancers-online',
        description: 'Find and hire skilled freelancers on Freelancer.com. Post your project and receive bids from millions of freelancers worldwide.',
        shortDescription: 'Hire from millions of freelancers for any project',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Freelancer.com',
          logo: 'https://example.com/freelancer-logo.png',
          website: 'https://freelancer.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Project-Based Hiring',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://freelancer.com/affiliate-pending',
        trackingCode: 'FREELANCER_COM_PLATFORM',
        commission: 75,
        tags: ['freelancer.com', 'project bidding', 'contests', 'global freelancers', 'competitive pricing'],
        features: [
          { name: 'Project Bidding', description: 'Receive competitive bids for your projects', isHighlight: true },
          { name: 'Milestone Payments', description: 'Pay as work is completed to your satisfaction', isHighlight: true },
          { name: 'Contest Feature', description: 'Run contests for design and creative work', isHighlight: false }
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
          title: 'Freelancer.com - Hire Freelancers Online',
          description: 'Find skilled freelancers on Freelancer.com. Post projects and receive bids from millions of professionals.',
          keywords: ['Freelancer.com', 'project bidding', 'contests', 'global freelancers', 'competitive pricing']
        }
      },
      {
        title: 'PeoplePerHour - UK\'s Leading Freelance Platform',
        slug: 'peopleperhour-uk-leading-freelance-platform',
        description: 'Hire freelancers on PeoplePerHour for your business needs. Vetted professionals offering hourly and fixed-price services.',
        shortDescription: 'UK-based freelance platform with vetted professionals',
        category: businessResourcesCategory._id,
        brand: {
          name: 'PeoplePerHour',
          logo: 'https://example.com/peopleperhour-logo.png',
          website: 'https://peopleperhour.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Hourly & Fixed Services',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'GBP'
        },
        affiliateLink: 'https://peopleperhour.com/affiliate-pending',
        trackingCode: 'PEOPLEPERHOUR_FREELANCE',
        commission: 80,
        tags: ['peopleperhour', 'uk freelancers', 'hourly services', 'vetted professionals', 'european talent'],
        features: [
          { name: 'Vetted Freelancers', description: 'All freelancers are pre-screened and verified', isHighlight: true },
          { name: 'Flexible Pricing', description: 'Choose between hourly or fixed-price projects', isHighlight: true },
          { name: 'UK Focus', description: 'Strong presence of UK and European talent', isHighlight: false }
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
          title: 'PeoplePerHour - UK\'s Leading Freelance Platform',
          description: 'Hire vetted freelancers on PeoplePerHour. Hourly and fixed-price services from UK and European professionals.',
          keywords: ['PeoplePerHour', 'UK freelancers', 'hourly services', 'vetted professionals', 'European talent']
        }
      },
      {
        title: 'Toptal - Hire Top 3% of Freelance Talent',
        slug: 'toptal-hire-top-3-percent-freelance-talent',
        description: 'Access the top 3% of freelance developers, designers, and finance experts. Toptal provides elite talent for critical projects.',
        shortDescription: 'Elite freelance talent - top 3% of professionals',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Toptal',
          logo: 'https://example.com/toptal-logo.png',
          website: 'https://toptal.com',
          rating: 4.9
        },
        offer: {
          type: 'other',
          value: 'Elite Talent',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://toptal.com/affiliate-pending',
        trackingCode: 'TOPTAL_ELITE_TALENT',
        commission: 200,
        tags: ['toptal', 'elite freelancers', 'top talent', 'premium services', 'enterprise clients'],
        features: [
          { name: 'Top 3% Talent', description: 'Only the best freelancers pass our rigorous screening', isHighlight: true },
          { name: 'No-Risk Trial', description: 'Satisfaction guarantee on all engagements', isHighlight: true },
          { name: 'Dedicated Matching', description: 'Personal talent matcher finds the perfect fit', isHighlight: false }
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
          title: 'Toptal - Hire Top 3% of Freelance Talent',
          description: 'Access elite freelance developers, designers, and finance experts. Only the top 3% of talent on Toptal.',
          keywords: ['Toptal', 'elite freelancers', 'top talent', 'premium services', 'enterprise clients']
        }
      },
      {
        title: 'DesignCrowd & 99designs - Creative Design Contests',
        slug: 'designcrowd-99designs-creative-design-contests',
        description: 'Get custom designs through design contests. Hundreds of designers compete to create your logo, website, or marketing materials.',
        shortDescription: 'Design contests with hundreds of creative submissions',
        category: businessResourcesCategory._id,
        brand: {
          name: 'DesignCrowd/99designs',
          logo: 'https://example.com/designcrowd-logo.png',
          website: 'https://designcrowd.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Design Contests',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://designcrowd.com/affiliate-pending',
        trackingCode: 'DESIGNCROWD_CONTESTS',
        commission: 120,
        tags: ['designcrowd', '99designs', 'design contests', 'logo design', 'creative services'],
        features: [
          { name: 'Design Contests', description: 'Multiple designers compete for your project', isHighlight: true },
          { name: 'Money-Back Guarantee', description: 'Get refunded if not satisfied with designs', isHighlight: true },
          { name: 'Global Designers', description: 'Access to creative talent worldwide', isHighlight: false }
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
          title: 'DesignCrowd & 99designs - Creative Design Contests',
          description: 'Get custom designs through contests. Logo design, websites, and marketing materials from global designers.',
          keywords: ['DesignCrowd', '99designs', 'design contests', 'logo design', 'creative services']
        }
      },
      {
        title: 'Workana - Latin America\'s Leading Freelance Platform',
        slug: 'workana-latin-america-leading-freelance-platform',
        description: 'Connect with skilled freelancers from Latin America on Workana. Quality services at competitive rates with cultural alignment.',
        shortDescription: 'Access Latin American freelance talent',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Workana',
          logo: 'https://example.com/workana-logo.png',
          website: 'https://workana.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Latin American Talent',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://workana.com/affiliate-pending',
        trackingCode: 'WORKANA_LATIN_AMERICA',
        commission: 70,
        tags: ['workana', 'latin america', 'spanish freelancers', 'competitive rates', 'cultural alignment'],
        features: [
          { name: 'Regional Expertise', description: 'Freelancers with Latin American market knowledge', isHighlight: true },
          { name: 'Competitive Rates', description: 'Quality services at affordable prices', isHighlight: true },
          { name: 'Language Options', description: 'Spanish and Portuguese speaking professionals', isHighlight: false }
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
          title: 'Workana - Latin America\'s Leading Freelance Platform',
          description: 'Hire skilled freelancers from Latin America. Quality services with cultural alignment and competitive rates.',
          keywords: ['Workana', 'Latin America', 'Spanish freelancers', 'competitive rates', 'cultural alignment']
        }
      },
      {
        title: 'Outsourcely - Long-term Remote Staff Platform',
        slug: 'outsourcely-long-term-remote-staff-platform',
        description: 'Find long-term remote employees on Outsourcely. Build dedicated remote teams with skilled professionals from around the world.',
        shortDescription: 'Build dedicated remote teams for long-term projects',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Outsourcely',
          logo: 'https://example.com/outsourcely-logo.png',
          website: 'https://outsourcely.com',
          rating: 4.4
        },
        offer: {
          type: 'other',
          value: 'Remote Teams',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://outsourcely.com/affiliate-pending',
        trackingCode: 'OUTSOURCELY_REMOTE_TEAMS',
        commission: 60,
        tags: ['outsourcely', 'remote teams', 'long-term hiring', 'dedicated staff', 'virtual employees'],
        features: [
          { name: 'Long-term Focus', description: 'Platform designed for ongoing remote work relationships', isHighlight: true },
          { name: 'Team Building', description: 'Build dedicated remote teams for your business', isHighlight: true },
          { name: 'Global Talent', description: 'Access to professionals worldwide', isHighlight: false }
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
          title: 'Outsourcely - Long-term Remote Staff Platform',
          description: 'Build dedicated remote teams on Outsourcely. Long-term remote employees for your business needs.',
          keywords: ['Outsourcely', 'remote teams', 'long-term hiring', 'dedicated staff', 'virtual employees']
        }
      },
      {
        title: 'Guru.com - Professional Freelance Network',
        slug: 'guru-com-professional-freelance-network',
        description: 'Connect with professional freelancers on Guru.com. Flexible work arrangements with WorkRooms collaboration tools and secure payments.',
        shortDescription: 'Professional freelance network with collaboration tools',
        category: businessResourcesCategory._id,
        brand: {
          name: 'Guru.com',
          logo: 'https://example.com/guru-logo.png',
          website: 'https://guru.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Professional Network',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://guru.com/affiliate-pending',
        trackingCode: 'GURU_COM_PROFESSIONAL_NETWORK',
        commission: 85,
        tags: ['guru.com', 'professional freelancers', 'workrooms', 'collaboration', 'flexible payments'],
        features: [
          { name: 'WorkRooms', description: 'Dedicated collaboration spaces for projects', isHighlight: true },
          { name: 'Flexible Payments', description: 'Multiple payment options and schedules', isHighlight: true },
          { name: 'Professional Network', description: 'Established network of quality freelancers', isHighlight: false }
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
          title: 'Guru.com - Professional Freelance Network',
          description: 'Connect with professional freelancers on Guru.com. WorkRooms collaboration and flexible payment options.',
          keywords: ['Guru.com', 'professional freelancers', 'WorkRooms', 'collaboration', 'flexible payments']
        }
      },

      // SAAS DEALS
      {
        title: 'HubSpot - All-in-One Marketing Platform',
        slug: 'hubspot-all-in-one-marketing-platform',
        description: 'HubSpot offers powerful CRM, marketing, sales, and service software. Grow your business with integrated tools and automation.',
        shortDescription: 'All-in-one CRM and marketing automation platform',
        category: saasCategory._id,
        brand: {
          name: 'HubSpot',
          logo: 'https://example.com/hubspot-logo.png',
          website: 'https://hubspot.com',
          rating: 4.9
        },
        offer: {
          type: 'other',
          value: 'Free CRM + Premium Tools',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://hubspot.com/affiliate-pending',
        trackingCode: 'HUBSPOT_MARKETING_PLATFORM',
        commission: 100,
        tags: ['hubspot', 'crm', 'marketing automation', 'sales tools', 'all-in-one platform'],
        features: [
          { name: 'Free CRM', description: 'Powerful CRM with unlimited users and contacts', isHighlight: true },
          { name: 'Marketing Automation', description: 'Advanced email marketing and automation', isHighlight: true },
          { name: 'Integrated Platform', description: 'All tools work seamlessly together', isHighlight: false }
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
          title: 'HubSpot All-in-One Marketing & CRM Platform',
          description: 'Grow your business with HubSpot\'s integrated CRM, marketing, sales, and service tools. Free CRM available.',
          keywords: ['HubSpot', 'CRM', 'marketing automation', 'sales tools', 'all-in-one platform']
        }
      },
      {
        title: 'Semrush - SEO & Digital Marketing Toolkit',
        slug: 'semrush-seo-digital-marketing-toolkit',
        description: 'Semrush is the ultimate SEO and digital marketing toolkit. Keyword research, competitor analysis, and content optimization in one platform.',
        shortDescription: 'Complete SEO and digital marketing toolkit',
        category: saasCategory._id,
        brand: {
          name: 'Semrush',
          logo: 'https://example.com/semrush-logo.png',
          website: 'https://semrush.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'SEO & Marketing Tools',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://semrush.com/affiliate-pending',
        trackingCode: 'SEMRUSH_SEO_TOOLKIT',
        commission: 150,
        tags: ['semrush', 'seo tools', 'keyword research', 'competitor analysis', 'digital marketing'],
        features: [
          { name: 'Keyword Research', description: 'Advanced keyword research and tracking', isHighlight: true },
          { name: 'Competitor Analysis', description: 'Spy on competitors\' SEO strategies', isHighlight: true },
          { name: 'Content Optimization', description: 'Optimize content for better rankings', isHighlight: false }
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
          title: 'Semrush SEO & Digital Marketing Toolkit',
          description: 'Master SEO and digital marketing with Semrush. Keyword research, competitor analysis, and content optimization tools.',
          keywords: ['Semrush', 'SEO tools', 'keyword research', 'competitor analysis', 'digital marketing']
        }
      },
      {
        title: 'Moosend - Email Marketing Automation',
        slug: 'moosend-email-marketing-automation',
        description: 'Moosend provides powerful email marketing automation with advanced segmentation, personalization, and analytics to grow your business.',
        shortDescription: 'Advanced email marketing automation platform',
        category: saasCategory._id,
        brand: {
          name: 'Moosend',
          logo: 'https://example.com/moosend-logo.png',
          website: 'https://moosend.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Email Marketing',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://moosend.com/affiliate-pending',
        trackingCode: 'MOOSEND_EMAIL_MARKETING',
        commission: 75,
        tags: ['moosend', 'email marketing', 'marketing automation', 'segmentation', 'analytics'],
        features: [
          { name: 'Advanced Automation', description: 'Sophisticated email automation workflows', isHighlight: true },
          { name: 'Smart Segmentation', description: 'Target audiences with precision', isHighlight: true },
          { name: 'Detailed Analytics', description: 'Comprehensive campaign performance insights', isHighlight: false }
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
          title: 'Moosend Email Marketing Automation Platform',
          description: 'Grow your business with Moosend\'s advanced email marketing automation. Smart segmentation and detailed analytics.',
          keywords: ['Moosend', 'email marketing', 'marketing automation', 'segmentation', 'analytics']
        }
      },
      {
        title: 'Omnisend - Ecommerce Marketing Automation',
        slug: 'omnisend-ecommerce-marketing-automation',
        description: 'Omnisend is the ecommerce marketing automation platform. Email, SMS, and push notifications unified for online stores.',
        shortDescription: 'Ecommerce marketing automation with email, SMS, and push',
        category: saasCategory._id,
        brand: {
          name: 'Omnisend',
          logo: 'https://example.com/omnisend-logo.png',
          website: 'https://omnisend.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Ecommerce Marketing',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://omnisend.com/affiliate-pending',
        trackingCode: 'OMNISEND_ECOMMERCE_MARKETING',
        commission: 80,
        tags: ['omnisend', 'ecommerce marketing', 'email marketing', 'sms marketing', 'push notifications'],
        features: [
          { name: 'Multi-Channel Marketing', description: 'Email, SMS, and push in one platform', isHighlight: true },
          { name: 'Ecommerce Integration', description: 'Built specifically for online stores', isHighlight: true },
          { name: 'Advanced Automation', description: 'Sophisticated ecommerce workflows', isHighlight: false }
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
          title: 'Omnisend Ecommerce Marketing Automation Platform',
          description: 'Boost your ecommerce sales with Omnisend. Email, SMS, and push notifications unified for online stores.',
          keywords: ['Omnisend', 'ecommerce marketing', 'email marketing', 'SMS marketing', 'push notifications']
        }
      },
      {
        title: 'Brand24 - Social Media Monitoring Tool',
        slug: 'brand24-social-media-monitoring-tool',
        description: 'Brand24 monitors your brand mentions across social media, news, blogs, and forums. Protect your reputation and engage with customers.',
        shortDescription: 'Advanced social media monitoring and brand tracking',
        category: saasCategory._id,
        brand: {
          name: 'Brand24',
          logo: 'https://example.com/brand24-logo.png',
          website: 'https://brand24.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Brand Monitoring',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://brand24.com/affiliate-pending',
        trackingCode: 'BRAND24_SOCIAL_MONITORING',
        commission: 60,
        tags: ['brand24', 'brand monitoring', 'social media monitoring', 'reputation management', 'sentiment analysis'],
        features: [
          { name: 'Real-Time Monitoring', description: 'Track brand mentions as they happen', isHighlight: true },
          { name: 'Sentiment Analysis', description: 'Understand how people feel about your brand', isHighlight: true },
          { name: 'Competitor Tracking', description: 'Monitor competitors\' online presence', isHighlight: false }
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
          title: 'Brand24 Social Media Monitoring & Brand Tracking Tool',
          description: 'Monitor your brand mentions with Brand24. Real-time tracking across social media, news, and forums.',
          keywords: ['Brand24', 'brand monitoring', 'social media monitoring', 'reputation management', 'sentiment analysis']
        }
      },
      {
        title: 'Insightful - Employee Productivity Analytics',
        slug: 'insightful-employee-productivity-analytics',
        description: 'Insightful provides employee productivity analytics and time tracking. Optimize team performance with data-driven insights.',
        shortDescription: 'Employee productivity analytics and time tracking',
        category: saasCategory._id,
        brand: {
          name: 'Insightful',
          logo: 'https://example.com/insightful-logo.png',
          website: 'https://insightful.io',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Productivity Analytics',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://insightful.io/affiliate-pending',
        trackingCode: 'INSIGHTFUL_PRODUCTIVITY_ANALYTICS',
        commission: 70,
        tags: ['insightful', 'productivity analytics', 'time tracking', 'employee monitoring', 'team performance'],
        features: [
          { name: 'Productivity Analytics', description: 'Comprehensive employee productivity insights', isHighlight: true },
          { name: 'Time Tracking', description: 'Accurate time tracking and reporting', isHighlight: true },
          { name: 'Team Optimization', description: 'Optimize team performance with data', isHighlight: false }
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
          title: 'Insightful Employee Productivity Analytics & Time Tracking',
          description: 'Optimize team performance with Insightful\'s productivity analytics and time tracking solutions.',
          keywords: ['Insightful', 'productivity analytics', 'time tracking', 'employee monitoring', 'team performance']
        }
      },
      {
        title: '10Web - AI-Powered WordPress Platform',
        slug: '10web-ai-powered-wordpress-platform',
        description: '10Web provides AI-powered WordPress hosting, website builder, and optimization tools. Build and manage WordPress sites with AI assistance.',
        shortDescription: 'AI-powered WordPress hosting and website builder',
        category: saasCategory._id,
        brand: {
          name: '10Web',
          logo: 'https://example.com/10web-logo.png',
          website: 'https://10web.io',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'AI WordPress Tools',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://10web.io/affiliate-pending',
        trackingCode: '10WEB_AI_WORDPRESS',
        commission: 85,
        tags: ['10web', 'ai wordpress', 'website builder', 'wordpress hosting', 'ai optimization'],
        features: [
          { name: 'AI Website Builder', description: 'Create WordPress sites with AI assistance', isHighlight: true },
          { name: 'Smart Hosting', description: 'AI-optimized WordPress hosting', isHighlight: true },
          { name: 'Performance Optimization', description: 'AI-powered site speed optimization', isHighlight: false }
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
          title: '10Web AI-Powered WordPress Platform & Hosting',
          description: 'Build and optimize WordPress sites with 10Web\'s AI-powered platform. Smart hosting and website builder.',
          keywords: ['10Web', 'AI WordPress', 'website builder', 'WordPress hosting', 'AI optimization']
        }
      },
      {
        title: 'Saleshandy - Email Outreach & Automation',
        slug: 'saleshandy-email-outreach-automation',
        description: 'Saleshandy provides powerful email outreach and automation tools. Scale your cold email campaigns with advanced features.',
        shortDescription: 'Advanced email outreach and automation platform',
        category: saasCategory._id,
        brand: {
          name: 'Saleshandy',
          logo: 'https://example.com/saleshandy-logo.png',
          website: 'https://saleshandy.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Email Outreach',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://saleshandy.com/affiliate-pending',
        trackingCode: 'SALESHANDY_EMAIL_OUTREACH',
        commission: 55,
        tags: ['saleshandy', 'email outreach', 'cold email', 'email automation', 'sales prospecting'],
        features: [
          { name: 'Cold Email Campaigns', description: 'Scale your cold email outreach efforts', isHighlight: true },
          { name: 'Advanced Automation', description: 'Sophisticated email automation sequences', isHighlight: true },
          { name: 'Deliverability Focus', description: 'Optimize for high email deliverability', isHighlight: false }
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
          title: 'Saleshandy Email Outreach & Automation Platform',
          description: 'Scale your email outreach with Saleshandy\'s advanced cold email and automation tools.',
          keywords: ['Saleshandy', 'email outreach', 'cold email', 'email automation', 'sales prospecting']
        }
      },
      {
        title: 'Thinkific - Online Course Creation Platform',
        slug: 'thinkific-online-course-creation-platform',
        description: 'Thinkific helps you create, market, and sell online courses. Build your education business with powerful course creation tools.',
        shortDescription: 'Complete online course creation and selling platform',
        category: saasCategory._id,
        brand: {
          name: 'Thinkific',
          logo: 'https://example.com/thinkific-logo.png',
          website: 'https://thinkific.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Course Creation',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://thinkific.com/affiliate-pending',
        trackingCode: 'THINKIFIC_COURSE_CREATION',
        commission: 90,
        tags: ['thinkific', 'online courses', 'course creation', 'education platform', 'e-learning'],
        features: [
          { name: 'Course Builder', description: 'Intuitive drag-and-drop course builder', isHighlight: true },
          { name: 'Marketing Tools', description: 'Built-in marketing and sales features', isHighlight: true },
          { name: 'Student Management', description: 'Comprehensive student management system', isHighlight: false }
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
          title: 'Thinkific Online Course Creation Platform',
          description: 'Create and sell online courses with Thinkific. Complete platform for building your education business.',
          keywords: ['Thinkific', 'online courses', 'course creation', 'education platform', 'e-learning']
        }
      },
      {
        title: 'Social Champ - Social Media Management Tool',
        slug: 'social-champ-social-media-management-tool',
        description: 'Social Champ simplifies social media management with scheduling, analytics, and team collaboration features across all platforms.',
        shortDescription: 'Complete social media management and scheduling tool',
        category: saasCategory._id,
        brand: {
          name: 'Social Champ',
          logo: 'https://example.com/socialchamp-logo.png',
          website: 'https://socialchamp.io',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Social Media Management',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://socialchamp.io/affiliate-pending',
        trackingCode: 'SOCIALCHAMP_SOCIAL_MANAGEMENT',
        commission: 65,
        tags: ['social champ', 'social media management', 'content scheduling', 'social media analytics', 'team collaboration'],
        features: [
          { name: 'Multi-Platform Scheduling', description: 'Schedule content across all social platforms', isHighlight: true },
          { name: 'Team Collaboration', description: 'Collaborate with team members efficiently', isHighlight: true },
          { name: 'Detailed Analytics', description: 'Comprehensive social media analytics', isHighlight: false }
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
          title: 'Social Champ - Social Media Management & Scheduling Tool',
          description: 'Manage all your social media with Social Champ. Scheduling, analytics, and team collaboration in one platform.',
          keywords: ['Social Champ', 'social media management', 'content scheduling', 'social media analytics', 'team collaboration']
        }
      },
      {
        title: 'Snov.io - Email Finder & Outreach Platform',
        slug: 'snov-io-email-finder-outreach-platform',
        description: 'Snov.io helps you find email addresses, verify them, and run effective outreach campaigns. Complete sales prospecting solution.',
        shortDescription: 'Email finder and outreach automation platform',
        category: saasCategory._id,
        brand: {
          name: 'Snov.io',
          logo: 'https://example.com/snov-logo.png',
          website: 'https://snov.io',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Email Finding & Outreach',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://snov.io/affiliate-pending',
        trackingCode: 'SNOV_EMAIL_FINDER_OUTREACH',
        commission: 75,
        tags: ['snov.io', 'email finder', 'email verification', 'outreach automation', 'sales prospecting'],
        features: [
          { name: 'Email Finder', description: 'Find email addresses from any website', isHighlight: true },
          { name: 'Email Verification', description: 'Verify email addresses for deliverability', isHighlight: true },
          { name: 'Outreach Automation', description: 'Automate your email outreach campaigns', isHighlight: false }
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
          title: 'Snov.io Email Finder & Outreach Automation Platform',
          description: 'Find emails and automate outreach with Snov.io. Complete sales prospecting and email verification solution.',
          keywords: ['Snov.io', 'email finder', 'email verification', 'outreach automation', 'sales prospecting']
        }
      },

      // SPORTS BETTING DEALS
      {
        title: 'Betway - Premier Sports Betting Platform',
        slug: 'betway-premier-sports-betting-platform',
        description: 'Bet on sports with Betway, one of the world\'s leading online sportsbooks. Competitive odds, live betting, and extensive sports coverage.',
        shortDescription: 'Premier sportsbook with competitive odds and live betting',
        category: bettingCategory._id,
        brand: {
          name: 'Betway',
          logo: 'https://example.com/betway-logo.png',
          website: 'https://betway.com',
          rating: 4.8
        },
        offer: {
          type: 'bonus',
          value: 'Welcome Bonus',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://betway.com/affiliate-pending',
        trackingCode: 'BETWAY_SPORTS_BETTING',
        commission: 40,
        tags: ['betway', 'sports betting', 'live betting', 'competitive odds', 'premier sportsbook'],
        features: [
          { name: 'Live Betting', description: 'In-play betting with real-time odds', isHighlight: true },
          { name: 'Competitive Odds', description: 'Best odds in the market', isHighlight: true },
          { name: 'Extensive Sports', description: 'Wide range of sports and markets', isHighlight: false }
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
          title: 'Betway Sports Betting - Premier Online Sportsbook',
          description: 'Bet on sports with Betway. Competitive odds, live betting, and extensive sports coverage.',
          keywords: ['Betway', 'sports betting', 'online sportsbook', 'live betting', 'competitive odds']
        }
      },
      {
        title: 'Bet365 - World\'s Leading Sports Betting Site',
        slug: 'bet365-worlds-leading-sports-betting-site',
        description: 'Join Bet365, the world\'s favorite online sports betting company. Live streaming, in-play betting, and comprehensive sports coverage.',
        shortDescription: 'World\'s leading sportsbook with live streaming and in-play betting',
        category: bettingCategory._id,
        brand: {
          name: 'Bet365',
          logo: 'https://example.com/bet365-logo.png',
          website: 'https://bet365.com',
          rating: 4.9
        },
        offer: {
          type: 'bonus',
          value: 'New Customer Bonus',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://bet365.com/affiliate-pending',
        trackingCode: 'BET365_SPORTS_BETTING',
        commission: 35,
        tags: ['bet365', 'sports betting', 'live streaming', 'in-play betting', 'leading sportsbook'],
        features: [
          { name: 'Live Streaming', description: 'Watch games while you bet', isHighlight: true },
          { name: 'In-Play Betting', description: 'Extensive live betting markets', isHighlight: true },
          { name: 'Global Coverage', description: 'Sports from around the world', isHighlight: false }
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
          title: 'Bet365 Sports Betting - World\'s Leading Online Sportsbook',
          description: 'Join Bet365 for sports betting with live streaming and in-play betting. World\'s favorite sportsbook.',
          keywords: ['Bet365', 'sports betting', 'live streaming', 'in-play betting', 'online sportsbook']
        }
      },
      {
        title: '1xBet - Global Sports Betting & Casino',
        slug: '1xbet-global-sports-betting-casino',
        description: 'Experience 1xBet\'s comprehensive sports betting and casino platform. High odds, extensive markets, and exciting casino games.',
        shortDescription: 'Global betting platform with sports betting and casino games',
        category: bettingCategory._id,
        brand: {
          name: '1xBet',
          logo: 'https://example.com/1xbet-logo.png',
          website: 'https://1xbet.com',
          rating: 4.6
        },
        offer: {
          type: 'bonus',
          value: 'Welcome Package',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://1xbet.com/affiliate-pending',
        trackingCode: '1XBET_SPORTS_BETTING',
        commission: 45,
        tags: ['1xbet', 'sports betting', 'casino', 'high odds', 'global platform'],
        features: [
          { name: 'High Odds', description: 'Competitive odds across all sports', isHighlight: true },
          { name: 'Extensive Markets', description: 'Thousands of betting markets', isHighlight: true },
          { name: 'Casino Games', description: 'Full casino gaming experience', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: '1xBet Sports Betting & Casino - Global Gaming Platform',
          description: 'Bet on sports and play casino games at 1xBet. High odds, extensive markets, and exciting games.',
          keywords: ['1xBet', 'sports betting', 'casino', 'high odds', 'global platform']
        }
      },
      {
        title: 'Melbet - Comprehensive Betting Experience',
        slug: 'melbet-comprehensive-betting-experience',
        description: 'Discover Melbet\'s comprehensive betting platform with sports betting, casino games, and esports. Attractive bonuses and wide payment options.',
        shortDescription: 'Comprehensive betting platform with sports, casino, and esports',
        category: bettingCategory._id,
        brand: {
          name: 'Melbet',
          logo: 'https://example.com/melbet-logo.png',
          website: 'https://melbet.com',
          rating: 4.5
        },
        offer: {
          type: 'bonus',
          value: 'Multi-Bonus Package',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://melbet.com/affiliate-pending',
        trackingCode: 'MELBET_COMPREHENSIVE_BETTING',
        commission: 40,
        tags: ['melbet', 'sports betting', 'casino', 'esports', 'comprehensive platform'],
        features: [
          { name: 'Multi-Platform', description: 'Sports, casino, and esports betting', isHighlight: true },
          { name: 'Attractive Bonuses', description: 'Generous welcome and reload bonuses', isHighlight: true },
          { name: 'Payment Options', description: 'Wide range of deposit methods', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Melbet Sports Betting & Casino - Comprehensive Gaming',
          description: 'Bet on sports, play casino games, and bet on esports at Melbet. Attractive bonuses and wide payment options.',
          keywords: ['Melbet', 'sports betting', 'casino', 'esports', 'comprehensive betting']
        }
      },
      {
        title: 'BetMGM - Premium US Sports Betting',
        slug: 'betmgm-premium-us-sports-betting',
        description: 'Experience premium sports betting with BetMGM. Legal US sportsbook with exclusive promotions, live betting, and professional-grade platform.',
        shortDescription: 'Premium US sportsbook with exclusive promotions and live betting',
        category: bettingCategory._id,
        brand: {
          name: 'BetMGM',
          logo: 'https://example.com/betmgm-logo.png',
          website: 'https://betmgm.com',
          rating: 4.7
        },
        offer: {
          type: 'bonus',
          value: 'Risk-Free Bet',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://betmgm.com/affiliate-pending',
        trackingCode: 'BETMGM_PREMIUM_SPORTS',
        commission: 30,
        tags: ['betmgm', 'us sports betting', 'legal sportsbook', 'premium platform', 'live betting'],
        features: [
          { name: 'Legal US Betting', description: 'Licensed and regulated in multiple states', isHighlight: true },
          { name: 'Exclusive Promotions', description: 'Unique offers and bonuses', isHighlight: true },
          { name: 'Premium Platform', description: 'Professional-grade betting interface', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'BetMGM Sports Betting - Premium US Sportsbook',
          description: 'Bet on sports legally in the US with BetMGM. Premium platform with exclusive promotions.',
          keywords: ['BetMGM', 'US sports betting', 'legal sportsbook', 'premium betting', 'live betting']
        }
      },
      {
        title: 'Betsafe - Safe & Secure Sports Betting',
        slug: 'betsafe-safe-secure-sports-betting',
        description: 'Bet safely with Betsafe, a trusted European sportsbook. Licensed platform with competitive odds, live betting, and excellent customer support.',
        shortDescription: 'Trusted European sportsbook with safe and secure betting',
        category: bettingCategory._id,
        brand: {
          name: 'Betsafe',
          logo: 'https://example.com/betsafe-logo.png',
          website: 'https://betsafe.com',
          rating: 4.6
        },
        offer: {
          type: 'bonus',
          value: 'Welcome Offer',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'EUR'
        },
        affiliateLink: 'https://betsafe.com/affiliate-pending',
        trackingCode: 'BETSAFE_SECURE_BETTING',
        commission: 35,
        tags: ['betsafe', 'safe betting', 'european sportsbook', 'licensed platform', 'customer support'],
        features: [
          { name: 'Licensed Platform', description: 'Fully licensed and regulated', isHighlight: true },
          { name: 'Safe Betting', description: 'Secure and responsible gambling', isHighlight: true },
          { name: 'Expert Support', description: '24/7 customer assistance', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Betsafe Sports Betting - Safe & Secure European Sportsbook',
          description: 'Bet safely with Betsafe. Licensed European sportsbook with competitive odds and excellent support.',
          keywords: ['Betsafe', 'safe betting', 'european sportsbook', 'licensed betting', 'secure platform']
        }
      },
      {
        title: 'BetVictor - Established Sports Betting Brand',
        slug: 'betvictor-established-sports-betting-brand',
        description: 'Join BetVictor, an established sports betting brand with decades of experience. Premium odds, live betting, and comprehensive sports coverage.',
        shortDescription: 'Established betting brand with premium odds and extensive coverage',
        category: bettingCategory._id,
        brand: {
          name: 'BetVictor',
          logo: 'https://example.com/betvictor-logo.png',
          website: 'https://betvictor.com',
          rating: 4.7
        },
        offer: {
          type: 'bonus',
          value: 'New Customer Offer',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'GBP'
        },
        affiliateLink: 'https://betvictor.com/affiliate-pending',
        trackingCode: 'BETVICTOR_ESTABLISHED_BRAND',
        commission: 35,
        tags: ['betvictor', 'established brand', 'premium odds', 'sports coverage', 'live betting'],
        features: [
          { name: 'Established Brand', description: 'Decades of betting industry experience', isHighlight: true },
          { name: 'Premium Odds', description: 'Competitive and attractive odds', isHighlight: true },
          { name: 'Sports Coverage', description: 'Comprehensive global sports markets', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'BetVictor Sports Betting - Established Premium Sportsbook',
          description: 'Bet with BetVictor, an established sports betting brand. Premium odds and comprehensive coverage.',
          keywords: ['BetVictor', 'established sportsbook', 'premium odds', 'sports betting', 'live betting']
        }
      },
      {
        title: 'Betfair - Betting Exchange & Sportsbook',
        slug: 'betfair-betting-exchange-sportsbook',
        description: 'Experience Betfair\'s unique betting exchange alongside traditional sportsbook. Better odds, lay betting, and innovative trading features.',
        shortDescription: 'Unique betting exchange with better odds and lay betting options',
        category: bettingCategory._id,
        brand: {
          name: 'Betfair',
          logo: 'https://example.com/betfair-logo.png',
          website: 'https://betfair.com',
          rating: 4.8
        },
        offer: {
          type: 'bonus',
          value: 'Exchange Bonus',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'GBP'
        },
        affiliateLink: 'https://betfair.com/affiliate-pending',
        trackingCode: 'BETFAIR_BETTING_EXCHANGE',
        commission: 40,
        tags: ['betfair', 'betting exchange', 'lay betting', 'better odds', 'trading features'],
        features: [
          { name: 'Betting Exchange', description: 'Unique peer-to-peer betting platform', isHighlight: true },
          { name: 'Better Odds', description: 'Often better odds than traditional sportsbooks', isHighlight: true },
          { name: 'Lay Betting', description: 'Bet against outcomes', isHighlight: false }
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
          title: 'Betfair Betting Exchange & Sportsbook - Better Odds',
          description: 'Bet on Betfair\'s exchange for better odds. Unique platform with lay betting and trading features.',
          keywords: ['Betfair', 'betting exchange', 'better odds', 'lay betting', 'trading platform']
        }
      },
      {
        title: 'Stake.com - Crypto Sports Betting Platform',
        slug: 'stake-crypto-sports-betting-platform',
        description: 'Bet with cryptocurrency on Stake.com. Anonymous betting, instant transactions, and provably fair games with extensive sports coverage.',
        shortDescription: 'Crypto sportsbook with anonymous betting and instant transactions',
        category: bettingCategory._id,
        brand: {
          name: 'Stake.com',
          logo: 'https://example.com/stake-logo.png',
          website: 'https://stake.com',
          rating: 4.5
        },
        offer: {
          type: 'bonus',
          value: 'Crypto Welcome Bonus',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'BTC'
        },
        affiliateLink: 'https://stake.com/affiliate-pending',
        trackingCode: 'STAKE_CRYPTO_BETTING',
        commission: 50,
        tags: ['stake', 'crypto betting', 'anonymous betting', 'instant transactions', 'provably fair'],
        features: [
          { name: 'Crypto Betting', description: 'Bet with Bitcoin and other cryptocurrencies', isHighlight: true },
          { name: 'Anonymous Betting', description: 'No KYC required for crypto users', isHighlight: true },
          { name: 'Instant Transactions', description: 'Quick deposits and withdrawals', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'Stake.com Crypto Sports Betting - Anonymous & Instant',
          description: 'Bet with crypto on Stake.com. Anonymous betting with instant transactions and provably fair games.',
          keywords: ['Stake', 'crypto betting', 'anonymous betting', 'instant transactions', 'bitcoin betting']
        }
      },
      {
        title: 'BetWinner - Multi-Sport Betting Platform',
        slug: 'betwinner-multi-sport-betting-platform',
        description: 'Explore BetWinner\'s extensive multi-sport betting platform. High odds, live streaming, casino games, and comprehensive sports markets.',
        shortDescription: 'Multi-sport platform with high odds and live streaming',
        category: bettingCategory._id,
        brand: {
          name: 'BetWinner',
          logo: 'https://example.com/betwinner-logo.png',
          website: 'https://betwinner.com',
          rating: 4.4
        },
        offer: {
          type: 'bonus',
          value: 'Multi-Sport Bonus',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://betwinner.com/affiliate-pending',
        trackingCode: 'BETWINNER_MULTI_SPORT',
        commission: 45,
        tags: ['betwinner', 'multi-sport betting', 'high odds', 'live streaming', 'comprehensive markets'],
        features: [
          { name: 'Multi-Sport Platform', description: 'Extensive sports and betting markets', isHighlight: true },
          { name: 'High Odds', description: 'Competitive odds across all sports', isHighlight: true },
          { name: 'Live Streaming', description: 'Watch games while betting', isHighlight: false }
        ],
        availability: {
          startDate: new Date(),
          isLimited: false
        },
        status: 'active',
        isFeatured: true,
        priority: 4,
        createdBy: adminUser._id,
        seoMeta: {
          title: 'BetWinner Multi-Sport Betting Platform - High Odds',
          description: 'Bet on multiple sports at BetWinner. High odds, live streaming, and comprehensive markets.',
          keywords: ['BetWinner', 'multi-sport betting', 'high odds', 'live streaming', 'sports markets']
        }
      },

      // WEB HOSTING AND DOMAIN PROVIDERS
      {
        title: 'EuroDNS - European Domain & Hosting Solutions',
        slug: 'eurodns-european-domain-hosting-solutions',
        description: 'EuroDNS offers premium European domain registration and hosting solutions. Trusted by businesses across Europe for reliable domain management.',
        shortDescription: 'Premium European domain registration and hosting solutions',
        category: hostingCategory._id,
        brand: {
          name: 'EuroDNS',
          logo: 'https://example.com/eurodns-logo.png',
          website: 'https://eurodns.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Domain & Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'EUR'
        },
        affiliateLink: 'https://eurodns.com/affiliate-pending',
        trackingCode: 'EURODNS_DOMAIN_HOSTING',
        commission: 50,
        tags: ['eurodns', 'domain registration', 'european hosting', 'premium domains', 'business solutions'],
        features: [
          { name: 'European Focus', description: 'Specialized in European domains and hosting', isHighlight: true },
          { name: 'Premium Service', description: 'High-quality domain and hosting solutions', isHighlight: true },
          { name: 'Business Solutions', description: 'Enterprise-grade domain management', isHighlight: false }
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
          title: 'EuroDNS European Domain Registration & Hosting Solutions',
          description: 'Premium European domain registration and hosting with EuroDNS. Trusted business solutions.',
          keywords: ['EuroDNS', 'domain registration', 'european hosting', 'premium domains', 'business solutions']
        }
      },
      {
        title: 'Dynadot - Domain Registration & Web Services',
        slug: 'dynadot-domain-registration-web-services',
        description: 'Dynadot provides affordable domain registration, web hosting, and website building tools. Simple domain management with competitive pricing.',
        shortDescription: 'Affordable domain registration and web hosting services',
        category: hostingCategory._id,
        brand: {
          name: 'Dynadot',
          logo: 'https://example.com/dynadot-logo.png',
          website: 'https://dynadot.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Domain & Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://dynadot.com/affiliate-pending',
        trackingCode: 'DYNADOT_DOMAIN_WEB',
        commission: 40,
        tags: ['dynadot', 'domain registration', 'web hosting', 'affordable', 'website building'],
        features: [
          { name: 'Competitive Pricing', description: 'Affordable domain and hosting rates', isHighlight: true },
          { name: 'Easy Management', description: 'Simple domain management interface', isHighlight: true },
          { name: 'Website Builder', description: 'Integrated website building tools', isHighlight: false }
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
          title: 'Dynadot Domain Registration & Web Hosting Services',
          description: 'Affordable domain registration and web hosting with Dynadot. Simple management and competitive pricing.',
          keywords: ['Dynadot', 'domain registration', 'web hosting', 'affordable', 'website building']
        }
      },
      {
        title: 'Domain.com - Premium Domain & Hosting Provider',
        slug: 'domain-com-premium-domain-hosting-provider',
        description: 'Domain.com offers premium domain registration and web hosting services. Professional hosting solutions with excellent customer support.',
        shortDescription: 'Premium domain registration and professional hosting services',
        category: hostingCategory._id,
        brand: {
          name: 'Domain.com',
          logo: 'https://example.com/domain-com-logo.png',
          website: 'https://domain.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Premium Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://domain.com/affiliate-pending',
        trackingCode: 'DOMAIN_COM_PREMIUM',
        commission: 60,
        tags: ['domain.com', 'premium domains', 'professional hosting', 'customer support', 'business hosting'],
        features: [
          { name: 'Premium Service', description: 'High-quality domain and hosting solutions', isHighlight: true },
          { name: 'Professional Support', description: 'Expert customer support team', isHighlight: true },
          { name: 'Business Solutions', description: 'Enterprise-ready hosting packages', isHighlight: false }
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
          title: 'Domain.com Premium Domain Registration & Hosting',
          description: 'Premium domain registration and professional hosting services with Domain.com. Expert support included.',
          keywords: ['Domain.com', 'premium domains', 'professional hosting', 'customer support', 'business hosting']
        }
      },
      {
        title: 'Network Solutions - Enterprise Domain & Hosting',
        slug: 'network-solutions-enterprise-domain-hosting',
        description: 'Network Solutions provides enterprise-grade domain registration and hosting services. Trusted by businesses for over 30 years.',
        shortDescription: 'Enterprise-grade domain registration and hosting services',
        category: hostingCategory._id,
        brand: {
          name: 'Network Solutions',
          logo: 'https://example.com/networksolutions-logo.png',
          website: 'https://networksolutions.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Enterprise Solutions',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://networksolutions.com/affiliate-pending',
        trackingCode: 'NETWORKSOLUTIONS_ENTERPRISE',
        commission: 75,
        tags: ['network solutions', 'enterprise hosting', 'domain registration', 'business solutions', 'trusted provider'],
        features: [
          { name: 'Enterprise Grade', description: 'Professional enterprise hosting solutions', isHighlight: true },
          { name: '30+ Years Experience', description: 'Trusted provider since 1991', isHighlight: true },
          { name: 'Business Focus', description: 'Specialized in business hosting needs', isHighlight: false }
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
          title: 'Network Solutions Enterprise Domain & Hosting Services',
          description: 'Enterprise-grade domain registration and hosting with Network Solutions. 30+ years of experience.',
          keywords: ['Network Solutions', 'enterprise hosting', 'domain registration', 'business solutions', 'trusted provider']
        }
      },
      {
        title: 'SEO.Domains - SEO-Optimized Domain Solutions',
        slug: 'seo-domains-seo-optimized-domain-solutions',
        description: 'SEO.Domains specializes in SEO-friendly domain registration and hosting. Boost your search rankings with premium domain solutions.',
        shortDescription: 'SEO-optimized domain registration and hosting solutions',
        category: hostingCategory._id,
        brand: {
          name: 'SEO.Domains',
          logo: 'https://example.com/seodomains-logo.png',
          website: 'https://seo.domains',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'SEO-Optimized Domains',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://seo.domains/affiliate-pending',
        trackingCode: 'SEO_DOMAINS_OPTIMIZED',
        commission: 45,
        tags: ['seo domains', 'seo optimization', 'domain registration', 'search rankings', 'premium domains'],
        features: [
          { name: 'SEO-Optimized', description: 'Domains optimized for search engine rankings', isHighlight: true },
          { name: 'Premium Domains', description: 'High-quality domain portfolio', isHighlight: true },
          { name: 'SEO Tools', description: 'Built-in SEO optimization tools', isHighlight: false }
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
          title: 'SEO.Domains - SEO-Optimized Domain Registration & Hosting',
          description: 'Boost your search rankings with SEO-optimized domains from SEO.Domains. Premium domain solutions.',
          keywords: ['SEO.Domains', 'seo optimization', 'domain registration', 'search rankings', 'premium domains']
        }
      },
      {
        title: 'Truehost - Reliable African Web Hosting',
        slug: 'truehost-reliable-african-web-hosting',
        description: 'Truehost provides reliable web hosting services across Africa. Fast, secure hosting with local data centers and excellent support.',
        shortDescription: 'Reliable African web hosting with local data centers',
        category: hostingCategory._id,
        brand: {
          name: 'Truehost',
          logo: 'https://example.com/truehost-logo.png',
          website: 'https://truehost.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'African Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://truehost.com/affiliate-pending',
        trackingCode: 'TRUEHOST_AFRICAN_HOSTING',
        commission: 50,
        tags: ['truehost', 'african hosting', 'local data centers', 'reliable hosting', 'fast servers'],
        features: [
          { name: 'Local Data Centers', description: 'African data centers for optimal speed', isHighlight: true },
          { name: 'Reliable Service', description: 'High uptime and performance', isHighlight: true },
          { name: 'Local Support', description: 'African-based customer support', isHighlight: false }
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
          title: 'Truehost Reliable African Web Hosting Services',
          description: 'Fast and reliable web hosting across Africa with Truehost. Local data centers and excellent support.',
          keywords: ['Truehost', 'african hosting', 'local data centers', 'reliable hosting', 'fast servers']
        }
      },
      {
        title: 'KenyaWebExperts - Kenyan Web Hosting Specialists',
        slug: 'kenyawebexperts-kenyan-web-hosting-specialists',
        description: 'KenyaWebExperts specializes in Kenyan web hosting solutions. Local expertise with international standards for optimal website performance.',
        shortDescription: 'Kenyan web hosting specialists with local expertise',
        category: hostingCategory._id,
        brand: {
          name: 'KenyaWebExperts',
          logo: 'https://example.com/kenyawebexperts-logo.png',
          website: 'https://kenyawebexperts.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Kenyan Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'KES'
        },
        affiliateLink: 'https://kenyawebexperts.com/affiliate-pending',
        trackingCode: 'KENYAWEBEXPERTS_HOSTING',
        commission: 40,
        tags: ['kenya web experts', 'kenyan hosting', 'local expertise', 'web specialists', 'east africa'],
        features: [
          { name: 'Local Expertise', description: 'Deep understanding of Kenyan market', isHighlight: true },
          { name: 'International Standards', description: 'Global quality with local service', isHighlight: true },
          { name: 'East African Focus', description: 'Optimized for East African users', isHighlight: false }
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
          title: 'KenyaWebExperts - Kenyan Web Hosting Specialists',
          description: 'Expert Kenyan web hosting solutions with KenyaWebExperts. Local expertise meets international standards.',
          keywords: ['KenyaWebExperts', 'kenyan hosting', 'local expertise', 'web specialists', 'east africa']
        }
      },
      {
        title: 'ReliableSite - Enterprise Hosting Solutions',
        slug: 'reliablesite-enterprise-hosting-solutions',
        description: 'ReliableSite offers enterprise-grade hosting solutions with 99.9% uptime guarantee. Premium hosting for mission-critical websites.',
        shortDescription: 'Enterprise hosting with 99.9% uptime guarantee',
        category: hostingCategory._id,
        brand: {
          name: 'ReliableSite',
          logo: 'https://example.com/reliablesite-logo.png',
          website: 'https://reliablesite.net',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'Enterprise Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://reliablesite.net/affiliate-pending',
        trackingCode: 'RELIABLESITE_ENTERPRISE',
        commission: 70,
        tags: ['reliablesite', 'enterprise hosting', 'uptime guarantee', 'premium hosting', 'mission critical'],
        features: [
          { name: '99.9% Uptime', description: 'Guaranteed high availability hosting', isHighlight: true },
          { name: 'Enterprise Grade', description: 'Premium infrastructure and support', isHighlight: true },
          { name: 'Mission Critical', description: 'Hosting for critical business applications', isHighlight: false }
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
          title: 'ReliableSite Enterprise Hosting - 99.9% Uptime Guarantee',
          description: 'Enterprise-grade hosting solutions with ReliableSite. 99.9% uptime guarantee for mission-critical websites.',
          keywords: ['ReliableSite', 'enterprise hosting', 'uptime guarantee', 'premium hosting', 'mission critical']
        }
      },
      {
        title: 'Name.com - Simple Domain & Hosting Solutions',
        slug: 'name-com-simple-domain-hosting-solutions',
        description: 'Name.com provides simple and affordable domain registration and hosting solutions. User-friendly platform with excellent customer service.',
        shortDescription: 'Simple and affordable domain registration and hosting',
        category: hostingCategory._id,
        brand: {
          name: 'Name.com',
          logo: 'https://example.com/name-com-logo.png',
          website: 'https://name.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Simple Solutions',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://name.com/affiliate-pending',
        trackingCode: 'NAME_COM_SIMPLE',
        commission: 45,
        tags: ['name.com', 'simple hosting', 'affordable domains', 'user friendly', 'customer service'],
        features: [
          { name: 'User-Friendly', description: 'Simple and intuitive interface', isHighlight: true },
          { name: 'Affordable Pricing', description: 'Competitive domain and hosting rates', isHighlight: true },
          { name: 'Excellent Service', description: 'Outstanding customer support', isHighlight: false }
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
          title: 'Name.com Simple Domain Registration & Hosting Solutions',
          description: 'Simple and affordable domain registration and hosting with Name.com. User-friendly platform and excellent service.',
          keywords: ['Name.com', 'simple hosting', 'affordable domains', 'user friendly', 'customer service']
        }
      },
      {
        title: 'GoDaddy - World\'s Largest Domain Registrar',
        slug: 'godaddy-worlds-largest-domain-registrar',
        description: 'GoDaddy is the world\'s largest domain registrar offering domains, hosting, and website building tools. Trusted by millions of customers worldwide.',
        shortDescription: 'World\'s largest domain registrar with comprehensive solutions',
        category: hostingCategory._id,
        brand: {
          name: 'GoDaddy',
          logo: 'https://example.com/godaddy-logo.png',
          website: 'https://godaddy.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Domain & Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://godaddy.com/affiliate-pending',
        trackingCode: 'GODADDY_DOMAIN_HOSTING',
        commission: 55,
        tags: ['godaddy', 'domain registrar', 'web hosting', 'website builder', 'trusted provider'],
        features: [
          { name: 'Largest Registrar', description: 'World\'s #1 domain registrar', isHighlight: true },
          { name: 'Complete Solutions', description: 'Domains, hosting, and website tools', isHighlight: true },
          { name: 'Global Trust', description: 'Trusted by millions worldwide', isHighlight: false }
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
          title: 'GoDaddy Domain Registration & Web Hosting - World\'s #1',
          description: 'Register domains and get web hosting with GoDaddy, the world\'s largest domain registrar. Trusted by millions.',
          keywords: ['GoDaddy', 'domain registrar', 'web hosting', 'website builder', 'trusted provider']
        }
      },
      {
        title: 'MilesWeb - Affordable Indian Web Hosting',
        slug: 'milesweb-affordable-indian-web-hosting',
        description: 'MilesWeb provides affordable and reliable web hosting services in India. Feature-rich hosting plans with excellent customer support.',
        shortDescription: 'Affordable and reliable Indian web hosting services',
        category: hostingCategory._id,
        brand: {
          name: 'MilesWeb',
          logo: 'https://example.com/milesweb-logo.png',
          website: 'https://milesweb.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Affordable Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'INR'
        },
        affiliateLink: 'https://milesweb.com/affiliate-pending',
        trackingCode: 'MILESWEB_INDIAN_HOSTING',
        commission: 40,
        tags: ['milesweb', 'indian hosting', 'affordable hosting', 'reliable service', 'feature rich'],
        features: [
          { name: 'Affordable Plans', description: 'Budget-friendly hosting packages', isHighlight: true },
          { name: 'Indian Servers', description: 'Local servers for optimal performance', isHighlight: true },
          { name: 'Feature-Rich', description: 'Comprehensive hosting features included', isHighlight: false }
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
          title: 'MilesWeb Affordable Indian Web Hosting Services',
          description: 'Affordable and reliable web hosting in India with MilesWeb. Feature-rich plans with excellent support.',
          keywords: ['MilesWeb', 'indian hosting', 'affordable hosting', 'reliable service', 'feature rich']
        }
      },
      {
        title: 'Hostinglelo - Premium African Hosting',
        slug: 'hostinglelo-premium-african-hosting',
        description: 'Hostinglelo offers premium web hosting services across Africa. High-performance hosting with local data centers and expert support.',
        shortDescription: 'Premium African hosting with high-performance servers',
        category: hostingCategory._id,
        brand: {
          name: 'Hostinglelo',
          logo: 'https://example.com/hostinglelo-logo.png',
          website: 'https://hostinglelo.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Premium African Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://hostinglelo.com/affiliate-pending',
        trackingCode: 'HOSTINGLELO_PREMIUM_AFRICAN',
        commission: 50,
        tags: ['hostinglelo', 'african hosting', 'premium hosting', 'high performance', 'expert support'],
        features: [
          { name: 'Premium Service', description: 'High-quality African hosting solutions', isHighlight: true },
          { name: 'High Performance', description: 'Fast and reliable server infrastructure', isHighlight: true },
          { name: 'Expert Support', description: 'Professional technical support team', isHighlight: false }
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
          title: 'Hostinglelo Premium African Web Hosting Services',
          description: 'Premium web hosting across Africa with Hostinglelo. High-performance servers and expert support.',
          keywords: ['Hostinglelo', 'african hosting', 'premium hosting', 'high performance', 'expert support']
        }
      },
      {
        title: 'Hostraha - Quality Web Hosting Solutions',
        slug: 'hostraha-quality-web-hosting-solutions',
        description: 'Hostraha provides quality web hosting solutions with excellent performance and customer service. Reliable hosting for all website needs.',
        shortDescription: 'Quality web hosting with excellent performance and service',
        category: hostingCategory._id,
        brand: {
          name: 'Hostraha',
          logo: 'https://example.com/hostraha-logo.png',
          website: 'https://hostraha.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Quality Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://hostraha.com/affiliate-pending',
        trackingCode: 'HOSTRAHA_QUALITY_HOSTING',
        commission: 45,
        tags: ['hostraha', 'quality hosting', 'excellent performance', 'customer service', 'reliable hosting'],
        features: [
          { name: 'Quality Service', description: 'High-standard hosting solutions', isHighlight: true },
          { name: 'Excellent Performance', description: 'Fast and stable hosting infrastructure', isHighlight: true },
          { name: 'Great Support', description: 'Responsive customer service team', isHighlight: false }
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
          title: 'Hostraha Quality Web Hosting Solutions',
          description: 'Quality web hosting with excellent performance and customer service from Hostraha. Reliable hosting for all needs.',
          keywords: ['Hostraha', 'quality hosting', 'excellent performance', 'customer service', 'reliable hosting']
        }
      },
      {
        title: 'SiteGround - Premium WordPress Hosting',
        slug: 'siteground-premium-wordpress-hosting',
        description: 'SiteGround offers premium WordPress hosting with superior performance, security, and support. Officially recommended by WordPress.org.',
        shortDescription: 'Premium WordPress hosting with superior performance',
        category: hostingCategory._id,
        brand: {
          name: 'SiteGround',
          logo: 'https://example.com/siteground-logo.png',
          website: 'https://siteground.com',
          rating: 4.9
        },
        offer: {
          type: 'other',
          value: 'WordPress Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://siteground.com/affiliate-pending',
        trackingCode: 'SITEGROUND_WORDPRESS_HOSTING',
        commission: 65,
        tags: ['siteground', 'wordpress hosting', 'premium hosting', 'superior performance', 'wordpress recommended'],
        features: [
          { name: 'WordPress Optimized', description: 'Specially optimized for WordPress sites', isHighlight: true },
          { name: 'Superior Performance', description: 'Fastest loading WordPress hosting', isHighlight: true },
          { name: 'WordPress.org Recommended', description: 'Officially recommended by WordPress', isHighlight: false }
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
          title: 'SiteGround Premium WordPress Hosting - WordPress.org Recommended',
          description: 'Premium WordPress hosting with SiteGround. Superior performance and officially recommended by WordPress.org.',
          keywords: ['SiteGround', 'wordpress hosting', 'premium hosting', 'superior performance', 'wordpress recommended']
        }
      },
      {
        title: 'Bluehost - Best WordPress Hosting',
        slug: 'bluehost-best-wordpress-hosting',
        description: 'Bluehost is the #1 WordPress recommended hosting provider. Easy WordPress installation, reliable hosting, and 24/7 expert support.',
        shortDescription: '#1 WordPress recommended hosting with easy setup',
        category: hostingCategory._id,
        brand: {
          name: 'Bluehost',
          logo: 'https://example.com/bluehost-logo.png',
          website: 'https://bluehost.com',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'WordPress Hosting',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://bluehost.com/affiliate-pending',
        trackingCode: 'BLUEHOST_WORDPRESS_HOSTING',
        commission: 65,
        tags: ['bluehost', 'wordpress hosting', 'recommended provider', 'easy setup', 'expert support'],
        features: [
          { name: '#1 Recommended', description: 'Top WordPress.org recommended host', isHighlight: true },
          { name: 'Easy WordPress Setup', description: 'One-click WordPress installation', isHighlight: true },
          { name: '24/7 Expert Support', description: 'Round-the-clock WordPress experts', isHighlight: false }
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
          title: 'Bluehost - #1 WordPress Recommended Hosting Provider',
          description: 'Get the best WordPress hosting with Bluehost. #1 recommended by WordPress.org with easy setup and expert support.',
          keywords: ['Bluehost', 'wordpress hosting', 'recommended provider', 'easy setup', 'expert support']
        }
      },

      // ONLINE EDUCATION DEALS
      {
        title: 'Coursera - Top University Courses Online',
        slug: 'coursera-top-university-courses-online',
        description: 'Learn from top universities and companies on Coursera. Access courses from Stanford, Yale, Google, IBM, and more with certificates and degrees.',
        shortDescription: 'University-level courses from top institutions worldwide',
        category: educationCategory._id,
        brand: {
          name: 'Coursera',
          logo: 'https://example.com/coursera-logo.png',
          website: 'https://coursera.org',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'University Courses',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://coursera.org/affiliate-pending',
        trackingCode: 'COURSERA_UNIVERSITY_COURSES',
        commission: 75,
        tags: ['coursera', 'university courses', 'certificates', 'degrees', 'top institutions'],
        features: [
          { name: 'Top Universities', description: 'Courses from Stanford, Yale, and other top schools', isHighlight: true },
          { name: 'Verified Certificates', description: 'Earn certificates recognized by employers', isHighlight: true },
          { name: 'Flexible Learning', description: 'Learn at your own pace with mobile access', isHighlight: false }
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
          title: 'Coursera - University Courses Online from Top Institutions',
          description: 'Learn from top universities on Coursera. Stanford, Yale, Google, IBM courses with certificates and degrees.',
          keywords: ['Coursera', 'university courses', 'certificates', 'degrees', 'top institutions']
        }
      },
      {
        title: 'Udemy - Learn Anything Online',
        slug: 'udemy-learn-anything-online',
        description: 'Master new skills with Udemy\'s vast library of courses. Programming, business, design, marketing, and more from expert instructors.',
        shortDescription: 'Massive online course library with expert instructors',
        category: educationCategory._id,
        brand: {
          name: 'Udemy',
          logo: 'https://example.com/udemy-logo.png',
          website: 'https://udemy.com',
          rating: 4.7
        },
        offer: {
          type: 'other',
          value: 'Skills Training',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://udemy.com/affiliate-pending',
        trackingCode: 'UDEMY_ONLINE_COURSES',
        commission: 50,
        tags: ['udemy', 'online courses', 'skills training', 'expert instructors', 'programming'],
        features: [
          { name: 'Vast Course Library', description: 'Over 210,000 courses in multiple languages', isHighlight: true },
          { name: 'Expert Instructors', description: 'Learn from industry professionals', isHighlight: true },
          { name: 'Lifetime Access', description: 'Access courses anytime, anywhere', isHighlight: false }
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
          title: 'Udemy - Learn New Skills with Online Courses',
          description: 'Master new skills on Udemy. Programming, business, design courses from expert instructors with lifetime access.',
          keywords: ['Udemy', 'online courses', 'skills training', 'expert instructors', 'programming']
        }
      },
      {
        title: 'Skillshare - Creative Learning Community',
        slug: 'skillshare-creative-learning-community',
        description: 'Join Skillshare\'s creative learning community. Learn design, photography, business, and creative skills from industry experts.',
        shortDescription: 'Creative skills learning community with expert classes',
        category: educationCategory._id,
        brand: {
          name: 'Skillshare',
          logo: 'https://example.com/skillshare-logo.png',
          website: 'https://skillshare.com',
          rating: 4.6
        },
        offer: {
          type: 'other',
          value: 'Creative Skills',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://skillshare.com/affiliate-pending',
        trackingCode: 'SKILLSHARE_CREATIVE_LEARNING',
        commission: 40,
        tags: ['skillshare', 'creative skills', 'design', 'photography', 'learning community'],
        features: [
          { name: 'Creative Focus', description: 'Specialized in creative and design skills', isHighlight: true },
          { name: 'Community Learning', description: 'Interactive learning with peer feedback', isHighlight: true },
          { name: 'Hands-on Projects', description: 'Learn by creating real projects', isHighlight: false }
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
          title: 'Skillshare - Creative Learning Community & Design Courses',
          description: 'Learn creative skills on Skillshare. Design, photography, business courses with community interaction and projects.',
          keywords: ['Skillshare', 'creative skills', 'design', 'photography', 'learning community']
        }
      },
      {
        title: 'edX - University-Level Education for Everyone',
        slug: 'edx-university-level-education-everyone',
        description: 'Access high-quality education from Harvard, MIT, Berkeley, and other top universities on edX. Free courses and verified certificates available.',
        shortDescription: 'University-level education from Harvard, MIT, and top schools',
        category: educationCategory._id,
        brand: {
          name: 'edX',
          logo: 'https://example.com/edx-logo.png',
          website: 'https://edx.org',
          rating: 4.8
        },
        offer: {
          type: 'other',
          value: 'University Education',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://edx.org/affiliate-pending',
        trackingCode: 'EDX_UNIVERSITY_EDUCATION',
        commission: 60,
        tags: ['edx', 'university education', 'harvard', 'mit', 'free courses'],
        features: [
          { name: 'Top Universities', description: 'Courses from Harvard, MIT, Berkeley, and more', isHighlight: true },
          { name: 'Free Access', description: 'Many courses available completely free', isHighlight: true },
          { name: 'Verified Certificates', description: 'Earn verified certificates for career advancement', isHighlight: false }
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
          title: 'edX - University-Level Education from Harvard, MIT & Top Schools',
          description: 'Access university-level education on edX. Courses from Harvard, MIT, Berkeley with free access and verified certificates.',
          keywords: ['edX', 'university education', 'Harvard', 'MIT', 'free courses']
        }
      },
      {
        title: 'Eduonix - Affordable Tech Training',
        slug: 'eduonix-affordable-tech-training',
        description: 'Learn technology skills affordably with Eduonix. Programming, web development, data science, and IT courses at budget-friendly prices.',
        shortDescription: 'Affordable technology and programming training courses',
        category: educationCategory._id,
        brand: {
          name: 'Eduonix',
          logo: 'https://example.com/eduonix-logo.png',
          website: 'https://eduonix.com',
          rating: 4.5
        },
        offer: {
          type: 'other',
          value: 'Tech Training',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://eduonix.com/affiliate-pending',
        trackingCode: 'EDUONIX_TECH_TRAINING',
        commission: 35,
        tags: ['eduonix', 'tech training', 'programming', 'web development', 'affordable'],
        features: [
          { name: 'Affordable Pricing', description: 'Budget-friendly tech training courses', isHighlight: true },
          { name: 'Tech Focus', description: 'Specialized in programming and technology skills', isHighlight: true },
          { name: 'Practical Projects', description: 'Hands-on learning with real projects', isHighlight: false }
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
          title: 'Eduonix - Affordable Technology & Programming Training',
          description: 'Learn tech skills affordably with Eduonix. Programming, web development, data science courses at budget prices.',
          keywords: ['Eduonix', 'tech training', 'programming', 'web development', 'affordable']
        }
      },
      {
        title: 'Alison - Free Online Learning Platform',
        slug: 'alison-free-online-learning-platform',
        description: 'Learn for free with Alison\'s comprehensive online courses. Business, technology, health, language, and personal development courses available.',
        shortDescription: 'Free online learning platform with comprehensive courses',
        category: educationCategory._id,
        brand: {
          name: 'Alison',
          logo: 'https://example.com/alison-logo.png',
          website: 'https://alison.com',
          rating: 4.4
        },
        offer: {
          type: 'other',
          value: 'Free Learning',
          originalPrice: 0,
          discountedPrice: 0,
          currency: 'USD'
        },
        affiliateLink: 'https://alison.com/affiliate-pending',
        trackingCode: 'ALISON_FREE_LEARNING',
        commission: 25,
        tags: ['alison', 'free learning', 'comprehensive courses', 'business', 'technology'],
        features: [
          { name: 'Completely Free', description: 'Access thousands of courses at no cost', isHighlight: true },
          { name: 'Comprehensive Library', description: 'Courses in business, tech, health, and more', isHighlight: true },
          { name: 'Certificate Options', description: 'Earn certificates to showcase your learning', isHighlight: false }
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
          title: 'Alison - Free Online Learning Platform with Certificates',
          description: 'Learn for free with Alison. Business, technology, health, and personal development courses with certificate options.',
          keywords: ['Alison', 'free learning', 'comprehensive courses', 'business', 'technology']
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

const seedBlogPosts = async (categories) => {
  try {
    await BlogPost.deleteMany({});
    
    // Use existing admin account from Admin model
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      console.log('⚠️ No admin user found for blog posts.');
      return [];
    }
    
    const adminUser = existingAdmin;
    const forexCategory = categories.find(cat => cat.slug === 'forex');
    const cryptoCategory = categories.find(cat => cat.slug === 'crypto');
    const bettingCategory = categories.find(cat => cat.slug === 'betting');
    const saasCategory = categories.find(cat => cat.slug === 'saas');
    const hostingCategory = categories.find(cat => cat.slug === 'hosting');
    const businessResourcesCategory = categories.find(cat => cat.slug === 'business-resources');
    const educationCategory = categories.find(cat => cat.slug === 'education');
    
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
    // Clear existing newsletter subscribers
    await NewsletterSubscriber.deleteMany({});
    console.log('✅ Newsletter subscribers collection ready for real subscribers');
    return [];
  } catch (error) {
    console.error('❌ Error clearing newsletter subscribers:', error);
  }
};

const seedDatabase = async () => {
  await connectDB();
  
  console.log('🌱 Starting database seeding...');
  
  const categories = await seedCategories();
  const deals = await seedDeals(categories);
  const blogPosts = await seedBlogPosts(categories);
  const newsletterSubscribers = await seedNewsletterSubscribers();
  
  console.log('✅ Database seeding completed!');
  console.log('\n📊 Summary:');
  console.log(`Categories: ${categories?.length || 0}`);
  console.log(`Deals: ${deals?.length || 0}`);
  console.log(`Blog Posts: ${blogPosts?.length || 0}`);
  console.log(`Newsletter Subscribers: ${newsletterSubscribers?.length || 0}`);
  
  console.log('\n🔐 Your Existing Admin Accounts:');
  console.log('✅ Admin accounts preserved (no changes made)');
  
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
