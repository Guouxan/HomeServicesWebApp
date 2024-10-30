const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/create-payment-intent', authenticateJWT, paymentController.createPaymentIntent);

module.exports = router;
