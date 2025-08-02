const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token from the header.
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our backend's JWT_SECRET to get the payload.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Use the ID from the token's payload to fetch the full, fresh user profile from the database.
      // We exclude the password for security.
      req.user = await User.findById(decoded.id).select('-password');
      // Now, req.user is the complete user object: { _id, name, email, isAdmin, ... }

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found for this token');
      }
      
      next(); // The user is valid and attached to the request, proceed.
    } catch (error) {
      console.error('TOKEN VERIFICATION FAILED:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, admin };