const express = require('express');
const router = express.Router();
const { generateUploadSignature } = require('../controllers/upload.controller');
const { 
  getOrders, 
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

// Order Routes
router.route('/orders').get(protect, admin, getOrders);
router.route('/orders/:id').put(protect, admin, updateOrderStatus);

// Product Routes
router.route('/products').post(protect, admin, createProduct);
router.route('/products/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post('/upload/signature', protect, admin, generateUploadSignature);

module.exports = router;