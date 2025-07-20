const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/authMiddleware');

// Placeholder restaurant routes
router.get('/', (req, res) => {
  res.json({ message: 'Restaurant routes working' });
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