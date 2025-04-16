const AppError = require('../../utils/appError');
const CartService = require('../../services/cartService');
const BookHelper = require('../../helpers/bookHelper');
const { mongooseToObject, multipleMongooseToObject } = require('../../utils/mongoose');

class CartController {
   
   // USER CART

   // [POST] /cart
   async addToUserCart(req, res, next) {
      try {
         const { userId, productId, quantity } = req.body;
         await CartService.addToCart(userId, null, productId, quantity);
         return res.status(200).json({});
      }
      catch (error) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', error.message));
      }
   }

   // [PUT] /cart
   async updateUserCart(req, res, next) {
      try {
         const { userId, productId, quantity } = req.body;
         await CartService.updateCart(userId, null, productId, quantity);
         return res.status(200).json({});
      }
      catch (error) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', error.message));
      }
   }

   // [DELETE] /cart/:userId
   async clearUserCart(req, res, next) {
      try {
         const { userId } = req.params;
         await CartService.clearCart(userId, null);
         return res.status(200).json({});
      }
      catch (error) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', error.message));
      }
   }

   // [GET] /cart/:userId
   async getUserCartByUserId(req, res, next) {
      try {
         const { userId } = req.params;
         const cart = await CartService.findCart(userId, null);
         return res.status(200).json(mongooseToObject(cart));
      }
      catch (error) {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', error.message));
      }
   }

}

module.exports = new CartController();