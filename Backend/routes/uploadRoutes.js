const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/uploadMiddleware');

// POST /api/upload — upload single image
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
  }
  
  let imageUrl = req.file.path;
  
  // ถ้าเป็นการอัปโหลดลง local storage path จะไม่มีคำว่า http ให้เติม URL เข้าไป
  if (!imageUrl.startsWith('http')) {
    imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }

  res.json({
    url: imageUrl,
    publicId: req.file.filename || req.file.filename
  });
});

module.exports = router;
