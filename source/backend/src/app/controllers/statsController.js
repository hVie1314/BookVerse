const mongoose = require('mongoose');
const AppError = require('../../utils/appError');
const Order = require('../models/Order');

class StatsController {
    // Get revenue, order count, and customer count by month
    async getMonthlyStats(req, res, next) {
        try {
            const { month, year } = req.query;  // Get month and year from query params

            // Check if the year and month are valid (not in the future)
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            if (year > currentYear || (year == currentYear && month > currentMonth)) {
                return next(new AppError(404, 'NOT_FOUND', 'Year or Month cannot be in the future'));
            }

            // Check if the year is before the website was created
            if (year < 2025 || (year == 2025 && month < 4)) {
                return next(new AppError(404, 'BAD_REQUEST', 'Year is before the website was created'));
            }

            const startDate = new Date(year, month - 1, 1); // JS month starts from 0
            const endDate = new Date(year, month, 0, 23, 59, 59, 999); // End of last day in month

            // Aggregate revenue, order count, customer count
            // Find distinct customerId within the date range
            const distinctCustomers = await Order.distinct('userId', {
                createdAt: { $gte: startDate, $lte: endDate }
            });
            
            // Get the revenue and order count
            const [result] = await Order.aggregate([
                {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
                },
                {
                $group: {
                    _id: null,
                    revenue: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
                },
                {
                $project: {
                    _id: 0,
                    revenue: 1,
                    orderCount: 1
                }
                }
            ]);

            const stats = {
                revenue: result ? result.revenue : 0,
                orderCount: result ? result.orderCount : 0,
                customerCount: distinctCustomers.length
            };

            return res.status(200).json(stats);  
        } catch (err) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
        }
    }

    // Get revenue statistics for a given date range (startMonth-year to endMonth-year)
    // async getRevenueByDateRange(req, res, next) 
}

module.exports = new StatsController();
