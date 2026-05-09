// D:\Foldery\Backend\routes\missionRoutes.js

const express = require('express');
const router = express.Router();

const missionController = require('../Controllers/missionController'); 
const statsController = require('../Controllers/statsController');
const upload = require('../middleware/uploadMiddleware');

// --- Routes ---

// 1. Dashboard & Stats (วางไว้บนสุด)
router.get('/dashboard/stats', missionController.getDashboardStats);
router.post('/stats', statsController.addMissionStats);

// 2. Mission CRUD
router.get('/', missionController.getMissions);
router.get('/:id', missionController.getMissionById);
router.post('/', upload.array('image', 5), missionController.createMission);
router.put('/:id', upload.array('image', 5), missionController.updateMission);
router.delete('/:id', missionController.deleteMission);

module.exports = router;