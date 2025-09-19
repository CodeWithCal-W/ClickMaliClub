const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('./models/Admin');

const setupCorrectAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clickmaliclub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear all existing admin accounts first
    await Admin.deleteMany({});
    console.log('🗑️ Cleared all existing admin accounts');

    // Define the 3 admin accounts you specified
    const adminAccounts = [
      {
        email: 'calmikew@gmail.com',
        password: 'TempPass2025$!',
        name: 'Calvin Michael W',
        role: 'admin' // Super admin
      },
      {
        email: 'clickmaliclub@gmail.com', 
        password: 'TempPass2025$!',
        name: 'ClickMali Club Admin',
        role: 'admin' // Regular admin
      },
      {
        email: 'calwasambla@gmail.com',
        password: 'TempPass2025$!', 
        name: 'Calvin Wasambla',
        role: 'admin' // Regular admin
      }
    ];

    // Create each admin account
    for (const adminData of adminAccounts) {
      const newAdmin = new Admin(adminData);
      await newAdmin.save();
      console.log(`✅ Created admin account: ${adminData.email} (${adminData.name})`);
    }

    console.log('\n🎉 Admin accounts setup completed successfully!');
    console.log('\n📧 Admin Login Credentials (EMAIL + PASSWORD ONLY):');
    console.log('   1. calmikew@gmail.com (Super Admin)');
    console.log('   2. clickmaliclub@gmail.com (Regular Admin)'); 
    console.log('   3. calwasambla@gmail.com (Regular Admin)');
    console.log('\n🔐 Password for all accounts: TempPass2025$!');
    console.log('\n⚠️  IMPORTANT: You can change passwords after deployment using the forgot password feature!');

  } catch (error) {
    console.error('❌ Error setting up admin accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📱 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the setup
setupCorrectAdmins();