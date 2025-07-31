require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---
const productRoutes = require('./routes/product.routes');
const paymentRoutes = require('./routes/payment.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes'); 

// Test Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Faqeera API' });
});

// Any request
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
const { notFound, errorHandler } = require('./middleware/error.middleware');

app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});