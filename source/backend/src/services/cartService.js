const Cart = require('../app/models/Cart');
const AppError = require('../utils/appError');
const BookService = require('./bookService');
const Book = require('../app/models/Book');

class CartService {

   // find cart by userId or cartId
   async findCart(userId, cartId) {
      try {
         let cart = null;
         const filter = userId ? { userId } : { cartId };
         // check if userId or cartId is provided
         if (!userId && !cartId) {
            throw new AppError(500, "CART_NOT_FOUND", 'Either userId or cartId is required to find the cart');
         }
         cart = await Cart.findOne(filter);
         return cart;

      }
      catch (error) {
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // get cart with book info 
   async getCartWithBookInfo(userId, cartId) {
      try {
         let cart = await this.findCart(userId, cartId);

         // join with Book model to get book info
         // get: title, author, price, image
         if (cart) {
            cart = await cart.populate({
               path: 'products.productId', // join with Book model
               select: 'title author price image', 
            });

            return cart;
         }

         return null; // cart not found
      }

      catch (error) {
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // add a product to cart 
   async addToCart(userId, cartId, productId, quantity) {
      try {
         let cart = await this.findCart(userId, cartId);

         // get book info for cart
         const bookInfo = await BookService.getBookInfoById(productId);

         // check if cart not exists, create new one
         if (!cart) {
            cart = await Cart.create({
               userId: userId || null,
               cartId: cartId || null,
               products: [
                  { 
                     productId, 
                     quantity,
                  }
               ],
               totalPrice: bookInfo.price * quantity,
            });  
         }
         else {
            // check if cart already has product, update totalPrice
            const productIndex = cart.products.findIndex(
               item => item.productId.toString() === productId);
            
            // if exists, update totalPrice
            if (productIndex > -1) {
               cart.products[productIndex].quantity += quantity;
            }
            else { // if not exists, add new product to cart
               cart.products.push({ productId, quantity });
            }

            // update totalPrice
            cart.totalPrice += bookInfo.price * quantity;
         }

         await cart.save();
         return cart;
      }

      catch (error) {
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // update cart by userId or cartId
   async updateCart(userId, cartId, productId, quantity) {
      try {
         let cart = await this.findCart(userId, cartId);

         // check if cart not exists
         if (!cart) {
            throw new AppError(404, 'EMPTY_CART');
         }
         
         // check if product not exists in cart
         const productIndex = cart.products.findIndex(
            item => item.productId.toString() === productId);
         if (productIndex === -1) {
            throw new AppError(404, 'PRODUCT_NOT_FOUND');
         }

         // update quantity and totalPrice
         // check if quantity > 0, if not remove product from cart
         if (quantity > 0) {
            const quantityChange = quantity - cart.products[productIndex].quantity;

            cart.products[productIndex].quantity = quantity;

            // update totalPrice
            const bookInfo = await BookService.getBookInfoById(productId);
            cart.totalPrice += (quantityChange * bookInfo.price);
         }
         else {
            cart.products.splice(productIndex, 1);
         }

         await cart.save();
         return cart;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // clear cart by userId or cartId
   async clearCart(userId, cartId) {
      try {
         let cart = await this.findCart(userId, cartId);

         // check if cart not exists
         if (!cart) {
            throw new AppError(404, 'EMPTY_CART');
         }

         // clear cart
         cart.products = [];
         cart.totalPrice = 0;
         await cart.save();
         return cart;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // get cart by userId or cartId
   async getCart(userId, cartId) {
      try {
         let cart = await this.findCart(userId, cartId);
          if (!cart) {
            return [];
          }

         cart = await cart.populate({
            path: 'products.productId', // join with Book model
            select: 'title price image', // only select necessary fields
         });

         return cart;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

   // merge guest cart to user cart
   async mergeGuestCartToUserCart(userId, cartId) {
      try {
         const guestCart = await this.findCart(null, cartId);
         let userCart = await this.findCart(userId, null);

         // check guest carts exists
         if (!guestCart) {
            throw new AppError(404, 'EMPTY_CART');
         }

         // check user cart exists, create new one
         if (!userCart) {
            userCart = await Cart.create({
               userId,
               products: [],
               totalPrice: 0,
            });
         }

         // check if guest cart not exists
         if (!guestCart) {
            throw new AppError(404, 'EMPTY_CART');
         }

         // merge guest cart to user cart
         for (const item of guestCart.products) {
            const productIndex = userCart.products.findIndex(
               product => product.productId.toString() === item.productId.toString()
            );

            // if product exists in user cart, update quantity
            if (productIndex > -1) {
               userCart.products[productIndex].quantity += item.quantity;
               
               //Check stock
               const book = await Book.findById(userCart.products[productIndex].productId);
               if (!book)
                  throw new AppError(404, 'BOOK_NOT_FOUND');
               if (userCart.products[productIndex].quantity > book.stock)
                  userCart.products[productIndex].quantity = book.stock
            }
            else { // if not exists, add new product to user cart
               userCart.products.push(item);
            }

            // update totalPrice
            const bookInfo = await BookService.getBookInfoById(item.productId);
            userCart.totalPrice += (item.quantity * bookInfo.price);
         }

         // save user cart and delete guest cart
         await userCart.save();
         await Cart.deleteOne({ cartId });

         return userCart;
      }

      catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         throw new AppError(500, 'INTERNAL_SERVER_ERROR', error.message);
      }
   }

}

module.exports = new CartService();