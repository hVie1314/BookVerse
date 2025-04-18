const Book = require('../models/Book');
const AppError = require('../../utils/appError');

class ReviewController {

   // [POST] /review/:bookId
   async addReview(req, res, next) {
      try {
         const book = await Book.findById(req.params.bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         book.reviews.push(req.body);
         await book.save();

         return res.status(201).json({ reviews: book.reviews });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [PUT] /review/:bookId/:reviewId
   async updateReview(req, res, next) {
      try {
         const book = await Book.findById(req.params.bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         const review = book.reviews.id(req.params.reviewId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         review.set(req.body);
         await book.save();

         return res.status(200).json({ review });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [DELETE] /review/:bookId/:reviewId
   async deleteReview(req, res, next) {
      try {
         const book = await Book.findById(req.params.bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         const review = book.reviews.id(req.params.reviewId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         review.remove();
         await book.save();

         return res.status(200).json({ message: 'Review deleted' });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [GET] /review/:bookId
   async getAllReviews(req, res, next) {
      try {
         const book = await Book.findById(req.params.bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         return res.status(200).json({ reviews: book.reviews });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }
}

module.exports = new ReviewController();