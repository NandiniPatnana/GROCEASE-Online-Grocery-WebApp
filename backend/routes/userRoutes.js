const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Get user profile
router.get('/profile', auth, userController.getUserProfile);

// Update user profile
router.put('/profile', auth, userController.updateUserProfile);

// Change password
router.put('/change-password', auth, userController.changePassword);

module.exports = router;
