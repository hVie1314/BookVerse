const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/cartController'); 
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/', cartController.addToUserCart);
router.put('/', cartController.updateUserCart);
router.delete('/:userId', cartController.clearUserCart);
router.get('/:userId', cartController.getUserCartByUserId);

module.exports = router;