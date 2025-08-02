const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user with credentials
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, authProvider: 'credentials' });
  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user with credentials
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id); 
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials or authentication method.');
  }
});

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  // The 'protect' middleware has already found the user
  res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
  });
});

// @desc    Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    // Don't update email here. Handle phone number update separately if needed.
    if (req.body.password) {
        if(user.authProvider !== 'credentials'){
            res.status(400);
            throw new Error('Cannot update password for social login accounts.');
        }
        user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      isAdmin: updatedUser.isAdmin, token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };