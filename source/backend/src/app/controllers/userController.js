const user = require('../models/user');
const AppError = require('../../utils/appError');

class UserController {
    async getAllCustomer(req, res, next) {        
        try {
            const customers = await user.find({ role: 'Customer' });
            res.status(200).json(customers);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getAllStaff(req, res, next) {        
        try {
            const staffs = await user.find({ role: 'Staff' });
            res.status(200).json(staffs);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getAllAdmin(req, res, next) {        
        try {
            const admins = await user.find({ role: 'Admin' });
            res.status(200).json(admins);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async updateUserInfo(req, res, next) {
        try {
            const updated = await user.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updated) 
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));
            res.status(200).json(updated);
        } catch (err) {
            next(new AppError(400, "INVALID_UPDATE"));
        }
    }

    // Delete user
    async deleteUser(req, res, next) {
        try {
            const deleted = await user.findByIdAndDelete(req.params.id);
            if (!deleted) 
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));
            res.status(204).json();
        } catch (err) {
            next(new AppError(400, "DELETE_FAILED"));
        }
    }
}

module.exports = new UserController();