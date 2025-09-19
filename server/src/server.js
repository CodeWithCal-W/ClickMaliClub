const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const optimizeDatabase = require('./optimizeDatabase');
const { compressionMiddleware, cacheMiddleware, optimizeResponse } = require('./middleware/performance');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for proper rate limiting
app.set('trust proxy', 1);

// Enable response compression (must be early in middleware stack)
app.use(compressionMiddleware);

// Response optimization middleware
app.use(optimizeResponse);

// Security middleware
app.use(helmet());

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased limit for development - allow 500 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for localhost in development
    return req.ip === '127.0.0.1' || req.ip === '::1';
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request timeout middleware
app.use((req, res, next) => {
  // Set timeout for all requests
  req.setTimeout(30000, () => {
    console.warn('Request timeout for:', req.url);
    if (!res.headersSent) {
      res.status(408).json({ 
        success: false, 
        message: 'Request timeout' 
      });
    }
  });
  next();
});

// Logging middleware
app.use(morgan('combined'));

// Apply caching to public API routes
app.use('/api/categories', cacheMiddleware(600)); // 10 minutes for categories
app.use('/api/deals', cacheMiddleware(300)); // 5 minutes for deals
app.use('/api/blog', cacheMiddleware(900)); // 15 minutes for blog posts

// Mongoose configuration to suppress warnings
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

// Database connection with optimized settings
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clickmaliclub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(async () => {
  console.log('✅ MongoDB connected successfully');
  // Optimize database on startup
  await optimizeDatabase();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ClickMaliClub API',
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Performance monitoring endpoint
app.get('/api/performance', (req, res) => {
  const { getCacheStats } = require('./middleware/performance');
  
  res.json({
    success: true,
    data: {
      cache: getCacheStats(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      uptime: Math.round(process.uptime()) + ' seconds'
    }
  });
});

// Import routes (we'll create these next)
app.use('/api/categories', require('./routes/categories'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/affiliate-links', require('./routes/affiliateLinks'));
app.use('/api/deal-performance', require('./routes/dealPerformance'));
app.use('/api/category-performance', require('./routes/categoryPerformance'));
app.use('/api/sitemap', require('./routes/sitemap'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/revenue-optimization', require('./routes/revenueOptimization'));

// Serve sitemaps at root level
app.use('/', require('./routes/sitemap'));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/email', require('./routes/email'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
