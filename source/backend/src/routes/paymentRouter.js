const express = require('express');
const router = express.Router();

const paymentController = require('../app/controllers/paymentController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/momo', authMiddleware.verifyToken, authMiddleware.verifyUser, paymentController.createPayment);
router.post('/momo/check-transaction-status', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin,  paymentController.checkTransactionStatus);
router.post('/momo/callback', paymentController.handleCallback);

module.exports = router;