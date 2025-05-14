const express = require('express');
const router = express.Router();

const reviewController = require('../app/controllers/reviewController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/:bookId',authMiddleware.verifyToken, authMiddleware.verifyUser, reviewController.addReview);                    
router.put('/:reviewId', authMiddleware.verifyToken, authMiddleware.verifyUser, reviewController.updateReview);                      
router.delete('/:reviewId', authMiddleware.verifyToken, authMiddleware.verifyUserOrStaffOrAdmin, reviewController.deleteReview);      
router.get('/:bookId', reviewController.getAllReviews);                               
router.patch('/hide/:id', authMiddleware.verifyToken, authMiddleware.verifyStaffOrAdmin, reviewController.hideReview);    
router.patch('/unhide/:id', authMiddleware.verifyToken, authMiddleware.verifyStaffOrAdmin, reviewController.unhideReview); 

module.exports = router;