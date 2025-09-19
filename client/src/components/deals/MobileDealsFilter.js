import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, TrendingUp } from 'react-feather';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import TouchOptimization from '../ui/TouchOptimization';

const MobileDealsFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange 
}) => {
  const device = useDeviceDetection();
  const [showFilters, setShowFilters] = useState(false);

  if (!device.isMobile) return null;

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 pb-safe">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex items-center justify-between px-4 pb-4">
        <TouchOptimization onTap={() => setShowFilters(!showFilters)}>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filters</span>
            {selectedCategory && (
              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                1
              </span>
            )}
          </button>
        </TouchOptimization>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <TouchOptimization onTap={() => onViewModeChange('grid')}>
            <button
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </TouchOptimization>
          <TouchOptimization onTap={() => onViewModeChange('list')}>
            <button
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </TouchOptimization>
        </div>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="px-4 pb-4 space-y-4 bg-gray-50 dark:bg-gray-800 mobile-slide-up">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <TouchOptimization onTap={() => onCategoryChange('')}>
                <button
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  All
                </button>
              </TouchOptimization>
              {categories.map((category) => (
                <TouchOptimization 
                  key={category._id} 
                  onTap={() => onCategoryChange(category._id)}
                >
                  <button
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category._id
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {category.name}
                  </button>
                </TouchOptimization>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="expiring">Expiring Soon</option>
              <option value="featured">Featured Deals</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDealsFilter;
