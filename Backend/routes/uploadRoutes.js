const express = require('express');
const router  = express.Router();
const upload  = require('../middleware/uploadMiddleware');

// POST /api/upload — upload single image to Cloudinary
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'ไม่พบไฟล์ที่อัปโหลด' });
  }
  res.json({
    url: req.file.path,         // Cloudinary secure URL
    publicId: req.file.filename // Cloudinary public_id
  });
});

module.exports = router;
