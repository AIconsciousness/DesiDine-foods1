const User = require('../models/User');
const otpService = require('../services/otpService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper: Multilingual error messages
const messages = {
  en: {
    userExists: 'User already exists.',
    userNotFound: 'User not found.',
    invalidOtp: 'Invalid or expired OTP.',
    invalidCredentials: 'Invalid credentials.',
    otpSent: 'OTP sent successfully.',
    signupSuccess: 'Signup successful. Please verify OTP.',
    loginSuccess: 'Login successful.',
    passwordReset: 'Password reset successful.',
    otpResent: 'OTP resent successfully.'
  },
  hi: {
    userExists: 'यूज़र पहले से मौजूद है।',
    userNotFound: 'यूज़र नहीं मिला।',
    invalidOtp: 'गलत या एक्सपायर हुआ OTP।',
    invalidCredentials: 'गलत जानकारी।',
    otpSent: 'OTP सफलतापूर्वक भेजा गया।',
    signupSuccess: 'साइनअप सफल। कृपया OTP वेरीफाई करें।',
    loginSuccess: 'लॉगिन सफल।',
    passwordReset: 'पासवर्ड सफलतापूर्वक रीसेट हुआ।',
    otpResent: 'OTP फिर से भेजा गया।'
  }
};

const getMsg = (lang, key) => (messages[lang] && messages[lang][key]) || messages.en[key];

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password, language } = req.body;
    const lang = language || 'en';
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) return res.status(400).json({ message: getMsg(lang, 'userExists') });
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const otp = otpService.generateOtp();
    user = new User({ name, email, phone, password: hashed, otp, language: lang });
    await user.save();
    await otpService.sendOtp(phone, otp);
    res.status(201).json({ message: getMsg(lang, 'signupSuccess') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp, language } = req.body;
    const lang = language || 'en';
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: getMsg(lang, 'userNotFound') });
    if (user.otp !== otp) return res.status(400).json({ message: getMsg(lang, 'invalidOtp') });
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    res.json({ message: getMsg(lang, 'loginSuccess') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password, language } = req.body;
    const lang = language || 'en';
    const user = await User.findOne({ $or: [{ email: emailOrPhone }, { phone: emailOrPhone }] });
    if (!user) return res.status(404).json({ message: getMsg(lang, 'userNotFound') });
    if (!user.isVerified) return res.status(403).json({ message: getMsg(lang, 'invalidOtp') });
    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: getMsg(lang, 'invalidCredentials') });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { phone, language } = req.body;
    const lang = language || 'en';
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: getMsg(lang, 'userNotFound') });
    const otp = otpService.generateOtp();
    user.otp = otp;
    await user.save();
    await otpService.sendOtp(phone, otp);
    res.json({ message: getMsg(lang, 'otpSent') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword, language } = req.body;
    const lang = language || 'en';
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: getMsg(lang, 'userNotFound') });
    if (user.otp !== otp) return res.status(400).json({ message: getMsg(lang, 'invalidOtp') });
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();
    res.json({ message: getMsg(lang, 'passwordReset') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { phone, language } = req.body;
    const lang = language || 'en';
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: getMsg(lang, 'userNotFound') });
    const otp = otpService.generateOtp();
    user.otp = otp;
    await user.save();
    await otpService.sendOtp(phone, otp);
    res.json({ message: getMsg(lang, 'otpResent') });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 