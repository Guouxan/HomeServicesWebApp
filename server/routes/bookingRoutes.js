const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateJWT } = require('../middleware/auth');

// Define routes with their corresponding controller functions
router.post('/create', authenticateJWT, bookingController.createBooking);
router.get('/user', authenticateJWT, bookingController.getUserBookings);
router.post('/update-status', authenticateJWT, bookingController.updateBookingStatus);
router.get('/:id', authenticateJWT, bookingController.getBooking);

module.exports = router; 