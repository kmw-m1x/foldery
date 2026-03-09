const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const User = require('../models/User'); // สมมติมึงมี Model User

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. หา User จาก Email (อันนี้ Mock ให้ดูก่อนนะ ถ้ามี DB จริงต้องใช้คำสั่ง SQL)
    // const user = await User.findOne({ where: { email } });
    
    // --- Mock Data (สมมติว่าเจอใน DB) ---
    const user = { 
      id: 1, 
      email: 'admin@mission.com', 
      passwordHash: '$2b$10$.....', // รหัสที่ Hash แล้ว (สมมติ)
      role: 'admin' 
    }; 
    // ----------------------------------

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งานนี้" });
    }

    // 2. เช็ค Password (เอา password ที่ส่งมา เทียบกับ Hash ใน DB)
    // const isMatch = await bcrypt.compare(password, user.passwordHash);
    const isMatch = true; // (Mock ให้ผ่านไปก่อน)

    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านผิด" });
    }

    // 3. สร้าง Token (แจกบัตรผ่าน)
    const token = jwt.sign(
      { id: user.id, role: user.role }, // ข้อมูลที่จะฝังในบัตร
      process.env.JWT_SECRET,           // กุญแจลับ (ต้องตรงกับ Middleware)
      { expiresIn: '1d' }               // บัตรหมดอายุใน 1 วัน
    );

    // 4. ส่งกลับไปหน้าบ้าน
    res.json({
      message: "Login สำเร็จ",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};