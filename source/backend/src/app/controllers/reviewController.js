const Book = require('../models/Book');
const Review = require('../models/Review')
const AppError = require('../../utils/appError');

class ReviewController {

   // [POST] /review/
   async addReview(req, res, next) {
      try {
         const { book_id, rating, comment } = req.body;
         const user_id = req.user.id; // giả sử middleware auth đã gán user vào req
   
         // Kiểm tra book tồn tại
         const book = await Book.findById(book_id);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));
   
         // Tạo review
         const review = new Review({
            user_id,
            book_id,
            rating,
            comment
         });
         await book.save();

         return res.status(201).json({ reviews: book.reviews });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [PUT] /review/:id
   async updateReview(req, res, next) {
      try {
         const review = await Review.findById(req.params.reviewId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         review.set(req.body);
         await review.save();

         return res.status(200).json({ review });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [DELETE] /review/:id
   async deleteReview(req, res, next) {
      try {
         const review = await Review.findById(req.params.reviewId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         await Book.updateOne(
            { _id: review.book_id },
            { $pull: { reviews: review._id } }
         );

         review.remove();

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

         const reviews = await Review.find({ book_id: book._id, status: 'approved' })

         return res.status(200).json({ reviews });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }
}

module.exports = new ReviewController();