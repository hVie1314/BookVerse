const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/cartController'); 
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/', cartController.addToCart);
router.put('/', cartController.updateCart);
router.delete('/', cartController.deleteProductInCart);
router.get('/:userId', cartController.getCartByUserId);

module.exports = router;