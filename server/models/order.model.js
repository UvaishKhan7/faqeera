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
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    shippingInfo: {
      trackingNumber: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;