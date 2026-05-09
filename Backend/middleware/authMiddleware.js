const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "ไม่มีสิทธิ์เข้าถึง (No Token)" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: "Token ไม่ถูกต้องหรือผู้ใช้ถูกลบไปแล้ว" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token หมดอายุหรือไม่ถูกต้อง" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role ของคุณ (${req.user.role}) ไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้` 
      });
    }
    next();
  };
};