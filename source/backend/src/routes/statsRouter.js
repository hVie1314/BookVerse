const express = require('express');
const router = express.Router();

const statsController = require('../app/controllers/statsController');

// Get order statistics
router.get('/report', statsController.getFullMonthlyStats.bind(statsController));

// Get revenue statistics
router.get('/revenue', statsController.getRevenueByDateRange.bind(statsController));

module.exports = router;