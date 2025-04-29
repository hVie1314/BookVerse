const express = require('express');
const router = express.Router();
const controller = require('../app/controllers/cancelRequestController');
const { verifyToken, verifyUserOrAdmin, verifyStaff } = require('../app/middlewares/authMiddleware');

router.post('/cancel/:id', verifyToken, verifyUserOrAdmin, controller.createRequest);      // [POST] /order/cancel/:id
router.patch('/cancel/:id', verifyToken, verifyStaff, controller.updateStatus);            // [PATCH] /order/cancel/:id
router.get('/cancel', verifyToken, verifyStaff, controller.getAll);                       // [GET] /order/cancel/
router.get('/cancel/:id', verifyToken, verifyStaff, controller.getById);                   // [GET] /order/cancel/:id

module.exports = router;