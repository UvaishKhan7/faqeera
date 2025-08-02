const mongoose = require('mongoose');
const { nanoid } = require('nanoid'); // <-- This line was missing

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      // Now that nanoid is imported, this will work perfectly.
      default: () => `ASH-${nanoid(10).toUpperCase()}`,
      unique: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        status: {
        type: String,
        enum: [
          'Order Placed',   // New, better default
          'Processing',     // You are preparing the package
          'Shipped',        // It has been handed to the courier
          'In Transit',     // The package is moving
          'Out for Delivery', // It's on the local truck
          'Delivered',      // Customer received it
          'Cancelled'       // Order was cancelled
        ],
        default: 'Order Placed',
      },
      trackingNumber: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentDetails: {
      razorpay_order_id: { type: String, required: true },
      razorpay_payment_id: { type: String, required: true },
      razorpay_signature: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.virtual('overallStatus').get(function() {
  const productStatuses = this.products.map(p => p.status);
  
  if (productStatuses.every(s => s === 'Delivered')) return 'Delivered';
  if (productStatuses.every(s => s === 'Cancelled')) return 'Cancelled';
  if (productStatuses.some(s => s === 'Shipped' || s === 'Delivered')) return 'Partially Shipped';
  return 'Processing';
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;