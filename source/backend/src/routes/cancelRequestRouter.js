const express = require('express');
const router = express.Router();
const controller = require('../controllers/cancelRequestController');
const { verifyToken, verifyUserOrAdmin, verifyStaff } = require('../app/middlewares/authMiddleware');

router.post('/:id', verifyToken, verifyUserOrAdmin, controller.createRequest);      // [POST] /order/cancel/:id
router.patch('/:id', verifyToken, verifyStaff, controller.updateStatus);            // [PATCH] /order/cancel/:id
router.get('/', verifyToken, verifyStaff, controller.getAll);                       // [GET] /order/cancel/
router.get('/:id', verifyToken, verifyStaff, controller.getById);                   // [GET] /order/cancel/:id

module.exports = router;