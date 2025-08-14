import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const CategoryCard = ({ category }) => {
  const dealCount = category.dealCount || 0;
  const dealText = dealCount === 1 ? 'deal' : 'deals';

  return (
    <Link 
      to={`/categories/${category.slug}`}
      className="card hover:shadow-xl transition-all duration-300 group"
    >
      {/* Color Bar */}
      <div 
        className="h-2"
        style={{ backgroundColor: category.color }}
      ></div>
      
      <div className="p-6">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {category.name}
          </h3>
          <div className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <FiArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {category.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            {dealCount} {dealText} available
          </span>
          <span 
            className="font-medium"
            style={{ color: category.color }}
          >
            View all →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
