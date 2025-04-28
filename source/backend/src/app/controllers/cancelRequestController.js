const CancelRequest = require('../models/CancelRequest');
const AppError = require('../../utils/appError');

class CancelRequestController {
   // [POST] /order/cancel/:id
   async createRequest(req, res, next) {
      try {
         const { reason } = req.body;
         const newRequest = new CancelRequest({
            orderId: req.params.id,
            userId: req.userInfo.id,
            reason
         });

         const saved = await newRequest.save();
         return res.status(201).json({ request: saved });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }

   // [PATCH] /order/cancel/:id
   async updateStatus(req, res, next) {
      try {
         const { status } = req.body;
         if (!['approved', 'rejected'].includes(status)) {
            return next(new AppError(400, "INVALID_STATUS"));
         }

         const updated = await CancelRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
         );

         if (!updated) return next(new AppError(404, "NOT_FOUND"));
         return res.status(200).json({ request: updated });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }

   // [GET] /order/cancel/
   async getAll(req, res, next) {
      try {
         const requests = await CancelRequest.find().populate('orderId userId');
         return res.status(200).json({ requests });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }

   // [GET] /order/cancel/:id
   async getById(req, res, next) {
      try {
         const request = await CancelRequest.findById(req.params.id).populate('orderId userId');
         if (!request) return next(new AppError(404, "NOT_FOUND"));
         return res.status(200).json({ request });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }
}

module.exports = new CancelRequestController();