const asyncHandler = require('express-async-handler'); // For better error handling
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/order.model');
const { sendOrderConfirmationEmail } = require('../utils/sendEmail');

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  const options = {
    amount: amount * 100, // amount in paisa
    currency,
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  const order = await instance.orders.create(options);

  if (!order) {
    res.status(500);
    throw new Error('Error creating Razorpay order');
  }

  res.status(200).json(order);
});

// @desc    Verify the payment signature and save the order
const verifyPayment = asyncHandler(async (req, res) => {
  console.log("VERIFYING PAYMENT. REQUEST BODY:", req.body);
  
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    cartItems,
    totalAmount,
  } = req.body;

  const stringToSign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(stringToSign.toString())
    .digest("hex");

  const isSignatureValid = expectedSignature === razorpay_signature;

  if (!isSignatureValid) {
    res.status(400);
    throw new Error('Payment verification failed. Signature mismatch.');
  }

  // Create order in DB
  const newOrder = new Order({
    userId: req.user._id,
    products: cartItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      slug: item.slug,
      image: item.image,
    })),
    totalAmount: totalAmount,
    paymentDetails: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    },
  });

  const savedOrder = await newOrder.save();

  // Convert to plain object to avoid serialization issues
  const plainOrder = savedOrder.toObject();

  // Send confirmation email
  try {
    if (req.user && req.user.email) {
      await sendOrderConfirmationEmail(req.user.email, plainOrder);
    }
  } catch (emailError) {
    console.error("Non-critical error: Failed to send email after saving order:", emailError);
  }

  // Respond with only necessary info (avoid returning entire Mongoose doc)
  res.status(200).json({
    status: 'success',
    orderNumber: plainOrder.orderNumber,
    paymentId: plainOrder.paymentDetails.razorpay_payment_id,
  });
});

module.exports = { createOrder, verifyPayment };
