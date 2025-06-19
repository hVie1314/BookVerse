const AppError = require('../../utils/appError');
const WishlistService = require('../../services/wishlistService');

class WishlistController {
   
   // USER WISHLIST

   // [POST] /wishlist
   async addToUserWishlist(req, res, next) {
      try {
         const { userId, productId } = req.body;
         await WishlistService.addToWishlist(userId, null, productId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

   // [DELETE] /wishlist
   async removeFromUserWishlist(req, res, next) {
      try {
         const { userId, productId } = req.body;
         await WishlistService.removeFromWishlist(userId, null, productId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

   // [GET] /wishlist/:userId
   async getUserWishlistByUserId(req, res, next) {
      try {
         const { userId } = req.params;
         const wishlist = await WishlistService.getWishlist(userId, null);
         return res.status(200).json({ wishlist });
      }
      catch (error) {
         return next(error);
      }
   }


   // GUEST WISHLIST

   // [POST] /wishlist/guest
   async addToGuestWishlist(req, res, next) {
      try {
         const { wishlistId, productId } = req.body;
         await WishlistService.addToWishlist(null, wishlistId, productId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

   // [DELETE] /wishlist/guest
   async removeFromGuestWishlist(req, res, next) {
      try {
         const { wishlistId, productId } = req.body;
         await WishlistService.removeFromWishlist(null, wishlistId, productId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }

   // [GET] /wishlist/guest/:wishlistId
   async getGuestWishlistByWishlistId(req, res, next) {
      try {
         const { wishlistId } = req.params;
         const wishlist = await WishlistService.getWishlist(null, wishlistId);
         return res.status(200).json({ wishlist });
      }
      catch (error) {
         return next(error);
      }
   }

   // [POST] /wishlist/merge
   async mergeGuestWishlistToUserWishlist(req, res, next) {
      try {
         const { userId, wishlistId } = req.body;
         await WishlistService.mergeGuestWishlistToUserWishlist(userId, wishlistId);
         return res.status(200).json({});
      }
      catch (error) {
         return next(error);
      }
   }
}

module.exports = new WishlistController();
