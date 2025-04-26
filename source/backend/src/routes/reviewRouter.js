const express = require('express');
const router = express.Router();
const reviewController = require('../app/controllers/reviewController');
const { verifyToken, verifyStaff } = require('../app/middlewares/authMiddleware');

// CRUD routes for books
router.post('/:bookId', reviewController.addReview);                                  // [POST] /review/:bookId
router.put('/:id', reviewController.updateReview);                                    // [PUT] /review/:id
router.delete('/:id', verifyToken, verifyStaff, reviewController.deleteReview);       // [DELETE] /review/:id
router.get('/:bookId', reviewController.getAllReviews);                               // [GET] /review/:bookId
router.patch('/:id/hide', verifyToken, verifyStaff, reviewController.hideReview);     // [PATCH] /review/:id/hide
router.patch('/:id/unhide', verifyToken, verifyStaff, reviewController.unhideReview); // [PATCH] /review/:id/unhide

module.exports = router;