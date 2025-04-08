require("dotenv").config();
const jwt = require('jsonwebtoken');
const { redisClient } = require("../../configs/db/redis");

class AuthMiddleware {

   verifyToken(req, res, next) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
         return res.status(403).json({
            errorCode: "FORBIDDEN",
         });
      }

      // verify token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
         if (err) {
            return res.status(401).json({
               errorCode: "UNAUTHORIZED",
            });
         }

         try {
            // get cached token from redis
            const isInBlacklist = await redisClient.get(`blacklist:${token}`);

            if (isInBlacklist) {
               return res.status(401).json({
                  errorCode: "UNAUTHORIZED",
               });
            }

            // passed all checks
            req.userInfo = decoded;
            next();
            
         } catch (error) {
            return res.status(500).json({
               errorCode: "INTERNAL_SERVER_ERROR",
            });
         }
      });
   }

}

module.exports = new AuthMiddleware();