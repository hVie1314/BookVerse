const Book = require('../models/Book');
const User = require('../models/User');
const Review = require('../models/Review')
const Order = require('../models/Order')
const AppError = require('../../utils/appError');
const bookService = require('../../services/bookService');

class ReviewController {

   // [POST] /review/:bookId
   async addReview(req, res, next) {
      try {
         const bookId = req.params.bookId;
         const { rating, comment } = req.body;
         const userId = req.userInfo.id;
   
         // Check if bookId is valid
         const book = await Book.findById(bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         // Check if order exists for this book
         const order = await Order.findOne({
            userId,  
            'items.bookId': bookId,
            orderStatus: 'success'
         });
         if (!order) return next(new AppError(403, 'FORBIDDEN', 'You must buy this book to review it'));

         // check if user already reviewed this book
         const existingReview = await Review.findOne({ userId, bookId });
         if (existingReview) {
            return next(new AppError(403, 'FORBIDDEN', 'You have already reviewed this book'));
         }

         // Kiểm tra rating hợp lệ
         if (rating < 1 || rating > 5) {
            return next(new AppError(400, 'INVALID_RATING', 'Rating must be between 1 and 5'));
         }

         // Tạo review
         const review = new Review({
            userId,
            bookId,
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

   // [PUT] /review/:reviewId
   async updateReview(req, res, next) {
      try {
         const { reviewId } = req.params;
         const { comment, rating } = req.body;
         const review = await Review.findById(reviewId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         const bookId = review.bookId;
         const book = await Book.findById(bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         if (String(review.userId) !== req.userInfo.id) {
            return next(new AppError(403, 'FORBIDDEN', 'You cannot modify this review'));
         }

         review.comment = comment;
         review.rating = rating;
         await review.save();
         
         // rating
         const bookRating = await bookService.reCalcBookRating(bookId);
         book.rating = bookRating;
         book.save();

         return res.status(200).json({ review });

      } catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

   // [DELETE] /review/:reviewId
   async deleteReview(req, res, next) {
      try {
         const { reviewId } = req.params;
         const review = await Review.findById(reviewId);
         if (!review) return next(new AppError(404, 'REVIEW_NOT_FOUND'));

         const bookId = review.bookId;
         const book = await Book.findById(bookId);
         if (!book) return next(new AppError(404, 'BOOK_NOT_FOUND'));

         // remove review from book
         book.reviews = book.reviews.filter((r) => String(r) !== String(review._id));
         await book.save();

         await Review.findByIdAndDelete(reviewId);

         // rating
         const bookRating = await bookService.reCalcBookRating(bookId);
         book.rating = bookRating;
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

         const reviews = await Review.find({ bookId: book._id, hidden: false })

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
               const user = await User.findById(review.userId, 'username avatar');
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