const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/userController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.get('/customer', authMiddleware.verifyToken, authMiddleware.verifyStaffOrAdmin, userController.getAllCustomer);
router.get('/staff', authMiddleware.verifyToken, authMiddleware.verifyAdmin, userController.getAllStaff);
router.get('/admin', authMiddleware.verifyToken, authMiddleware.verifyAdmin, userController.getAllAdmin);
router.get('/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, userController.getUserById);
router.put('/:userId', authMiddleware.verifyToken, authMiddleware.verifyUserOrAdmin, userController.updateUserInfo);
router.delete('/:userId', authMiddleware.verifyToken, authMiddleware.verifyAdmin, userController.deleteUser);
router.post('/set-role', authMiddleware.verifyToken, authMiddleware.verifyAdmin, userController.setRole);

module.exports = router;