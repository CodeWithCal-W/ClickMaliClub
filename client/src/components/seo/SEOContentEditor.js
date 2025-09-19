import React, { useState } from 'react';
import useDeviceDetection from '../../hooks/useDeviceDetection';
import MobileOptimizedModal from '../ui/MobileOptimizedModal';

const SEOContentEditor = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData = {},
  type = 'blog' // 'blog', 'deal', 'category'
}) => {
  const device = useDeviceDetection();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    slug: '',
    category: '',
    tags: [],
    author: 'ClickMaliClub Team',
    publishedAt: '',
    status: 'draft',
    ...initialData
  });

  const [activeTab, setActiveTab] = useState('content');
  const [seoScore, setSeoScore] = useState(0);

  // SEO Analysis Function
  const analyzeSEO = () => {
    let score = 0;
    const checks = [];

    // Title checks
    if (formData.title && formData.title.length >= 30 && formData.title.length <= 60) {
      score += 15;
      checks.push({ type: 'success', message: 'Title length is optimal (30-60 characters)' });
    } else {
      checks.push({ type: 'warning', message: 'Title should be 30-60 characters' });
    }

    // Description checks
    if (formData.seoDescription && formData.seoDescription.length >= 120 && formData.seoDescription.length <= 160) {
      score += 15;
      checks.push({ type: 'success', message: 'Meta description length is optimal (120-160 characters)' });
    } else {
      checks.push({ type: 'warning', message: 'Meta description should be 120-160 characters' });
    }

    // Content length
    if (formData.content && formData.content.length >= 300) {
      score += 10;
      checks.push({ type: 'success', message: 'Content length is good (300+ characters)' });
    } else {
      checks.push({ type: 'warning', message: 'Content should be at least 300 characters' });
    }

    // Keywords
    if (formData.seoKeywords && formData.seoKeywords.split(',').length >= 3) {
      score += 10;
      checks.push({ type: 'success', message: 'Good keyword coverage (3+ keywords)' });
    } else {
      checks.push({ type: 'warning', message: 'Add at least 3 relevant keywords' });
    }

    // Featured Image
    if (formData.featuredImage) {
      score += 10;
      checks.push({ type: 'success', message: 'Featured image is set' });
    } else {
      checks.push({ type: 'warning', message: 'Add a featured image' });
    }

    // Slug
    if (formData.slug && formData.slug.length <= 50) {
      score += 10;
      checks.push({ type: 'success', message: 'URL slug is SEO-friendly' });
    } else {
      checks.push({ type: 'warning', message: 'Add a short, descriptive URL slug' });
    }

    // Excerpt
    if (formData.excerpt && formData.excerpt.length >= 100) {
      score += 10;
      checks.push({ type: 'success', message: 'Excerpt is present and detailed' });
    } else {
      checks.push({ type: 'warning', message: 'Add a detailed excerpt (100+ characters)' });
    }

    // Category
    if (formData.category) {
      score += 5;
      checks.push({ type: 'success', message: 'Category is assigned' });
    } else {
      checks.push({ type: 'warning', message: 'Assign a category' });
    }

    // Author
    if (formData.author) {
      score += 5;
      checks.push({ type: 'success', message: 'Author is specified' });
    } else {
      checks.push({ type: 'warning', message: 'Add author information' });
    }

    // Publish date
    if (formData.publishedAt) {
      score += 5;
      checks.push({ type: 'success', message: 'Publish date is set' });
    } else {
      checks.push({ type: 'info', message: 'Set publish date when ready' });
    }

    setSeoScore(score);
    return { score, checks };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }

    // Auto-generate SEO title if not set
    if (field === 'title' && !formData.seoTitle) {
      setFormData(prev => ({
        ...prev,
        seoTitle: `${value} | ClickMaliClub`
      }));
    }
  };

  const handleSave = () => {
    const { score, checks } = analyzeSEO();
    onSave({
      ...formData,
      seoScore: score,
      seoChecks: checks
    });
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'preview', label: 'Preview', icon: '👁️' }
  ];

  if (!isOpen) return null;

  return (
    <MobileOptimizedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${type === 'blog' ? 'Blog Post' : type === 'deal' ? 'Deal' : 'Category'} Editor`}
      size="large"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            <span className={device.isMobile ? 'hidden' : 'block'}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter a compelling title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={device.isMobile ? 8 : 12}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Write your content here..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.content.length} characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Brief description of the content..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => handleInputChange('featuredImage', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          {/* SEO Score */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 dark:text-white">SEO Score</h3>
              <button
                onClick={analyzeSEO}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Analyze
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    seoScore >= 80 ? 'bg-green-500' : seoScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${seoScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {seoScore}/100
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              SEO Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Optimized title for search engines..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.seoTitle.length}/60 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.seoDescription}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Description that appears in search results..."
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.seoDescription.length}/160 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Keywords
            </label>
            <input
              type="text"
              value={formData.seoKeywords}
              onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="keyword1, keyword2, keyword3..."
            />
            <div className="text-xs text-gray-500 mt-1">
              Separate keywords with commas
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="url-friendly-slug"
            />
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Select Category</option>
              <option value="forex">Forex</option>
              <option value="crypto">Crypto</option>
              <option value="betting">Betting</option>
              <option value="saas">SaaS</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange('author', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Publish Date
            </label>
            <input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => handleInputChange('publishedAt', e.target.value)}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Search Result Preview
            </h3>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h4 className="text-blue-600 text-lg hover:underline cursor-pointer">
                {formData.seoTitle || formData.title}
              </h4>
              <p className="text-green-600 text-sm">
                {typeof window !== 'undefined' ? window.location.origin : ''}/blog/{formData.slug}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {formData.seoDescription || formData.excerpt}
              </p>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Social Media Preview
            </h3>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border max-w-md">
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {formData.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {formData.excerpt}
              </p>
              <p className="text-gray-500 text-xs mt-2">ClickMaliClub</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className={`flex ${device.isMobile ? 'flex-col space-y-3' : 'justify-end space-x-3'} mt-8 pt-6 border-t border-gray-200 dark:border-gray-700`}>
        <button
          onClick={onClose}
          className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave({ ...formData, status: 'draft' })}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave({ ...formData, status: 'published' })}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Publish
        </button>
      </div>
    </MobileOptimizedModal>
  );
};

export default SEOContentEditor;
