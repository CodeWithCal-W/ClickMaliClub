import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDeals, useCategories } from '../hooks/useApi';
import DealGrid from '../components/deals/DealGrid';

const Deals = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: dealsData, loading: dealsLoading, error: dealsError, refetch } = useDeals({
    category: selectedCategory,
    page: currentPage,
    limit: 12
  });
  
  const { data: categoriesData } = useCategories();
  
  const deals = dealsData?.data || [];
  const categories = categoriesData?.data || [];
  const totalPages = dealsData?.pages || 1;
  const totalDeals = dealsData?.total || 0;

  // Reset to page 1 if current page doesn't exist and refetch
  useEffect(() => {
    if (dealsError && (dealsError.response?.status === 400 || dealsError.status === 400)) {
      console.log('Page error detected, resetting to page 1');
      if (currentPage !== 1) {
        setCurrentPage(1);
        // Trigger a refetch after state update
        setTimeout(() => {
          refetch();
        }, 100);
      }
    }
  }, [dealsError, currentPage, refetch]);

  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page <= totalPages && page >= 1) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.warn('Invalid page number:', page, 'Valid range: 1-', totalPages);
      // If trying to access an invalid page, go to page 1
      setCurrentPage(1);
    }
  };

  // Enhanced pagination with proper bounds checking
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
      );
    }

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-2 py-2 text-gray-500">...</span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-2 py-2 text-gray-500">...</span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      );
    }

    return (
      <div className="flex justify-center mt-12">
        <nav className="flex space-x-2 items-center">
          {pages}
        </nav>
      </div>
    );
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

          {/* Enhanced Pagination */}
          {renderPagination()}

          {/* Error handling for pagination issues */}
          {dealsError && (dealsError.response?.status === 400 || dealsError.status === 400) && currentPage === 1 && (
            <div className="text-center mt-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Showing latest available deals
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Deals;
