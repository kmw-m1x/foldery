require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/foldery');
    
    const existingAdmin = await User.findOne({ username: 'admin@mission.com' });
    if (existingAdmin) {
      console.log('✅ Admin already exists! You can login with admin@mission.com');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    const admin = new User({
      username: 'admin@mission.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Default Admin created successfully!');
    console.log('Username: admin@mission.com');
    console.log('Password: 12345678');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
