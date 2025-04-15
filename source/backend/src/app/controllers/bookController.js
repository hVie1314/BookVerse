const Category = require('../models/Category');
const AppError = require('../../utils/appError');

class BookController {
   
   // [GET] /book/category
   getCategory(req, res, next) {
      Category.find()
         .then(categories => {
            res.status(200).json({
               categories: categories.map(category => ({
                  id: category._id,
                  categoryName: category.categoryName,
               })),
            });
         })
         .catch(err => {
            return next(new AppError(500, 'SERVER_ERROR'));
         });
   }
}

module.exports = new BookController();