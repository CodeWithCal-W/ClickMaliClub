import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FiBook, FiTrendingUp, FiDollarSign, FiTarget, FiTool, FiServer, FiClock, FiUser, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Guides = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTopics, setExpandedTopics] = useState({});
  const [selectedGuide, setSelectedGuide] = useState(null);

  const guides = [
    {
      id: 1,
      title: 'Complete Beginner\'s Guide to Forex Trading',
      excerpt: 'Learn the fundamentals of forex trading, from understanding currency pairs to placing your first trade.',
      category: 'Forex Trading',
      icon: FiTrendingUp,
      readTime: '15 min read',
      difficulty: 'Beginner',
      author: 'ClickMaliClub Team',
      date: 'August 12, 2025',
      content: [
        'What is Forex Trading?',
        'Understanding Currency Pairs',
        'Major, Minor, and Exotic Pairs', 
        'How to Read Forex Charts',
        'Basic Trading Strategies',
        'Risk Management Principles',
        'Choosing a Forex Broker',
        'Demo Trading vs Live Trading'
      ],
      fullContent: {
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
      }
    },
    {
      id: 2,
      title: 'Cryptocurrency Trading for Beginners',
      excerpt: 'Master the basics of crypto trading, understand market volatility, and learn about different exchanges.',
      category: 'Crypto Exchange',
      icon: FiDollarSign,
      readTime: '12 min read',
      difficulty: 'Beginner',
      author: 'ClickMaliClub Team',
      date: 'August 10, 2025',
      content: [
        'Introduction to Cryptocurrency',
        'Understanding Blockchain Technology',
        'Popular Cryptocurrencies (Bitcoin, Ethereum, etc.)',
        'How Crypto Exchanges Work',
        'Types of Trading Orders',
        'Wallet Security Best Practices',
        'Reading Crypto Charts and Indicators',
        'Managing Risk in Volatile Markets'
      ],
      fullContent: {
        introduction: "Cryptocurrency trading has become one of the most exciting and potentially profitable forms of digital asset trading. This guide will teach you everything you need to know to start safely.",
        sections: [
          {
            title: "Introduction to Cryptocurrency",
            content: "Cryptocurrency is a digital or virtual currency secured by cryptography. Bitcoin, launched in 2009, was the first cryptocurrency, and thousands of alternatives now exist."
          },
          {
            title: "Understanding Blockchain Technology",
            content: "Blockchain is the underlying technology that powers cryptocurrencies. It's a decentralized ledger that records all transactions across a network of computers, ensuring transparency and security."
          },
          {
            title: "Popular Cryptocurrencies",
            content: "Bitcoin (BTC) remains the largest cryptocurrency by market cap. Ethereum (ETH) enables smart contracts. Other popular options include Binance Coin (BNB), Cardano (ADA), and Solana (SOL)."
          },
          {
            title: "How Crypto Exchanges Work",
            content: "Crypto exchanges are platforms where you can buy, sell, and trade cryptocurrencies. Centralized exchanges (like Binance) offer high liquidity, while decentralized exchanges provide more privacy."
          },
          {
            title: "Types of Trading Orders",
            content: "Market orders execute immediately at current prices. Limit orders set a specific price. Stop-loss orders help limit losses. Stop-limit orders combine features of both stop and limit orders."
          },
          {
            title: "Wallet Security Best Practices",
            content: "Use hardware wallets for long-term storage. Enable two-factor authentication. Never share private keys. Keep backup phrases secure and offline. Regular security updates are essential."
          },
          {
            title: "Reading Crypto Charts and Indicators",
            content: "Learn to read candlestick charts, moving averages, RSI, and MACD indicators. Understanding volume and market sentiment helps identify trends and potential entry/exit points."
          },
          {
            title: "Managing Risk in Volatile Markets",
            content: "Cryptocurrency markets are highly volatile. Never invest more than you can afford to lose. Diversify your portfolio. Use dollar-cost averaging and set clear profit-taking levels."
          }
        ],
        conclusion: "Cryptocurrency trading offers exciting opportunities but requires careful risk management. Start with our recommended exchanges and always do your own research."
      }
    },
    {
      id: 3,
      title: 'Sports Betting Strategy Guide',
      excerpt: 'Learn responsible betting strategies, understand odds, and discover how to make informed betting decisions.',
      category: 'Betting Sites',
      icon: FiTarget,
      readTime: '10 min read',
      difficulty: 'Intermediate',
      author: 'ClickMaliClub Team',
      date: 'August 8, 2025',
      content: [
        'Understanding Betting Odds',
        'Types of Sports Bets',
        'Bankroll Management',
        'Research and Analysis Techniques',
        'Value Betting Concepts',
        'In-Play Betting Strategies',
        'Responsible Gambling Guidelines',
        'Common Betting Mistakes to Avoid'
      ]
    },
    {
      id: 4,
      title: 'SaaS Tools for Business Growth',
      excerpt: 'Discover essential software tools that can automate your business processes and boost productivity.',
      category: 'SaaS Tools',
      icon: FiTool,
      readTime: '8 min read',
      difficulty: 'Beginner',
      author: 'ClickMaliClub Team',
      date: 'August 6, 2025',
      content: [
        'Essential SaaS Categories for Business',
        'CRM Software Selection Guide',
        'Project Management Tools Comparison',
        'Marketing Automation Platforms',
        'Accounting and Finance Software',
        'Communication and Collaboration Tools',
        'Cost-Benefit Analysis for SaaS',
        'Implementation Best Practices'
      ]
    },
    {
      id: 5,
      title: 'Web Hosting Selection Guide',
      excerpt: 'Learn how to choose the right web hosting provider for your website needs and budget.',
      category: 'Web Hosting',
      icon: FiServer,
      readTime: '12 min read',
      difficulty: 'Beginner',
      author: 'ClickMaliClub Team',
      date: 'August 4, 2025',
      content: [
        'Types of Web Hosting (Shared, VPS, Dedicated)',
        'Key Hosting Features to Consider',
        'Understanding Bandwidth and Storage',
        'SSL Certificates and Security',
        'Domain Management',
        'Backup and Recovery Options',
        'Customer Support Evaluation',
        'Performance and Uptime Metrics'
      ]
    },
    {
      id: 6,
      title: 'Affiliate Marketing Success Strategies',
      excerpt: 'Learn how to maximize your earnings through affiliate marketing and build sustainable income streams.',
      category: 'Affiliate Marketing',
      icon: FiBook,
      readTime: '18 min read',
      difficulty: 'Advanced',
      author: 'ClickMaliClub Team',
      date: 'August 2, 2025',
      content: [
        'Understanding Affiliate Marketing',
        'Choosing Profitable Niches',
        'Building Trust with Your Audience',
        'Content Marketing for Affiliates',
        'Email Marketing Strategies',
        'SEO for Affiliate Websites',
        'Tracking and Analytics',
        'Scaling Your Affiliate Business'
      ]
    }
  ];

  const categories = [
    { name: 'All Guides', slug: 'all', icon: FiBook },
    { name: 'Forex Trading', slug: 'forex', icon: FiTrendingUp },
    { name: 'Crypto Exchange', slug: 'crypto', icon: FiDollarSign },
    { name: 'Betting Sites', slug: 'betting', icon: FiTarget },
    { name: 'SaaS Tools', slug: 'saas', icon: FiTool },
    { name: 'Web Hosting', slug: 'hosting', icon: FiServer }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category.toLowerCase().includes(selectedCategory));

  const toggleTopics = (guideId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [guideId]: !prev[guideId]
    }));
  };

  const openFullGuide = (guide) => {
    setSelectedGuide(guide);
  };

  const closeFullGuide = () => {
    setSelectedGuide(null);
  };

  return (
    <>
      <Helmet>
        <title>Guides - ClickMaliClub</title>
        <meta name="description" content="Comprehensive guides and tutorials for forex trading, cryptocurrency, betting, SaaS tools, and more." />
      </Helmet>
      
      <div className="min-h-screen py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Learning Guides
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive guides and tutorials to help you succeed in forex trading, cryptocurrency, 
              betting, and more. Learn from experts and grow your knowledge.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-colors duration-200 ${
                    selectedCategory === category.slug
                      ? 'bg-primary-500 border-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Guide Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <guide.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">{guide.category}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guide.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' :
                      guide.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300' :
                      'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
                    }`}>
                      {guide.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {guide.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {guide.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{guide.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiUser className="w-4 h-4" />
                      <span>{guide.author}</span>
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="px-6 pb-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">What You'll Learn:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {(expandedTopics[guide.id] ? guide.content : guide.content.slice(0, 4)).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary-500 dark:bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                    {guide.content.length > 4 && (
                      <li>
                        <button
                          onClick={() => toggleTopics(guide.id)}
                          className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300 flex items-center space-x-1 transition-colors"
                        >
                          {expandedTopics[guide.id] ? (
                            <>
                              <FiChevronUp className="w-4 h-4" />
                              <span>Show less</span>
                            </>
                          ) : (
                            <>
                              <FiChevronDown className="w-4 h-4" />
                              <span>+ {guide.content.length - 4} more topics...</span>
                            </>
                          )}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
                  <button 
                    onClick={() => openFullGuide(guide)}
                    className="w-full btn-primary text-sm"
                  >
                    Read Full Guide
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Need a Specific Guide?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Can't find what you're looking for? Let us know what topic you'd like us to cover next.
            </p>
            <Link to="/contact" className="btn-primary">
              Request a Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Full Guide Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <selectedGuide.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedGuide.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{selectedGuide.readTime}</span>
                    <span>{selectedGuide.difficulty}</span>
                    <span>By {selectedGuide.author}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeFullGuide}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {selectedGuide.fullContent ? (
                <>
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {selectedGuide.fullContent.introduction}
                    </p>
                    
                    {selectedGuide.fullContent.sections.map((section, index) => (
                      <div key={index} className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                          {section.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    ))}
                    
                    <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <h4 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">Conclusion</h4>
                      <p className="text-primary-800 dark:text-primary-200">
                        {selectedGuide.fullContent.conclusion}
                      </p>
                    </div>

                    <div className="mt-8 text-center">
                      <Link to="/deals" className="btn-primary">
                        Explore Recommended Platforms
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    This guide is currently being updated with more detailed content.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Check back soon for the complete guide!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Guides;
