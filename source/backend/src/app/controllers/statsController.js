const AppError = require('../../utils/appError');
const mongoose = require('mongoose');
const Order = require('../models/Order');

class StatsController {
    // Get revenue, order count, and customer count by month
    static async getMonthlyStats(month, year, next) {
        try {
            const startDate = new Date(year, month - 1, 1); // JS month starts from 0
            const endDate = new Date(year, month, 0, 23, 59, 59, 999); // End of last day in month

            // Aggregate revenue, order count, customer count
            // Find distinct customerId within the date range
            const distinctCustomers = await Order.distinct('userId', {
                createdAt: { $gte: startDate, $lte: endDate }
            });
            

            // Get the revenue and order count as before
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

            return stats;  
        } catch (err) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
        }
    }

    // Get full monthly stats, calling getMonthlyStats and calculating percentage change
    async getFullMonthlyStats(req, res, next) {
        try {
            const { month, year } = req.query;

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

            // Get stats for the current month
            const currentMonthStats = await StatsController.getMonthlyStats(month, year, next);
            
            // Check if the month and year are 4/2025
            if (month == 4 && year == 2025) {
                // Return stats with 0% change if the month is 4/2025
                    return res.status(200).json({
                        ...currentMonthStats,
                        revenueChangePercent: 0,
                        orderCountChangePercent: 0,
                        customerCountChangePercent: 0
                    });
            }
            
            // Calculate percentage change compared to the previous month
            const prevMonth = month == 1 ? 12 : month - 1;  // Handle January -> December transition
            const prevYear = month == 1 ? year - 1 : year;   // Adjust year for January

            const prevMonthStats = await StatsController.getMonthlyStats(prevMonth, prevYear, next);

            // Calculate percentage change
            const calculatePercentageChange = (current, previous) => {
                if (previous == 0) return current > 0 ? 100 : 0; // To avoid division by zero
                return ((current - previous) / previous) * 100;
            };

            const revenueChangePercent = Number(calculatePercentageChange(currentMonthStats.revenue, prevMonthStats.revenue).toFixed(2));
            const orderCountChangePercent = Number(calculatePercentageChange(currentMonthStats.orderCount, prevMonthStats.orderCount).toFixed(2));
            const customerCountChangePercent = Number(calculatePercentageChange(currentMonthStats.customerCount, prevMonthStats.customerCount).toFixed(2));            

            // Return both current month stats and percentage changes
            const stats = {
                ...currentMonthStats,
                revenueChangePercent,
                orderCountChangePercent,
                customerCountChangePercent
            };
            return res.status(200).json(stats);
        } catch (error) {
            throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
        }
    }

    // Get revenue statistics for a given date range (startMonth-year to endMonth-year)
    // GET /stats/revenue
    async getRevenueByDateRange(req, res, next) {
        try {
            let { startMonth, startYear, endMonth, endYear } = req.query;

            startMonth = parseInt(startMonth);
            startYear = parseInt(startYear);
            endMonth = parseInt(endMonth);
            endYear = parseInt(endYear);

            if (
                isNaN(startMonth) || isNaN(startYear) ||
                isNaN(endMonth) || isNaN(endYear)
            ) {
                return next(new AppError(400, 'BAD_REQUEST', 'Invalid query parameters'));
            }

            const results = [];

            let currentMonth = startMonth;
            let currentYear = startYear;

            while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
                const stat = await StatsController.getMonthlyStats(currentMonth, currentYear, next);
                results.push({
                    month: currentMonth,
                    year: currentYear,
                    revenue: stat.revenue
                });

                // Tăng tháng
                currentMonth++;
                if (currentMonth > 12) {
                    currentMonth = 1;
                    currentYear++;
                }
            }

            return res.status(200).json(results);
        } catch (error) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR', error.message));
        }
    }
}

module.exports = new StatsController();