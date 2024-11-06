require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const {
  limiter,
  xssProtection,
  commandInjectionProtection,
  sqlInjectionProtection,
  validateRequest,
  securityHeaders,
  hpp
} = require('./server/middleware/security');

// Import routes
const authRoutes = require('./server/routes/authRoutes');
const serviceRoutes = require('./server/routes/serviceRoutes');
const paymentRoutes = require('./server/routes/paymentRoutes');
const bookingRoutes = require('./server/routes/bookingRoutes');
const seedDatabase = require('./server/utils/seedData');

const app = express();

// Basic middleware (these must come first)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
}));

// Parse JSON and URL-encoded bodies
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Security headers
app.use(securityHeaders);

// Rate limiting
app.use('/api/', limiter);

// Data sanitization (after body parsing, before routes)
app.use(mongoSanitize());
app.use(hpp());
app.use(xssProtection);
app.use(commandInjectionProtection);
app.use(sqlInjectionProtection);
app.use(validateRequest);

// Environment logging
console.log('Environment Check:');
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('JWT Secret exists:', !!process.env.JWT_SECRET);
console.log('Stripe Secret exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('Port:', process.env.PORT);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
.then(async () => {
  console.log('Connected to MongoDB');
  await seedDatabase();
})
.catch(err => {
  console.error('Could not connect to MongoDB:', err.message);
  process.exit(1);
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  if (err.type === 'security') {
    return res.status(403).json({ 
      message: 'Security violation detected',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Access denied'
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      error: err.message
    });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
