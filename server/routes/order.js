const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { userAuth } = require('../middlewares/authMiddleware');

// Place order
router.post('/place', userAuth, orderController.placeOrder);
// Get user order history
router.get('/user/:id', userAuth, orderController.getUserOrders);

module.exports = router; 