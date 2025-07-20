exports.sendPushNotification = async (deviceToken, title, body, data = {}) => {
  // TODO: Integrate with Firebase Cloud Messaging (FCM)
  console.log(`Push notification to ${deviceToken}: ${title} - ${body}`);
  return true;
}; 