const express = require('express');
const router = express.Router();

const WishlistController = require('../app/controllers/wishlistController');
const authMiddleware = require('../app/middlewares/authMiddleware');
const wishlistController = require('../app/controllers/wishlistController');

// user wishlist routes
router.post('/', wishlistController.addToUserWishlist);
router.delete('/', wishlistController.removeFromUserWishlist);
router.get('/:userId', wishlistController.getUserWishlistByUserId);

// guest wishlist routes
router.post('/guest', wishlistController.addToGuestWishlist);
router.delete('/guest', wishlistController.removeFromGuestWishlist);
router.get('/guest/:wishlistId', wishlistController.getGuestWishlistByWishlistId);

// merge
router.post('/merge', wishlistController.mergeGuestWishlistToUserWishlist);

module.exports = router;