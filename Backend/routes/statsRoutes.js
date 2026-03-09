const express = require('express');
const router = express.Router();




const statsController = require('../Controllers/statsController');






router.put('/', statsController.updateMissionStats);

router.get('/all', statsController.getStats);


module.exports = router;