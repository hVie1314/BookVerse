const mongoose = require('mongoose');
const Review = require('./Review');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    image: { type: String, default: '' },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
});

const BookModel = mongoose.model('Book', BookSchema);
module.exports = BookModel;