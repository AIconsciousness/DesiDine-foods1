const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { userAuth } = require('../middlewares/authMiddleware');

// Initiate payment (Razorpay)
router.post('/initiate', userAuth, paymentController.initiatePayment);
// Verify payment (webhook)
router.post('/verify', paymentController.verifyPayment);

// UPI Payment routes
router.post('/upi/verify', paymentController.verifyUPIPayment);
router.get('/upi/status/:orderId', paymentController.getUPIPaymentStatus);

// Paytm/PhonePe placeholders
router.post('/paytm', paymentController.initiatePaytm);
router.post('/phonepe', paymentController.initiatePhonePe);

module.exports = router; 