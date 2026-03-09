// middleware/uploadMiddleware.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../Config/cloudinary'); // เรียกไฟล์ config ที่มึงมีอยู่แล้ว

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mission-dashboard', // ชื่อโฟลเดอร์ใน Cloudinary (ตั้งอะไรก็ได้)
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // นามสกุลที่ยอมรับ
  },
});

const upload = multer({ storage: storage });

module.exports = upload;