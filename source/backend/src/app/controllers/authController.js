const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const { redisClient } = require('../../configs/db/redis');
const AppError = require('../../utils/appError');
const emailSender = require('../../utils/emailSender');


class AuthController {

   // [POST] /auth/register
   async register(req, res, next) {
      // get data from request
      const { username, email, password, role } = req.body;

      // check if username or email already exists
      User.findOne({ $or: [{ username: username }, {email: email }]})
      .then(user => {
         // if username or email already exists, then return error
         if (user) {
            return next(new AppError(400, "USER_ALREADY_EXISTS"));
         }

         // check if password < 8 characters
         if (password.length < 8) {
            return next(new AppError(400, "INVALID_PASSWORD"));
         }

         // gen hash password
         const salt = bcrypt.genSaltSync(10);
         const hashPassword = bcrypt.hashSync(password, salt);

         // create new user
         const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
            role: role,
         });

         // save user to database
         newUser.save()
            .then(user => {
               res.status(201).json({
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  address: user.address,
                  avatar: user.avatar,
               })
            })
      })
      .catch(err => {
         return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
      });
   }

   // [POST] /auth/login
   async login(req, res, next) {

      // get data from request
      const { username, password } = req.body;

      // find user in db
      User.findOne({ username: username })
         .then(user => {
            
            // if user does not exist then return error
            if (!user) {
               return next(new AppError(404, "INVALID_CREDENTIALS"));
            }

            // check password
            const isPasswordMatch = bcrypt.compareSync(password, user.password);
            if (!isPasswordMatch) {
               return next(new AppError(400, "INVALID_CREDENTIALS"));
            }

            // update last login time
            user.lastLogin = new Date();
            user.save()

            // create token
            const accessToken = jwt.sign({
               id: user._id,
               role: user.role,
            }, 
               process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: '100000m'
            });

            // save token to redis
            // automatically expire after 3 days
            // 3 day is refresh token expiration time
            redisClient.set(user._id.toString(), accessToken, { EX: 3 * 24 * 60 * 60 }); 

            // return user data and token
            res.status(200).json({
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              address: user.address,
              avatar: user.avatar,
              accessToken: accessToken,
            });
         })
         .catch(err => {
            return next(new AppError(500, 'INTERNAL_SERVER_ERROR', err.message));
         });
   }

   // [POST] /auth/refresh-token
   async refreshToken(req, res, next) {
      try {
         // get info from request
         const token = req.headers["authorization"].split(" ")[1];
         
         // verify token
         const decoded = jwt.decode(token, { complete: true });
         if (!decoded) {
            return next(new AppError(401, "UNAUTHORIZED"));
         }

         // check if token is blacklisted
         await redisClient.get(`blacklist:${token}`, (err, reply) => {
            if (err) {
               return next(new AppError(500, "INTERNAL_SERVER_ERROR"));
            }
            if (reply) {
               return next(new AppError(401, "UNAUTHORIZED"));
            }
         });

         // retrieve userId and role from decoded token
         var { id: userId, role: userRole } = decoded.payload;
         userId = userId.toString();

         // get cached token from redis
         const redisToken = await redisClient.get(userId);

         // if token not found (refreshable duration expired)
         if (!redisToken || redisToken != token) {
            return next(new AppError(401, "UNAUTHORIZED"));
         }


         // after passing all checks

         // create new access token
         const newAccessToken = jwt.sign({
            id: userId,
            role: userRole,
         }, 
            process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '10m'
         });

         // save new token to redis
         redisClient.set(userId, newAccessToken, { EX: 3 * 24 * 60 * 60 });

         // return new token
         res.status(200).json({
            accessToken: newAccessToken,
         });
      } catch (err) {
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   };

   // [POST] /auth/logout
   async logout(req, res) {

      const token = req.headers["authorization"].split(" ")[1];
      const userId = req.userInfo.id.toString();

      // delete token from redis
      redisClient.del(userId, (err, reply) => {
         if (err) {
            return next(new AppError(500, "INTERNAL_SERVER_ERROR"));
         }
      });

      // add access token to blacklist
      // automatically expire after 10 minutes
      redisClient.set(`blacklist:${token}`, "blacklisted", { EX: 10 * 60 });

      // return success message
      res.status(200).json({});
   }
   // logout(req, res) {
   //    const authHeader = req.headers["authorization"];
   //    const token = authHeader && authHeader.split(" ")[1];
      
   //    if (token) {
   //      // Thêm token vào blacklist ngay cả khi không hợp lệ
   //      redisClient.set(`blacklist:${token}`, "blacklisted", 'EX', 10 * 60);
   //    }
      
   //    // Trả về thành công bất kể token
   //    res.status(200).json({});
   // }

   // [POST] /auth/forgot-password
   async forgotPassword(req, res, next) {
      try {
         const { email } = req.body;

         const user = await User.findOne({ email: email });
         if (!user) {
            return next(new AppError(404, "USER_NOT_FOUND"));
         }

         // generate OTP
         const otp = Math.floor(100000 + Math.random() * 900000).toString();

         // hash OTP and save to redis
         const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
         await redisClient.set(`otp:${email}`, hashedOtp, { EX: 10 * 60 });
          
         // send OTP to user's email
         await emailSender.sendOtpEmail(email, otp);

         res.status(200).json();

      } catch (err) {
         if (err instanceof AppError) {
            return next(err);
         }  
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }   

   // [POST] /auth/verify-otp-and-change-password
   async verifyOtpAndChangePassword(req, res, next) {                              
      try {
         const { email, otp, newPassword } = req.body;

         // get hashed OTP from redis
         const hashedOtp = await redisClient.get(`otp:${email}`);
         if (!hashedOtp) {
            return next(new AppError(400, "OTP_EXPIRED"));
         }

         // hash the provided OTP and compare with the one in redis
         const hashedProvidedOtp = crypto.createHash('sha256').update(otp).digest('hex');
         if (hashedProvidedOtp !== hashedOtp) {
            return next(new AppError(400, "INVALID_OTP"));
         }

         // delete OTP from redis
         await redisClient.del(`otp:${email}`);

         // reset password
         // find user by email
         const user = await User.findOne({ email: email });
         if (!user) {
            throw new AppError(404, "USER_NOT_FOUND");
         }

         // check if new password < 8 characters
         if (newPassword.length < 8) {
            throw new AppError(400, "INVALID_PASSWORD");
         }

         // hash new password
         const salt = bcrypt.genSaltSync(10);
         const hashPassword = bcrypt.hashSync(newPassword, salt);
         
         // update password in db
         user.password = hashPassword;
         await user.save();

         // delete access token from redis
         await redisClient.del(user._id.toString());

         res.status(200).json();

      } catch (err) {
         if (err instanceof AppError) {
            return next(err);
         }
         return next(new AppError(500, "INTERNAL_SERVER_ERROR", err.message));
      }
   }

}

module.exports = new AuthController();