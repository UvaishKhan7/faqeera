const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { sendShippingConfirmationEmail } = require('../utils/sendEmail');

// @desc    Get all orders
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('userId', 'email name');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const { status, trackingNumber } = req.body;
  order.status = status || order.status;

  if (status === 'Shipped' && trackingNumber) {
    order.shippingInfo = { trackingNumber };
  }

  const updatedOrder = await order.save();

  if (updatedOrder.status === 'Shipped' && updatedOrder.userId?.email) {
    try {
      await sendShippingConfirmationEmail(updatedOrder.userId?.email, updatedOrder);
    } catch (emailError) {
      console.error("Non-critical error: Failed to send shipping email:", emailError);
    }
  }
  
  res.json(updatedOrder);
});

// @desc    Create a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, price, category, images, variants } = req.body;
  const product = new Product({
    name, slug, description, price, category, images, variants,
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product by ID
const updateProduct = asyncHandler(async (req, res) => {
  const { name, slug, description, price, category, images, variants } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.name = name || product.name;
  product.slug = slug || product.slug;
  product.description = description || product.description;
  product.price = price || product.price;
  product.category = category || product.category;
  product.images = images || product.images;
  product.variants = variants || product.variants;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});


module.exports = { 
  getOrders, 
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct
};