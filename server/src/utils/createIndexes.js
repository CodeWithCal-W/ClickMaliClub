const mongoose = require('mongoose');
const Deal = require('../models/Deal');
const Category = require('../models/Category');
const BlogPost = require('../models/BlogPost');
const ClickTracking = require('../models/ClickTracking');

const createIndexes = async () => {
  try {
    console.log('🚀 Creating database indexes for better performance...');
    
    // Ensure all model indexes are created (with error handling for existing indexes)
    try {
      await Deal.createIndexes();
    } catch (error) {
      if (error.code === 86) { // IndexKeySpecsConflict
        console.log('📝 Deal indexes already exist, skipping...');
      } else {
        throw error;
      }
    }
    
    try {
      await Category.createIndexes();
    } catch (error) {
      if (error.code === 86) { // IndexKeySpecsConflict
        console.log('📝 Category indexes already exist, skipping...');
      } else {
        throw error;
      }
    }
    
    try {
      await BlogPost.createIndexes();
    } catch (error) {
      if (error.code === 86) { // IndexKeySpecsConflict
        console.log('📝 BlogPost indexes already exist, skipping...');
      } else {
        throw error;
      }
    }
    
    try {
      await ClickTracking.createIndexes();
    } catch (error) {
      if (error.code === 86) { // IndexKeySpecsConflict
        console.log('📝 ClickTracking indexes already exist, skipping...');
      } else {
        throw error;
      }
    }
    
    console.log('✅ All database indexes created successfully');
    
    // List all indexes for verification
    const dealIndexes = await Deal.collection.getIndexes();
    console.log('📊 Deal Collection Indexes:', Object.keys(dealIndexes));
    
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

module.exports = createIndexes;

// Run directly if this file is executed
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('📱 Connected to MongoDB');
      return createIndexes();
    })
    .then(() => {
      console.log('🏁 Index creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error:', error);
      process.exit(1);
    });
}
