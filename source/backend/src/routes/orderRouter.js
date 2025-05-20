const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/create', authMiddleware.verifyToken, authMiddleware.verifyUser, orderController.createOrder);
router.get('/history/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, orderController.getAllOrdersOfUser);
router.get('/details/:id', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, orderController.getOrderById);
router.post('/cancel/:id', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, orderController.cancelOrder);     
router.get('/statistics', authMiddleware.verifyToken, authMiddleware.verifyAdmin, orderController.getOrderStatistics);

module.exports = router;
