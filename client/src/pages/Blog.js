import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCalendar, FiUser, FiClock, FiTag } from 'react-icons/fi';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/blog');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.data);
        } else {
          setError('Failed to load blog posts');
        }
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Blog - ClickMaliClub</title>
          <meta name="description" content="Read our latest articles and insights on forex, crypto, betting, and more" />
        </Helmet>
        
        <div className="min-h-screen py-16">
          <div className="container-custom">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Blog - ClickMaliClub</title>
          <meta name="description" content="Read our latest articles and insights" />
        </Helmet>
        
        <div className="min-h-screen py-16">
          <div className="container-custom">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Blog</h1>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Blog - ClickMaliClub</title>
        <meta name="description" content="Read our latest articles and insights on forex, crypto, betting, SaaS tools, and web hosting" />
        <meta name="keywords" content="forex trading, cryptocurrency, sports betting, SaaS tools, web hosting, affiliate marketing" />
      </Helmet>
      
      <div className="min-h-screen py-16 bg-gray-50">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest Insights & Guides
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and strategies in forex trading, 
              cryptocurrency, sports betting, and business tools.
            </p>
          </div>

          {/* Featured Posts */}
          {posts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {posts.filter(post => post.isSticky).slice(0, 2).map((post) => (
                  <article key={post._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center space-x-1">
                          <FiCalendar size={14} />
                          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <FiClock size={14} />
                          <span>{post.analytics?.readTime || 5} min read</span>
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag} 
                              className="inline-flex items-center space-x-1 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                            >
                              <FiTag size={10} />
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                        
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* All Posts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <FiCalendar size={14} />
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiClock size={14} />
                        <span>{post.analytics?.readTime || 5}m</span>
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {posts.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600">Check back soon for exciting content!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
