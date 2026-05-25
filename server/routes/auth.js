const express = require('express');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/request-otp', AuthController.requestOTP);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.put('/profile', authMiddleware, AuthController.updateProfile);
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
