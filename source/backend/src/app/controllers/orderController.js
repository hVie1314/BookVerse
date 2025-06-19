const Order = require('../models/Order');
const User = require('../models/User');
const AppError = require('../../utils/appError');
const Book = require('../models/Book');

class OrderController {

    // [POST] /order/create
    async createOrder(req, res, next) {
        try {
            const { userId, items, totalAmount, paymentMethod } = req.body;
          
            // Check if the user exists
            const user = await User.findById(userId);
            if (!user)
                return next(new AppError(404, 'USER_NOT_FOUND', 'User not found'));

            // If the user has no address, prevent the order and ask for an address update
            if (!user.address)
                return next(new AppError(400, 'MISSING_ADDRESS', 'Please update your address before placing an order'));
            
            // Check stock before placing the order
            for (const item of items) {
                const book = await Book.findById(item.bookId);
                if (!book)
                    return res.status(404).json({ errorCode: 'BOOK_NOT_FOUND' });
                if (item.quantity > book.stock)
                    return res.status(400).json({ errorCode: 'NOT_ENOUGH_STOCK' });
            }   
          
            // Create a new order 
            const newOrder = new Order({
                userId: userId,
                items: items,
                totalAmount: totalAmount,
                paymentMethod: paymentMethod,
                orderStatus: 'pending',   // Order status is 'pending' initially
            });

            // Save the order to the database
            const savedOrder = await newOrder.save();

            // Update stock for each item
            for (const item of items) {
                const updatedBook = await Book.findOneAndUpdate(
                    { _id: item.bookId, stock: { $gte: item.quantity } },
                    { $inc: { stock: -item.quantity } },
                    { new: true }
                );
                if (!updatedBook) {
                    // If update fails, rollback by deleting the order
                    await Order.findByIdAndDelete(savedOrder._id);
                    return res.status(400).json({ errorCode: 'NOT_ENOUGH_STOCK' });
                }
            }

            res.status(201).json({ message: 'Order created successfully', order: savedOrder });
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error creating order'));
        }
    }

    // [GET] /order/history/:userId
    async getAllOrdersOfUser(req, res, next) {
        try {
            const { userId } = req.params;
            const user = await User.findById(userId);
            if (!user)
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));

            // Fetch all orders for the given user ID
            const orders = await Order.find({ userId });

            // For each order, join with Book collection to get book details
            const ordersWithDetails = await Promise.all(
                orders.map(order =>
                    Order.findById(order._id).populate([
                        {
                            path: 'items.bookId',
                            model: 'Book',
                            select: 'title author price image',
                        },
                    ])
                )
            );

            res.status(200).json({ orders :  ordersWithDetails });

        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching orders'));
        }
    }

    // [GET] /order/details/:id
    async getOrderById(req, res, next) {
        try {
            // Join with Book and User collections to get book details and user details
            const orderInfo = await Order.findById(req.params.id).populate([
                { 
                    path: 'items.bookId', 
                    model: 'Book', 
                    select: 'title author price image' // Select specific fields
                }
            ]);
            
            if (!orderInfo)
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found'));
            res.status(200).json(orderInfo);

        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching order'));
        }
    }

    // Update the order status 
    async updateOrderStatus(orderId, orderStatusUpdate) {
        try {
            const order = await Order.findById(orderId);
            
            if (!order) 
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found.'));
    
            order.orderStatus = orderStatusUpdate;

            // Save the updated order
            const updatedOrder = await order.save();
            
            return updatedOrder;
        } catch (error) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error updating order'));
        }
    }

    // [POST] /order/cancel/:id
    async cancelOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const order = await Order.findById(orderId);
            if (!order) {
                return next(new AppError(404, 'ORDER_NOT_FOUND', 'Order not found'));
            }

            if (order.orderStatus !== 'pending') {
                return next(new AppError(400, 'INVALID_ORDER_STATUS', 'Only pending orders can be cancelled'));
            }

            order.orderStatus = 'cancelled'; // Update the order status to 'cancelled'
            await order.save(); // Save the updated order
            
            // Update stock for items in the cancelled order
            await Promise.all(order.items.map(item => 
                Book.findByIdAndUpdate(
                    item.bookId,
                    { $inc: { stock: item.quantity } },
                    { new: true }
                )
            ));

            res.status(200).json({ message: 'Order cancelled successfully' });

        }
        catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
        }
    }

    // [POST] /order/statistics
    async getOrderStatistics(req, res, next) {
        try {
            const totalOrders = await Order.countDocuments();
            const successfulOrders = await Order.countDocuments({ orderStatus: 'success' });
            const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });
            const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });

            const statistics = {
                totalOrders,
                successfulOrders,
                cancelledOrders,
                pendingOrders
            };

            res.status(200).json(statistics);

        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR', 'Error fetching order statistics'));
        }
    }
    
}

module.exports = new OrderController();
