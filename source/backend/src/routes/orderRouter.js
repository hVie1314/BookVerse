const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController');

// Create a new order
router.post('/create', orderController.createOrder);

// Update the order status and payment status
router.put('/update/:id', orderController.updateOrderStatus);

// Get all orders for a specific user
router.get('/history/:userId', orderController.getAllOrders);

// Get order details by order ID
router.get('/details/:id', orderController.getOrderById);

module.exports = router;
