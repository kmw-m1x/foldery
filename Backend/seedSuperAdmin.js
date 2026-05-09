require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foldery');
    
    const existingSuper = await User.findOne({ role: 'superadmin' });
    if (existingSuper) {
      console.log('✅ Super Admin already exists in the system!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('superadmin1234', salt);

    const admin = new User({
      username: 'superadmin@mission.com',
      password: hashedPassword,
      role: 'superadmin'
    });

    await admin.save();
    console.log('👑 Super Admin created successfully!');
    console.log('Username: superadmin@mission.com');
    console.log('Password: superadmin1234');
    console.log('⚠️ Please change this password after your first login!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Super Admin:', err);
    process.exit(1);
  }
};

seedSuperAdmin();
