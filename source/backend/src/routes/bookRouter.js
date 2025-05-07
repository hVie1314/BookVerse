const express = require('express');
const router = express.Router();

const bookController = require('../app/controllers/bookController');
const authMiddleware = require('../app/middlewares/authMiddleware');

router.get('/category', bookController.getCategory); 

router.get('/search', bookController.search);   

// CRUD routes for books
router.post('/', authMiddleware.verifyToken, authMiddleware.verifyStaffOrAdmin, bookController.create);                
router.put('/:id', authMiddleware.verifyToken, authMiddleware.verifyStaffOrAdmin, bookController.update);            
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.verifyStaffOrAdmin, bookController.delete);          
router.get('/page/:page/limit/:limit', bookController.getBooks);    
router.get('/:id', bookController.getById);            

router.get('/top/:n', bookController.getTopSelling);    
router.get('/recently-added/:n', bookController.getRecentAdded); 
router.get('/related/:id/:limit', bookController.getRelated); 
router.get('/rating/:bookId', bookController.getRating);

module.exports = router;