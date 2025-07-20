const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Coordinates required' });
    }
    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMenuForRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await MenuItem.find({ restaurant: id });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addRestaurant = async (req, res) => {
  try {
    const { name, location, cuisines, ratings, deliveryFee, image } = req.body;
    const restaurant = new Restaurant({ name, location, cuisines, ratings, deliveryFee, image });
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 