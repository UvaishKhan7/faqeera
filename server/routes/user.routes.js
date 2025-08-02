const express = require('express');
const router = express.Router();

const { addAddress, getAddresses, updateAddress, deleteAddress, toggleDefaultAddress } = require('../controllers/address.controller');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// Public Authentication Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private User Profile Routes
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Private User Address Book Routes
router.route('/addresses')
    .post(protect, addAddress)
    .get(protect, getAddresses);
    
router.route('/addresses/:addressId')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

router.route('/addresses/:addressId/toggle-default').put(protect, toggleDefaultAddress);

module.exports = router;