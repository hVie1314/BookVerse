const express = require('express');
const router = express.Router();

const productController = require('../app/controllers/productController');

// Lấy danh sách tất cả sản phẩm
router.get('/', productController.getAll);

// Thêm một sản phẩm mới
router.post('/', productController.create);

// Cập nhật sản phẩm theo ID
router.put('/:id', productController.update);

// Xóa sản phẩm theo ID
router.delete('/:id', productController.delete);

module.exports = router;