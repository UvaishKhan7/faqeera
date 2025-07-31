const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // We use asyncHandler to automatically catch any errors and pass them
  // to our centralized error handler.
  
  // The query logic is correct: find all orders where the userId matches the
  // ID of the logged-in user (provided by the 'protect' middleware).
  const orders = await Order.find({ userId: req.user._id }).populate('userId', 'name email').sort({ createdAt: -1 });
  
  // Send the found orders back as JSON.
  res.json(orders);
});

module.exports = { getMyOrders };