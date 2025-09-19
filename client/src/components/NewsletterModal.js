import React, { useState } from 'react';
import { FiMail, FiUser, FiCheck, FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const NewsletterModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    preferences: {
      categories: ['forex', 'crypto'],
      frequency: 'weekly'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Format data to match backend expectations
      const submitData = {
        email: formData.email,
        fullName: formData.name,
        interests: formData.preferences.categories,
        frequency: formData.preferences.frequency
      };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setFormData({
          email: '',
          name: '',
          preferences: {
            categories: ['forex', 'crypto'],
            frequency: 'weekly'
          }
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setMessage({ type: '', text: '' });
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to subscribe. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        categories: prev.preferences.categories.includes(category)
          ? prev.preferences.categories.filter(c => c !== category)
          : [...prev.preferences.categories, category]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className={`rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Join Our Newsletter</h3>
          <button
            onClick={onClose}
            className={`transition-colors ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get exclusive deals, trading insights, and expert tips delivered to your inbox!
          </p>

          {/* Message */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? theme === 'dark'
                  ? 'bg-green-900 text-green-200 border border-green-700'
                  : 'bg-green-50 text-green-700 border border-green-200'
                : theme === 'dark'
                  ? 'bg-red-900 text-red-200 border border-red-700'
                  : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.type === 'success' ? <FiCheck size={16} /> : <FiX size={16} />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address *
              </label>
              <div className="relative">
                <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} size={16} />
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className={`block text-sm font-medium mb-1 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Full Name (Optional)
              </label>
              <div className="relative">
                <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`} size={16} />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Your Name"
                />
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Interests (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'forex', label: 'Forex Trading' },
                  { id: 'crypto', label: 'Cryptocurrency' },
                  { id: 'betting', label: 'Sports Betting' },
                  { id: 'saas', label: 'SaaS Tools' },
                  { id: 'hosting', label: 'Web Hosting' },
                  { id: 'other', label: 'Other' }
                ].map((category) => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className={`w-4 h-4 text-primary-600 rounded focus:ring-primary-500 ${
                        theme === 'dark' 
                          ? 'border-gray-600 bg-gray-700' 
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Frequency
              </label>
              <select
                value={formData.preferences.frequency}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    frequency: e.target.value
                  }
                }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="daily">Daily Updates</option>
                <option value="weekly">Weekly Digest</option>
                <option value="monthly">Monthly Summary</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !formData.email}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <FiMail size={16} />
                  <span>Subscribe to Newsletter</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterModal;
