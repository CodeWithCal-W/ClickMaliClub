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
        <title>ClickMaliClub - Your Ultimate Affiliate Marketing Hub</title>
        <meta name="description" content="Discover the best deals, offers, and opportunities in forex, crypto, betting, SaaS, and more." />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-gradient py-20">
          <div className="container-custom">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeIn">
                Welcome to <span className="text-yellow-300">ClickMaliClub</span>
              </h1>
              <p className="text-xl md:text-2xl mb-4 opacity-90 max-w-3xl mx-auto animate-slideUp">
                Your trusted partner for the best affiliate deals across forex, crypto, 
                betting, SaaS, hosting, and more!
              </p>
              <p className="text-lg md:text-xl mb-8 opacity-80 max-w-4xl mx-auto animate-slideUp">
                If you are interested or excited about making money online from the comfort of your home, 
                on your digital devices, then you are in the right place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
                <Link to="/deals" className="btn-accent text-lg px-8 py-4 shadow-glow inline-block text-center">
                  Explore Deals
                </Link>
                <Link to="/about" className="btn-secondary bg-white text-primary-600 text-lg px-8 py-4 hover:shadow-lg inline-block text-center">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Preview */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our curated selection of affiliate opportunities across various industries
              </p>
            </div>

            <CategoryGrid 
              categories={categories} 
              loading={categoriesLoading} 
              error={categoriesError} 
            />

            <div className="text-center mt-12">
              <Link to="/categories" className="btn-secondary inline-flex items-center">
                View All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Deals */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Deals
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Don't miss out on these exclusive offers and limited-time deals
              </p>
            </div>

            <DealGrid 
              deals={deals} 
              loading={dealsLoading} 
              error={dealsError} 
            />

            <div className="text-center mt-12">
              <Link to="/deals" className="btn-primary inline-flex items-center">
                View All Deals
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of marketers who trust ClickMaliClub for their affiliate marketing needs.
            </p>
            <Link to="/deals" className="btn-primary text-lg px-8 py-4 inline-block text-center">
              Get Started Today
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
