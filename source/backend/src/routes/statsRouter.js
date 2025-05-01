const express = require('express');
const router = express.Router();

const statsController = require('../app/controllers/statsController');

// Get order statistics
router.get('/report', statsController.getMonthlyStats);

// Get revenue statistics


module.exports = router;