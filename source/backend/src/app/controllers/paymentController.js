const momo = require('../../utils/momo');
const AppError = require('../../utils/appError');


class PaymentController {

    // [POST] /payment/momo
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

            if (resultCode === 0) {
                
                // TODO: update order status in db
                
            }
            
        } catch (error) {
            throw new AppError(500, "INTERNAL_SERVER_ERROR", error.message);
        }
    }

    // [POST] /payment/momo/check-transaction-status
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