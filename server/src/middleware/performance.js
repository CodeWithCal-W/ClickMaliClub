const compression = require('compression');
const NodeCache = require('node-cache');

// Create cache instance with 5 minute TTL
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every minute
  maxKeys: 1000 // Limit cache size
});

// Cache middleware for API responses
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for admin routes and real-time data
    if (req.url.includes('/admin') || req.url.includes('/stats')) {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`📦 Cache hit for: ${key}`);
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data) {
      // Only cache successful responses
      if (res.statusCode === 200 && data) {
        cache.set(key, data, duration);
        console.log(`💾 Cached response for: ${key}`);
      }
      
      // Call original json method
      originalJson.call(this, data);
    };

    next();
  };
};

// Compression middleware with optimized settings
const compressionMiddleware = compression({
  // Only compress responses larger than 1kb
  threshold: 1024,
  
  // Compression level (1-9, 6 is default)
  level: 6,
  
  // Memory level (1-9, 8 is default)
  memLevel: 8,
  
  // Only compress these mime types
  filter: (req, res) => {
    // Don't compress responses if this request is proxied
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Use compression filter function
    return compression.filter(req, res);
  }
});

// Response optimization middleware
const optimizeResponse = (req, res, next) => {
  // Remove unnecessary headers
  res.removeHeader('X-Powered-By');
  
  // Add cache control headers for static content
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
  } else if (req.url.includes('/api/deals') || req.url.includes('/api/categories')) {
    res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  
  next();
};

// Clear cache for specific patterns
const clearCache = (pattern) => {
  const keys = cache.keys();
  const keysToDelete = keys.filter(key => key.includes(pattern));
  
  keysToDelete.forEach(key => {
    cache.del(key);
  });
  
  console.log(`🗑️ Cleared ${keysToDelete.length} cache entries matching: ${pattern}`);
};

// Cache statistics
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

module.exports = {
  cache,
  cacheMiddleware,
  compressionMiddleware,
  optimizeResponse,
  clearCache,
  getCacheStats
};
