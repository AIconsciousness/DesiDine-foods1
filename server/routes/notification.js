const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for a user
router.get('/:userId', notificationController.getNotificationsByUser);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router; 