const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  dateOfBirth: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 