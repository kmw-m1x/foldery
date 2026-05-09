require('dotenv').config({ override: true }); // โหลด .env บรรทัดแรกเสมอ! และบังคับทับค่าเดิมในระบบ

const app = require('./app'); // เรียกสมองมา
const connectDB = require('./Config/db'); // เรียกฐานข้อมูลมา

const PORT = process.env.PORT || 3000;

// 1. ต่อ Database ก่อน
connectDB();

// 2. สตาร์ท Server
app.listen(PORT, () => {
  console.log(`✅ Server สตาร์ทแล้วที่ http://localhost:${PORT}`);
  console.log(`✅ API (Swagger): http://localhost:${PORT}/api-docs`);
});