const express = require('express');
const router = express.Router();

const reviewController = require('../app/controllers/reviewController');

// CRUD routes for books
router.post('/:bookId', reviewController.addReview);                    // [POST] /review/
router.put('/:bookId/:reviewId', reviewController.updateReview);        // [PUT] /review/:id
router.delete('/:bookId/:reviewId', reviewController.deleteReview);     // [DELETE] /review/:id
router.get('/:bookId', reviewController.getAllReviews);                 // [GET] /review/:bookId

module.exports = router;