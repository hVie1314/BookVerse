const express = require('express');
const router = express.Router();

const bookController = require('../app/controllers/bookController');

router.get('/category', bookController.getCategory); 

router.get('/search', bookController.search);   

// CRUD routes for books
router.post('/', bookController.create);                // [POST] /book/
router.put('/:id', bookController.update);              // [PUT] /book/:id
router.delete('/:id', bookController.delete);           // [DELETE] /book/:id
router.get('/', bookController.getAll);                 // [GET] /book/
router.get('/:id', bookController.getById);             // [GET] /book/:id
router.get('/top/:n', bookController.getTopSelling);    // [GET] /book/top/:n
router.get('/recently-added/:n', bookController.getRecentAdded); // [GET] /book/recent-added/

module.exports = router;