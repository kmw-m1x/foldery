const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Self-service: any logged-in user can change their own password (after force-reset)
router.patch('/self/change-password', protect, userController.selfChangePassword);

// All routes below require superadmin
router.use(protect);
router.use(authorize('superadmin'));

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id/reset-password', userController.resetPassword);
router.patch('/:id/force-password-reset', userController.forcePasswordReset);
router.delete('/:id', userController.deleteUser);

module.exports = router;
