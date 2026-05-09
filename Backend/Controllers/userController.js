const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. GET /api/users - ดูรายชื่อ Admin ทั้งหมด
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: error.message });
  }
};

// 2. POST /api/users - สร้างบัญชี Admin ใหม่
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'มีชื่อผู้ใช้นี้ในระบบแล้ว' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: role || 'admin' // ให้ superadmin เลือกได้ว่าจะเป็น admin หรือ superadmin
    });

    await newUser.save();
    res.status(201).json({ message: 'สร้างบัญชีสำเร็จ', user: { _id: newUser._id, username: newUser.username, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างบัญชี', error: error.message });
  }
};

// 3. PUT /api/users/:id/reset-password - รีเซ็ตรหัสผ่าน
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'กรุณาระบุรหัสผ่านใหม่' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    res.json({ message: 'รีเซ็ตรหัสผ่านสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน', error: error.message });
  }
};

// 5. PATCH /api/users/:id/force-password-reset (superadmin only)
exports.forcePasswordReset = async (req, res) => {
  try {
    const { password, superadminPassword } = req.body;
    if (!password || !superadminPassword) {
      return res.status(400).json({ message: 'กรุณาระบุรหัสผ่านใหม่และรหัสผ่านของคุณ' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    // Verify superadmin's own password first
    const superAdmin = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(superadminPassword, superAdmin.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'รหัสผ่านของคุณไม่ถูกต้อง' });
    }

    // Prevent resetting own password with this endpoint
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'ไม่สามารถรีเซ็ตรหัสผ่านตัวเองผ่านช่องทางนี้ได้' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(req.params.id, {
      password: hashedPassword,
      mustChangePassword: true  // Force the user to change on next login
    });

    res.json({ message: `รีเซ็ตรหัสผ่านของ ${targetUser.username} สำเร็จ` });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};

// 6. PATCH /api/users/self/change-password — self-service after mustChangePassword
exports.selfChangePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user._id, {
      password: hashed,
      mustChangePassword: false  // Clear the flag after successful change
    });

    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'ไม่สามารถลบบัญชีตัวเองได้' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    }

    res.json({ message: 'ลบบัญชีสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบบัญชี', error: error.message });
  }
};
