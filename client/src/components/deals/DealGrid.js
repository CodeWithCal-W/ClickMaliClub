import React from 'react';
import DealCard from './DealCard';

const DealGrid = ({ deals, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-semibold mb-2">
          Error loading deals
        </div>
        <p className="text-gray-600">
          {error.message || 'Something went wrong while fetching deals.'}
        </p>
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg font-semibold mb-2">
          No deals available
        </div>
        <p className="text-gray-600">
          Check back later for new affiliate deals and offers.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {deals.map((deal) => (
        <DealCard key={deal._id} deal={deal} />
      ))}
    </div>
  );
};

export default DealGrid;
