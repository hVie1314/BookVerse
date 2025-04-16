const Book = require('../models/Book');

class BookController {
   // [POST] /book/create
   async create(req, res) {
      try {
         const newBook = new Book(req.body);
         const savedBook = await newBook.save();
         res.status(201).json({ success: true, data: savedBook });
      } catch (err) {
         console.error(err);
         res.status(500).json({ success: false, errorCode: 'INTERNAL_SERVER_ERROR' });
      }
   }

   // [PUT] /book/update/:id
   async update(req, res) {
      try {
         const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
         if (!updatedBook) {
            return res.status(404).json({ success: false, errorCode: 'NOT_FOUND' });
         }
         res.json({ success: true, data: updatedBook });
      } catch (err) {
         console.error(err);
         res.status(500).json({ success: false, errorCode: 'INTERNAL_SERVER_ERROR' });
      }
   }

   // [DELETE] /book/delete/:id
   async delete(req, res) {
      try {
         const deletedBook = await Book.findByIdAndDelete(req.params.id);
         if (!deletedBook) {
            return res.status(404).json({ success: false, errorCode: 'NOT_FOUND' });
         }
         res.json({ success: true, message: 'Book deleted successfully' });
      } catch (err) {
         console.error(err);
         res.status(500).json({ success: false, errorCode: 'INTERNAL_SERVER_ERROR' });
      }
   }

   // [GET] /book
   async getAll(req, res) {
      try {
         const books = await Book.find();
         res.json({ success: true, data: books });
      } catch (err) {
         console.error(err);
         res.status(500).json({ success: false, errorCode: 'INTERNAL_SERVER_ERROR' });
      }
   }

    // [GET] /book/:id
    async getById(req, res) {
        try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        res.status(200).json({ success: true, data: book });
        } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = new BookController();