const Book = require('../models/Book');
const Category = require('../models/Category');
const BookService = require('../../services/bookService');
const AppError = require('../../utils/appError');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');


class BookController {

   // [POST] /book/
   async create(req, res, next) {
      try {
         const newBook = new Book(req.body);
         const savedBook = await newBook.save();
         return res.status(201).json({ book: savedBook });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [PUT] /book/:id
   async update(req, res, next) {
      try {
         const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
         );
         if (!updatedBook) {
            return next(new AppError(404, 'NOT_FOUND'));
         }
         return res.status(200).json({ book: updatedBook });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [DELETE] /book/:id
   async delete(req, res, next) {
      try {
         const deletedBook = await Book.findByIdAndDelete(req.params.id);
         if (!deletedBook) {
            return next(new AppError(404, 'NOT_FOUND'));
         }
         return res.status(200).json({ message: 'Book deleted successfully' });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [GET] /book/
   async getAll(req, res, next) {
      try {
         const books = await Book.find();
         return res.status(200).json({ books });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [GET] /book/:id
   async getById(req, res, next) {
      try {
         const book = await Book.findById(req.params.id);
         if (!book) {
            return next(new AppError(404, 'NOT_FOUND'));
         }
         return res.status(200).json({ book });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

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

   // [GET] /book/top/:n
   async getTopSelling(req, res, next) {
      try {
         const limit = parseInt(req.params.n);
         if (isNaN(limit) || limit <= 0) {
            return next(new AppError(400, 'INVALID_PARAM', 'Parameter n must be a positive number'));
         }         

         const books = await Book.find().sort({ sold: -1 }).limit(limit);

         return res.status(200).json({ books });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }
        
   // [GET] /book/search
   async search(req, res, next) {
      try {
         const result = await BookService.searchBooks(req.query);
            return res.status(200).json(result);
      } catch (err) {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));

      }
   }

   // [GET] /book/recent-added/:n
   async getRecentAdded(req, res, next) {
      try {
         const limit = parseInt(req.params.n);
         if (isNaN(limit) || limit <= 0) {
            return next(new AppError(400, 'INVALID_PARAM', 'Parameter n must be a positive number'));
         }         

         const books = await Book.find().sort({ createdAt: -1 }).limit(limit);

         return res.status(200).json({ books });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

}

module.exports = new BookController();