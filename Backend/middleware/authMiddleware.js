const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret-sud-yod';

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Format: Bearer <token>
  
  if (!token) return res.status(401).json({ error: 'Access denied, No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // ยัดข้อมูล user ใส่ req ไว้ใช้ต่อ
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};