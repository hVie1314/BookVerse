const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/authController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/refresh-token', authMiddleware.verifyToken, authController.refreshToken)
router.get('/logout', authMiddleware.verifyToken, authController.logout);

module.exports = router;