const express = require('express');
const router = express.Router();
const churchController = require('../Controllers/churchController');

router.get('/missions', churchController.getMissions);
router.get('/dashboard-stats', churchController.getDashboardStats);



module.exports = router;