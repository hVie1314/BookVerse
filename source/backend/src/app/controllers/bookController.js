const Book = require('../models/Book');
const AppError = require('../../utils/appError');

class BookController {

   // [POST] /book/create
   async create(req, res, next) {
      try {
         const newBook = new Book(req.body);
         const savedBook = await newBook.save();
         return res.status(201).json({ success: true, data: savedBook });
      } catch (err) {
         console.error('Create Book Error:', err);
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [PUT] /book/update/:id
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
         return res.status(200).json({ success: true, data: updatedBook });
      } catch (err) {
         console.error('Update Book Error:', err);
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [DELETE] /book/delete/:id
   async delete(req, res, next) {
      try {
         const deletedBook = await Book.findByIdAndDelete(req.params.id);
         if (!deletedBook) {
            return next(new AppError(404, 'NOT_FOUND'));
         }
         return res.status(200).json({ success: true, message: 'Book deleted successfully' });
      } catch (err) {
         console.error('Delete Book Error:', err);
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [GET] /book
   async getAll(req, res, next) {
      try {
         const books = await Book.find();
         return res.status(200).json({ success: true, data: books });
      } catch (err) {
         console.error('Get All Books Error:', err);
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
         return res.status(200).json({ success: true, data: book });
      } catch (err) {
         console.error('Get Book By ID Error:', err);
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }
}

module.exports = new BookController();