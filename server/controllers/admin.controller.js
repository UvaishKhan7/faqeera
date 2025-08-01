const asyncHandler = require('express-async-handler');
const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { sendShippingConfirmationEmail } = require('../utils/sendEmail');
const HeroCarouselSlide = require('../models/heroCarouselSlide.model');

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

// @desc    Get all products for ADMIN use (simple list)
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 });
  // This only returns the array, which is what the admin page needs.
  res.json(products);
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

// --- HERO CAROUSEL SLIDE MANAGEMENT ---

const getAllHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroCarouselSlide.find({}).sort({ displayOrder: 1 });
  res.json(slides);
});

// @desc    Get a single hero slide by ID
const getHeroSlideById = asyncHandler(async (req, res) => {
    const slide = await HeroCarouselSlide.findById(req.params.id);
    if (slide) {
        res.json(slide);
    } else {
        res.status(404);
        throw new Error('Hero slide not found');
    }
});

const createHeroSlide = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, linkUrl, buttonText, isActive, displayOrder } = req.body;
  // This line will now work correctly because the model is imported.
  const newSlide = new HeroCarouselSlide({ title, description, imageUrl, linkUrl, buttonText, isActive, displayOrder });
  const createdSlide = await newSlide.save();
  res.status(201).json(createdSlide);
});

const updateHeroSlide = asyncHandler(async (req, res) => {
  const { title, description, imageUrl, linkUrl, buttonText, isActive, displayOrder } = req.body;
  const slide = await HeroCarouselSlide.findById(req.params.id);
  if (slide) {
    slide.title = title;
    slide.description = description;
    slide.imageUrl = imageUrl;
    slide.linkUrl = linkUrl;
    slide.buttonText = buttonText;
    slide.isActive = isActive;
    slide.displayOrder = displayOrder;
    const updatedSlide = await slide.save();
    res.json(updatedSlide);
  } else {
    res.status(404);
    throw new Error('Hero slide not found');
  }
});

const deleteHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroCarouselSlide.findById(req.params.id);
  if (slide) {
    await slide.deleteOne();
    res.json({ message: 'Hero slide removed' });
  } else {
    res.status(404);
    throw new Error('Hero slide not found');
  }
});

module.exports = { 
  getOrders, 
  updateOrderStatus,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
