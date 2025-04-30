const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');

// Get all customers
router.get('/customer', userController.getAllCustomer);

// Get all staffs
router.get('/staff', userController.getAllStaff);

// Get all admins
router.get('/admin', userController.getAllAdmin);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user info
router.put('/:id', userController.updateUserInfo);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;