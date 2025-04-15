const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/cartController'); 
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/', cartController.addToCart);

module.exports = router;