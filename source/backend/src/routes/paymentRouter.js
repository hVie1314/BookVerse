const express = require('express');
const router = express.Router();

const paymentController = require('../app/controllers/paymentController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/momo/:userId', authMiddleware.verifyToken, authMiddleware.verifyUser, paymentController.createPayment);
router.post('/momo/check-transaction-status/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin,  paymentController.checkTransactionStatus);
router.post('/momo/callback', paymentController.handleCallback);

module.exports = router;