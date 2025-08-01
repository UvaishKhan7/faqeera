const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProductReview,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route for fetching multiple products (search, filter, sort)
router.route('/').get(getProducts);

// Public route for fetching a single product by its unique SLUG
router.route('/slug/:slug').get(getProductBySlug); 

// Public route for fetching a single product by its database ID
router.route('/:id').get(getProductById);

// Private route for creating a review for a specific product
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;