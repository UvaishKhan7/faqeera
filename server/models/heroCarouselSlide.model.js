const mongoose = require('mongoose');

const heroCarouselSlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, required: true, default: '/' }, // Where the button links to
    buttonText: { type: String, required: true, default: 'Shop Now' },
    isActive: { type: Boolean, default: true }, // So you can enable/disable slides
    displayOrder: { type: Number, default: 0 }, // To control the order of slides
  },
  {
    timestamps: true,
  }
);

const HeroCarouselSlide = mongoose.model('HeroCarouselSlide', heroCarouselSlideSchema);

module.exports = HeroCarouselSlide;