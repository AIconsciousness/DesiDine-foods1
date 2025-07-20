const express = require('express');
const router = express.Router();
const cloudinaryService = require('../services/cloudinaryService');

// Dummy multer middleware
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinaryService.uploadImage(req.file);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 