exports.generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (phone, otp) => {
  // Dummy: In real app, integrate Twilio/Fast2SMS
  console.log(`OTP for ${phone}: ${otp}`);
  return true;
}; 