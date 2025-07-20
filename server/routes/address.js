const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { userAuth } = require('../middlewares/authMiddleware');

// Get user addresses
router.get('/', userAuth, addressController.getUserAddresses);

// Add new address
router.post('/', userAuth, addressController.addAddress);

// Update address
router.put('/:id', userAuth, addressController.updateAddress);

// Delete address
router.delete('/:id', userAuth, addressController.deleteAddress);

// Set default address
router.patch('/:id/default', userAuth, addressController.setDefaultAddress);

module.exports = router; 