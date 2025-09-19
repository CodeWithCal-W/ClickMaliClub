import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCategories, useDeals } from '../hooks/useApi';
import CategoryGrid from '../components/categories/CategoryGrid';
import DealGrid from '../components/deals/DealGrid';

const Home = () => {
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: dealsData, loading: dealsLoading, error: dealsError } = useDeals({ limit: 6 });

  const categories = categoriesData?.data || [];
  const deals = dealsData?.data || [];
  
  return (
    <>
      <Helmet>
        <title>ClickMaliClub - Discover Premium Forex, Crypto, SaaS & Web Hosting Platforms | Expert Reviews</title>
        <meta name="description" content="Find the best forex brokers, crypto exchanges, betting sites, SaaS tools, web hosting, online education, prop firms & business resources. Expert reviews & exclusive bonuses." />
        <meta name="keywords" content="forex brokers review, crypto exchanges, betting sites, SaaS tools, web hosting, online education, prop trading firms, business outsourcing, digital platforms" />
        <meta property="og:title" content="ClickMaliClub - Your Gateway to Premium Online Platforms" />
        <meta property="og:description" content="Discover hand-picked forex, crypto, betting, SaaS, hosting, education & business platforms. Get exclusive bonuses and expert guidance." />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://clickmaliclub.com" />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-gradient py-20">
          <div className="container-custom">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
                Discover <span className="text-yellow-300">Premium Platforms</span> That Actually Work
              </h1>
              <p className="text-xl md:text-2xl mb-4 opacity-90 max-w-5xl mx-auto animate-slideUp font-medium">
                Hand-Picked Forex Brokers, Crypto Exchanges, Betting Sites, SaaS Tools, Web Hosting, Online Education, Prop Firms & Business Resources with Exclusive Bonuses & Expert Reviews
              </p>
              <p className="text-lg md:text-xl mb-8 opacity-80 max-w-5xl mx-auto animate-slideUp">
                🔍 <strong>Thoroughly Vetted Platforms</strong> | 💰 <strong>Exclusive Welcome Bonuses</strong> | ⚡ <strong>Step-by-Step Success Guides</strong> | 📈 <strong>Real User Reviews</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
                <Link to="/deals" className="btn-accent text-lg px-10 py-5 shadow-glow inline-block text-center font-bold">
                  🚀 Explore Top Platforms
                </Link>
                <Link to="/guides" className="btn-secondary bg-white text-primary-600 text-lg px-8 py-5 hover:shadow-lg inline-block text-center font-semibold">
                  📚 Free Success Guides
                </Link>
              </div>
              <p className="text-sm mt-4 opacity-75">
                ✅ Honest Reviews | ✅ Exclusive Bonuses | ✅ Expert Guidance
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Social Proof */}
        <section className="py-12 bg-white dark:bg-gray-900 border-b dark:border-gray-700">
          <div className="container-custom">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                <strong>Helping Digital Entrepreneurs Find the Right Tools Since 2024</strong>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">150+</div>
                  <div className="text-sm text-gray-500">Platforms Reviewed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">25K+</div>
                  <div className="text-sm text-gray-500">Monthly Visitors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">4.9★</div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">24/7</div>
                  <div className="text-sm text-gray-500">Community Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                💎 Explore Premium Platform Categories
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From forex trading to crypto investing, SaaS tools to online education - we've curated the <strong>best platforms</strong> in each category with honest reviews and exclusive bonuses.
              </p>
            </div>

            <CategoryGrid 
              categories={categories} 
              loading={categoriesLoading} 
              error={categoriesError} 
            />

            <div className="text-center mt-12">
              <Link to="/categories" className="btn-secondary inline-flex items-center text-lg px-8 py-4">
                🎯 Browse All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Deals */}
        <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-800 dark:to-gray-700 transition-colors duration-300">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🔥 Today's Best Platform Deals & Bonuses
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                <strong>Exclusive Welcome Bonuses!</strong> Get special offers and bonuses when you sign up through our trusted partner links. Limited-time deals updated daily.
              </p>
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mt-4">
                ✨ Exclusive bonuses only available through ClickMaliClub
              </div>
            </div>

            <DealGrid 
              deals={deals} 
              loading={dealsLoading} 
              error={dealsError} 
            />

            <div className="text-center mt-12">
              <Link to="/deals" className="btn-primary inline-flex items-center text-lg px-10 py-5 font-bold">
                💰 View All Platform Deals
              </Link>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🏆 Real Success Stories From Our Community
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">$5,200 Profit</div>
                <div className="text-sm text-gray-500 mb-4">First 3 Months Trading</div>
                <p className="text-gray-700 dark:text-gray-300 italic">"ClickMaliClub's forex broker reviews helped me choose the right platform. The bonus I got through their link was amazing!"</p>
                <div className="mt-4 font-semibold">- Sarah M., Forex Trader</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">$500 Bonus</div>
                <div className="text-sm text-gray-500 mb-4">Crypto Exchange Welcome</div>
                <p className="text-gray-700 dark:text-gray-300 italic">"Found the perfect crypto exchange through ClickMaliClub. The exclusive welcome bonus was incredible!"</p>
                <div className="mt-4 font-semibold">- Mike T., Crypto Investor</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-2">300% Growth</div>
                <div className="text-sm text-gray-500 mb-4">Business Revenue</div>
                <p className="text-gray-700 dark:text-gray-300 italic">"The SaaS tools recommended here transformed my business. Honest reviews and great exclusive deals!"</p>
                <div className="mt-4 font-semibold">- Alex R., Entrepreneur</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Trust ClickMaliClub?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">Thoroughly Vetted</h3>
                <p className="text-gray-600 dark:text-gray-300">Every platform is personally tested and reviewed. We only recommend services we trust and use ourselves.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-bold mb-2">Exclusive Bonuses</h3>
                <p className="text-gray-600 dark:text-gray-300">Get special welcome bonuses and deals available only through our trusted partner relationships.</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
                <p className="text-gray-600 dark:text-gray-300">Step-by-step guides, tutorials, and tips to help you succeed with every platform we recommend.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Discover Your Next Success Platform?
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
              Don't waste time with unreliable platforms. Browse our curated collection of proven forex, crypto, betting, SaaS, hosting, education & business platforms with exclusive bonuses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/deals" className="bg-yellow-400 text-gray-900 font-bold text-xl px-12 py-6 rounded-lg hover:bg-yellow-300 transition-colors inline-block">
                🌟 Browse Premium Platforms
              </Link>
            </div>
            <div className="text-sm opacity-75 max-w-2xl mx-auto">
              ✅ Honest Reviews | ✅ Exclusive Bonuses | ✅ Expert Support<br/>
              <strong>Join thousands who trust ClickMaliClub for platform recommendations!</strong>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;