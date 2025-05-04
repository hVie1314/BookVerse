const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController');
const cancelRequestController = require('../app/controllers/cancelRequestController');
const { verifyToken, verifyUserOrAdmin, verifyStaff } = require('../app/middlewares/authMiddleware');

// Create a new order
router.post('/create', orderController.createOrder);

// Update the order status and payment status
router.put('/update/:id', orderController.updateOrderStatus);

// Get all orders for a specific user
router.get('/history/:userId', orderController.getAllOrders);

// Get order details by order ID
router.get('/details/:id', orderController.getOrderById);

// === Cancel Request Routes ===
router.post('/cancel/:id', verifyToken, cancelRequestController.createRequest);      // [POST] /order/cancel/:id
router.patch('/cancel/:id', verifyToken, verifyStaff, cancelRequestController.updateStatus);            // [PATCH] /order/cancel/:id
router.get('/cancel', verifyToken, verifyStaff, cancelRequestController.getAll);                        // [GET] /order/cancel
router.get('/cancel/:id', verifyToken, verifyStaff, cancelRequestController.getById);                   // [GET] /order/cancel/:id

module.exports = router;
