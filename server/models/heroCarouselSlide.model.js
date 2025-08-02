const mongoose = require('mongoose');

const heroCarouselSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, required: true, default: '/' },
    buttonText: { type: String, required: true, default: 'Shop Now' },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
  
const HeroCarouselSlide = mongoose.model('HeroCarouselSlide', heroCarouselSlideSchema);

module.exports = HeroCarouselSlide;
