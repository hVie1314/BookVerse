const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../../configs/db/redis');

class AuthController {

   // [POST] /auth/register
   register(req, res) {
      // get data from request
      const { username, email, password, role } = req.body;

      // check if username or email already exists
      User.findOne({ $or: [{ username: username }, {email: email }]})
      .then(user => {
         // if username or email already exists, then return error
         if (user) {
            return res.status(400).json({
               success: false,
               errorCode: "USER_ALREADY_EXISTS"
            });
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
                  success: true,
                  data: {
                     id: user._id,
                     username: user.username,
                     email: user.email,
                     role: user.role,
                     avatar: user.avatar
                  },
               })
            })
      })
      .catch(err => {
         console.error(err);

         res.status(500).json({
            success: false,
            errorCode: "INTERNAL_SERVER_ERROR",
         })
      });
   }

   // [POST] /auth/login
   login(req, res) {

      // get data from request
      const { username, password } = req.body;

      // find user in db
      User.findOne({ username: username })
         .then(user => {
            
            // if user does not exist then return error
            if (!user) {
               return res.status(404).json({
                  success: false,
                  errorCode: "INVALID_CREDENTIALS"
               })
            }

            // check password
            const isPasswordMatch = bcrypt.compareSync(password, user.password);
            if (!isPasswordMatch) {
               return res.status(400).json({
                  success: false,
                  errorCode: "INVALID_CREDENTIALS"
               })
            }

            // create token
            const accessToken = jwt.sign({
               id: user._id,
               role: user.role,
            }, 
               process.env.ACCESS_TOKEN_SECRET, {
               expiresIn: '10m'
            });

            // create refresh token
            const refreshToken = jwt.sign({
               id: user._id,
               role: user.role,
            }, 
               process.env.REFRESH_TOKEN_SECRET, {
               expiresIn: '3d'
            });

            // save refresh token to redis
            // automatically expire after 3 days
            redisClient.set(user._id.toString(), refreshToken, 'EX', 3 * 24 * 60 * 60); 

            // return user data and token
            res.status(200).json({
               success: true,
               data: {
                  id: user._id,
                  username: user.username,
                  email: user.email,
                  role: user.role,
                  avatar: user.avatar,
                  accessToken: accessToken,
               }
            })
         })
         .catch(err => {
            console.error(err);

            res.status(500).json({
               success: false,
               errorCode: "INTERNAL_SERVER_ERROR",
            })
         });
   }

}

module.exports = new AuthController();