const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: { type: String, required: true }, // Changed to String for orderId
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Made optional for UPI
  amount: { type: Number, required: true },
  provider: { type: String, enum: ['razorpay', 'paytm', 'phonepe', 'upi'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  paymentId: { type: String },
  upiApp: { type: String }, // For UPI app name
  paymentMethod: { type: String }, // For payment method type
  transactionDetails: { type: Object }, // For additional transaction info
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema); 