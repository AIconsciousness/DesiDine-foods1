const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminAuth, (req, res) => {
  res.json({ message: 'Restaurant created' });
});

router.put('/:id', adminAuth, (req, res) => {
  res.json({ message: 'Restaurant updated' });
});

router.delete('/:id', adminAuth, (req, res) => {
  res.json({ message: 'Restaurant deleted' });
});

module.exports = router; 