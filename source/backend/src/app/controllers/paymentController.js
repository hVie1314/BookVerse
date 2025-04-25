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
    
}

module.exports = new PaymentController();