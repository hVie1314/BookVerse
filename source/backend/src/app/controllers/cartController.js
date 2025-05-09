const AppError = require('../../utils/appError');
const CartService = require('../../services/cartService');

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
         return next(error);
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
         return next(error);
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
         return next(error);
      }
   }

   // [GET] /cart/:userId
   async getUserCartByUserId(req, res, next) {
      try {
         const { userId } = req.params;
         const cart = await CartService.getCartWithBookInfo(userId, null);
         return res.status(200).json(cart);
      }
      catch (error) {
         return next(error);
      }
   }


   // GUEST CART

   // [POST] /cart/guest
   async addToGuestCart(req, res, next) {
      try {
         const { cartId, productId, quantity } = req.body;
         await CartService.addToCart(null, cartId, productId, quantity);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

   // [PUT] /cart/guest
   async updateGuestCart(req, res, next) {
      try {
         const { cartId, productId, quantity } = req.body;
         await CartService.updateCart(null, cartId, productId, quantity);
         return res.status(200).json({});
      }
      catch (error) {
         console.warn(error);
         return next(error);
      }
   }

   // [DELETE] /cart/guest/:cartId
   async clearGuestCart(req, res, next) {
      try {
         const { cartId } = req.params;
         await CartService.clearCart(null, cartId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

   // [GET] /cart/guest/:cartId
   async getGuestCartByCartId(req, res, next) {
      try {
         const { cartId } = req.params;
         const cart = await CartService.getCartWithBookInfo(null, cartId);
         return res.status(200).json(cart);
      }
      catch (error) {
         return next(error);
      }
   }

   // [POST] /cart/merge
   async mergeGuestCartToUserCart(req, res, next) {
      try {
         const { userId, cartId } = req.body;
         await CartService.mergeGuestCartToUserCart(userId, cartId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

}

module.exports = new CartController();