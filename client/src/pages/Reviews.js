import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiStar, FiUser, FiCalendar, FiThumbsUp, FiThumbsDown, FiX } from 'react-icons/fi';
import apiService from '../services/api';

const Reviews = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Generate a simple user ID for vote tracking (in production, use proper user authentication)
  const getUserId = () => {
    let userId = localStorage.getItem('tempUserId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('tempUserId', userId);
    }
    return userId;
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReviews();
      setReviews(response.data);
      
      // Initialize review stats
      const stats = {};
      response.data.forEach(review => {
        stats[review._id] = {
          helpful: review.helpful,
          unhelpful: review.unhelpful
        };
      });
      setReviewStats(stats);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const handleVote = async (reviewId, voteType) => {
    try {
      const userId = getUserId();
      const response = await apiService.voteOnReview(reviewId, {
        voteType,
        userId
      });

      // Update local state with response data
      setReviewStats(prev => ({
        ...prev,
        [reviewId]: {
          helpful: response.data.helpful,
          unhelpful: response.data.unhelpful
        }
      }));

      setUserVotes(prev => ({
        ...prev,
        [reviewId]: response.data.userVote
      }));
    } catch (error) {
      console.error('Error voting on review:', error);
      alert('Failed to submit vote. Please try again.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const reviewData = {
        platform: formData.get('platform'),
        category: formData.get('category'),
        rating: parseFloat(formData.get('rating')),
        reviewer: formData.get('name'),
        review: formData.get('review')
      };

      await apiService.submitReview(reviewData);
      
      setShowReviewModal(false);
      e.target.reset();
      alert('Thank you for your review! It has been submitted for approval and will be visible soon.');
      
      // Refresh reviews to show any that were just approved
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const averageRating = reviews && reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <>
      <Helmet>
        <title>Reviews - ClickMaliClub</title>
        <meta name="description" content="Read honest reviews from our community about forex brokers, crypto exchanges, and other affiliate partners." />
      </Helmet>
      
      <div className="min-h-screen py-16">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Reviews
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Real reviews from our community members about their experiences with our recommended platforms and services.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
              <span className="text-gray-600">({reviews ? reviews.length : 0} reviews)</span>
            </div>
          </div>

          {/* Reviews Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading reviews...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchReviews}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews && reviews.length > 0 ? reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {review.platform}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{review.category}</p>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(review.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                      </div>
                    </div>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Verified User
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {review.review}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <FiUser className="w-4 h-4" />
                        <span>{review.reviewer}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleVote(review._id, 'helpful')}
                        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                          userVotes[review._id] === 'helpful' 
                            ? 'bg-green-100 text-green-600 border border-green-300' 
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <FiThumbsUp className="w-4 h-4" />
                        <span>{reviewStats[review._id]?.helpful || review.helpful}</span>
                      </button>
                      <button
                        onClick={() => handleVote(review._id, 'unhelpful')}
                        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                          userVotes[review._id] === 'unhelpful' 
                            ? 'bg-red-100 text-red-600 border border-red-300' 
                            : 'hover:bg-gray-100 border border-transparent'
                        }`}
                      >
                        <FiThumbsDown className="w-4 h-4" />
                        <span>{reviewStats[review._id]?.unhelpful || review.unhelpful}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No reviews available yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12 p-8 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Share Your Experience
            </h2>
            <p className="text-gray-600 mb-6">
              Have you used any of our recommended platforms? We'd love to hear about your experience!
            </p>
            <button 
              onClick={() => setShowReviewModal(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Write a Review</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform/Service *
                </label>
                <input
                  type="text"
                  name="platform"
                  required
                  placeholder="e.g., Binance, Deriv, HFM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  <option value="Forex Trading">Forex Trading</option>
                  <option value="Crypto Exchange">Crypto Exchange</option>
                  <option value="Betting Sites">Betting Sites</option>
                  <option value="SaaS Tools">SaaS Tools</option>
                  <option value="Web Hosting">Web Hosting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Your name (will be displayed publicly)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating *
                </label>
                <select
                  name="rating"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a rating</option>
                  <option value="5">5 stars - Excellent</option>
                  <option value="4">4 stars - Very Good</option>
                  <option value="3">3 stars - Good</option>
                  <option value="2">2 stars - Fair</option>
                  <option value="1">1 star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review *
                </label>
                <textarea
                  name="review"
                  required
                  rows="4"
                  placeholder="Share your experience with this platform..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Reviews;
