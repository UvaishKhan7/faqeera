const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProductReview,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route for fetching multiple products (with search/filter/sort)
router.route('/').get(getProducts);

// Public route for fetching a single product by its slug
// This MUST come before the /:id route to avoid ambiguity.
router.route('/slug/:slug').get(getProductBySlug);

// Public route for fetching a single product by its database ID
router.route('/:id').get(getProductById);

// Private (user must be logged in) route for creating a review
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;