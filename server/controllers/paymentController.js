const Payment = require('../models/Payment');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret',
});

exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, user, provider } = req.body;
    if (provider !== 'razorpay') return res.status(400).json({ message: 'Only Razorpay supported in demo' });
    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: orderId,
    };
    const order = await razorpay.orders.create(options);
    const payment = new Payment({
      order: orderId,
      user,
      amount,
      provider,
      status: 'pending',
      paymentId: order.id,
    });
    await payment.save();
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    // Webhook payload verification logic here (dummy for now)
    const { paymentId, status } = req.body;
    const payment = await Payment.findOne({ paymentId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    payment.status = status;
    await payment.save();
    res.json({ message: 'Payment status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPI Payment Verification
exports.verifyUPIPayment = async (req, res) => {
  try {
    const { orderId, transactionId, amount, status, upiApp } = req.body;
    
    // Validate required fields
    if (!orderId || !transactionId || !amount || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Check if payment already exists
    let payment = await Payment.findOne({ order: orderId });
    
    if (!payment) {
      // Create new payment record
      payment = new Payment({
        order: orderId,
        user: req.user?.id, // anonymous न डालें
        amount: amount,
        provider: 'upi',
        status: status,
        paymentId: transactionId,
        upiApp: upiApp || 'unknown',
        paymentMethod: 'upi',
        transactionDetails: {
          upiApp: upiApp,
          transactionId: transactionId,
          timestamp: new Date(),
        }
      });
    } else {
      // Update existing payment
      payment.status = status;
      payment.paymentId = transactionId;
      payment.upiApp = upiApp || payment.upiApp;
      payment.transactionDetails = {
        ...payment.transactionDetails,
        upiApp: upiApp,
        transactionId: transactionId,
        lastUpdated: new Date(),
      };
    }

    await payment.save();

    // Update order paymentStatus and status if payment is successful
    if (status === 'success') {
      const Order = require('../models/Order');
      await Order.findOneAndUpdate(
        { orderId: orderId },
        { paymentStatus: 'paid', status: 'processing' }
      );
    }

    // Log payment attempt
    console.log(`UPI Payment ${status}: Order ${orderId}, Amount:  ǀ${amount}, App: ${upiApp}`);

    res.json({
      success: true,
      message: `Payment ${status}`,
      payment: {
        orderId: payment.order,
        transactionId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        upiApp: payment.upiApp,
        timestamp: payment.createdAt
      }
    });

  } catch (err) {
    console.error('UPI Payment verification error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Payment verification failed',
      error: err.message 
    });
  }
};

// Get UPI Payment Status
exports.getUPIPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const payment = await Payment.findOne({ order: orderId });
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      payment: {
        orderId: payment.order,
        transactionId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        upiApp: payment.upiApp,
        timestamp: payment.createdAt,
        lastUpdated: payment.updatedAt
      }
    });

  } catch (err) {
    console.error('Get UPI payment status error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get payment status',
      error: err.message 
    });
  }
};

// Placeholder for Paytm/PhonePe
exports.initiatePaytm = (req, res) => res.status(501).json({ message: 'Paytm integration coming soon' });
exports.initiatePhonePe = (req, res) => res.status(501).json({ message: 'PhonePe integration coming soon' }); 