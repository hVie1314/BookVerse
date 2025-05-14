const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
}, {
    _id: false,
});

const WishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    wishlistId: { type: String, required: function () { return !this.userId; } },
    products: [WishlistItemSchema],
}, {
    timestamps: true,
});

const WishlistModel = mongoose.model('Wishlist', WishlistSchema);
module.exports = WishlistModel;
