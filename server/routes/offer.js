const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { adminAuth } = require('../middlewares/authMiddleware');

// Add offer (admin only)
router.post('/', adminAuth, offerController.addOffer);
// Validate offer
router.post('/validate', offerController.validateOffer);
// Get all offers
router.get('/', offerController.getAllOffers);

module.exports = router; 