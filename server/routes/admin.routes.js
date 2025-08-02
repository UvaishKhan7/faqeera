const express = require('express');
const router = express.Router();

const { 
  getOrders, 
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllHeroSlides, 
  getHeroSlideById, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide,
  updateOrderItemStatus
} = require('../controllers/admin.controller');

const { generateUploadSignature } = require('../controllers/upload.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Order Routes
router.route('/orders').get(protect, admin, getOrders);
router.route('/orders/:orderId/items/:itemId').put(protect, admin, updateOrderItemStatus);

// Product Routes
router.route('/products/all').get(protect, admin, getAllProducts);
router.route('/products').post(protect, admin, createProduct);
router.route('/products/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

// Hero Carousel Routes
router.route('/hero-slides').get(protect, admin, getAllHeroSlides).post(protect, admin, createHeroSlide);
router.route('/hero-slides/:id').get(protect, admin, getHeroSlideById).put(protect, admin, updateHeroSlide).delete(protect, admin, deleteHeroSlide);

// User Management Routes
// Note: We'll add the controller logic for this later if needed. For now, the route is correct.
router.route('/users').get(protect, admin, (req, res) => res.json({ message: 'GET users endpoint'}));

// Upload Signature Route
router.post('/upload/signature', protect, admin, generateUploadSignature);

module.exports = router;