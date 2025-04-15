const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
            quantity: { type: Number, default: 1 },
        },
    ],
    totalPrice: { type: Number, default: 0 },
}, {
    timestamps: true,
});

const CartModel = mongoose.model('Cart', CartSchema);
module.exports = CartModel;