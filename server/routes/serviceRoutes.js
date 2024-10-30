const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/packages', serviceController.getServicePackages);
router.get('/search', serviceController.searchServices);
router.get('/packages/:id', serviceController.getPackage);
router.get('/:id', serviceController.getService);
router.post('/book', authenticateJWT, serviceController.bookService);
router.post('/packages/book', authenticateJWT, serviceController.bookPackage);
router.get('/:serviceId/covid-restrictions', serviceController.getCovidRestrictions);

module.exports = router;
