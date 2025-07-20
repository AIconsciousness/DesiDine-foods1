const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  try {
    const { order, restaurant, rating, comment } = req.body;
    const review = new Review({ user: req.user.id, order, restaurant, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurant: restaurantId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await Review.aggregate([
      { $match: { restaurant: require('mongoose').Types.ObjectId(restaurantId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    res.json({ avgRating: result[0]?.avgRating || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 