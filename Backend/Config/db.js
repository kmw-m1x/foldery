const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // จารย์เติม Option เข้าไปใน {} ตัวที่สองตามนี้เลย
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // บังคับให้ใช้ IPv4 (ไอ้ตัวนี้แหละไม้ตาย!)
      serverSelectionTimeoutMS: 5000, // ถ้าต่อไม่ได้เกิน 5 วิให้ตัดเลย ไม่ต้องรอให้นานปวดหัว
    }); 
    
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); 
  }
};

module.exports = connectDB;