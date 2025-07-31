const express = require('express');
const router = express.Router();
const { getMyOrders } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

// Any request to this route will first be checked by the 'protect' middleware
router.route('/myorders').get(protect, getMyOrders);

module.exports = router;