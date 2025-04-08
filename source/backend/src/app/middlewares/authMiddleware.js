require("dotenv").config();
const jwt = require('jsonwebtoken');
const { redisClient } = require("../../configs/db/redis");
const AppError = require("../../utils/appError");

class AuthMiddleware {

   verifyToken(req, res, next) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
         return next(new AppError(401, "FORBIDDEN"));
      }

      // verify token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            return next(new AppError(401, "UNAUTHORIZED"));
         }

         try {
            // get cached token from redis
            const isInBlacklist = await redisClient.get(`blacklist:${token}`);

            if (isInBlacklist) {
               return next(new AppError(401, "UNAUTHORIZED"));
            }

            // passed all checks
            req.userInfo = decoded;
            next();
            
         } catch (error) {
            return next(new AppError(500, "INTERNAL_SERVER_ERROR"));
         }
      });
   }

   isAdmin(req, res, next) {
      if (req.userInfo.role !== "admin") {
         return next(new AppError(403, "FORBIDDEN"));
      }
      next();
   }

   isStaff(req, res, next) {
      if (req.userInfo.role !== "staff") {
         return next(new AppError(403, "FORBIDDEN"));
      }
      next();
   }

   isUser(req, res, next) {
      if (req.userInfo.role !== "user") {
         return next(new AppError(403, "FORBIDDEN"));
      }
      next();
   }

}

module.exports = new AuthMiddleware();