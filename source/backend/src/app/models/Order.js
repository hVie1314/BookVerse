const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['COD', 'MOMO'], default: 'COD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['pending', 'picking up', 'shipping', 'delivered', 'cancelled'], default: 'pending' },

    isConfirmed: { type: Boolean, default: false },
}, {
    timestamps: true
});

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;