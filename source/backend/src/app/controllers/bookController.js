const Book = require('../models/Book');
const Category = require('../models/Category');
const AppError = require('../../utils/appError');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');

class BookController {
   
   // [GET] /book/category
   getCategory(req, res, next) {
      Category.find()
         .then(categories => {
            res.status(200).json({
               categories: multipleMongooseToObject(categories)
            });
         })
         .catch(err => {
            return next(new AppError(500, 'SERVER_ERROR', err.message));
         });
   }
}

module.exports = new BookController();