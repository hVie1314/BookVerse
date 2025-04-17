const Book = require('../models/Book');
const Category = require('../models/Category');
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

   // [DELETE] /books/:id
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
      console.warn('this func is called');
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