const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup
router.post('/signup', authController.signup);
// Verify OTP
router.post('/verify-otp', authController.verifyOtp);
// Login
router.post('/login', authController.login);
// Password reset (request OTP)
router.post('/forgot-password', authController.forgotPassword);
// Password reset (verify OTP & set new password)
router.post('/reset-password', authController.resetPassword);
// Resend OTP
router.post('/resend-otp', authController.resendOtp);

module.exports = router; 