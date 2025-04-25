const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController');

// Create a new order
router.post('/create', orderController.createOrder);

// Update the order status and payment status
router.put('/update/:id', orderController.updateOrderStatus);

// Confirm the order (set isConfirmed to true)
router.put('/confirm/:id', orderController.confirmOrder);

// Get all orders for a specific user
router.get('/:userId', orderController.getAllOrders);

// Get order details by order ID
router.get('/details/:id', orderController.getOrderById);

module.exports = router;
