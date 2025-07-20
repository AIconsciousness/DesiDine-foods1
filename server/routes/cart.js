const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { userAuth } = require('../middlewares/authMiddleware');

// Get user's cart
router.get('/', userAuth, cartController.getCart);
// Add item to cart
router.post('/add', userAuth, cartController.addToCart);
// Update cart item quantity
router.put('/update', userAuth, cartController.updateCartItem);
// Remove item from cart
router.delete('/remove', userAuth, cartController.removeCartItem);
// Clear cart
router.delete('/clear', userAuth, cartController.clearCart);

module.exports = router; 