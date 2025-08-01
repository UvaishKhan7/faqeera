require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize App
const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Get the allowed origins from your .env file. It will be a comma-separated string.
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];

const corsOptions = {
  origin: (origin, callback) => {
    // The '!origin' allows server-to-server requests and tools like Postman.
    // The indexOf check is for browsers.
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed.`);
      callback(new Error('This origin is not allowed by CORS.'));
    }
  },
  // We must also explicitly allow the methods and headers our frontend uses.
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

// First, handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Then, use the CORS policy for all other requests
app.use(cors(corsOptions));

app.use(express.json());

// --- ROUTES ---
const productRoutes = require('./routes/product.routes');
const paymentRoutes = require('./routes/payment.routes');
const userRoutes = require('./routes/user.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const uploadRoutes = require('./routes/upload.routes');
const siteContentRoutes = require('./routes/siteContent.routes');

// Test Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Faqeera API' });
});

// requests
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/api/content', siteContentRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
const { notFound, errorHandler } = require('./middleware/error.middleware');
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});