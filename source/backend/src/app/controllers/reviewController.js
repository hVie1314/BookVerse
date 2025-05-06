const Book = require('../models/Book');
const User = require('../models/User');
const Review = require('../models/Review')
const AppError = require('../../utils/appError');
const bookService = require('../../services/bookService');

class ReviewController {

   // [POST] /review/:bookId
   async addReview(req, res, next) {
      try {
         const { rating, comment } = req.body;
         const user_id = req.userInfo.id;
         const bookId = req.params.bookId;
   
         // Kiểm tra book tồn tại
         const book = await Book.findById(bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         // TODO: Kiểm tra người dùng đã mua sách này chưa
   
         // Tạo review
         const review = new Review({
            user_id,
            book_id: bookId,
            rating,
            comment
         });
         await review.save();

         // rating
         const bookRating = await bookService.reCalcBookRating(bookId);
         book.rating = bookRating;

         // Liên kết review với book
         book.reviews.push(review._id);
         await book.save();

         return res.status(201).json({ review });
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [PUT] /review/:id
   async updateReview(req, res, next) {
      try {
         const bookId = req.body.id;
         const review = await Review.findById(bookId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         const book = await Book.findById(review.book_id);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         if (String(review.user_id) !== req.userInfo.id) {
            return next(new AppError(403, 'FORBIDDEN', 'You cannot modify this review'));
         }

         // rating
         const bookRating = await bookService.reCalcBookRating(bookId);
         book.rating = bookRating;

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
         const bookId = req.body.id;
         const review = await Review.findById(bookId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         const book = await Book.findById(review.book_id);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         // rating
         const bookRating = await bookService.reCalcBookRating(bookId);
         book.rating = bookRating;

         // remove review from book
         book.reviews = book.reviews.filter((r) => String(r) !== String(review._id));
         await book.save();

         await review.remove();

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

         const reviews = await Review.find({ book_id: book._id, hidden: false })

         // get rating statistics by rating value, number of reviews and average rating
         const ratingStats = [1, 2, 3, 4, 5].map((ratingValue) => ({
            rating: ratingValue,
            count: reviews.filter((review) => review.rating === ratingValue).length,
         }));
         const totalReviews = reviews.length;
         const averageRating = book.rating || 0;

         // join with user to get username and avatar
         const reviewsWithUsers = await Promise.all(
            reviews.map(async (review) => {
               const user = await User.findById(review.user_id, 'username avatar');
               return {
                  ...review.toObject(),
                  user: {
                     username: user.username,
                     avatar: user.avatar
                  }
               };
            })
         );

         return res.status(200).json({ 
            ratingStats,
            averageRating,
            totalReviews,
            reviews: reviewsWithUsers
          });
      
      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [PATCH] /review/:id/hide
   async hideReview(req, res, next) {
      try {
         const updated = await Review.findByIdAndUpdate(
            req.params.id,
            { hidden: true },
            { new: true }
         );
         if (!updated) return next(new AppError(404, "NOT_FOUND"));
         res.status(200).json({ review: updated });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }
   
   // [PATCH] /review/:id/unhide
   async unhideReview(req, res, next) {
      try {
         const updated = await Review.findByIdAndUpdate(
            req.params.id,
            { hidden: false },
            { new: true }
         );
         if (!updated) return next(new AppError(404, "NOT_FOUND"));
         res.status(200).json({ review: updated });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   } 

}

module.exports = new ReviewController();