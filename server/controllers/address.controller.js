const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

// @desc    Add a new address for the logged-in user
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const newAddress = req.body;
    
    if (newAddress.isDefault) {
        user.addresses.forEach(addr => (addr.isDefault = false));
    }
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
});

// @desc    Get all addresses for the logged-in user
const getAddresses = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('addresses');
    res.json(user.addresses);
});

// @desc    Update a specific address
const updateAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) { res.status(404); throw new Error('Address not found'); }
    
    if (req.body.isDefault) {
        user.addresses.forEach(addr => (addr.isDefault = false));
    }
    
    address.set(req.body);
    await user.save();
    res.json(user.addresses);
});

// @desc    Delete a specific address
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (address) {
        await address.deleteOne();
        await user.save();
    }
    res.status(204).send(); // No content to send back
});

// @desc    Toggle the default status of an address
// @route   PUT /api/users/addresses/:addressId/toggle-default
// @access  Private
const toggleDefaultAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const addressToToggle = user.addresses.id(req.params.addressId);
        if (!addressToToggle) {
            res.status(404);
            throw new Error('Address not found');
        }
        const newIsDefaultState = !addressToToggle.isDefault;

        user.addresses.forEach(addr => (addr.isDefault = false));
        addressToToggle.isDefault = newIsDefaultState;
        const hasDefault = user.addresses.some(addr => addr.isDefault);
        if (!hasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = { addAddress, getAddresses, updateAddress, deleteAddress, toggleDefaultAddress };