// D:\Foldery\Backend\routes\missionRoutes.js

const express = require('express');
const router = express.Router();

// เช็ค path ให้ดีนะ ว่าโฟลเดอร์มึงชื่อ Controllers (ตัวใหญ่) หรือ controllers (ตัวเล็ก)
const missionController = require('../Controllers/missionController'); 
const statsController = require('../Controllers/statsController');


// ✅ เหลือบรรทัดนี้อันเดียวพอ เพราะไฟล์มึงชื่อ uploadMiddleware.js
const upload = require('../middleware/uploadMiddleware');

// --- Routes ---

// GET ทั้งหมด (Map)
router.get('/', missionController.getMissions);

// GET สถิติรวม (Dashboard) ** ต้องวางไว้บนสุดในบรรดา GET ID **


router.post('/', upload.array('image', 5), missionController.createMission);

router.post('/stats', statsController.addMissionStats);

router.delete('/:id', missionController.deleteMission);

module.exports = router;