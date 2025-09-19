import React, { useEffect, useRef } from 'react';
import { ExternalLink, TrendingUp, Clock } from 'react-feather';
import { apiService } from '../../services/api';
import TouchOptimization from '../ui/TouchOptimization';

// Global view tracking batch to prevent excessive API calls
const viewBatch = new Set();
let batchTimer = null;

const processBatch = async () => {
  if (viewBatch.size === 0) return;
  
  const dealIds = Array.from(viewBatch);
  viewBatch.clear();
  
  // Process views in batches to prevent overwhelming the server
  try {
    await Promise.all(
      dealIds.map(dealId => 
        apiService.trackView(dealId).catch(err => 
          console.warn('View tracking failed for deal:', dealId, err)
        )
      )
    );
  } catch (error) {
    console.error('Batch view tracking failed:', error);
  }
};

const DealCard = ({ deal }) => {
  const cardRef = useRef(null);
  const viewTracked = useRef(false);

  // Track view when card comes into viewport (with batching)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewTracked.current) {
          viewTracked.current = true;
          // Add to batch instead of immediate tracking
          viewBatch.add(deal._id);
          
          // Debounce batch processing
          if (batchTimer) clearTimeout(batchTimer);
          batchTimer = setTimeout(processBatch, 1000); // Process batch after 1 second
        }
      },
      { threshold: 0.5 } // Track when 50% of card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [deal._id]);

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
    <TouchOptimization onTap={handleClick}>
      <div 
        ref={cardRef}
        className="card hover:shadow-xl transition-all duration-300 group cursor-pointer deal-card"
        onClick={handleClick}
      >
        {/* Deal Image - Mobile Optimized */}
        {deal.image && (
          <div className="relative h-40 sm:h-48 md:h-52 overflow-hidden">
            <img 
              src={deal.image} 
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {deal.featured && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                FEATURED
              </div>
            )}
            {expiryStatus && (
              <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 bg-white text-xs font-medium px-2 py-1 rounded shadow-lg ${expiryStatus.color}`}>
                <Clock className="inline w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{expiryStatus.text}</span>
                <span className="sm:hidden">{expiryStatus.text.split(' ')[0]}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-4 sm:p-5 md:p-6">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="inline-block px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium text-white rounded-full"
              style={{ backgroundColor: deal.category?.color || '#36b37e' }}
            >
              {deal.category?.name || 'General'}
            </span>
          </div>

          {/* Deal Title - Mobile Responsive */}
          <h3 className="text-lg sm:text-xl md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 leading-tight">
            {deal.title}
          </h3>

          {/* Deal Description - Mobile Optimized */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {deal.description}
          </p>

          {/* Deal Stats - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="flex items-center">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">
                  {(() => {
                    const clicks = deal.analytics?.clicks || 0;
                    const clickText = clicks === 1 ? 'click' : 'clicks';
                    return `${clicks} ${clickText}`;
                  })()}
                </span>
                <span className="sm:hidden">
                  {deal.analytics?.clicks || 0}
                </span>
              </span>
              <span className="hidden sm:inline">
                Added {formatDate(deal.createdAt)}
              </span>
              <span className="sm:hidden text-xs">
                {formatDate(deal.createdAt)}
              </span>
            </div>
          </div>

          {/* CTA Button - Mobile Optimized */}
          <button
            onClick={handleClick}
            className="w-full btn-primary flex items-center justify-center space-x-2 group py-3 sm:py-3 px-4 sm:px-6 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300 transform active:scale-95"
            style={{ minHeight: '44px' }} // Apple's recommended touch target
          >
            <span>{deal.ctaText || 'Get Deal'}</span>
            <ExternalLink className="w-4 h-4 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Terms - Mobile Responsive */}
          {deal.terms && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {deal.terms}
            </p>
          )}
        </div>
      </div>
    </TouchOptimization>
  );
};

export default DealCard;
