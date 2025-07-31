const express = require('express');
const router = express.Router();

// Import the controller functions
const {
  getProducts,
  getProductBySlug,
  getProductById,
  createProductReview,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { createProduct } = require('../controllers/admin.controller');

// Define the routes
// GET /api/products - gets all products
router.route('/').get(getProducts);

// POST /api/products - creates a new product
router.route('/').post(createProduct);

// It's generally good practice to have more specific routes like '/:id'
// before more generic ones like '/:slug' if they could potentially conflict,
// but since IDs and slugs have different formats, this order is fine.
router.route('/:id').get(getProductById); // <-- ADD THIS ROUTE
router.route('/slug/:slug').get(getProductBySlug); // <-- Let's make the slug route more specific to avoid conflicts

// New route for creating a review
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;