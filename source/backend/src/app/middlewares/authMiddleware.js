require("dotenv").config();
const jwt = require('jsonwebtoken');

class AuthMiddleware {

   verifyToken(req, res, next) {

      const token = req.headers["authorization"].split(" ")[1];
      if (!token) {
         return res.status(403).json({
            errorCode: "FORBIDDEN",
         });
      }

      console.warn(token);

      // verify token
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
         if (err) {
            return res.status(401).json({
               errorCode: "UNAUTHORIZED",
            });
         }

         req.userInfo = decoded;

         next();
      });
   }

}

module.exports = new AuthMiddleware();