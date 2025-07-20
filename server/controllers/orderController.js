const Order = require('../models/Order');
const Cart = require('../models/Cart');

function generateOrderId() {
  return 'OD' + Date.now() + Math.floor(Math.random() * 1000);
}

exports.placeOrder = async (req, res) => {
  try {
    const { restaurant, items, total, paymentStatus } = req.body;
    const orderId = generateOrderId();
    const order = new Order({
      user: req.user.id,
      restaurant,
      items,
      total,
      paymentStatus,
      orderId
    });
    await order.save();
    // Optionally clear cart after order
    await Cart.findOneAndDelete({ user: req.user.id, restaurant });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 