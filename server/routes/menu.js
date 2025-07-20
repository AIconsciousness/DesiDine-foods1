const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { adminAuth } = require('../middlewares/authMiddleware');

// POST new menu item (admin only)
router.post('/', adminAuth, menuController.addMenuItem);
// GET all menu items (optionally by restaurant)
router.get('/', menuController.getAllMenuItems);
// PUT update menu item (admin only)
router.put('/:id', adminAuth, menuController.updateMenuItem);
// DELETE menu item (admin only)
router.delete('/:id', adminAuth, menuController.deleteMenuItem);

module.exports = router; 