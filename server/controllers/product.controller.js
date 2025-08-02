const asyncHandler = require('express-async-handler');
const Product = require('../models/product.model');
const Order = require('../models/order.model');

// @desc    Get all products with search, filter, and sort
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category: categoryQuery, sortBy } = req.query;
  const filter = {};

  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }
  if (categoryQuery) {
    filter.category = categoryQuery;
  }

  let sortOptions = { createdAt: -1 };
  if (sortBy === 'price_asc') {
    sortOptions = { price: 1 };
  } else if (sortBy === 'price_desc') {
    sortOptions = { price: -1 };
  }

  const products = await Product.find(filter).sort(sortOptions);

  // Convert Mongoose documents to plain JS objects to avoid Symbol issues
  const plainProducts = products.map((p) => p.toObject());

  res.json({ products: plainProducts, keyword, category: categoryQuery });
});

// @desc    Get a single product by its ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product.toObject()); // Ensure plain object
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get a single product by its slug
// @route   GET /api/products/slug/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    const productData = {
      ...product.toObject(),
      variants: product.variants || [],
    };
    res.json(productData);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already reviewed');
  }

  const hasPurchased = await Order.exists({
    user: req.user._id,
    'products.productId': req.params.id,
  });

  if (!hasPurchased) {
    res.status(403);
    throw new Error("You can only review products you've purchased.");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: 'Review added' });
});

module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProductReview,
};
