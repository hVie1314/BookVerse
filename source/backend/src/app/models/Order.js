const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'MOMO' },
    orderStatus: { type: String, enum: ['pending', 'success', 'cancelled'], default: 'pending' },
}, {
    timestamps: true
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;