import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiPlus, FiMinus, FiSearch, FiMessageCircle } from 'react-icons/fi';

const FAQ = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const faqs = [
    {
      id: 1,
      category: 'General',
      question: 'What is ClickMaliClub?',
      answer: 'ClickMaliClub is a trusted affiliate marketing platform that helps users discover the best deals, offers, and opportunities across multiple industries including forex trading, cryptocurrency exchanges, betting sites, SaaS tools, and web hosting services.'
    },
    {
      id: 2,
      category: 'General',
      question: 'How do I get started with ClickMaliClub?',
      answer: 'Getting started is simple! Browse our featured deals and categories, click on offers that interest you, and follow the registration process with our partner platforms. You can also subscribe to our newsletter to stay updated on the latest deals and opportunities.'
    },
    {
      id: 3,
      category: 'General',
      question: 'Are all the deals and offers legitimate?',
      answer: 'Yes, we carefully vet all our partners and deals. We only work with licensed, regulated, and reputable companies. All offers are verified and updated regularly to ensure accuracy and legitimacy.'
    },
    {
      id: 4,
      category: 'Forex Trading',
      question: 'What should I look for in a forex broker?',
      answer: 'When choosing a forex broker, consider: regulatory compliance, competitive spreads, reliable trading platform, customer support quality, deposit/withdrawal methods, educational resources, and welcome bonuses. We recommend starting with our featured brokers like Headway, Deriv, and HFM.'
    },
    {
      id: 5,
      category: 'Forex Trading',
      question: 'Can I really trade synthetic indices on weekends?',
      answer: 'Yes! With Deriv, you can trade synthetic indices including Boom, Crash, and Volatility Indices even when traditional forex markets are closed during weekends. These instruments simulate real market movements and are available 24/7.'
    },
    {
      id: 6,
      category: 'Forex Trading',
      question: 'What is the $111 welcome bonus with Headway?',
      answer: 'Headway offers a $111 welcome/no deposit bonus for new clients who register through our affiliate link. This bonus allows you to start trading without an initial deposit. Terms and conditions apply, including trading volume requirements before withdrawal.'
    },
    {
      id: 7,
      category: 'Cryptocurrency',
      question: 'How do I earn BMT and INIT tokens with Binance?',
      answer: 'When you register for Binance through our referral link, you automatically participate in their referral program where you can earn trending tokens like BMT and INIT. The tokens are distributed based on your trading activity and referral program terms.'
    },
    {
      id: 8,
      category: 'Cryptocurrency',
      question: 'Which crypto exchange is best for beginners?',
      answer: 'For beginners, we recommend Binance due to its user-friendly interface, extensive educational resources, and strong security measures. OKX is also excellent for those wanting more advanced trading features. Both are featured on our platform with special offers.'
    },
    {
      id: 9,
      category: 'Cryptocurrency',
      question: 'Are cryptocurrency investments safe?',
      answer: 'Cryptocurrency trading involves significant risk due to market volatility. Only invest what you can afford to lose. Choose reputable exchanges like those we recommend, use secure wallets, enable two-factor authentication, and educate yourself about the market before trading.'
    },
    {
      id: 10,
      category: 'Affiliate Program',
      question: 'Do you have an affiliate program?',
      answer: 'Currently, ClickMaliClub focuses on connecting users with the best affiliate opportunities from our partners. We may launch our own affiliate program in the future. Stay subscribed to our newsletter for updates on new opportunities.'
    },
    {
      id: 11,
      category: 'Affiliate Program',
      question: 'How do affiliate links work?',
      answer: 'When you click on our affiliate links and register with a partner platform, we may receive a commission. This doesn\'t cost you anything extra and often qualifies you for exclusive bonuses and offers that aren\'t available elsewhere.'
    },
    {
      id: 12,
      category: 'Support',
      question: 'How can I contact customer support?',
      answer: 'You can reach us through our contact page, email us at clickmaliclub@gmail.com, or use the contact form on our website. We strive to respond to all inquiries within 24 hours during business days.'
    },
    {
      id: 13,
      category: 'Support',
      question: 'What if I have issues with a partner platform?',
      answer: 'While we carefully select our partners, any issues with their services should be directed to their customer support first. If you continue to experience problems, contact us and we\'ll do our best to help resolve the situation.'
    },
    {
      id: 14,
      category: 'Account',
      question: 'Do I need to create an account to use ClickMaliClub?',
      answer: 'No, you can browse and access most deals without creating an account. However, subscribing to our newsletter ensures you get notified about exclusive offers and new opportunities as they become available.'
    },
    {
      id: 15,
      category: 'Account',
      question: 'How do I unsubscribe from the newsletter?',
      answer: 'You can unsubscribe from our newsletter at any time by clicking the unsubscribe link at the bottom of any email we send, or by contacting us directly at clickmaliclub@gmail.com.'
    }
  ];

  const categories = ['All', 'General', 'Forex Trading', 'Cryptocurrency', 'Affiliate Program', 'Support', 'Account'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <>
      <Helmet>
        <title>FAQ - ClickMaliClub</title>
        <meta name="description" content="Frequently asked questions about ClickMaliClub, forex trading, cryptocurrency, affiliate marketing, and our services." />
      </Helmet>
      
      <div className="min-h-screen py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our platform, deals, and services. 
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 border rounded-full transition-colors duration-200 text-sm ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white border-gray-200 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-md border border-gray-200">
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div>
                    <span className="text-xs font-medium text-primary-600 mb-1 block">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                  </div>
                  {openFaq === faq.id ? (
                    <FiMinus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <FiPlus className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                
                {openFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No FAQs found matching your search. Try a different keyword or browse all categories.
              </p>
            </div>
          )}

          {/* Contact Section */}
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
            <FiMessageCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help. Get in touch and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:clickmaliclub@gmail.com" 
                className="btn-primary inline-flex items-center justify-center"
              >
                Email Support
              </a>
              <a 
                href="/contact" 
                className="btn-secondary inline-flex items-center justify-center"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
