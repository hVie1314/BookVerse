const momo = require('../../utils/momo');
const AppError = require('../../utils/appError');
const OrderController = require('./orderController'); 
const Order = require('../models/Order');

class PaymentController {

    // [POST] /payment/momo/:userId
    async createPayment(req, res, next) {
        try {
            const { orderId, amount } = req.body;
            const orderInfo = `Thanh toán cho hóa đơn BookVerse với ID: ${orderId}`;
            const paymentCode = orderId; 

            const paymentUrl = await momo.createPayment(amount, orderInfo, paymentCode);

            res.status(200).json({ url: paymentUrl });

        } catch (error) {
            next(error);
        }
    }

    // [POST] /payment/momo/callback
    async handleCallback(req, res, next) {
        try {
            //console.log(req.body);

            const { orderId, resultCode } = req.body;
            let updatedOrder = null;

            if (resultCode === 0) {
                // update order status to success
                updatedOrder = await OrderController.updateOrderStatus(orderId, 'success');      
                
                // update sold for books in the order
                const order = await Order.findById(orderId);
                await Promise.all(order.items.map(item => 
                    Book.findByIdAndUpdate(
                        item.bookId,
                        { $inc: { sold: item.quantity } },
                        { new: true }
                    )
                ));
            }
            else { // timeout or something else
                // update order status to failed
                updatedOrder = await OrderController.updateOrderStatus(orderId, 'cancelled');        
            }
            
            return res.status(200).json({ updatedOrder });

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
        }
    }

    // [POST] /payment/momo/check-transaction-status/:userId
    async checkTransactionStatus(req, res, next) {
        try {
            const { orderId } = req.body;
            const transactionStatus = await momo.checkTransactionStatusByOrderId(orderId);

            res.status(200).json({ status: transactionStatus });
        } catch (error) {
            next(error);
        }
    }
    
}

module.exports = new PaymentController();