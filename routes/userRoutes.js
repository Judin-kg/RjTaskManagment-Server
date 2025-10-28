const express = require('express');
const router = express.Router();
// const { getUserProfile } = require('../controllers/userController');
const requireAuth = require('../middleware/authMiddleware');

// router.get('/profile', requireAuth, getUserProfile);

module.exports = router;