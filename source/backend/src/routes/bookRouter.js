const express = require('express');
const router = express.Router();

const bookController = require('../app/controllers/bookController');

// CRUD routes for books
router.post('/create', bookController.create);
router.put('/update/:id', bookController.update);
router.delete('/delete/:id', bookController.delete);
router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);

module.exports = router;