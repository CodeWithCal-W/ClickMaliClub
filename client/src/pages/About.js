import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTarget, FiUsers, FiTrendingUp, FiShield, FiHeart, FiAward } from 'react-icons/fi';

const About = () => {
  const stats = [
    { number: '25K+', label: 'Monthly Visitors' },
    { number: '150+', label: 'Platforms Reviewed' },
    { number: '4.9★', label: 'Average Rating' },
    { number: '24/7', label: 'Community Support' }
  ];

  const features = [
    {
      icon: FiTarget,
      title: 'Thorough Research',
      description: 'Every platform is personally tested and analyzed. We spend weeks evaluating features, security, and user experience before making recommendations.'
    },
    {
      icon: FiShield,
      title: 'Verified Partners',
      description: 'We only partner with licensed, regulated, and reputable companies. Your safety and security are our top priorities.'
    },
    {
      icon: FiTrendingUp,
      title: 'Exclusive Bonuses',
      description: 'Access special welcome bonuses, reduced fees, and promotional offers available only through our trusted partner relationships.'
    },
    {
      icon: FiUsers,
      title: 'Honest Reviews',
      description: 'No sugar-coating here. We share real pros and cons, helping you make informed decisions based on facts, not hype.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About ClickMaliClub - Your Trusted Platform Recommendation Hub | Expert Reviews</title>
        <meta name="description" content="Discover ClickMaliClub's mission: connecting you with the best forex brokers, crypto exchanges, betting sites, SaaS tools, web hosting, education platforms, prop firms & business resources." />
        <meta name="keywords" content="about clickmaliclub, platform reviews, forex broker reviews, crypto exchange reviews, SaaS recommendations, web hosting reviews, prop trading firms, business outsourcing" />
        <meta property="og:title" content="About ClickMaliClub - Expert Platform Recommendations" />
        <meta property="og:description" content="Learn how ClickMaliClub curates the best digital platforms with honest reviews and exclusive bonuses." />
        <link rel="canonical" href="https://clickmaliclub.com/about" />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
          <div className="container-custom text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About ClickMaliClub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-5xl mx-auto opacity-90">
              Your trusted guide to discovering premium forex brokers, crypto exchanges, betting platforms, SaaS tools, web hosting providers, online education platforms, prop trading firms, and business outsourcing resources with honest reviews and exclusive welcome bonuses.
            </p>
            <div className="flex items-center justify-center space-x-2">   
              <span className="text-lg">We are here to help you succeed online!</span>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission: Simplifying Your Platform Selection
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  At ClickMaliClub, we understand how overwhelming it can be to choose the right online platform. 
                  With thousands of forex brokers, crypto exchanges, betting sites, SaaS tools, web hosting providers, 
                  online education platforms, prop trading firms, and business outsourcing services available, making the wrong choice 
                  can cost you time, money, and opportunities.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  That's why we personally test, review, and curate only the <strong>best platforms</strong> across all 8 categories we focus on. 
                  Every recommendation comes with honest insights, pros and cons, and exclusive bonuses you won't find elsewhere. 
                  We're not just another review site - we're your trusted advisors in the digital world.
                </p>
                <div className="flex items-center space-x-4">
                  <FiAward className="text-primary-600 dark:text-primary-400 flex-shrink-0" size={24} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Helping digital entrepreneurs since 2025
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose ClickMaliClub?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We're more than just a deals platform. We're your trusted advisor in the digital marketplace.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="text-primary-600 dark:text-primary-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Cover Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What We Cover
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From trading platforms to business tools, we've got all your digital needs covered.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrendingUp className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Forex & Trading</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Best forex brokers, trading platforms, and exclusive bonuses for traders of all levels.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 dark:text-orange-400 text-2xl font-bold">₿</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Cryptocurrency</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Secure crypto exchanges, wallets, and trading platforms with the best fees and features.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTarget className="text-blue-600 dark:text-blue-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Sports Betting</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Licensed sportsbooks with competitive odds, live betting, and generous welcome bonuses.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 dark:text-purple-400 text-2xl font-bold">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">SaaS Tools</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Business software and productivity tools to streamline operations and boost growth.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 dark:text-green-400 text-2xl font-bold">🌐</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Web Hosting</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reliable hosting providers with fast servers, excellent uptime, and 24/7 support.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-600 dark:text-gray-400 text-2xl font-bold">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Education</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Online courses, certifications, and learning platforms to advance your skills and career.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="container-custom text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Discover Amazing Deals?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of smart shoppers who trust ClickMaliClub for the best deals in the digital marketplace.
            </p>
            <div className="space-x-4">
              <a 
                href="/deals" 
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Browse Deals
              </a>
              <a 
                href="/categories" 
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                Explore Categories
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
