const Wishlist = require('../app/models/Wishlist');
const AppError = require('../utils/appError');
const BookService = require('./bookService');

class WishlistService {

   // find wishlist by userId or wishlistId
   async findWishlist(userId, wishlistId) {
      try {
         let wishlist = null;
         const filter = userId ? { userId } : { wishlistId };
         // check if userId or wishlistId is provided
         if (!userId && !wishlistId) {
            throw new AppError(400, "WISHLIST_NOT_FOUND", 'Either userId or wishlistId is required to find the wishlist');
         }
         wishlist = await Wishlist.findOne(filter);
         return wishlist;

      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // add a product to wishlist 
   async addToWishlist(userId, wishlistId, productId) {
      try {
         let wishlist = await this.findWishlist(userId, wishlistId);

         // check if book exists
         await BookService.getBookInfoById(productId);

         // check if wishlist not exists, create new one
         if (!wishlist) {
            wishlist = await Wishlist.create({
               userId: userId || null,
               wishlistId: wishlistId || null,
               products: [{ productId }]
            });  
         }
         else {
            // check if wishlist already has product
            const productExists = wishlist.products.some(
               item => item.productId.toString() === productId);
            
            // if not exists, add new product to wishlist
            if (!productExists) {
               wishlist.products.push({ productId });
            }
         }

         await wishlist.save();
         return wishlist;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // remove product from wishlist
   async removeFromWishlist(userId, wishlistId, productId) {
      try {
         let wishlist = await this.findWishlist(userId, wishlistId);

         // check if wishlist not exists
         if (!wishlist) {
            throw new AppError(404, 'EMPTY_WISHLIST');
         }
         
         // check if product exists in wishlist
         const productIndex = wishlist.products.findIndex(
            item => item.productId.toString() === productId);
         if (productIndex === -1) {
            throw new AppError(404, 'BOOK_NOT_FOUND');
         }

         // remove product from wishlist
         wishlist.products.splice(productIndex, 1);
         await wishlist.save();
         return wishlist;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // get wishlist by userId or wishlistId
   async getWishlist(userId, wishlistId) {
      try {
         let wishlist = await this.findWishlist(userId, wishlistId);
         if (!wishlist) {
            throw new AppError(404, 'EMPTY_WISHLIST');
         }

         wishlist = await wishlist.populate({
            path: 'products.productId', // join with Book model
            select: 'title price image author', // select necessary fields
         });

         return wishlist;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // merge guest wishlist to user wishlist
   async mergeGuestWishlistToUserWishlist(userId, wishlistId) {
      try {
         const guestWishlist = await this.findWishlist(null, wishlistId);
         let userWishlist = await this.findWishlist(userId, null);

         // check guest wishlist exists
         if (!guestWishlist) {
            throw new AppError(404, 'EMPTY_WISHLIST');
         }

         // check user wishlist exists, create new one if not
         if (!userWishlist) {
            userWishlist = await Wishlist.create({
               userId,
               products: [],
            });
         }

         // merge guest wishlist to user wishlist
         for (const item of guestWishlist.products) {
            const productExists = userWishlist.products.some(
               product => product.productId.toString() === item.productId.toString()
            );

            // if product doesn't exist in user wishlist, add it
            if (!productExists) {
               userWishlist.products.push(item);
            }
         }

         // save user wishlist and delete guest wishlist
         await userWishlist.save();
         await Wishlist.deleteOne({ wishlistId });

         return userWishlist;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }
}

module.exports = new WishlistService();
