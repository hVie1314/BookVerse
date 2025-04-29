const Order = require('../models/Order');
const User = require('../models/User');
const AppError = require('../../utils/appError');

class OrderController {

    // Create a new order
    async createOrder(req, res, next) {
        try {
            const { userId, items, totalAmount, paymentMethod } = req.body;

            // Create a new order 
            const newOrder = new Order({
                userId: userId,
                items: items,
                totalAmount: totalAmount,
                paymentMethod: paymentMethod,
                paymentStatus: 'pending', // Payment status is 'pending' initially
                orderStatus: 'pending',   // Order status is 'pending' initially
            });

            // Save the order to the database
            const savedOrder = await newOrder.save();
            res.status(201).json({ message: 'Order created successfully', order: savedOrder });
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error creating order'));
        }
    }

    // Get all orders for a user
    async getAllOrders(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);
            if (!user)
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));

            // Fetch all orders for the given user ID
            const orders = await Order.find({ userId });
            res.status(200).json(orders);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching orders'));
        }
    }

    // Get order details by order ID
    async getOrderById(req, res, next) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order)
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found'));
            res.status(200).json(order);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching order'));
        }
    }

    // Update the order status and payment status
    async updateOrderStatus(req, res, next) {
        try {
            const { orderStatus, paymentStatus } = req.body;  // Status for order and payment

            // Find the order by order ID
            const order = await Order.findById(req.params.id);
            if (!order)
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found.'));

            // Update the order status and payment status if provided
            order.orderStatus = orderStatus || order.orderStatus;
            order.paymentStatus = paymentStatus || order.paymentStatus;

            // Save the updated order
            const updatedOrder = await order.save();
            res.status(200).json({message: 'Order status updated successfully', order: updatedOrder});
        } catch (error) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error updating order'));
        }
    }

    // Confirm the order by setting isConfirmed to true
    async confirmOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order)
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found.'));

            // Set the order as confirmed
            order.isConfirmed = true;
            order.orderStatus = 'picking up';
            const confirmedOrder = await order.save();
            res.status(200).json({ message: 'Order confirmed', order: confirmedOrder });
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error confirming order'));
        }
    }
}

module.exports = new OrderController();
