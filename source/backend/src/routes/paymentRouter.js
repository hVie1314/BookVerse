const express = require('express');
const router = express.Router();

const paymentController = require('../app/controllers/paymentController');

router.post('/momo', paymentController.createPayment);
router.post('/momo/callback', paymentController.handleCallback);
router.post('/momo/check-transaction-status', paymentController.checkTransactionStatus);

module.exports = router;