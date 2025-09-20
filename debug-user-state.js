const mongoose = require('mongoose');
require('dotenv').config();

// User schema definition
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "cashier"], default: "cashier" },
  outletId: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet" },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function debugUserAuthState() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📡 Connected to MongoDB');

    // Find all users and their auth state
    const users = await User.find({}, {
      email: 1,
      firstName: 1,
      lastName: 1,
      role: 1,
      lastLogin: 1,
      lastLogout: 1,
      isActive: 1
    }).exec();

    console.log('\n👥 User Authentication States:');
    console.log('=====================================');

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Last Login: ${user.lastLogin || 'Never'}`);
      console.log(`   Last Logout: ${user.lastLogout || 'Never'}`);
      
      // Check if logout is after login (problematic state)
      if (user.lastLogout && user.lastLogin && user.lastLogout > user.lastLogin) {
        console.log(`   ⚠️  PROBLEM: Last logout (${user.lastLogout}) is after last login (${user.lastLogin})`);
        console.log(`       This will cause 401 errors for any tokens issued before logout time`);
      } else if (user.lastLogout && !user.lastLogin) {
        console.log(`   ⚠️  PROBLEM: User has logout time but no login time`);
      } else {
        console.log(`   ✅ Auth state looks good`);
      }
    });

    // Option to fix problematic states
    console.log('\n🔧 Clearing all lastLogout timestamps to fix authentication...');
    
    const result = await User.updateMany(
      { lastLogout: { $exists: true, $ne: null } },
      { $unset: { lastLogout: 1 } }
    );
    
    console.log(`✅ Cleared lastLogout for ${result.modifiedCount} users`);
    
    console.log('\n📝 Summary:');
    console.log('- All users should now be able to authenticate properly');
    console.log('- Restart the backend server to ensure clean state');
    console.log('- Try logging in again - 401 errors should be resolved');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n📡 Disconnected from MongoDB');
  }
}

debugUserAuthState();