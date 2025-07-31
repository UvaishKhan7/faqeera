const mongoose = require('mongoose');

// Define a new schema for individual reviews
const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true }, // User's name to display
    rating: { type: Number, required: true }, // A number from 1 to 5
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// --- NEW: Define a schema for individual variants (Size/Color/Stock) ---
const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true, // Slugs should be unique for URLs
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Kids', 'Accessories'], // Pre-defined categories
    },
    brand: {
      type: String,
      default: 'Faqeera', // Our brand name is the default
    },
    images: [
      {
        type: String, // An array of URLs for product images
        required: true,
      },
    ],
    // We can add more fields like sizes, colors, etc. later
    variants: [variantSchema],
    reviews: [reviewSchema], // An array of review documents
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;