const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/cartController'); 
const authMiddleware = require('../app/middlewares/authMiddleware');

// user cart routes
router.post('/', cartController.addToUserCart);
router.put('/', cartController.updateUserCart);
router.delete('/:userId', cartController.clearUserCart);
router.get('/:userId', cartController.getUserCartByUserId);

// guest cart routes
router.post('/guest', cartController.addToGuestCart);
router.put('/guest', cartController.updateGuestCart);
router.delete('/guest/:cartId', cartController.clearGuestCart);
router.get('/guest/:cartId', cartController.getGuestCartByCartId);

// merge guest cart to user cart
router.post('/merge', cartController.mergeGuestCartToUserCart);

module.exports = router;