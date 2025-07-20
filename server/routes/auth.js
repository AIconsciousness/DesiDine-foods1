const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { userAuth } = require('../middlewares/authMiddleware');

// Signup
router.post('/signup', authController.signup);

// Verify OTP
router.post('/verify-otp', authController.verifyOtp);

// Login
router.post('/login', authController.login);

// Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// Reset Password
router.post('/reset-password', authController.resetPassword);

// Resend OTP
router.post('/resend-otp', authController.resendOtp);

// Update Profile (requires authentication)
router.put('/update-profile', userAuth, authController.updateProfile);

module.exports = router; 