const createIndexes = require('./utils/createIndexes');

const optimizeDatabase = async () => {
  console.log('🚀 Optimizing database for better performance...');
  
  try {
    // Create indexes
    await createIndexes();
    
    // Add any other optimization tasks here
    console.log('✅ Database optimization completed');
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
  }
};

module.exports = optimizeDatabase;
