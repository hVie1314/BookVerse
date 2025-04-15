
const Cart = require('../models/Cart');
const AppError = require('../../utils/appError');
const BookHelper = require('../../helpers/bookHelper');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');

class CartController {
   
   // [POST] /cart
   async addToCart(req, res, next) {

      try {
         const { userId, productId, quantity } = req.body;
         let cart = await Cart.findOne({ userId });

         // get book info for cart
         const bookInfo = await BookHelper.getBookInfoForCartById(productId);

         // check if cart not exists, create new one
         if (!cart) {
            cart = await Cart.create({
               userId,
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
         return res.status(200).json({});
      }

      catch (err) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      }
   }

}

module.exports = new CartController();