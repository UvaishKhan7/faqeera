const asyncHandler = require('express-async-handler');
const HeroCarouselSlide = require('../models/heroCarouselSlide.model');

// @desc    Get all ACTIVE hero slides for the homepage
// @route   GET /api/content/hero-slides
// @access  Public
const getActiveHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroCarouselSlide.find({ isActive: true }).sort({ displayOrder: 1 });
  res.json(slides);
});

module.exports = { getActiveHeroSlides };