const MenuItem = require('../models/MenuItem');

exports.addMenuItem = async (req, res) => {
  try {
    const { restaurant, name, description, price, image, section } = req.body;
    const menuItem = new MenuItem({ restaurant, name, description, price, image, section });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMenuItems = async (req, res) => {
  try {
    const { restaurant } = req.query;
    const filter = restaurant ? { restaurant } : {};
    const menuItems = await MenuItem.find(filter);
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Menu item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 