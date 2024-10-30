require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./server/routes/authRoutes');
const serviceRoutes = require('./server/routes/serviceRoutes');
const paymentRoutes = require('./server/routes/paymentRoutes');
const bookingRoutes = require('./server/routes/bookingRoutes');
const seedDatabase = require('./server/utils/seedData');

const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Add these logs near the top after require('dotenv').config();
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
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
