const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');

// Get all customers
router.get('/customers', userController.getAllCustomer);

// Get all staffs
router.get('/staffs', userController.getAllStaff);

// Get all admins
router.get('/admins', userController.getAllAdmin);

// Update user info
router.put('/:id', userController.updateUserInfo);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;