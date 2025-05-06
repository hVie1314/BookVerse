const Book = require('../app/models/Book');
const AppError = require('../utils/appError');
const Review = require('../app/models/Review');

class BookService {

   async searchBooks(query) {
        try {
            const {
                keyword,
                category,
                author,
                minPrice,
                maxPrice,
                sortBy,
                page = 1,
                limit = 10
            } = query;

            const filter = {};

            // search by book title, case-insensitive
            if (keyword) {
                filter.title = { $regex: keyword, $options: 'i' };
            }

            // filter by category
            if (category) {
                filter.category = category;
            }

            // filter by author
            if (author) {
                filter.author = author;
            }

            // filter by price range
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice) filter.price.$gte = parseFloat(minPrice);
                if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
            }

            // sort options
            let sortOption = {};
            if (sortBy === 'price_asc') sortOption.price = 1;
            else if (sortBy === 'price_desc') sortOption.price = -1;
            else sortOption = { createdAt: -1 }; // mặc định: mới nhất

            const skip = (page - 1) * limit;

            const books = await Book.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(parseInt(limit));

            const total = await Book.countDocuments(filter);

            return {
                books,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
        throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
        }
    }

    async getBookInfoById(id) {
        try {
        const book = await Book.findById(id);
        if (!book) {
            throw new AppError(404, 'BOOK_NOT_FOUND');
        }

        return {
            title: book.title,
            price: book.price,
            image: book.image,
        };
        }
        catch (err) {
        throw new AppError(500, 'INTERNAL_SERVER_ERROR', err.message);
        }
    }

    async reCalcBookRating(bookId) {
        try {
            const book = await Book.findById(bookId);
            if (!book) {
                throw new AppError(404, 'BOOK_NOT_FOUND');
            }

            // get all reviews for the book
            const reviews = await Review.find({ 
                book_id: bookId, 
                status: 'approved', 
                hidden: false 
            });

            if (reviews.length === 0) return 0;

            // calculate the average rating
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const avgRating = Math.round(totalRating / reviews.length * 10) / 10;

            // update the book's rating
            book.rating = avgRating;
            await book.save();

            return avgRating;

        } catch (error) {
            throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
        }
    }

}

module.exports = new BookService();
