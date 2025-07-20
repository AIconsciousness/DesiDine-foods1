const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { userAuth } = require('../middlewares/authMiddleware');

// Add review (user)
router.post('/', userAuth, reviewController.addReview);
// Get restaurant reviews
router.get('/:restaurantId', reviewController.getRestaurantReviews);
// Get average rating for restaurant
router.get('/:restaurantId/average', reviewController.getAverageRating);

module.exports = router; 