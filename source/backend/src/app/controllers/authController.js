const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../../configs/db/redis');
const AppError = require('../../utils/appError');

class AuthController {

   // [POST] /auth/register
   register(req, res, next) {
      // get data from request
      const { username, email, password, role } = req.body;

      // check if username or email already exists
      User.findOne({ $or: [{ username: username }, {email: email }]})
      .then(user => {
         // if username or email already exists, then return error
         if (user) {
            return next(new AppError(400, "USER_ALREADY_EXISTS"));
         }

         // gen hash password
         const salt = bcrypt.genSaltSync(10);
         const hashPassword = bcrypt.hashSync(password, salt);

         // create new user
         const newUser = new User({
            username: username,
            email: email,
            password: hashPassword,
            role: role
         });

         // save user to database
         newUser.save()
            .then(user => {
               res.status(201).json({
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  avatar: user.avatar
               })
            })
      })
      .catch(err => {
         return next(new AppError());
      });
   }

   // [POST] /auth/login
   login(req, res, next) {

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

            // create token
            const accessToken = jwt.sign({
               id: user._id,
               role: user.role,
            }, 
               process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: '10m'
            });

            // save token to redis
            // automatically expire after 3 days
            // 3 day is refresh token expiration time
            redisClient.set(user._id.toString(), accessToken, 'EX', 3 * 24 * 60 * 60); 

            // return user data and token
            res.status(200).json({
              id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
              accessToken: accessToken,
            });
         })
         .catch(err => {
            return next(new AppError());
         });
   }

   // [POST] /auth/refresh-token
   refreshToken(req, res, next) {

   };

}

module.exports = new AuthController();