const user = require('../models/User');
const AppError = require('../../utils/appError');
const bcrypt = require('bcryptjs');
const { redisClient } = require('../../configs/db/redis');

class UserController {
    async getAllCustomer(req, res, next) {        
        try {
            const customers = await user.find({ role: 'user' });

            // eliminate password field from the response
            customers.forEach(customer => {
                customer.password = null;
            });

            return res.status(200).json(customers);
        } catch (err) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getAllStaff(req, res, next) {        
        try {
            const staffs = await user.find({ role: 'staff' });

            // eliminate password field from the response
            staffs.forEach(staff => {
                staff.password = null;
            });

            return res.status(200).json(staffs);
        } catch (err) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getAllAdmin(req, res, next) {        
        try {
            const admins = await user.find({ role: 'admin' });

            // eliminate password field from the response
            admins.forEach(admin => {
                admin.password = null;
            });

            return res.status(200).json(admins);
        } catch (err) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR'));
        }
    }

    async getUserById(req, res, next) {
        try {
            const foundUser = await user.findById(req.params.userId);
            if (!foundUser)
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));

            // eliminate password field from the response
            foundUser.password = null;

            res.status(200).json(foundUser);
        } catch (err) {
            return next(new AppError(400, 'INVALID_USER_ID'));
        }
    }

    async updateUserInfo(req, res, next) {
        try {
            const userId = req.params.userId;
            // Only allow specific fields to be updated
            const allowedFields = ['username', 'password', 'address', 'avatar'];
            const updatedData = {};
            
            // Filter and include only allowed fields from the request body
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updatedData[field] = req.body[field];
                }
            });
            
            // Check if username is being updated
            if (updatedData.username) {
                const existingUser = await user.findOne({ $and: [{username: updatedData.username}, {_id: { $ne: userId } }]});
                if (existingUser) {
                    return next(new AppError(400, 'USER_ALREADY_EXISTS', 'Username is already in use'));
                }
            }

            // If the password is being updated, hash it before saving
            if (updatedData.password) {
                // check if password < 8 characters
                if (updatedData.password.length < 8) {
                    return next(new AppError(400, 'INVALID_PASSWORD', 'Password must be at least 8 characters long'));
                }
                
                // Get user from database including password
                const userDoc = await user.findById(userId).select('+password');
                if (!userDoc) {
                    return next(new AppError(404, 'NOT_FOUND', 'User not found'));
                }
                
                // Get old password from request body
                const { oldPassword } = req.body;
                if (!oldPassword) {
                    return next(new AppError(400, 'OLD_PASSWORD_REQUIRED', 'Old password is required'));
                }
                
                // Compare old password with current hashed password
                const isMatch = bcrypt.compareSync(oldPassword, userDoc.password);
                if (!isMatch) {
                    return next(new AppError(401, 'INVALID_OLD_PASSWORD', 'Old password is incorrect'));
                }

                const salt = bcrypt.genSaltSync(10);
                updatedData.password = bcrypt.hashSync(updatedData.password, salt);
            }

            // Find the user by ID and update the allowed fields
            const updatedUser = await user.findByIdAndUpdate(userId, updatedData, {
                new: true,             
                runValidators: true  
            });

            if (!updatedUser)
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));
            
            // if the password is updated, require re-login
            if (updatedData.password) {
                const token = req.headers["authorization"]?.split(" ")[1];
                
                // delete token from Redis
                await redisClient.del(userId, (err, reply) => {
                    if (err) {
                        return next(new AppError(500, "INTERNAL_SERVER_ERROR", "Failed to delete token from Redis"));
                    }
                });

                // add access token to blacklist
                await redisClient.set(`blacklist:${token}`, "blacklisted", { EX: 10 * 60 });
            }

            // eliminate password field from the response
            updatedUser.password = null;

            res.status(200).json(updatedUser);

        } catch (err) {
            if (err instanceof AppError) {
                return next(err);
            }
            return next(new AppError(400, "INVALID_UPDATE"));
        }
    }

    async deleteUser(req, res, next) {
        try {
            const deleted = await user.findByIdAndDelete(req.params.userId);
            if (!deleted) 
                return next(new AppError(404, 'NOT_FOUND', 'User not found'));

            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            return next(new AppError(400, "DELETE_FAILED"));
        }
    }

    // [POST] /user/set-role
    async setRole(req, res, next) {
        try {
            const { userId, role } = req.body;
            
            // Validate role
            const validRoles = ['user', 'admin', 'staff'];
            if (!validRoles.includes(role)) {
                return next(new AppError(400, 'INVALID_ROLE', 'Role must be one of: user, admin, staff'));
            }

            // Find the user by ID and update the role
            const updatedUser = await user.findByIdAndUpdate(userId, { role }, {
                new: true,             
                runValidators: true  
            });

            // eliminate password field from the response
            updatedUser.password = null;

            return res.status(200).json(updatedUser);

        } catch (err) {
            return next(new AppError(400, 'INVALID_UPDATE'));
        }
    }
}

module.exports = new UserController();