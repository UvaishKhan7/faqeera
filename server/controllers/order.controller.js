const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  // Convert each order document to a plain JS object
  const sanitizedOrders = orders.map(order => {
    const obj = order.toObject();
    return {
      _id: obj._id,
      userId: obj.userId, // already populated as plain object (name, email)
      items: obj.items,
      totalAmount: obj.totalAmount,
      status: obj.status,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      // Include any other fields you want to expose
    };
  });

  res.json(sanitizedOrders);
});

module.exports = { getMyOrders };
