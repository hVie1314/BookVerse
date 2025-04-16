const express = require('express');
const router = express.Router();

const bookController = require('../app/controllers/bookController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.get('/category', bookController.getCategory);

module.exports = router;