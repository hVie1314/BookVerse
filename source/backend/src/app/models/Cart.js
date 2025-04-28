const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
}, {
    _id: false,
});

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    cartId: { type: String, required: function () { return !this.userId; } },
    products: [CartItemSchema],
    totalPrice: { type: Number, default: 0 },
}, {
    timestamps: true,
});

const CartModel = mongoose.model('Cart', CartSchema);
module.exports = CartModel;