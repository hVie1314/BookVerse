const express = require('express');
const router = express.Router();

const wishlistController = require('../app/controllers/wishlistController');
const authMiddleware = require('../app/middlewares/authMiddleware');

// user wishlist routes
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyUser, wishlistController.addToUserWishlist);
router.delete('/', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, wishlistController.removeFromUserWishlist);
router.get('/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, wishlistController.getUserWishlistByUserId);

// guest wishlist routes
router.post('/guest', wishlistController.addToGuestWishlist);
router.delete('/guest', wishlistController.removeFromGuestWishlist);
router.get('/guest/:wishlistId', wishlistController.getGuestWishlistByWishlistId);

// merge
router.post('/merge', authMiddleware.verifyToken, authMiddleware.verifyUser, wishlistController.mergeGuestWishlistToUserWishlist);

module.exports = router;