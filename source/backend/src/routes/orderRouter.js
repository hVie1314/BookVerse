const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController');
const { verifyToken, verifyUserOrAdmin, verifyStaff } = require('../app/middlewares/authMiddleware');

// Create a new order
router.post('/create', orderController.createOrder);

// Update the order status and payment status
router.put('/update/:id', orderController.updateOrderStatus);

// Get all orders for a specific user
router.get('/history/:userId', orderController.getAllOrdersOfUser);

// Get order details by order ID
router.get('/details/:id', orderController.getOrderById);

// Cancel Request Routes 
router.post('/cancel/:id', verifyToken, orderController.cancelOrder);     

module.exports = router;
