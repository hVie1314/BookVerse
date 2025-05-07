const express = require('express');
const router = express.Router();

const statsController = require('../app/controllers/statsController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.get('/report', authMiddleware.verifyToken, authMiddleware.verifyAdmin, statsController.getFullMonthlyStats);
router.get('/revenue', authMiddleware.verifyToken, authMiddleware.verifyAdmin, statsController.getRevenueByDateRange);

module.exports = router;