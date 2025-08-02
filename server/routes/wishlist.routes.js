const express = require('express');
const router = express.Router();
const { getWishlist, toggleWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

// We apply the 'protect' middleware to both routes to ensure only logged-in users can access them.
router.route('/')
    .get(protect, getWishlist)
    .post(protect, toggleWishlist);

module.exports = router;