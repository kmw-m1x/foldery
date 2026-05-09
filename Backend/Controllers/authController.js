const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'มีชื่อผู้ใช้นี้ในระบบแล้ว' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'admin'
    });

    await newUser.save();

    res.status(201).json({ message: 'สร้างบัญชีสำเร็จ', user: { username: newUser.username, role: newUser.role } });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Use 'email' from frontend, map to 'username' in DB for simplicity, or change DB?
    // Since the frontend form uses "email" (admin@mission.com), let's find by username using the email field
    const username = email;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งานนี้ในระบบ" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านผิด" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HttpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: "เข้าสู่ระบบสำเร็จ",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        mustChangePassword: user.mustChangePassword
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: "ออกจากระบบสำเร็จ" });
};

exports.me = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "ไม่มีสิทธิ์เข้าถึง (No Token)" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้ในระบบ" });
    }

    res.json({ user });
  } catch (error) {
    console.error("Auth Me Error:", error);
    res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};