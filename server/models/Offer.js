const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percent', 'amount'], required: true },
  value: { type: Number, required: true },
  expiry: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema); 