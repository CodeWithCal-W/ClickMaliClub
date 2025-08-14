import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTarget, FiUsers, FiTrendingUp, FiShield, FiHeart, FiAward } from 'react-icons/fi';

const About = () => {
  const features = [
    {
      icon: FiTarget,
      title: 'Expert Curation',
      description: 'Our team carefully reviews and selects only the best deals and platforms to ensure you get maximum value.'
    },
    {
      icon: FiShield,
      title: 'Trusted Partners',
      description: 'We work exclusively with licensed, regulated, and reputable companies to protect your interests.'
    },
    {
      icon: FiTrendingUp,
      title: 'Real-Time Updates',
      description: 'Stay ahead with the latest deals, market insights, and trending opportunities in your favorite niches.'
    },
    {
      icon: FiUsers,
      title: 'Community Driven',
      description: 'Join thousands of traders, entrepreneurs, and deal-seekers who trust ClickMaliClub for their needs.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Active Users' },
    { number: '500+', label: 'Verified Deals' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - ClickMaliClub</title>
        <meta name="description" content="Learn about ClickMaliClub's mission to connect users with the best deals in forex, crypto, betting, SaaS, and hosting" />
        <meta name="keywords" content="about clickmaliclub, affiliate marketing, forex deals, crypto deals, betting offers" />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
          <div className="container-custom text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About ClickMaliClub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your trusted partner for discovering the best deals and opportunities 
              in forex trading, cryptocurrency, sports betting, SaaS tools, and web hosting.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <FiHeart className="text-red-300" size={24} />
              <span className="text-lg">Built with passion for your success</span>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  At ClickMaliClub, we believe everyone deserves access to the best deals and opportunities 
                  in the digital world. Our mission is to bridge the gap between quality service providers 
                  and smart consumers looking for value.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  We meticulously research, test, and verify every deal we feature, ensuring you save time, 
                  money, and make informed decisions. Whether you're a beginner trader, seasoned investor, 
                  or business owner, we've got you covered.
                </p>
                <div className="flex items-center space-x-4">
                  <FiAward className="text-primary-600 dark:text-primary-400 flex-shrink-0" size={24} />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Trusted by over 50,000 users worldwide
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
