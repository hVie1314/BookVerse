const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/cartController'); 
const authMiddleware = require('../app/middlewares/authMiddleware');

// user cart routes
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyUser, cartController.addToUserCart);
router.put('/', authMiddleware.verifyToken, authMiddleware.verifyUser, cartController.updateUserCart);
router.delete('/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, cartController.clearUserCart);
router.get('/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, cartController.getUserCartByUserId);

// guest cart routes
router.post('/guest', cartController.addToGuestCart);
router.put('/guest', cartController.updateGuestCart);
router.delete('/guest/:cartId', cartController.clearGuestCart);
router.get('/guest/:cartId', cartController.getGuestCartByCartId);

// merge guest cart to user cart
router.post('/merge', authMiddleware.verifyToken, authMiddleware.verifyUser, cartController.mergeGuestCartToUserCart);

module.exports = router;