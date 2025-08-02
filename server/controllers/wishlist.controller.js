const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');

// @desc    Get the logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate({
        path: 'products',
        model: 'Product',
        select: 'name price images slug', // Select fields needed for the Wishlist Card
    });
    
    if (wishlist) {
        res.json(wishlist.products);
    } else {
        // If user doesn't have a wishlist yet, return an empty array.
        res.json([]);
    }
});

// @desc    Add or remove a product from the wishlist (toggle action)
// @route   POST /api/wishlist
// @access  Private
const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) { 
        res.status(404); 
        throw new Error('Product not found'); 
    }
    
    // Find or create the user's wishlist
    let wishlist = await Wishlist.findOne({ userId: userId });
    if (!wishlist) {
        wishlist = await Wishlist.create({ userId: userId, products: [] });
    }

    // Check if the product is already in the wishlist
    const productIndex = wishlist.products.findIndex(p => p.toString() === productId);

    if (productIndex > -1) {
        // If it exists, pull it from the array
        wishlist.products.splice(productIndex, 1);
    } else {
        // If it doesn't exist, add it to the array
        wishlist.products.push(productId);
    }
    
    await wishlist.save();
    
    // Fetch the updated wishlist with populated products to send back
    const updatedWishlist = await Wishlist.findOne({ userId: userId }).populate({
        path: 'products',
        model: 'Product',
        select: 'name price images slug'
    });

    res.status(200).json(updatedWishlist.products || []);
});

module.exports = { getWishlist, toggleWishlist };