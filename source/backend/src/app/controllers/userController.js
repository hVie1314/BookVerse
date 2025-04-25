const user = require('../models/User');
const AppError = require('../../utils/appError');
const bcrypt = require('bcryptjs');

class UserController {
    async getAllCustomer(req, res, next) {        
        try {
            const customers = await user.find({ role: 'user' });
            res.status(200).json(customers);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getAllStaff(req, res, next) {        
        try {
            const staffs = await user.find({ role: 'staff' });
            res.status(200).json(staffs);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getAllAdmin(req, res, next) {        
        try {
            const admins = await user.find({ role: 'admin' });
            res.status(200).json(admins);
        } catch (err) {
            next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getUserById(req, res, next) {
        try {
            const foundUser = await user.findById(req.params.id);
            if (!foundUser)
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));
            res.status(200).json(foundUser);
        } catch (err) {
            next(new AppError(400, 'INVALID_USER_ID'));
        }
    }

    async updateUserInfo(req, res, next) {
        try {
            // Only allow specific fields to be updated
            const allowedFields = ['password', 'address', 'avatar'];
            const updatedData = {};
            
            // Filter and include only allowed fields from the request body
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updatedData[field] = req.body[field];
                }
            });
            
            // If the password is being updated, hash it before saving
            if (updatedData.password) {
                const salt = bcrypt.genSaltSync(10);
                updatedData.password = bcrypt.hashSync(updatedData.password, salt);
            }

            // Find the user by ID and update the allowed fields
            const updatedUser = await user.findByIdAndUpdate(req.params.id, updatedData, {
                new: true,             
                runValidators: true  
            });
    
            if (!updatedUser)
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));
            res.status(200).json(updatedUser);
        } catch (err) {
            next(new AppError(400, "INVALID_UPDATE"));
        }
    }

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