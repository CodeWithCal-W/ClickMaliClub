const mongoose = require('mongoose');
const Guide = require('./models/Guide');
const Review = require('./models/Review');
require('dotenv').config();

const seedGuides = async () => {
  const guides = [
    {
      title: 'Complete Beginner\'s Guide to Forex Trading',
      slug: 'complete-beginners-guide-to-forex-trading',
      excerpt: 'Learn the fundamentals of forex trading, from understanding currency pairs to placing your first trade.',
      category: 'Forex Trading',
      difficulty: 'Beginner',
      readTime: '15 min read',
      content: {
        topics: [
          'What is Forex Trading?',
          'Understanding Currency Pairs',
          'Major, Minor, and Exotic Pairs',
          'How to Read Forex Charts',
          'Basic Trading Strategies',
          'Risk Management Principles',
          'Choosing a Forex Broker',
          'Demo Trading vs Live Trading'
        ],
        introduction: "Foreign exchange (Forex) trading is the simultaneous buying of one currency and selling of another. It's the world's largest financial market with over $6 trillion traded daily.",
        sections: [
          {
            title: "What is Forex Trading?",
            content: "Forex trading involves exchanging one currency for another at an agreed price. The forex market operates 24 hours a day, 5 days a week, making it one of the most accessible financial markets globally."
          },
          {
            title: "Understanding Currency Pairs",
            content: "Currencies are traded in pairs, such as EUR/USD or GBP/JPY. The first currency is the 'base currency' and the second is the 'quote currency'. The price tells you how much of the quote currency you need to buy one unit of the base currency."
          },
          {
            title: "Major, Minor, and Exotic Pairs",
            content: "Major pairs include the most traded currencies (EUR/USD, GBP/USD, USD/JPY). Minor pairs don't include USD but feature major currencies. Exotic pairs include emerging market currencies and typically have wider spreads."
          },
          {
            title: "How to Read Forex Charts",
            content: "Forex charts display price movements over time. Learn to read candlestick patterns, understand support and resistance levels, and identify trends to make informed trading decisions."
          },
          {
            title: "Basic Trading Strategies",
            content: "Start with simple strategies like trend following, range trading, or breakout trading. Always practice on demo accounts before risking real money."
          },
          {
            title: "Risk Management Principles",
            content: "Never risk more than 1-2% of your account on a single trade. Use stop-loss orders, diversify your trades, and maintain a disciplined approach to position sizing."
          },
          {
            title: "Choosing a Forex Broker",
            content: "Look for regulated brokers with competitive spreads, reliable execution, good customer support, and user-friendly trading platforms. Consider deposit/withdrawal methods and minimum deposit requirements."
          },
          {
            title: "Demo Trading vs Live Trading",
            content: "Start with demo accounts to practice without risk. Transition to live trading gradually, starting with small amounts to manage the psychological aspects of real money trading."
          }
        ],
        conclusion: "Forex trading requires dedication, education, and practice. Start with our recommended brokers and always trade responsibly."
      },
      featured: true,
      tags: ['forex', 'trading', 'beginner', 'currency', 'financial-markets']
    },
    {
      title: 'Cryptocurrency Trading for Beginners',
      slug: 'cryptocurrency-trading-for-beginners',
      excerpt: 'Master the basics of crypto trading, understand market volatility, and learn about different exchanges.',
      category: 'Crypto Exchange',
      difficulty: 'Beginner',
      readTime: '12 min read',
      content: {
        topics: [
          'Introduction to Cryptocurrency',
          'Understanding Blockchain Technology',
          'Popular Cryptocurrencies (Bitcoin, Ethereum, etc.)',
          'How Crypto Exchanges Work',
          'Types of Trading Orders',
          'Wallet Security Best Practices',
          'Reading Crypto Charts and Indicators',
          'Managing Risk in Volatile Markets'
        ],
        introduction: "Cryptocurrency trading has become one of the most exciting opportunities in the financial world. Learn how to navigate this dynamic market safely and profitably.",
        sections: [
          {
            title: "Introduction to Cryptocurrency",
            content: "Cryptocurrency is a digital or virtual currency secured by cryptography. Unlike traditional currencies, cryptocurrencies operate on decentralized networks based on blockchain technology."
          },
          {
            title: "Understanding Blockchain Technology",
            content: "Blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography."
          },
          {
            title: "Popular Cryptocurrencies",
            content: "Bitcoin (BTC) is the first and most well-known cryptocurrency. Ethereum (ETH) introduced smart contracts. Other popular coins include Binance Coin (BNB), Cardano (ADA), and Solana (SOL)."
          },
          {
            title: "How Crypto Exchanges Work",
            content: "Crypto exchanges are digital platforms where you can buy, sell, and trade cryptocurrencies. They act as intermediaries between buyers and sellers, providing liquidity and security."
          },
          {
            title: "Types of Trading Orders",
            content: "Market orders execute immediately at current prices. Limit orders execute only at specified prices. Stop-loss orders help limit losses by selling when prices drop to certain levels."
          },
          {
            title: "Wallet Security Best Practices",
            content: "Use hardware wallets for long-term storage. Enable two-factor authentication. Never share your private keys. Keep backup phrases in secure locations."
          },
          {
            title: "Reading Crypto Charts and Indicators",
            content: "Learn to read candlestick charts, understand support and resistance levels, and use technical indicators like RSI, MACD, and moving averages to make informed decisions."
          },
          {
            title: "Managing Risk in Volatile Markets",
            content: "Crypto markets are highly volatile. Never invest more than you can afford to lose. Diversify your portfolio and use proper position sizing techniques."
          }
        ],
        conclusion: "Cryptocurrency trading offers exciting opportunities but requires careful study and risk management. Start with small amounts and our recommended exchanges."
      },
      featured: true,
      tags: ['cryptocurrency', 'bitcoin', 'ethereum', 'trading', 'blockchain']
    }
  ];

  try {
    await Guide.deleteMany({});
    await Guide.insertMany(guides);
    console.log('✅ Guides seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding guides:', error);
  }
};

const seedReviews = async () => {
  const reviews = [
    {
      platform: 'Headway',
      category: 'Forex Trading',
      rating: 4.7,
      reviewer: 'Sarah M.',
      review: 'Amazing welcome bonus of $111! The platform is user-friendly and customer support is excellent. I\'ve been trading for 2 months now and very satisfied with the spreads and execution.',
      verified: true,
      helpful: 24,
      unhelpful: 3,
      status: 'approved'
    },
    {
      platform: 'Binance',
      category: 'Crypto Exchange',
      rating: 4.9,
      reviewer: 'Michael K.',
      review: 'Great referral program! Got my BMT and INIT tokens as promised. The exchange has excellent liquidity and a wide variety of cryptocurrencies. Highly recommended for both beginners and pros.',
      verified: true,
      helpful: 31,
      unhelpful: 2,
      status: 'approved'
    },
    {
      platform: 'Deriv',
      category: 'Forex Trading',
      rating: 4.6,
      reviewer: 'James L.',
      review: 'Love that I can trade synthetic indices on weekends! Boom and Crash indices are exciting to trade. The platform is stable and offers good analytical tools.',
      verified: true,
      helpful: 18,
      unhelpful: 1,
      status: 'approved'
    },
    {
      platform: 'HF Markets (HFM)',
      category: 'Forex Trading',
      rating: 4.8,
      reviewer: 'Lisa R.',
      review: 'Premium trading experience indeed! Very competitive spreads and fast execution. Their educational resources are also top-notch. Been using them for 6 months.',
      verified: true,
      helpful: 22,
      unhelpful: 1,
      status: 'approved'
    },
    {
      platform: 'OKX',
      category: 'Crypto Exchange',
      rating: 4.5,
      reviewer: 'David Chen',
      review: 'Solid crypto exchange with good trading features. The mobile app is well-designed and withdrawals are processed quickly. Customer service could be improved but overall satisfied.',
      verified: true,
      helpful: 15,
      unhelpful: 4,
      status: 'approved'
    }
  ];

  try {
    await Review.deleteMany({});
    await Review.insertMany(reviews);
    console.log('✅ Reviews seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
  }
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clickmaliclub');
    console.log('📦 Connected to MongoDB');
    
    await seedGuides();
    await seedReviews();
    
    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
