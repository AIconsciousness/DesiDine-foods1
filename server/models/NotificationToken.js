const mongoose = require('mongoose');

const notificationTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceToken: { type: String, required: true },
  platform: { type: String, enum: ['android', 'ios', 'web'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('NotificationToken', notificationTokenSchema); 