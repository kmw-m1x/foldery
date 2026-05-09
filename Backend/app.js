const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// เรียก Route (ทางเดิน API)
const missionRoutes = require('./routes/missionRoutes');
const eventRoutes = require('./routes/events');
const contactRoutes = require('./routes/Contact');
const churchRoutes = require('./routes/churchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const provinceStatRoutes = require('./routes/provinceStatRoutes');
const app = express();

// --- Middleware Zone (ด่านตรวจ) ---

// เปิด CORS ให้ Frontend ยิงมาได้ และอนุญาตให้ส่ง Cookie ได้
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];
app.use(cors({
  origin: true, 
  credentials: true
}));

// อ่านข้อมูล JSON, Form Data และ Cookie ที่ส่งมา
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Routes Zone (ทางเดินรถ) ---

const authRoutes   = require('./routes/authRoutes');
const userRoutes   = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// API หลักสำหรับ Mission
app.use('/api/auth',   authRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/events', eventRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/churches', churchRoutes);

app.use('/api/stats', statsRoutes);
app.use('/api/province-stats', provinceStatRoutes);

// Route เช็คสถานะ Server (Health Check)
app.get('/', (req, res) => {
  res.send('✅ API พร้อมใช้งาน (No Login Version)');
});

// Route ดัก Error (เผื่อใส่ URL มั่ว)
app.use((req, res) => {
  res.status(404).json({ error: 'ไม่พบหน้านี้ (404 Not Found)' });
});

module.exports = app;