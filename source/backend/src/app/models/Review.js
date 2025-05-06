const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved'
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'create_at', updatedAt: 'update_at' }
});

const Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;