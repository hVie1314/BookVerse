const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: String },
    sold: { type: Number, default: 0 },
    image: { type: String, default: '' }
}, {
    timestamps: true,
});

const ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;
