const Order = require('../models/Order');
const AppError = require('../../utils/appError');

class OrderController {

    // Create a new order
    async createOrder(req, res, next) {
        try {
            const { userId, items, totalAmount, paymentMethod } = req.body;

            // Create a new order 
            const newOrder = new Order({
                userId,
                items,
                totalAmount,
                paymentMethod,
                paymentStatus: 'pending', // Payment status is 'pending' initially
                orderStatus: 'pending',   // Order status is 'pending' initially
            });

            // Save the order to the database
            const savedOrder = await newOrder.save();
            res.status(201).json({ message: 'Order created successfully', order: savedOrder });
        } catch (error) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error creating order'));
        }
    }

    // Get all orders for a user
    async getAllOrders(req, res, next) {
        try {
            const { userId } = req.params;
            // Fetch all orders for the given user ID
            const orders = await OrderModel.find({ userId });
            res.status(200).json(orders);
        } catch (error) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching orders'));
        }
    }

    // Get order details by order ID
    async getOrderById(req, res, next) {
        try {
            const { orderId } = req.params;
            // Find the order by order ID
            const order = await OrderModel.findById(orderId);
            if (!order) {
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found'));
            }
            res.status(200).json(order);
        } catch (error) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching order'));
        }
    }

    // Update the order status and payment status
    async updateOrderStatus(req, res, next) {
        try {
            const { orderId } = req.params;
            const { orderStatus, paymentStatus } = req.body;  // Status for order and payment

            // Find the order by order ID
            const order = await OrderModel.findById(orderId);
            if (!order) {
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found.'));
            }

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
            const { orderId } = req.params;

            // Find the order by order ID
            const order = await OrderModel.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Set the order as confirmed
            order.isConfirmed = true;
            const confirmedOrder = await order.save();

            res.status(200).json({ message: 'Order confirmed', order: confirmedOrder });
        } catch (error) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error confirming order'));
        }
    }
}

module.exports = new OrderController();
