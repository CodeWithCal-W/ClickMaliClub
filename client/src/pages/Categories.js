import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useCategories, useCategory, useDeals } from '../hooks/useApi';
import CategoryGrid from '../components/categories/CategoryGrid';
import DealGrid from '../components/deals/DealGrid';

const Categories = () => {
  const { category: categorySlug } = useParams();
  
  // If we have a category slug, show that specific category
  const { data: categoryData, loading: categoryLoading, error: categoryError } = useCategory(categorySlug || '');
  const { data: categoryDealsData, loading: categoryDealsLoading, error: categoryDealsError } = useDeals(
    categorySlug ? { category: categorySlug } : {}
  );
  
  // Otherwise show all categories
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useCategories();
  
  if (categorySlug) {
    // Show specific category page
    const category = categoryData?.data;
    const deals = categoryDealsData?.data || [];
    
    return (
      <>
        <Helmet>
          <title>{category?.name || 'Category'} - ClickMaliClub</title>
          <meta name="description" content={category?.description || 'Browse affiliate deals in this category'} />
        </Helmet>
        
        <div className="min-h-screen py-16">
          <div className="container-custom">
            {categoryLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4 w-64"></div>
                <div className="h-4 bg-gray-200 rounded mb-8 w-96"></div>
              </div>
            ) : category ? (
              <>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold mb-4" style={{ color: category.color }}>
                    {category.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    {category.description}
                  </p>
                </div>
                
                <DealGrid 
                  deals={deals} 
                  loading={categoryDealsLoading} 
                  error={categoryDealsError} 
                />
              </>
            ) : (
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Category Not Found</h1>
                <p className="text-gray-600 dark:text-gray-300">The category you're looking for doesn't exist.</p>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Show all categories
  const categories = categoriesData?.data || [];

  return (
    <>
      <Helmet>
        <title>Categories - ClickMaliClub</title>
        <meta name="description" content="Browse all affiliate marketing categories" />
      </Helmet>
      
      <div className="min-h-screen py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">All Categories</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our complete collection of affiliate marketing opportunities
            </p>
          </div>
          
          <CategoryGrid 
            categories={categories} 
            loading={categoriesLoading} 
            error={categoriesError} 
          />
        </div>
      </div>
    </>
  );
};

export default Categories;
