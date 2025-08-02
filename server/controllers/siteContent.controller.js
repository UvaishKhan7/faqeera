const asyncHandler = require('express-async-handler');
const HeroCarouselSlide = require('../models/heroCarouselSlide.model');

// Helper to sanitize Mongoose documents
const sanitizeDocs = (docs) => {
  return docs.map(doc => {
    const obj = doc.toObject();
    obj._id = obj._id.toString();
    if (obj.createdAt) obj.createdAt = obj.createdAt.toISOString();
    if (obj.updatedAt) obj.updatedAt = obj.updatedAt.toISOString();
    return obj;
  });
};

// @desc    Get all ACTIVE hero slides for the homepage
// @route   GET /api/content/hero-slides
// @access  Public
const getActiveHeroSlides = asyncHandler(async (req, res) => {
  const slides = await HeroCarouselSlide.find({ isActive: true }).sort({ displayOrder: 1 });

  const sanitizedSlides = sanitizeDocs(slides);

  res.json(sanitizedSlides);
});

module.exports = { getActiveHeroSlides };
