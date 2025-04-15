const Book = require('../app/models/Book');
const AppError = require('../utils/appError');

class BookHelper {

   // return name, price and img link
   async getBookInfoForCartById(id) {
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

}

module.exports = new BookHelper();