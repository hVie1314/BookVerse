const express = require('express');
const router = express.Router();
const reviewController = require('../app/controllers/reviewController');
const { verifyToken, verifyStaff } = require('../app/middlewares/authMiddleware');

// CRUD routes for books
router.post('/:bookId', reviewController.addReview);                                                // [POST] /review/
router.put('/:bookId/:reviewId', reviewController.updateReview);                                    // [PUT] /review/:id
router.delete('/:bookId/:reviewId', verifyToken, verifyStaff, reviewController.deleteReview);       // [DELETE] /review/:id
router.get('/:bookId', reviewController.getAllReviews);                                             // [GET] /review/:bookId
router.patch('/:bookId/:reviewId/hide', verifyToken, verifyStaff, reviewController.hideReview);     // [PATCH] /review/:id/hide
router.patch('/:bookId/:reviewId/unhide', verifyToken, verifyStaff, reviewController.unhideReview); // [PATCH] /review/:id/unhide

module.exports = router;