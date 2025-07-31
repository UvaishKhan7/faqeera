const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
});

const admin = (req, res, next) => {
  // 'protect' middleware should have already run, attaching req.user
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed to the next function
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };