const express = require('express');
const cors = require('cors');

// เรียก Route (ทางเดิน API)
const missionRoutes = require('./routes/missionRoutes');
const eventRoutes = require('./routes/events');
const contactRoutes = require('./routes/Contact');
const churchRoutes = require('./routes/churchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const app = express();

// --- Middleware Zone (ด่านตรวจ) ---

// เปิด CORS ให้ Frontend ยิงมาได้
app.use(cors()); 

// อ่านข้อมูล JSON และ Form Data ที่ส่งมา
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes Zone (ทางเดินรถ) ---

// API หลักสำหรับ Mission
app.use('/api/missions', missionRoutes);
app.use('/api/events', eventRoutes);

app.use('/api/contact', contactRoutes);

app.use('/api/churches', churchRoutes);

app.use('/api/stats', statsRoutes);

// Route เช็คสถานะ Server (Health Check)
app.get('/', (req, res) => {
  res.send('✅ API พร้อมใช้งาน (No Login Version)');
});

// Route ดัก Error (เผื่อใส่ URL มั่ว)
app.use((req, res) => {
  res.status(404).json({ error: 'ไม่พบหน้านี้ (404 Not Found)' });
});

module.exports = app;