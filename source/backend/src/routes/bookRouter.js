const express = require('express');
const router = express.Router();

const bookController = require('../app/controllers/bookController');

// CRUD routes for books
router.post('/', bookController.create);         // [POST] /book/
router.put('/:id', bookController.update);       // [PUT] /book/:id
router.delete('/books/:id', bookController.delete); // [DELETE] /books/:id
router.get('/', bookController.getAll);          // [GET] /book/
router.get('/:id', bookController.getById);      // [GET] /book/:id

module.exports = router;