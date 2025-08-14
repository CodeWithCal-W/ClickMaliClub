import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDeals, useCategories } from '../hooks/useApi';
import DealGrid from '../components/deals/DealGrid';

const Deals = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: dealsData, loading: dealsLoading, error: dealsError } = useDeals({
    category: selectedCategory,
    page: currentPage,
    limit: 12
  });
  
  const { data: categoriesData } = useCategories();
  
  const deals = dealsData?.data || [];
  const categories = categoriesData?.data || [];
  const totalPages = dealsData?.pages || 1;

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>Latest Deals - ClickMaliClub</title>
        <meta name="description" content="Discover the latest affiliate deals and offers" />
      </Helmet>
      
      <div className="min-h-screen py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Latest Deals</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the hottest affiliate deals and exclusive offers
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === '' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug 
                      ? 'text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  style={selectedCategory === category.slug ? { backgroundColor: category.color } : {}}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Deals Grid */}
          <DealGrid 
            deals={deals} 
            loading={dealsLoading} 
            error={dealsError} 
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === index + 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Deals;
