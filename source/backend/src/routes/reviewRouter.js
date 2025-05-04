const express = require('express');
const router = express.Router();
const reviewController = require('../app/controllers/reviewController');
const { verifyToken, verifyStaff } = require('../app/middlewares/authMiddleware');

// CRUD routes for books
router.post('/:bookId', verifyToken, reviewController.addReview);                     // [POST] /review/:bookId
router.put('/:id', verifyToken, reviewController.updateReview);                       // [PUT] /review/:id
router.delete('/:id', verifyToken, verifyStaff, reviewController.deleteReview);       // [DELETE] /review/:id
router.get('/:bookId', reviewController.getAllReviews);                               // [GET] /review/:bookId
router.patch('/hide/:id', verifyToken, verifyStaff, reviewController.hideReview);     // [PATCH] /review/hide/:id
router.patch('/unhide/:id', verifyToken, verifyStaff, reviewController.unhideReview); // [PATCH] /review/unhide/:id

module.exports = router;