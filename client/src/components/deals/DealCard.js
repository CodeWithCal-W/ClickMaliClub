import React from 'react';
import { FiExternalLink, FiTrendingUp, FiClock } from 'react-icons/fi';
import { apiService } from '../../services/api';

const DealCard = ({ deal }) => {
  const handleClick = async () => {
    try {
      const response = await apiService.trackClick(deal._id);
      // Open affiliate link in new tab
      window.open(response.data.affiliateUrl || deal.affiliateLink, '_blank');
    } catch (error) {
      console.error('Error tracking click:', error);
      // Fallback: still open the link
      window.open(deal.affiliateLink, '_blank');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getExpiryStatus = () => {
    if (!deal.expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(deal.expiryDate);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'text-red-500' };
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, color: 'text-orange-500' };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, color: 'text-yellow-500' };
    return { text: `${daysLeft} days left`, color: 'text-green-500' };
  };

  const expiryStatus = getExpiryStatus();

  return (
    <div className="card hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      {/* Deal Image */}
      {deal.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={deal.image} 
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {deal.featured && (
            <div className="absolute top-3 left-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded">
              FEATURED
            </div>
          )}
          {expiryStatus && (
            <div className={`absolute top-3 right-3 bg-white text-xs font-medium px-2 py-1 rounded shadow ${expiryStatus.color}`}>
              <FiClock className="inline w-3 h-3 mr-1" />
              {expiryStatus.text}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-block px-3 py-1 text-xs font-medium text-white rounded-full"
            style={{ backgroundColor: deal.category?.color || '#36b37e' }}
          >
            {deal.category?.name || 'General'}
          </span>
        </div>        {/* Deal Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {deal.title}
        </h3>

        {/* Deal Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {deal.description}
        </p>

        {/* Deal Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FiTrendingUp className="w-4 h-4 mr-1" />
              {(() => {
                const clicks = deal.analytics?.clicks || 0;
                const clickText = clicks === 1 ? 'click' : 'clicks';
                return `${clicks} ${clickText}`;
              })()}
            </span>
            <span>
              Added {formatDate(deal.createdAt)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleClick}
          className="w-full btn-primary flex items-center justify-center space-x-2 group"
        >
          <span>{deal.ctaText || 'Get Deal'}</span>
          <FiExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Terms */}
        {deal.terms && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 leading-relaxed">
            {deal.terms}
          </p>
        )}
      </div>
    </div>
  );
};

export default DealCard;
