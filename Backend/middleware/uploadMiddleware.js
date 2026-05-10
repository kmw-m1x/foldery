// middleware/uploadMiddleware.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

let storage;

// ตรวจสอบว่ามีการตั้งค่า CLOUDINARY_URL ใน .env หรือไม่
if (process.env.CLOUDINARY_URL) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const cloudinary = require('../Config/cloudinary');
  
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'mission-dashboard',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
  });
} else {
  // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // ใช้ Local Storage ของ Multer
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      // ตั้งชื่อไฟล์ใหม่เพื่อป้องกันชื่อซ้ำ
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
}

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // จำกัดขนาดไฟล์ที่ 10MB
});

module.exports = upload;